"use client";
import Link from "next/link";
import { useState } from "react";
import { Mail } from "lucide-react";
import styles from "./Footer.module.css";
import NewsletterModal from "./NewsletterModal";
import Logo from "./Logo";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerTop}`}>
        <div className={styles.brandSection}>
          <div className={styles.logo}>
            <Logo siteName="Readers 24" size="md" variant="dark" />
          </div>
          <p className={styles.tagline}>Intelligent 24/7 journalism for a complex world.</p>
          <div className={styles.socialLinks}>
            <a href="#" aria-label="Twitter" className={styles.socialIcon}>X</a>
            <a href="#" aria-label="Facebook" className={styles.socialIcon}>F</a>
            <a href="#" aria-label="Instagram" className={styles.socialIcon}>I</a>
            <a href="#" aria-label="LinkedIn" className={styles.socialIcon}>L</a>
            <a href="#" aria-label="YouTube" className={styles.socialIcon}>Y</a>
          </div>
        </div>

        <div className={styles.linkGrid}>
          <div className={styles.linkColumn}>
            <h3 className={styles.columnHeader}>Sections</h3>
            <Link href="/category/world" className={styles.footerLink}>World</Link>
            <Link href="/category/politics" className={styles.footerLink}>Politics</Link>
            <Link href="/category/business" className={styles.footerLink}>Business</Link>
            <Link href="/category/tech" className={styles.footerLink}>Tech</Link>
            <Link href="/category/science" className={styles.footerLink}>Science</Link>
            <Link href="/category/health" className={styles.footerLink}>Health</Link>
            <Link href="/category/sports" className={styles.footerLink}>Sports</Link>
            <Link href="/category/arts" className={styles.footerLink}>Arts</Link>
            <Link href="/category/opinion" className={styles.footerLink}>Opinion</Link>
          </div>
          
          <div className={styles.linkColumn}>
            <h3 className={styles.columnHeader}>About Us</h3>
            <Link href="/info/about" className={styles.footerLink}>Our Company</Link>
            <Link href="/info/careers" className={styles.footerLink}>Careers</Link>
            <Link href="/info/journalism-ethics" className={styles.footerLink}>Journalism Ethics</Link>
            <a href="mailto:contact@readers24.com" className={styles.footerLink}>Contact Us (contact@readers24.com)</a>
            <Link href="/info/site-map" className={styles.footerLink}>Site Map</Link>
          </div>

          <div className={styles.linkColumn}>
            <h3 className={styles.columnHeader}>Subscriptions</h3>
            <button 
              className={styles.footerLink} 
              onClick={() => setIsModalOpen(true)}
              style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0, width: '100%' }}
            >
              Subscribe
            </button>
            <button 
              className={styles.footerLink} 
              onClick={() => setIsModalOpen(true)}
              style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0, width: '100%' }}
            >
              Gift Subscriptions
            </button>
            <button 
              className={styles.footerLink} 
              onClick={() => setIsModalOpen(true)}
              style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0, width: '100%' }}
            >
              Education Rate
            </button>
            <button 
              className={styles.footerLink} 
              onClick={() => setIsModalOpen(true)}
              style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0, width: '100%' }}
            >
              Newsletters
            </button>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={`container ${styles.bottomContainer}`}>
          <p className={styles.copyright}>
            &copy; 2026 Readers 24. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link href="/info/terms" className={styles.legalLink}>Terms of Service</Link>
            <Link href="/info/privacy" className={styles.legalLink}>Privacy Policy</Link>
            <Link href="/info/cookies" className={styles.legalLink}>Cookie Settings</Link>
            <Link href="/info/accessibility" className={styles.legalLink}>Accessibility</Link>
          </div>
        </div>
      </div>
      <NewsletterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </footer>
  );
}
