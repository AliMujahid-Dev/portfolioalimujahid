import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, PlayCircle, Radio, Clock, Share2, Newspaper, Activity } from "lucide-react";
import styles from "./live.module.css";
import { readData } from "@/lib/data";
import SafeImage from "@/components/SafeImage";
import { getCategoryFallbackImage } from "@/lib/fallback-images";

export const metadata = {
  title: 'Live TV | Readers 24',
  description: 'Watch Readers 24 Live TV - Real-time global news coverage.',
};

import ShareStreamButton from "@/components/ShareStreamButton";

export default async function LivePage() {
  const data = await readData();
  const latestArticles = (data?.editorsPicks || []).slice(0, 5);

  return (
    <div className={styles.livePage}>
      <div className="container">
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Readers 24
        </Link>
        
        <div className={styles.header}>
          <div className={styles.liveBadge}>
            <span className={styles.dot}></span> LIVE
          </div>
          <h1 className={styles.title}>Readers 24 Global Stream</h1>
          <p className={styles.description}>Continuous coverage of international breaking news, politics, and business by Al Jazeera English.</p>
        </div>

        <div className={styles.videoWrapper}>
          <div className={styles.videoPlayer}>
            <iframe 
              className={styles.liveEmbed}
              src="https://www.youtube.com/embed/live_stream?channel=UCNye-wNBqNL5ZzHSJj3l8Bg&autoplay=1&mute=0" 
              title="Al Jazeera English Live"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
          
          <div className={styles.sidebarSection}>
            <h3><Newspaper size={16} /> Latest News</h3>
            <div className={styles.sidebarArticleList}>
              {latestArticles.map(article => (
                <Link key={article.id} href={`/article/${article.id}`} className={styles.sidebarArticle}>
                  <div className={styles.sidebarArticleImg}>
                    <SafeImage 
                      src={article.image} 
                      fallbackSrc={getCategoryFallbackImage(article.category, article.title)}
                      alt={article.title} 
                      fill 
                      className={styles.editorsImage} 
                    />
                  </div>
                  <div className={styles.sidebarArticleContent}>
                    <span className={styles.sidebarArticleCategory}>{article.category}</span>
                    <h4 className={styles.sidebarArticleTitle}>{article.title}</h4>
                  </div>
                </Link>
              ))}
              {latestArticles.length === 0 && (
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No articles available.</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.bottomInfo}>
          <div className={styles.share}>
            <ShareStreamButton />
          </div>
        </div>
      </div>
    </div>
  );
}
