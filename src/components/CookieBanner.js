"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";
import styles from "./CookieBanner.module.css";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("readers24_cookie_consent");
      if (!consent) {
        // Show after user interaction (scroll/touch) or after 3.5s so initial Core Web Vitals are not degraded
        const onInteraction = () => {
          setIsVisible(true);
          window.removeEventListener("scroll", onInteraction);
          window.removeEventListener("pointerdown", onInteraction);
        };
        window.addEventListener("scroll", onInteraction, { once: true, passive: true });
        window.addEventListener("pointerdown", onInteraction, { once: true, passive: true });

        const timer = setTimeout(() => setIsVisible(true), 3500);
        return () => {
          clearTimeout(timer);
          window.removeEventListener("scroll", onInteraction);
          window.removeEventListener("pointerdown", onInteraction);
        };
      }
    } catch {
      // Ignore localStorage access errors in private mode
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("readers24_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("readers24_cookie_consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.bannerOverlay} role="dialog" aria-live="polite" aria-label="Cookie Consent Banner">
      <div className={styles.bannerCard}>
        <div className={styles.headerRow}>
          <Cookie size={22} className={styles.icon} />
          <h3 className={styles.title}>Cookie & Privacy Policy</h3>
        </div>
        <p className={styles.description}>
          We use cookies and similar technologies to enhance your browsing experience, analyze traffic on <strong>Readers 24</strong>, and personalize content. By clicking "Accept All", you consent to our use of cookies in accordance with our{" "}
          <Link href="/info/cookies" className={styles.policyLink}>
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link href="/info/privacy" className={styles.policyLink}>
            Privacy Policy
          </Link>.
        </p>
        <div className={styles.actions}>
          <button onClick={handleDecline} className={styles.declineBtn}>
            Decline Non-Essential
          </button>
          <button onClick={handleAccept} className={styles.acceptBtn}>
            Accept All Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
