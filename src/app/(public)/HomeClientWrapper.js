"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PlayCircle } from "lucide-react";
import styles from "./page.module.css";
import NewsletterModal from "@/components/NewsletterModal";

export default function HomeClientWrapper({ opinionPieces = [], multimediaArticles = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {multimediaArticles.length > 0 && (
        <section className={styles.multimediaSection}>
          <div className={styles.sectionHeaderFlex}>
            <h2 className={styles.sectionTitleLarge}>Video & Podcasts</h2>
            <Link href="/live" className={styles.viewAllLink}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.multimediaGrid}>
            {multimediaArticles.map(media => (
              <article key={media.id} className={styles.multimediaCard}>
                <div className={styles.multimediaImageWrapper}>
                  {media.image && <Image src={media.image} alt={media.title} fill className={styles.multimediaImage} />}
                  <div className={styles.playButtonOverlay}>
                    <PlayCircle size={48} className={styles.playIcon} />
                  </div>
                  <span className={styles.durationBadge}>{media.duration || 'Video'}</span>
                </div>
                <div className={styles.multimediaContent}>
                  <span className="category-tag">{media.category}</span>
                  <h3 className={styles.multimediaTitle}>
                    <Link href={`/article/${media.id}`}>{media.title}</Link>
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {multimediaArticles.length > 0 && <div className={styles.sectionDivider}></div>}

      {opinionPieces.length > 0 && (
        <section className={styles.opinionSection}>
          <div className={styles.sectionHeaderFlex}>
            <h2 className={styles.sectionTitleLarge}>Opinion & Analysis</h2>
            <Link href="/category/opinion" className={styles.viewAllLink}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className={styles.opinionGrid}>
            {opinionPieces.map(piece => (
              <article key={piece.id} className={styles.opinionCard}>
                <div className={styles.authorBadge}>
                  <div className={styles.authorAvatar}>
                    {piece.author?.charAt(0) || 'A'}
                  </div>
                </div>
                <div className={styles.opinionContent}>
                  <h3 className={styles.opinionTitle}>
                    <Link href={`/article/${piece.id}`}>{piece.title}</Link>
                  </h3>
                  <div className={styles.opinionMeta}>
                    <span className={styles.opinionAuthor}>{piece.author}</span>
                    <span className={styles.opinionRole}>{piece.role || 'Contributor'}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className={styles.newsletterSection}>
        <div className={styles.newsletterContent}>
          <h2 className={styles.newsletterTitle}>The Daily Briefing</h2>
          <p className={styles.newsletterDesc}>Get the most important news, analysis, and insights delivered straight to your inbox every morning.</p>
          <form className={styles.newsletterForm} onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }}>
            <input type="email" placeholder="Your email address" className={styles.newsletterInput} required />
            <button type="submit" className={styles.newsletterBtn}>Subscribe</button>
          </form>
          <p className={styles.newsletterDisclaimer}>By subscribing, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </section>

      <NewsletterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
