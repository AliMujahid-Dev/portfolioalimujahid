import Link from "next/link";
import { ArrowLeft, Mic, Play, Clock, ChevronRight } from "lucide-react";
import styles from "./podcasts.module.css";

export const metadata = {
  title: 'Podcasts | Readers 24',
  description: 'Listen to the latest podcasts from Readers 24.',
};

export default function PodcastsPage() {
  const podcasts = [
    {
      id: 1,
      title: "The Morning Brief",
      host: "Sarah Chen",
      duration: "15 min",
      description: "Start your day with the most essential global news stories in 15 minutes.",
      image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Tech Frontiers",
      host: "Marcus Thorne",
      duration: "42 min",
      description: "Deep dives into the technologies reshaping our world, from AI to quantum computing.",
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "The Global Market",
      host: "Elena Rostova",
      duration: "35 min",
      description: "Analysis of financial markets and economic trends with leading experts.",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className={styles.podcastsPage}>
      <div className="container">
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Readers 24
        </Link>
        
        <div className={styles.header}>
          <Mic size={48} className={styles.headerIcon} />
          <h1 className={styles.title}>Readers 24 Podcasts</h1>
          <p className={styles.description}>Audio journalism for your commute, workout, or anywhere in between.</p>
        </div>

        <div className={styles.podcastGrid}>
          {podcasts.map((podcast) => (
            <div key={podcast.id} className={styles.podcastCard}>
              <div className={styles.imageWrapper}>
                <img src={podcast.image} alt={podcast.title} className={styles.podcastImage} />
                <button className={styles.playBtn}><Play size={24} fill="currentColor" /></button>
              </div>
              <div className={styles.podcastContent}>
                <h2 className={styles.podcastTitle}>{podcast.title}</h2>
                <div className={styles.podcastMeta}>
                  <span className={styles.host}>Hosted by {podcast.host}</span>
                  <span className={styles.dot}>•</span>
                  <span className={styles.duration}><Clock size={14} /> {podcast.duration}</span>
                </div>
                <p className={styles.podcastDesc}>{podcast.description}</p>
                <button className={styles.listenLink}>
                  Listen to latest episode <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
