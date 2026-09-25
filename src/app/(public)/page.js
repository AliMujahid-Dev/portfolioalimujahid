import { readData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PlayCircle, Sparkles, Search as SearchIcon, X } from "lucide-react";
import styles from "./page.module.css";
import HomeClientWrapper from "./HomeClientWrapper";
import SafeImage from "@/components/SafeImage";
import { getCategoryFallbackImage } from "@/lib/fallback-images";

export const revalidate = 60;

export const metadata = {
  title: {
    absolute: 'Readers 24 | Premium Global Journalism'
  },
  description: 'Intelligent 24/7 journalism for a complex world. Breaking news, deep analysis, and global perspectives.',
  keywords: [
    "breaking news",
    "world news live",
    "latest headlines",
    "global analysis",
    "international politics",
    "business and economy",
    "tech intelligence",
    "investigative journalism",
    "readers 24",
    "readers24.com"
  ],
  alternates: {
    canonical: 'https://www.readers24.com',
  },
  openGraph: {
    title: 'Readers 24 | Premium Global Journalism',
    description: 'Intelligent 24/7 journalism for a complex world. Breaking news, deep analysis, and global perspectives.',
    url: 'https://www.readers24.com',
    siteName: 'Readers 24',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Readers 24 - Premium Global Journalism',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@readers24',
    creator: '@readers24',
    title: 'Readers 24 | Premium Global Journalism',
    description: 'Intelligent 24/7 journalism for a complex world.',
    images: ['https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&h=630&q=80'],
  },
};

export default async function Home(props) {
  const searchParams = await props?.searchParams;
  const rawQuery = searchParams?.s;
  const searchQuery = typeof rawQuery === 'string' ? rawQuery.trim() : '';

  const data = await readData();

  // Intelligent slot filling:
  const rawEditorsPicks = (data?.editorsPicks || []).filter(a => a && typeof a === 'object' && a.id);
  const heroArticle = data?.heroArticle?.image ? data.heroArticle : (rawEditorsPicks[0] || {});
  const secondaryArticles = ((data?.secondaryArticles?.length > 0) 
    ? data.secondaryArticles 
    : rawEditorsPicks.slice(1, 4)).filter(a => a && typeof a === 'object' && a.id);
  const opinionPieces = (data?.opinionPieces || []).filter(a => a && typeof a === 'object' && a.id);
  const multimediaArticles = (data?.multimediaArticles || []).filter(a => a && typeof a === 'object' && a.id);
  const sidebarArticle = (secondaryArticles.length >= 3) ? secondaryArticles[2] : (rawEditorsPicks[4] || null);

  // Dynamic Trending Now selection:
  // Prioritize explicit mostRead list, supplemented by freshest trending articles from across the newsroom
  const rawMostRead = (data?.mostRead || []).filter(a => a && typeof a === 'object' && a.id);
  const candidateArticles = [
    ...(data?.editorsPicks || []),
    ...(data?.secondaryArticles || []),
    ...(data?.opinionPieces || []),
    ...(data?.multimediaArticles || [])
  ].filter(a => a && typeof a === 'object' && a.id);

  // Deduplicate candidates
  const uniqueCandidates = Array.from(new Map(candidateArticles.map(a => [a.id, a])).values());

  // Sort candidates: prioritize 'trending' tag, then newest date
  uniqueCandidates.sort((a, b) => {
    const aIsTrending = Array.isArray(a.tags) && a.tags.some(t => String(t).toLowerCase().includes('trending'));
    const bIsTrending = Array.isArray(b.tags) && b.tags.some(t => String(t).toLowerCase().includes('trending'));
    if (aIsTrending && !bIsTrending) return -1;
    if (!aIsTrending && bIsTrending) return 1;

    const aTime = new Date(a.date || 0).getTime() || 0;
    const bTime = new Date(b.date || 0).getTime() || 0;
    return bTime - aTime;
  });

  const combinedMostRead = Array.from(new Map([...rawMostRead, ...uniqueCandidates].map(a => [a.id, a])).values());
  const mostRead = combinedMostRead.slice(0, 5);
  const editorsPicks = rawEditorsPicks;

  // Recency scoring algorithm for articles:
  // Prioritizes newest published dates, relative times ('Just now', 'mins ago'), and newly published IDs
  const getArticleRecencyScore = (art, index = 0) => {
    if (!art || !art.id) return 0;
    let score = 0;

    // 1. Parse standard or ISO date strings (e.g. 'Sep 9, 2026', '2026-09-09')
    if (art.date) {
      const parsed = Date.parse(art.date);
      if (!isNaN(parsed)) {
        score = parsed;
      }
    }

    // 2. Newly generated article IDs often include Date.now() timestamp (e.g. 'new-1725884900000')
    if (typeof art.id === 'string' && art.id.startsWith('new-')) {
      const num = parseInt(art.id.replace('new-', ''), 10);
      if (!isNaN(num) && num > score) {
        score = num;
      }
    }

    // 3. Offset relative human time strings
    if (typeof art.time === 'string') {
      const t = art.time.toLowerCase();
      if (t.includes('just now')) {
        score += 1000 * 60 * 60 * 24; // +24h priority boost
      } else if (t.includes('min')) {
        const m = parseInt(t, 10) || 1;
        score += 1000 * 60 * (1440 - Math.min(m, 1440));
      } else if (t.includes('hour')) {
        const h = parseInt(t, 10) || 1;
        score += 1000 * 60 * 60 * (24 - Math.min(h, 24));
      }
    }

    // 4. Stable tie-breaker: items appearing earlier in editorsPicks / feeds get priority
    score += Math.max(0, 500 - index);

    return score;
  };

  // Gather all unique articles across the newsroom database
  const allArticlesMap = new Map();
  const rawPool = [
    ...(data?.editorsPicks || []),
    heroArticle,
    ...(data?.secondaryArticles || []),
    ...(data?.mostRead || []),
    ...(data?.opinionPieces || []),
    ...(data?.multimediaArticles || [])
  ].filter(a => a && typeof a === 'object' && a.id && a.title);

  rawPool.forEach((item, index) => {
    if (!allArticlesMap.has(item.id)) {
      allArticlesMap.set(item.id, {
        article: item,
        score: getArticleRecencyScore(item, index)
      });
    }
  });

  // Sort all unique articles by recency (newest published first)
  const sortedArticlesByRecency = Array.from(allArticlesMap.values())
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.article);

  const allArticles = sortedArticlesByRecency;

  // Breaking news ticker marquee: always features the freshest published articles at the front
  const uniqueTickerArticles = sortedArticlesByRecency.slice(0, 12);

  // --- RAG & Semantic Retrieval Algorithm for Search ---
  let searchResults = [];
  let isSearching = Boolean(searchQuery);

  if (isSearching) {
    const cleanQuery = searchQuery.toLowerCase();
    const queryTokens = cleanQuery.split(/\s+/).filter(w => w.length > 1);

    // Topic keywords for semantic RAG expansion
    const topicSynonyms = {
      tech: ['ai', 'tech', 'technology', 'digital', 'software', 'device', 'apple', 'google', 'cyber', 'gadget', 'chip', 'cloud', 'data'],
      business: ['market', 'economy', 'money', 'stock', 'trade', 'finance', 'company', 'sensex', 'nifty', 'inflation', 'bank', 'invest', 'revenue'],
      politics: ['politics', 'political', 'government', 'election', 'policy', 'minister', 'modi', 'starmer', 'parliament', 'senate', 'vote', 'president', 'trump', 'biden', 'law', 'party'],
      science: ['science', 'space', 'nasa', 'rocket', 'moon', 'mars', 'climate', 'energy', 'planet', 'research', 'biology', 'physics'],
      sports: ['sports', 'sport', 'cricket', 'football', 'soccer', 'game', 'tennis', 'tournament', 'cup', 'olympics', 'league', 'match', 'athlete'],
      health: ['health', 'medical', 'hospital', 'disease', 'vaccine', 'diet', 'wellness', 'fitness', 'doctor', 'care', 'treatment'],
      world: ['world', 'global', 'international', 'nation', 'war', 'peace', 'un', 'diplomacy', 'foreign', 'conflict', 'border', 'summit'],
      arts: ['arts', 'art', 'culture', 'film', 'music', 'cinema', 'book', 'fashion', 'artist', 'museum', 'theatre', 'actor', 'portrait']
    };

    // Determine relevant topics from query
    const activeTopics = [];
    for (const [topic, kws] of Object.entries(topicSynonyms)) {
      if (kws.some(kw => cleanQuery.includes(kw) || queryTokens.includes(kw))) {
        activeTopics.push(topic);
      }
    }

    searchResults = allArticles.map(art => {
      let score = 0;
      const title = (art.title || '').toLowerCase();
      const excerpt = (art.excerpt || '').toLowerCase();
      const content = (art.content || '').toLowerCase();
      const category = (art.category || '').toLowerCase();
      const author = (art.author || '').toLowerCase();
      const tags = Array.isArray(art.tags) ? art.tags.map(t => String(t).toLowerCase()) : [];

      // Exact phrase match
      if (title.includes(cleanQuery)) score += 100;
      if (excerpt.includes(cleanQuery)) score += 50;
      if (category === cleanQuery) score += 60;
      else if (category.includes(cleanQuery)) score += 30;
      if (author.includes(cleanQuery)) score += 30;
      if (tags.some(t => t.includes(cleanQuery))) score += 40;
      if (content.includes(cleanQuery)) score += 25;

      // Token overlap
      for (const token of queryTokens) {
        if (title.includes(token)) score += 25;
        if (excerpt.includes(token)) score += 15;
        if (category.includes(token)) score += 20;
        if (tags.some(t => t.includes(token))) score += 15;
        if (content.includes(token)) score += 8;
      }

      // RAG Semantic Topic Boost
      if (activeTopics.includes(category)) score += 35;
      for (const t of activeTopics) {
        if (tags.some(tg => tg.includes(t))) score += 20;
        if (topicSynonyms[t]?.some(kw => title.includes(kw) || excerpt.includes(kw))) {
          score += 15;
        }
      }

      return { ...art, relevanceScore: score };
    }).filter(a => a.relevanceScore > 0);

    searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  return (
    <>
      <div className={styles.breakingStrip}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <div className={styles.breakingHeader}>
            <span className={styles.breakingBadge}>BREAKING</span>
            <span className={styles.liveDotSmall}></span>
          </div>
          <div className={styles.tickerViewport}>
            <div className={styles.tickerTrack}>
              {uniqueTickerArticles.map((art, idx) => (
                <Link key={idx} href={`/article/${art.id}`} className={styles.tickerLink}>
                  <span className={styles.tickerBullet}>•</span>
                  <span>{art.title}</span>
                </Link>
              ))}
              {/* Duplicate set for seamless looping */}
              {uniqueTickerArticles.map((art, idx) => (
                <Link key={`dup-${idx}`} href={`/article/${art.id}`} className={styles.tickerLink}>
                  <span className={styles.tickerBullet}>•</span>
                  <span>{art.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isSearching ? (
        <div className="container">
          <div className={styles.searchContainer}>
            <header className={styles.searchHeader}>
              <div className={styles.searchBadge}>
                <Sparkles size={14} />
                <span>Readers 24 AI Discovery</span>
              </div>
              <h1 className={styles.searchTitle}>
                Results for <span className={styles.searchQueryHighlight}>“{searchQuery}”</span>
              </h1>
              <p className={styles.searchSubtitle}>
                {searchResults.length > 0 
                  ? `${searchResults.length} article${searchResults.length === 1 ? '' : 's'} retrieved matching your query`
                  : `No direct matches found in our newsroom database.`
                }
              </p>
              <div className={styles.searchActionRow}>
                <Link href="/" className={styles.clearSearchBtn}>
                  <X size={14} /> Clear Search & Return Home
                </Link>
              </div>
            </header>

            {searchResults.length > 0 ? (
              <div className={styles.searchGrid}>
                {searchResults.map(article => (
                  <article key={article.id} className={styles.searchCard}>
                    {article.image && (
                      <div className={styles.searchCardImageWrapper}>
                        <SafeImage 
                          src={article.image} 
                          fallbackSrc={getCategoryFallbackImage(article.category, article.title)}
                          alt={article.title || "Story image"} 
                          fill 
                          className={styles.searchCardImage} 
                        />
                      </div>
                    )}
                    <div className={styles.searchCardContent}>
                      <span className={styles.searchCardCategory}>{article.category || "General"}</span>
                      <h3 className={styles.searchCardTitle}>
                        <Link href={`/article/${article.id}`}>{article.title}</Link>
                      </h3>
                      {article.excerpt && (
                        <p className={styles.searchCardExcerpt}>{article.excerpt}</p>
                      )}
                      <div className={styles.searchCardMeta}>
                        <span>By {article.author || "Readers 24"}</span>
                        <span>•</span>
                        <span>{article.readTime || "4 min read"}</span>
                        <span className={styles.relevanceBadge}>Top Match</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.noResultsBox}>
                <h3 className={styles.noResultsTitle}>No exact stories found</h3>
                <p className={styles.noResultsText}>
                  We couldn't find any articles matching “{searchQuery}”. Try searching for broader terms such as World, Politics, Tech, Business, Science, or Sports.
                </p>
                <Link href="/" className={styles.clearSearchBtn}>
                  Browse All Coverage
                </Link>
              </div>
            )}

            {/* Supplemental / Recent Articles (RAG style fallback coverage) */}
            <div className={styles.sectionDivider}></div>
            <div className={styles.sectionHeaderFlex} style={{ marginTop: '2.5rem', marginBottom: '1.5rem' }}>
              <h2 className={styles.sectionTitleLarge}>Recent Editorial Coverage</h2>
            </div>
            <div className={styles.editorsGrid}>
              {allArticles
                .filter(a => !searchResults.some(sr => sr.id === a.id))
                .slice(0, 6)
                .map(article => (
                  <article key={article.id} className={styles.editorsCard}>
                    {article.image && (
                      <div className={styles.editorsImageWrapper}>
                        <SafeImage 
                          src={article.image} 
                          fallbackSrc={getCategoryFallbackImage(article.category, article.title)}
                          alt={article.title} 
                          fill 
                          className={styles.editorsImage} 
                        />
                      </div>
                    )}
                    <div className={styles.editorsContent}>
                      <span className="category-tag">{article.category}</span>
                      <h3 className={styles.editorsTitle}>
                        <Link href={`/article/${article.id}`}>{article.title}</Link>
                      </h3>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {!heroArticle.id && editorsPicks.length === 0 && (
            <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '20px' }}>Welcome to Readers 24</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                The editorial desk is currently preparing fresh coverage. Check back shortly or explore our dashboard to publish your first story.
              </p>
            </div>
          )}

          <div className="container">
            <section className={styles.topSection}>
              <div className={styles.heroColumn}>
                {heroArticle.image && (
                  <article className={styles.heroArticle}>
                    <div className={styles.heroImageWrapper}>
                      <SafeImage 
                        src={heroArticle.image} 
                        fallbackSrc={getCategoryFallbackImage(heroArticle.category, heroArticle.title)}
                        alt={heroArticle.title || "Hero article"} 
                        fill 
                        priority
                        className={styles.heroImage}
                      />
                      <span className={styles.categoryBadge}>{heroArticle.category}</span>
                    </div>
                    <div className={styles.heroContent}>
                      <h1 className={styles.heroTitle}>
                        <Link href={`/article/${heroArticle.id}`}>{heroArticle.title}</Link>
                      </h1>
                      <p className={styles.heroExcerpt}>{heroArticle.excerpt}</p>
                      <div className={styles.heroMeta}>
                        <span className={styles.author}>By {heroArticle.author}</span>
                        <span className={styles.metaDivider}>•</span>
                        <span>{heroArticle.readTime || '5 min read'}</span>
                      </div>
                    </div>
                  </article>
                )}

                <div className={styles.secondaryGrid}>
                  {secondaryArticles.slice(0, 2).map(article => (
                    <article key={article.id} className={styles.secondaryCard}>
                      <div className={styles.secondaryImageWrapper}>
                        <SafeImage 
                          src={article.image} 
                          fallbackSrc={getCategoryFallbackImage(article.category, article.title)}
                          alt={article.title} 
                          fill
                          className={styles.secondaryImage}
                        />
                      </div>
                      <div className={styles.secondaryContent}>
                        <span className="category-tag">{article.category}</span>
                        <h2 className={styles.secondaryTitle}>
                          <Link href={`/article/${article.id}`}>{article.title}</Link>
                        </h2>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className={styles.sidebarColumn}>
                {sidebarArticle && (
                  <article className={styles.featuredSidebar}>
                    <span className="category-tag">{sidebarArticle.category}</span>
                    <h2 className={styles.sidebarTitle}>
                      <Link href={`/article/${sidebarArticle.id}`}>{sidebarArticle.title}</Link>
                    </h2>
                    <div className={styles.sidebarImageWrapper}>
                      <SafeImage 
                        src={sidebarArticle.image} 
                        fallbackSrc={getCategoryFallbackImage(sidebarArticle.category, sidebarArticle.title)}
                        alt={sidebarArticle.title} 
                        fill
                        className={styles.secondaryImage}
                      />
                    </div>
                  </article>
                )}

                <div className={styles.divider}></div>

                <div className={styles.mostRead}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Trending Now</h2>
                  </div>
                  <ol className={styles.mostReadList}>
                    {mostRead.map((item, index) => (
                      <li key={item.id} className={styles.mostReadItem}>
                        <span className={styles.mostReadNumber}>{index + 1}</span>
                        <div className={styles.mostReadContent}>
                          <h3 className={styles.mostReadTitle}>
                            <Link href={`/article/${item.id}`}>{item.title}</Link>
                          </h3>
                          <span className={styles.mostReadCategory}>{item.category}</span>
                        </div>
                        {item.image && (
                          <div className={styles.mostReadImageWrapper}>
                            <SafeImage 
                              src={item.image} 
                              fallbackSrc={getCategoryFallbackImage(item.category, item.title)}
                              alt={item.title} 
                              fill 
                              className={styles.mostReadImage} 
                            />
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>

            <div className={styles.sectionDivider}></div>

            {editorsPicks.length > 0 && (
              <section className={styles.editorsSection}>
                <div className={styles.sectionHeaderFlex}>
                  <h2 className={styles.sectionTitleLarge}>Editor's Picks</h2>
                  <Link href="/category/world" className={styles.viewAllLink}>
                    View All <ArrowRight size={16} />
                  </Link>
                </div>
                <div className={styles.editorsGrid}>
                  {editorsPicks.slice(0, 12).map(article => (
                    <article key={article.id} className={styles.editorsCard}>
                      <div className={styles.editorsImageWrapper}>
                        <SafeImage 
                          src={article.image} 
                          fallbackSrc={getCategoryFallbackImage(article.category, article.title)}
                          alt={article.title} 
                          fill 
                          className={styles.editorsImage} 
                        />
                      </div>
                      <div className={styles.editorsContent}>
                        <span className="category-tag">{article.category}</span>
                        <h3 className={styles.editorsTitle}>
                          <Link href={`/article/${article.id}`}>{article.title}</Link>
                        </h3>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <div className={styles.sectionDivider}></div>

            {/* Pass lightweight payloads to Client Component to prevent HTML bloat */}
            <HomeClientWrapper 
              opinionPieces={opinionPieces.slice(0, 6).map(p => ({
                id: p.id,
                title: p.title,
                author: p.author || 'Readers 24',
                role: p.role || 'Contributor',
              }))} 
              multimediaArticles={multimediaArticles.slice(0, 4).map(m => ({
                id: m.id,
                title: m.title,
                image: m.image,
                category: m.category || 'Multimedia',
                duration: m.duration || 'Video',
              }))} 
            />
          </div>
        </>
      )}
    </>
  );
}
