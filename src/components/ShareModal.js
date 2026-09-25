"use client";
import { useState } from "react";
import { X, Copy, Check, Send, Globe, Users, Mail } from "lucide-react";
import styles from "./ShareModal.module.css";

export default function ShareModal({ isOpen, onClose, url, title }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const shareLinks = [
    { name: "Twitter", icon: Send, color: "#1DA1F2", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
    { name: "Facebook", icon: Globe, color: "#1877F2", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: "LinkedIn", icon: Users, color: "#0A66C2", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { name: "Email", icon: Mail, color: "#64748b", url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}` },
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        
        <h2>Share this stream</h2>
        <p>Invite others to join the live coverage on Readers 24.</p>
        
        <div className={styles.shareOptions}>
          {shareLinks.map(link => (
            <a 
              key={link.name} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.shareOption}
            >
              <div className={styles.iconWrapper} style={{ backgroundColor: link.color }}>
                <link.icon size={20} />
              </div>
              <span>{link.name}</span>
            </a>
          ))}
        </div>
        
        <div className={styles.copySection}>
          <label className={styles.copyLabel}>Copy Link</label>
          <div className={styles.copyGroup}>
            <input type="text" readOnly value={url} className={styles.copyInput} />
            <button 
              className={`${styles.copyBtn} ${copied ? styles.copied : ""}`} 
              onClick={handleCopy}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
