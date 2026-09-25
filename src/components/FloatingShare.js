"use client";
import { useState } from "react";
import { Globe, Send, Users, Bookmark, Check } from "lucide-react";
import styles from "./FloatingShare.module.css";

export default function FloatingShare({ url, title }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const shareLinks = [
    { name: "Facebook", icon: Globe, color: "#1877F2", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: "Twitter", icon: Send, color: "#000000", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
    { name: "LinkedIn", icon: Users, color: "#0A66C2", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ];

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className={styles.floatingBar}>
      {shareLinks.map(link => (
        <a 
          key={link.name} 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.shareIcon}
          title={`Share on ${link.name}`}
        >
          <link.icon size={20} />
        </a>
      ))}
      <button 
        className={`${styles.shareIcon} ${isBookmarked ? styles.activeBookmark : ""}`} 
        onClick={handleBookmark}
        title="Bookmark article"
      >
        {isBookmarked ? <Check size={20} /> : <Bookmark size={20} />}
      </button>
    </div>
  );
}
