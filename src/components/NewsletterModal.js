"use client";
import { useState, useEffect } from "react";
import { X, Mail, CheckCircle2 } from "lucide-react";
import styles from "./NewsletterModal.module.css";

export default function NewsletterModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    }, 1500);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>

        {!isSubmitted ? (
          <div className={styles.content}>
            <div className={styles.iconWrapper}>
              <Mail size={32} className={styles.icon} />
            </div>
            <h2 className={styles.title}>Subscribe to our newsletter</h2>
            <p className={styles.description}>
              Sign up for our newsletter and receive exclusive discounts and promotions directly to your inbox.
            </p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Your email address"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                {isLoading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        ) : (
          <div className={styles.successContent}>
            <CheckCircle2 size={64} className={styles.successIcon} />
            <h2 className={styles.title}>Thank You!</h2>
            <p className={styles.description}>
              You've successfully subscribed to our newsletter. We'll be in touch soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
