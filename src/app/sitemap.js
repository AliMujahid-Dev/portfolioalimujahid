import { readData } from '@/lib/data';

export const revalidate = 0; // Revalidate the sitemap automatically so it's always up-to-date

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readers24.com';
  
  // Define core static routes
  const staticRoutes = [
    '',
    '/live',
    '/podcasts',
    '/category/world',
    '/category/politics',
    '/category/business',
    '/category/tech',
    '/category/science',
    '/category/health',
    '/category/sports',
    '/category/arts',
    '/category/opinion',
    '/info/about',
    '/info/careers',
    '/info/journalism-ethics',
    '/info/site-map',
    '/info/terms',
    '/info/privacy',
    '/info/cookies',
    '/info/accessibility'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic articles to automatically add them to the sitemap
  let data;
  try {
    data = await readData();
  } catch (error) {
    console.error("Failed to read site data for sitemap:", error);
    data = {};
  }

  // Aggregate all articles from various sections
  const allArticles = [
    data.heroArticle || {},
    ...(data.editorsPicks || []),
    ...(data.secondaryArticles || []),
    ...(data.mostRead || []),
    ...(data.opinionPieces || []),
    ...(data.multimediaArticles || [])
  ].filter(a => a && Object.keys(a).length > 0 && a.id);

  // Remove duplicate articles based on ID
  const uniqueArticles = Array.from(new Map(allArticles.map(a => [a.id, a])).values());

  const articleRoutes = uniqueArticles.map((article) => {
    // Attempt to parse the article's date, or fallback to current date
    let lastMod = new Date();
    if (article.date || article.time) {
      try {
        const parsed = new Date(article.date || article.time);
        if (!isNaN(parsed.getTime())) {
          lastMod = parsed;
        }
      } catch (e) {
        // Fallback to now
      }
    }

    return {
      url: `${baseUrl}/article/${article.id}`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...articleRoutes];
}
