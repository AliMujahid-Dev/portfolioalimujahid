"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, Edit, Trash2, MoreVertical, Eye, Archive } from "lucide-react";
import styles from "../dashboard.module.css";

function ArticlesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    fetch('/api/data', { cache: 'no-store' })
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Error loading articles data:", err));

    const q = searchParams.get('q');
    if (q) setSearchTerm(q);

    const handleClickOutside = () => setOpenDropdownId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [searchParams]);



  // BUG FIX: Actually filter articles using searchTerm
  const allArticles = data?.editorsPicks || [];
  const articles = searchTerm.trim()
    ? allArticles.filter(a =>
        (a.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.author || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.category || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allArticles;

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    // Use functional update to ensure we have the latest state
    setData(currentData => {
      if (!currentData) return currentData;
      return {
        ...currentData,
        editorsPicks: (currentData.editorsPicks || []).filter(a => a.id !== id),
        heroArticle: currentData.heroArticle?.id === id ? null : currentData.heroArticle,
        secondaryArticles: (currentData.secondaryArticles || []).filter(a => a.id !== id),
        opinionPieces: (currentData.opinionPieces || []).filter(a => a.id !== id),
        mostRead: (currentData.mostRead || []).filter(a => a.id !== id),
        multimediaArticles: (currentData.multimediaArticles || []).filter(a => a.id !== id)
      };
    });

    try {
      // Fetch latest data to be absolutely sure
      const getRes = await fetch('/api/data', { cache: 'no-store' });
      const latestData = await getRes.json();
      
      const updatedData = {
        ...latestData,
        editorsPicks: (latestData.editorsPicks || []).filter(a => a.id !== id),
        heroArticle: latestData.heroArticle?.id === id ? null : latestData.heroArticle,
        secondaryArticles: (latestData.secondaryArticles || []).filter(a => a.id !== id),
        opinionPieces: (latestData.opinionPieces || []).filter(a => a.id !== id),
        mostRead: (latestData.mostRead || []).filter(a => a.id !== id),
        multimediaArticles: (latestData.multimediaArticles || []).filter(a => a.id !== id)
      };

      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
        cache: 'no-store'
      });
      
      if (!res.ok) throw new Error("Server error");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete article. Reverting changes...");
      // Refresh data from server to recover
      const recoverRes = await fetch('/api/data', { cache: 'no-store' });
      const recoverData = await recoverRes.json();
      setData(recoverData);
    }
  };

  const toggleDropdown = (e, id) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Article Management</h1>
          <p>Create, edit, and manage all editorial content across Readers 24.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primaryBtn} onClick={() => router.push('/dashboard?create=true')}>
            Create New Article
          </button>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableControls}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search articles by title or author..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.articleTable}>
            <thead>
              <tr>
                <th>Article Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date Published</th>
                <th>Author</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    {searchTerm ? "No articles match your search." : "No articles found."}
                  </td>
                </tr>
              )}
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className={styles.titleCell}>{article.title}</td>
                  <td><span className={styles.categoryTag}>{article.category}</span></td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[(article.status || 'Published').toLowerCase().replace(' ', '')]}`}>
                      {article.status || 'Published'}
                    </span>
                  </td>
                  <td>{article.date || '—'}</td>
                  <td>{article.author || '—'}</td>
                  <td>
                    <div className={styles.actionGroup}>
                      <button 
                        className={styles.iconBtn} 
                        onClick={() => router.push(`/dashboard?edit=${article.id}`)}
                        title="Edit Article"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className={styles.iconBtn} 
                        onClick={() => handleDelete(article.id)} 
                        style={{ color: '#f43f5e' }}
                        title="Delete Article"
                      >
                        <Trash2 size={16} />
                      </button>
                      
                      <div className={styles.dropdownWrapper}>
                        <button 
                          className={styles.iconBtn}
                          onClick={(e) => toggleDropdown(e, article.id)}
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {openDropdownId === article.id && (
                          <div className={styles.actionDropdown}>
                            <button className={styles.dropdownItem} onClick={() => window.open(`/article/${article.id}`, '_blank')}>
                              <Eye size={14} /> View Article
                            </button>
                            <button className={styles.dropdownItem} onClick={() => alert("Article archived successfully!")}>
                              <Archive size={14} /> Archive
                            </button>
                            <div className={styles.dropdownDivider}></div>
                            <button className={`${styles.dropdownItem} ${styles.deleteItem}`} onClick={() => handleDelete(article.id)}>
                              <Trash2 size={14} /> Delete Permanent
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div>Loading articles...</div>}>
      <ArticlesContent />
    </Suspense>
  );
}
