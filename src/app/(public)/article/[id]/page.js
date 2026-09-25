import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Share2, Bookmark, MessageCircle, ArrowLeft } from "lucide-react";
import { readData } from '@/lib/data';
import styles from "./article.module.css";
import Comments from "@/components/Comments";
import SafeImage from "@/components/SafeImage";
import { getCategoryFallbackImage } from "@/lib/fallback-images";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  try {
    const data = await readData();
    
    const allArticles = [
      data.heroArticle || {},
      ...(data.editorsPicks || []),
      ...(data.secondaryArticles || []),
      ...(data.mostRead || []),
      ...(data.opinionPieces || []),
      ...(data.multimediaArticles || [])
    ].filter(a => a && typeof a === 'object' && a.id && Object.keys(a).length > 0);

    const article = allArticles.find(a => a.id === id);

    if (!article) {
      return {
        title: 'Article Not Found',
        description: 'The requested article could not be found.',
      };
    }

    const rawTitle = article.title || 'Breaking News';
    // 1) Title tag: 50–60 characters, primary keyword near start, compelling for clicks
    let seoTitle = `${rawTitle.slice(0, 36)} – Critical 2026 Breakdown | Readers 24`;
    if (seoTitle.length > 60) {
      seoTitle = `${rawTitle.slice(0, 30)} – Critical 2026 | Readers 24`;
    }

    // 2) Meta description: 150–160 characters, primary keyword, clear benefit, and CTA
    const baseDesc = (article.excerpt || article.description || `Verified reporting on ${rawTitle}`).replace(/\s+/g, ' ').trim();
    let seoDescription = `Discover the latest on ${rawTitle.slice(0, 35)}. Explore verified analysis, expert forecasts, and market impacts. Read full Readers 24 report now.`;
    if (seoDescription.length > 160) {
      seoDescription = seoDescription.slice(0, 157) + '...';
    } else if (seoDescription.length < 150) {
      seoDescription = `Discover the latest on ${rawTitle.slice(0, 45)}. Explore verified reporting, policy analysis, and future forecasts. Read complete Readers 24 investigation now.`.slice(0, 160);
    }

    const image = article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop';

    const articleKeywords = [
      article.category || 'News',
      ...(Array.isArray(article.tags) ? article.tags : []),
      `${article.category || 'World'} news 2026`,
      'breaking news',
      'readers 24',
      'verified editorial coverage',
      rawTitle
    ];

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: articleKeywords,
      authors: [{ name: article.author || 'Readers 24 Editorial Team' }],
      category: article.category,
      alternates: {
        canonical: `https://www.readers24.com/article/${article.id}`,
      },
      openGraph: {
        title: rawTitle,
        description: seoDescription,
        url: `https://www.readers24.com/article/${article.id}`,
        siteName: 'Readers 24',
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: rawTitle,
          },
        ],
        locale: 'en_US',
        type: 'article',
        publishedTime: article.date || new Date().toISOString(),
        authors: [article.author || 'Readers 24 Editorial'],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@readers24',
        creator: '@readers24',
        title: rawTitle,
        description: seoDescription,
        images: [image],
      },
    };
  } catch (error) {
    console.error("Error generating article metadata:", error);
    return {
      title: 'Article | Readers 24',
      description: 'Read the latest verified journalism on Readers 24.',
    };
  }
}

export default async function ArticlePage({ params }) {
  // Await params for Next.js 15+ compatibility
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  let data = {};
  
  try {
    data = await readData();
  } catch (error) {
    console.error("Failed to read site data:", error);
  }

  // Search across all data arrays for the article with this ID
  const allArticles = [
    data.heroArticle || {},
    ...(data.editorsPicks || []),
    ...(data.secondaryArticles || []),
    ...(data.mostRead || []),
    ...(data.opinionPieces || []),
    ...(data.multimediaArticles || [])
  ].filter(a => a && typeof a === 'object' && a.id && Object.keys(a).length > 0);

  const article = allArticles.find(a => a.id === id) || null;
  const secondaryArticles = data.secondaryArticles || [];

  // If article not found, trigger Next.js notFound() which sends a real 404 HTTP status code
  if (!article) {
    notFound();
  }

  // Safe fallbacks for missing data
  const authorName = article.author || "Editorial Team";
  const authorInitial = authorName.charAt(0) || "N";
  const category = article.category || "News";
  const articleUrl = `https://www.readers24.com/article/${article.id}`;
  const imageUrl = article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop';
  
  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${articleUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.readers24.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": category,
            "item": `https://www.readers24.com/category/${category.toLowerCase()}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": article.title,
            "item": articleUrl
          }
        ]
      },
      {
        "@type": "NewsArticle",
        "@id": `${articleUrl}#article`,
        "isPartOf": {
          "@id": "https://www.readers24.com/#website"
        },
        "headline": article.title,
        "description": article.excerpt || article.description || "",
        "url": articleUrl,
        "mainEntityOfPage": articleUrl,
        "datePublished": article.date || new Date().toISOString(),
        "dateModified": article.date || new Date().toISOString(),
        "articleSection": category,
        "image": {
          "@type": "ImageObject",
          "url": imageUrl,
          "width": 1200,
          "height": 675
        },
        "author": {
          "@type": "Person",
          "name": authorName,
          "jobTitle": "Investigative Journalist & Senior Correspondent"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Readers 24",
          "url": "https://www.readers24.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.readers24.com/logo.svg"
          }
        }
      }
    ]
  };

  // Dynamically extract FAQs from article HTML and register Schema.org FAQPage
  try {
    const faqCards = [];
    const faqRegex = /<div class="faq-card"[^>]*>[\s\S]*?<h[3-6][^>]*>([\s\S]*?)<\/h[3-6]>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/div>/gi;
    let match;
    while ((match = faqRegex.exec(article.content || '')) !== null) {
      const q = match[1].replace(/<[^>]+>/g, '').trim();
      const a = match[2].replace(/<[^>]+>/g, '').trim();
      if (q && a) {
        faqCards.push({
          "@type": "Question",
          "name": q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": a
          }
        });
      }
    }
    if (faqCards.length > 0) {
      articleSchema["@graph"].push({
        "@type": "FAQPage",
        "@id": `${articleUrl}#faq`,
        "mainEntity": faqCards
      });
    }
  } catch (schemaErr) {
    console.warn("FAQ schema parsing error:", schemaErr);
  }

  return (
    <article className={styles.articlePage}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <header className={styles.articleHeader}>
        <div className="container">
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', marginBottom: '24px', textDecoration: 'none', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className={styles.headerContent}>
            <span className="category-tag">{category}</span>
            <h1 className={styles.title}>{article.title}</h1>
            <p className={styles.excerpt}>{article.excerpt || article.description || ""}</p>
            
            <div className={styles.metaRow}>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>{authorInitial}</div>
                <div>
                  <div className={styles.authorName}>By {authorName}</div>
                  <div className={styles.publishDate}>Verified Editorial Coverage • Readers 24</div>
                </div>
              </div>
              
              <div className={styles.actions}>
                <button className={styles.actionBtn}><Share2 size={20} /></button>
                <button className={styles.actionBtn}><Bookmark size={20} /></button>
                <button className={styles.actionBtn}><MessageCircle size={20} /></button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {(article.image || category) && (
        <div className={styles.featuredImageWrapper}>
          <div className="container">
            <div className={styles.imageContainer}>
              <SafeImage 
                src={article.image} 
                fallbackSrc={getCategoryFallbackImage(category, article.title)}
                alt={article.title || "Article Image"} 
                width={840}
                height={472}
                sizes="(max-width: 768px) 100vw, 840px"
                className={styles.featuredImage}
                priority
              />
            </div>
            <span className={styles.imageCaption}>Editorial visual coverage of {category.toLowerCase()} concepts. (Credit: Readers 24)</span>
          </div>
        </div>
      )}

      <div className={`container ${styles.articleBodyContainer}`}>
        <div className={styles.socialRail}>
          <div className={styles.stickyRail}>
            <button className={styles.railBtn}>F</button>
            <button className={styles.railBtn}>X</button>
            <button className={styles.railBtn}>in</button>
            <button className={styles.railBtn}><Bookmark size={20} /></button>
          </div>
        </div>
        
        <div className={styles.articleContent}>
          {/* Display actual AI content if generated, otherwise show placeholder text */}
          {article.content ? (
            <div 
              dangerouslySetInnerHTML={{ 
                __html: (article.content.includes('<') && article.content.includes('>') 
                  ? article.content 
                  : article.content.replace(/\n/g, '<br/>'))
                  .replace(/<nav class="editorial-toc">[\s\S]*?<\/nav>/gi, '')
                  .replace(/<nav class="toc"[\s\S]*?<\/nav>/gi, '')
              }} 
            />
          ) : (
            <>
              <p className={styles.leadParagraph}>
                The global economic landscape shifted dramatically today as technology sectors experienced unprecedented surges, defying analysts' expectations and sending major indexes into record territory.
              </p>
              
              <p>
                This coordinated push in semiconductor manufacturing and widespread artificial intelligence software adoption has led to massive gains across global exchanges. Experts suggest this signals a robust recovery phase for the international economy, which has been grappling with inflation concerns for the past several quarters.
              </p>
              
              <h2 className={styles.subheading}>The Role of Artificial Intelligence</h2>
              
              <p>
                Central to this rally is the rapid deployment of generative AI solutions across enterprise environments. Companies that previously viewed the technology as experimental are now integrating it into their core operations, driving immense demand for computational resources.
              </p>
              
              <blockquote className={styles.pullQuote}>
                "We are witnessing a fundamental restructuring of how businesses operate. The scale of this transition rivals the early days of the internet."
                <span className={styles.quoteAttribution}>— Dr. Elena Rostova, Chief Economic Strategist</span>
              </blockquote>
              
              <p>
                Semiconductor manufacturers have reported record-breaking orders for their latest generation of AI-optimized chips. Supply chains, previously constrained, have shown remarkable resilience, allowing production to meet the soaring demand.
              </p>
            </>
          )}

          <div className={styles.relatedBlock}>
            <h3 className={styles.relatedTitle}>Read More</h3>
            <ul className={styles.relatedList}>
              {(secondaryArticles || []).slice(0, 2).map(item => (
                <li key={item.id}><Link href={`/article/${item.id}`}>{item.title}</Link></li>
              ))}
            </ul>
          </div>
          
          <Comments />
        </div>
      </div>
    </article>
  );
}
