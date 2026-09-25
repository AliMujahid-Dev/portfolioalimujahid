"use client";
import { useState } from "react";
import { Share2 } from "lucide-react";
import styles from "../app/(public)/live/live.module.css";
import ShareModal from "./ShareModal";

export default function ShareStreamButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShareClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button className={styles.shareBtn} onClick={handleShareClick}>
        <Share2 size={18} /> Share Stream
      </button>
      
      <ShareModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        url={typeof window !== 'undefined' ? window.location.href : ""}
        title="Readers 24 Global Stream"
      />
    </>
  );
}
