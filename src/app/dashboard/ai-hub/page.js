"use client";
import { useState, useEffect } from "react";
import { Sparkles, Wand2, RefreshCw, CheckCircle2, AlertCircle, Search, FileText, Share2, List, Layout, Globe } from "lucide-react";
import styles from "../dashboard.module.css";
import { getCategoryFallbackImage } from "@/lib/fallback-images";

export default function AIHubPage() {
  const [topic, setTopic] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [newsResults, setNewsResults] = useState([]);
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewrittenArticle, setRewrittenArticle] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("World");
  const [apiStatus, setApiStatus] = useState({ gnews: true, deepseek: true });
  const [publishedArticle, setPublishedArticle] = useState(null);

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setApiStatus(data))
      .catch(err => console.error("Status check failed:", err));
  }, []);

  const handleSearch = async (e, searchQuery = null) => {
    if (e) e.preventDefault();
    const queryToSearch = searchQuery || topic;
    if (!queryToSearch.trim()) return;
    
    setIsSearching(true);
    setNewsResults([]);
    setRewrittenArticle(null);
    setError(null);
    
    try {
      const res = await fetch(`/api/news-search?q=${encodeURIComponent(queryToSearch)}&_t=${Date.now()}`, {
        cache: 'no-store'
      });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }
      
      const results = data.articles || [];
      if (results.length === 0) {
        setError("No results found. Try a different search term.");
      }
      setNewsResults(results);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed. Please check your internet connection and try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleRewrite = async (article) => {
    setIsRewriting(true);
    setRewrittenArticle(null);
    setError(null);
    
    try {
      const res = await fetch('/api/ai-rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          description: article.description,
          topic: topic
        })
      });
      
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const rawTitle = data.title || article.title || "";
      const cleanTitle = rawTitle.replace(/^SEO Optimized:\s*/i, '').replace(/^SEO-Optimized:\s*/i, '').replace(/SEO Optimized:\s*/gi, '').trim();

      setRewrittenArticle({
        title: cleanTitle,
        content: data.content,
        metaDescription: data.metaDescription || "",
        image: article.image || getCategoryFallbackImage(data.category || selectedCategory, cleanTitle),
        source: article.source?.name || "Global News Hub",
        originalUrl: article.url,
        tags: data.tags || [topic.toLowerCase(), "trending", "ai-optimized"],
        category: data.category || "Global News",
        slug: data.slug || cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      });
    } catch (err) {
      console.error("Rewrite failed:", err);
      setError("AI Rewrite failed. Please check your DeepSeek API key in .env.local.");
    } finally {
      setIsRewriting(false);
    }
  };

  const handlePublish = async () => {
    if (!rewrittenArticle) return;
    setIsPublishing(true);
    
    let processedContent = rewrittenArticle.content;

    // Convert [Internal Link: anchor text](url) to HTML
    processedContent = processedContent.replace(
      /\[Internal Link:\s*([^\]]+)\]\(([^)]+)\)/gi,
      '<a href="$2" class="internal-seo-link" title="$1" style="color: var(--accent-color); text-decoration: underline;">$1</a>'
    );

    // Convert [External Link: anchor text](url) to HTML
    processedContent = processedContent.replace(
      /\[External Link:\s*([^\]]+)\]\(([^)]+)\)/gi,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="external-seo-link" title="$1" style="color: var(--accent-color); text-decoration: underline;">$1</a>'
    );

    // Auto-add related SEO tags based on category and topic
    const extraTags = [selectedCategory.toLowerCase(), "breaking news", "global update", "insight"];
    const mergedTags = Array.from(new Set([...(rewrittenArticle.tags || []), ...extraTags]));
    const permanentFallback = getCategoryFallbackImage(selectedCategory, rewrittenArticle.title);

    const newArticle = {
      id: rewrittenArticle.slug || `ai-${Date.now()}`,
      title: rewrittenArticle.title,
      excerpt: rewrittenArticle.metaDescription || (processedContent.replace(/<[^>]*>/g, '').substring(0, 150) + "..."),
      author: "Readers 24",
      category: selectedCategory,
      status: "Published",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: "12 mins ago",
      image: rewrittenArticle.image || permanentFallback,
      content: processedContent,
      tags: mergedTags,
      isAiGenerated: true
    };

    try {
      // Get fresh data with cache-busting to bypass any browser/router caching
      const res = await fetch(`/api/data?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error("Failed to load current data");
      const currentData = await res.json();
      
      // Safely deduplicate and merge articles so old articles are NEVER lost
      const existingArticles = Array.isArray(currentData.editorsPicks) ? currentData.editorsPicks : [];
      const filteredExisting = existingArticles.filter(a => a && a.id && a.id !== newArticle.id);
      const mergedEditorsPicks = [newArticle, ...filteredExisting];

      const existingSecondary = Array.isArray(currentData.secondaryArticles) ? currentData.secondaryArticles : [];
      const mergedSecondary = [
        currentData.heroArticle,
        ...existingSecondary
      ].filter(a => a && a.id && a.id !== newArticle.id).slice(0, 4);

      const updatedData = {
        ...currentData,
        heroArticle: newArticle,
        secondaryArticles: mergedSecondary,
        editorsPicks: mergedEditorsPicks,
        mostRead: [newArticle, ...(currentData.mostRead || mergedEditorsPicks)].filter((a, idx, arr) => a && a.id && arr.findIndex(x => x.id === a.id) === idx).slice(0, 5)
      };

      const saveRes = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
        cache: 'no-store'
      });
      
      const saveResult = await saveRes.json().catch(() => ({}));

      if (!saveRes.ok || !saveResult.success) {
        const errorMsg = saveResult.message || `Server error (${saveRes.status})`;
        throw new Error(errorMsg);
      }

      setPublishedArticle(newArticle);
      setRewrittenArticle(null);
      setNewsResults([]);
      setTopic("");
    } catch (err) {
      console.error("Publish failed:", err);
      alert(`Publish Failed: ${err.message}\nYour draft was not lost. Please check your login session.`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.pageHeader}>
        <div>
          <h1>AI Article Hub & News Aggregator</h1>
          <p>Search global news, rewrite with SEO-optimized AI, and publish instantly.</p>
        </div>
        <div className={styles.apiStatusContainer}>
          <div className={`${styles.apiBadge} ${styles.statusActive}`}>
            <Globe size={14} />
            <span>News Feed: Live</span>
          </div>
          <div className={`${styles.apiBadge} ${styles.statusActive}`}>
            <Sparkles size={14} />
            <span>Gemini AI: Live</span>
          </div>
        </div>
      </div>

      {publishedArticle && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #10b981',
          borderRadius: '10px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h4 style={{ color: '#065f46', margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 700 }}>
              🎉 Article Successfully Published to Readers 24!
            </h4>
            <p style={{ margin: 0, color: '#047857', fontSize: '0.9rem' }}>
              <strong>Title:</strong> {publishedArticle.title}
            </p>
          </div>
          <a 
            href={`/article/${publishedArticle.id}`} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#9b2226',
              color: '#ffffff',
              padding: '9px 18px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.85rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            View Article Live on Readers 24 ↗
          </a>
        </div>
      )}

      <div className={styles.contentGrid} style={{ gridTemplateColumns: '1fr' }}>
        <div className={styles.tableCard}>
          <div className={styles.aiHubHeader}>
            <Search size={24} className={styles.aiIcon} />
            <h2>Step 1: Search Global Trends</h2>
          </div>
          
          <form onSubmit={handleSearch} className={styles.aiForm}>
            <div className={styles.inputGroup}>
              <label>Search news by interest (Powered by GNews)</label>
              <div className={styles.inputWithAction}>
                <input 
                  type="text" 
                  placeholder="e.g., Apple Vision Pro sales" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <button type="submit" className={styles.primaryBtn} disabled={isSearching || !topic.trim()}>
                  {isSearching ? <RefreshCw size={18} className={styles.spin} /> : <Search size={18} />}
                  {isSearching ? "Searching..." : "Search Latest News"}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className={styles.aiPlaceholder} style={{ padding: '32px', color: '#f43f5e' }}>
              <AlertCircle size={32} />
              <p>{error}</p>
            </div>
          )}

          {newsResults.length > 0 && !rewrittenArticle && (
            <div className={styles.newsGrid}>
              {newsResults.map((article, idx) => (
                <div key={idx} className={styles.newsCard}>
                  <img 
                    src={article.image || getCategoryFallbackImage(selectedCategory, article.title)} 
                    alt="News thumbnail" 
                    className={styles.newsThumb}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getCategoryFallbackImage(selectedCategory, article.title);
                    }}
                  />
                  <div className={styles.newsInfo}>
                    <h4>{article.title}</h4>
                    <p>{(article.description || '').replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim().substring(0, 110)}...</p>
                    <button 
                      className={styles.secondaryBtn} 
                      onClick={() => handleRewrite(article)}
                      disabled={isRewriting}
                    >
                      <Sparkles size={16} /> {isRewriting ? "Rewriting..." : "AI SEO Rewrite"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isRewriting && (
            <div className={styles.aiPlaceholder}>
              <RefreshCw size={40} className={styles.spin} />
              <p>Google Gemini AI is optimizing this article for Google Search (TOC, Headings, SEO Links)...</p>
            </div>
          )}

          {rewrittenArticle && (
            <div className={styles.aiResult}>
              <div className={styles.resultHeader}>
                <CheckCircle2 size={20} color="#10b981" />
                <h3>Step 2: SEO Optimized Draft (Google Gemini AI)</h3>
              </div>
              <div className={styles.draftCard}>
                 <div className={styles.draftPreviewHeader}>
                    {rewrittenArticle.image && (
                      <img 
                        src={rewrittenArticle.image} 
                        alt="Preview" 
                        className={styles.draftImage} 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getCategoryFallbackImage(selectedCategory, rewrittenArticle.title);
                        }}
                      />
                    )}
                    <h4>{rewrittenArticle.title}</h4>
                 </div>
                <div className={styles.seoContent} dangerouslySetInnerHTML={{ __html: rewrittenArticle.content }} />
              </div>
              
              <div className={styles.categoryPicker}>
                <label>Select Category for Publication:</label>
                <select 
                  className={styles.selectInput} 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option>World</option>
                  <option>Politics</option>
                  <option>Business</option>
                  <option>Tech</option>
                  <option>Science</option>
                  <option>Health</option>
                  <option>Sports</option>
                  <option>Arts</option>
                  <option>Opinion</option>
                  <option>Style</option>
                  <option>Food</option>
                  <option>Travel</option>
                </select>
              </div>

              <div className={styles.aiActions}>
                <button className={styles.secondaryBtn} onClick={() => setRewrittenArticle(null)}>Back to Search</button>
                <button className={styles.primaryBtn} onClick={handlePublish} disabled={isPublishing}>
                  {isPublishing ? <RefreshCw size={18} className={styles.spin} /> : <Share2 size={18} />}
                  {isPublishing ? "Publishing..." : "Publish to Readers 24"}
                </button>
              </div>
            </div>
          )}

          {!newsResults.length && !isSearching && !rewrittenArticle && !error && (
            <div className={styles.emptyStateContainer}>
              <div className={styles.aiPlaceholder}>
                <div className={styles.iconCircle}>
                  <Layout size={40} strokeWidth={1.5} />
                </div>
                <h3>Your Automated SEO Workspace</h3>
                <p>Enter a topic above to aggregate global news and generate AI-optimized articles.</p>
              </div>

              <div className={styles.trendingTopics}>
                <div className={styles.trendingTitle}>
                  <Sparkles size={16} className={styles.aiIcon} />
                  <span>Trending News Topics</span>
                </div>
                <div className={styles.trendingGrid}>
                  {[
                    "Global Economy", "Artificial Intelligence", "Climate Change", 
                    "Space Exploration", "Renewable Energy", "Cybersecurity", 
                    "Electric Vehicles", "Quantum Computing", "Sustainable Cities"
                  ].map(keyword => (
                    <button 
                      key={keyword} 
                      className={styles.keywordChip}
                      onClick={() => {
                        setTopic(keyword);
                        // Trigger search automatically
                        const fakeEvent = { preventDefault: () => {} };
                        handleSearch(fakeEvent, keyword);
                      }}
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
