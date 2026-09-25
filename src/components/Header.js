"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import styles from "./Header.module.css";
import NewsletterModal from "./NewsletterModal";
import Logo from "./Logo";

const CATEGORIES = [
  { name: "World", slug: "world" },
  { name: "Politics", slug: "politics" },
  { name: "Business", slug: "business" },
  { name: "Tech", slug: "tech" },
  { name: "Science", slug: "science" },
  { name: "Health", slug: "health" },
  { name: "Sports", slug: "sports" },
  { name: "Arts", slug: "arts" },
  { name: "Opinion", slug: "opinion" },
];

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [siteName, setSiteName] = useState("Readers 24");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formatted);

    fetch('/api/data')
      .then(res => {
        if (!res.ok) return null;
        return res.json().catch(() => null);
      })
      .then(data => {
        if (data?.settings?.siteName) setSiteName(data.settings.siteName);
      })
      .catch(() => {
        // Silently keep default 'Readers 24' if background fetch fails
      });

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/?s=${encodeURIComponent(searchQuery.trim())}`);
    setIsSearchOpen(false);
  };

  return (
    <header className={styles.header}>
      {/* Top utility bar */}
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarContainer}`}>
          <div className={styles.leftUtils}>
            <span className={styles.date}>{currentDate || "Sunday, September 6, 2026"}</span>
            <span className={styles.edition}>International Edition</span>
          </div>
          <div className={styles.rightUtils}>
            <button className={styles.utilLink} onClick={() => setIsModalOpen(true)}>Newsletters</button>
            <Link href="/podcasts" className={styles.utilLink}>Podcasts</Link>
            <button className={styles.subscribeBtn} onClick={() => setIsModalOpen(true)}>Subscribe</button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className={styles.mainNav}>
        <div className={`container ${styles.mainNavContainer}`}>
          <div className={styles.navLeft}>
            <button 
              className={styles.menuBtn} 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              <Menu size={18} />
              <span className={styles.menuText}>Categories</span>
              <ChevronDown size={14} className={`${styles.chevron} ${isMenuOpen ? styles.chevronOpen : ""}`} />
            </button>
          </div>
          
          <Link href="/" className={styles.logo} aria-label="Readers 24 Home">
            <Logo siteName={siteName} size="md" variant="dark" />
          </Link>
          
          <div className={styles.navActions}>
            <Link href="/live" className={styles.liveLink}>
              <span className={styles.liveDot}></span> 
              <span className={styles.liveText}>Live TV</span>
            </Link>

            <button 
              type="button"
              className={`${styles.iconBtn} ${isSearchOpen ? styles.iconBtnActive : ''}`} 
              aria-label={isSearchOpen ? "Close search" : "Open search"} 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <X size={18} /> : <Search size={18} />}
            </button>
          </div>
        </div>

        {/* Dedicated Modern Newsroom Search Dropdown Panel (NYT / Guardian / BBC style) */}
        {isSearchOpen && (
          <>
            <div className={styles.searchPanelOverlay} onClick={() => setIsSearchOpen(false)} />
            <div className={styles.searchPanel}>
              <div className={`container ${styles.searchPanelContainer}`}>
                <form onSubmit={handleSearchSubmit} className={styles.searchPanelForm}>
                  <div className={styles.searchPanelInputWrapper}>
                    <Search size={20} className={styles.searchPanelIcon} />
                    <input 
                      type="text" 
                      placeholder="Search news, topics, analysis, people..." 
                      className={styles.searchPanelInput}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    {searchQuery && (
                      <button 
                        type="button" 
                        onClick={() => setSearchQuery("")} 
                        className={styles.searchClearBtn}
                        aria-label="Clear search input"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <button type="submit" className={styles.searchPanelSubmitBtn}>
                    Search
                  </button>
                  <button 
                    type="button" 
                    className={styles.searchPanelCloseBtn} 
                    onClick={() => setIsSearchOpen(false)}
                    aria-label="Close search"
                  >
                    <X size={20} />
                  </button>
                </form>

                <div className={styles.searchTrendingRow}>
                  <span className={styles.searchTrendingLabel}>Trending Topics:</span>
                  {["World", "Politics", "Business", "Tech", "Science", "Sports"].map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      className={styles.searchTrendingChip}
                      onClick={() => {
                        setSearchQuery(topic);
                        router.push(`/?s=${encodeURIComponent(topic)}`);
                        setIsSearchOpen(false);
                      }}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Categories Drawer Overlay */}
        {isMenuOpen && (
          <div className={styles.drawerOverlay} onClick={() => setIsMenuOpen(false)}>
            <div className={styles.drawer} onClick={e => e.stopPropagation()}>
              <div className={styles.drawerHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Menu size={20} color="var(--accent-color)" />
                  <h3 className={styles.drawerTitle}>Browse Categories</h3>
                </div>
                <button className={styles.iconBtn} onClick={() => setIsMenuOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <nav className={styles.drawerNav}>
                {CATEGORIES.map(cat => (
                  <Link 
                    key={cat.slug} 
                    href={`/category/${cat.slug}`} 
                    className={styles.drawerCatLink}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </nav>
              <div className={styles.drawerFooter}>
                <p>Readers 24 Media & Global Newsroom</p>
                <Link href="/live" className={styles.drawerLiveBtn} onClick={() => setIsMenuOpen(false)}>
                  🔴 Watch Live Broadcast
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categories horizontal strip */}
      <div className={styles.categoryStrip}>
        <div className={`container ${styles.categoryContainer}`}>
          <nav className={styles.categories}>
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className={styles.catLink}>
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <NewsletterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </header>
  );
}
