import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Newspaper, TrendingUp, Sparkles } from "lucide-react";
import { readData } from "@/lib/data";
import SafeImage from "@/components/SafeImage";
import { getCategoryFallbackImage } from "@/lib/fallback-images";
import styles from "../../page.module.css";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  const normalizedSlug = slug.toLowerCase().trim();
  const title = `${categoryName} News & Analysis | Readers 24`;
  const description = `Stay informed with the latest ${categoryName} news, deep analysis, and global updates from Readers 24.`;
  const ogImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop';

  const categoryKeywords = {
    world: ["world breaking news", "international headlines", "geopolitical analysis", "foreign affairs", "global diplomacy"],
    politics: ["latest political news", "world politics updates", "government policy", "parliament election coverage", "political investigations"],
    business: ["global business news", "stock market updates", "financial market analysis", "economy inflation forecasts", "trade industry reports"],
    tech: ["technology news", "artificial intelligence AI", "software innovation", "cybersecurity", "tech gadget reviews"],
    science: ["science discoveries", "space exploration nasa", "climate science", "astronomy physics research", "clean energy"],
    health: ["global healthcare news", "medical research breakthroughs", "wellness disease prevention", "public health policy"],
    sports: ["breaking sports news", "live tournament coverage", "football soccer results", "cricket updates", "athlete championship"],
    arts: ["arts and culture", "entertainment film cinema", "book reviews literature", "design visual arts"],
    opinion: ["editorial opinion columns", "expert global analysis", "political commentary", "thought leadership essays"]
  };

  const keywords = [
    categoryName,
    ...(categoryKeywords[normalizedSlug] || []),
    `readers 24 ${categoryName}`,
    `latest ${categoryName} news 2026`,
    'breaking journalism'
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://www.readers24.com/category/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.readers24.com/category/${slug}`,
      siteName: 'Readers 24',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${categoryName} News | Readers 24`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  const normalizedSlug = slug.toLowerCase().trim();

  let data = {};
  try {
    data = await readData();
  } catch (error) {
    console.error("Failed to read site data:", error);
  }

  // Gather all unique articles from all main page sections
  const allArticlesMap = new Map();
  const addArt = (item) => {
    if (item && item.id && !allArticlesMap.has(item.id)) {
      allArticlesMap.set(item.id, item);
    }
  };

  if (data.heroArticle) addArt(data.heroArticle);
  (data.secondaryArticles || []).forEach(addArt);
  (data.editorsPicks || []).forEach(addArt);
  (data.opinionPieces || []).forEach(addArt);
  (data.mostRead || []).forEach(addArt);
  (data.multimediaArticles || []).forEach(addArt);

  const allArticles = Array.from(allArticlesMap.values());

  // Category synonyms and topic mapping for intelligent discovery
  const topicKeywords = {
    politics: ['politics', 'political', 'policy', 'minister', 'pm modi', 'starmer', 'government', 'election', 'parliament', 'senate'],
    business: ['business', 'market', 'economy', 'sensex', 'nifty', 'stock', 'trade', 'finance', 'company', 'industry'],
    tech: ['tech', 'technology', 'apple', 'google', 'ai', 'software', 'digital', 'device', 'cyber', 'phone'],
    science: ['science', 'space', 'nasa', 'rocket', 'moon', 'research', 'climate', 'energy', 'biology', 'physics'],
    health: ['health', 'medical', 'wellness', 'food', 'diet', 'care', 'fitness', 'mental'],
    sports: ['sports', 'sport', 'football', 'cricket', 'game', 'tournament', 'wheelchair', 'league', 'athlete'],
    arts: ['arts', 'art', 'culture', 'portrait', 'film', 'music', 'book', 'design', 'style'],
    opinion: ['opinion', 'editorial', 'analysis', 'perspective', 'view', 'forecast', 'column', 'essay'],
    world: ['world', 'global', 'international', 'nation', 'foreign', 'un', 'diplomacy', 'geopolitics']
  };

  const keywords = topicKeywords[normalizedSlug] || [normalizedSlug];

  // 1. Direct and keyword matches
  const directMatches = allArticles.filter(art => {
    const cat = (art.category || "").toLowerCase();
    if (cat === normalizedSlug) return true;
    
    // Check tags
    if (Array.isArray(art.tags) && art.tags.some(t => t.toLowerCase() === normalizedSlug)) return true;

    // Check title/excerpt with topic keywords
    const text = `${art.title || ''} ${art.excerpt || ''}`.toLowerCase();
    return keywords.some(kw => text.includes(kw));
  });

  // 2. Related/main page articles to supplement coverage
  const directIds = new Set(directMatches.map(a => a.id));
  const fallbackStories = allArticles.filter(a => !directIds.has(a.id));

  // If direct matches exist, use them; supplement with fallback stories if fewer than 4
  const displayArticles = directMatches.length > 0 
    ? [...directMatches, ...fallbackStories.slice(0, Math.max(0, 4 - directMatches.length))]
    : allArticles.slice(0, 8); // Never leave page empty: always show latest main page news!

  const isSupplemented = directMatches.length === 0;

  return (
    <div className="container">
      <header className={styles.categoryHeader}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="category-tag" style={{ fontSize: '0.85rem', padding: '4px 10px' }}>
            Readers 24 Desk
          </span>
        </div>
        <h1 className={styles.categoryTitleLarge}>{categoryName}</h1>
        <p className={styles.categoryDescription}>
          {isSupplemented 
            ? `Top breaking stories, market reports, and global coverage curated by the Readers 24 ${categoryName} desk.`
            : `The latest verified news, investigations, and analysis from our ${categoryName} desk.`
          }
        </p>
      </header>

      <div className={styles.sectionDivider}></div>

      {displayArticles.length > 0 ? (
        <>
          <div className={styles.categoryGrid}>
            {displayArticles.map((article, idx) => (
              <article key={article.id || idx} className={styles.editorsCard}>
                <div className={styles.editorsImageWrapper}>
                  <SafeImage 
                    src={article.image} 
                    fallbackSrc={getCategoryFallbackImage(article.category || categoryName, article.title)}
                    alt={article.title} 
                    fill 
                    className={styles.editorsImage} 
                  />
                </div>
                <div className={styles.editorsContent}>
                  <span className="category-tag">{article.category || categoryName}</span>
                  <h3 className={styles.editorsTitle}>
                    <Link href={`/article/${article.id}`}>{article.title}</Link>
                  </h3>
                  <p className={styles.heroExcerpt} style={{ fontSize: '0.95rem' }}>{article.excerpt}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Related Newsroom Wire Footer */}
          <div style={{
            marginTop: '48px',
            padding: '24px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Want to explore more topics?
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Browse our real-time breaking news wire or live streaming broadcasts.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/live" className={styles.secondaryBtn} style={{ padding: '8px 16px', fontSize: '0.85rem', textDecoration: 'none', borderRadius: '6px' }}>
                Readers 24 Live
              </Link>
              <Link href="/" className={styles.viewAllLink} style={{ margin: 0 }}>
                Front Page <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.emptyCategory}>
          <h3>Coverage updating for {categoryName}</h3>
          <p>Our editorial newsroom is updating reports. Return to front page for real-time coverage.</p>
          <Link href="/" className={styles.viewAllLink}>
            Return Home <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
