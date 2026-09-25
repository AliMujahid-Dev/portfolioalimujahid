"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  TrendingUp, 
  Users, 
  FileEdit, 
  Clock, 
  Plus, 
  Image as ImageIcon,
  Send,
  MoreVertical,
  Eye,
  Trash2,
  X
} from "lucide-react";
import styles from "./dashboard.module.css";

function DashboardContent() {
  const searchParams = useSearchParams();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState({
    settings: { siteName: "Readers 24", userName: "James Doe" },
    editorsPicks: [],
    heroArticle: null,
    secondaryArticles: []
  });
  const [editingArticle, setEditingArticle] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setShowUploadForm(true);
      setEditingArticle(null);
    }
    const editId = searchParams.get('edit');
    if (editId && data.editorsPicks.length > 0) {
      const article = [
        data.heroArticle || {},
        ...(data.editorsPicks || []),
        ...(data.secondaryArticles || [])
      ].find(a => a.id === editId);

      if (article) {
        setEditingArticle(article);
        setImagePreview(article.image);
        setSelectedImage(article.image);
        setShowUploadForm(true);
      }
    }
  }, [searchParams, data.editorsPicks, data.heroArticle, data.secondaryArticles]);

  // Fetch all data on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/data', { cache: 'no-store' })
      .then(res => res.json())
      .then(json => {
        if (isMounted) setData(json);
      })
      .catch(err => console.error("Error loading dashboard data:", err));
    return () => { isMounted = false; };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    // Use functional update to ensure we have the latest state
    let previousData;
    setData(currentData => {
      previousData = currentData;
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setImagePreview(article.image);
    setSelectedImage(article.image);
    setShowUploadForm(true);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const category = formData.get("category");
    const excerpt = formData.get("excerpt");
    const content = formData.get("content");
    
    if (!title?.trim()) {
      alert("Please enter an article title.");
      setIsSaving(false);
      return;
    }

    const updatedArticle = {
      ...(editingArticle || {}),
      id: editingArticle ? editingArticle.id : `new-${Date.now()}`,
      title,
      category,
      excerpt,
      content,
      status: "Published",
      date: editingArticle ? editingArticle.date : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: editingArticle ? editingArticle.time : "Just now",
      author: editingArticle ? editingArticle.author : (data?.settings?.userName || "James Doe"),
      image: selectedImage || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=2070&auto=format&fit=crop"
    };

    let updatedData;
    if (editingArticle) {
      updatedData = {
        ...data,
        editorsPicks: (data.editorsPicks || []).map(a => a.id === editingArticle.id ? updatedArticle : a),
        heroArticle: data.heroArticle?.id === editingArticle.id ? updatedArticle : data.heroArticle,
        secondaryArticles: (data.secondaryArticles || []).map(a => a.id === editingArticle.id ? updatedArticle : a),
        mostRead: (data.mostRead || []).map(a => a.id === editingArticle.id ? updatedArticle : a)
      };
    } else {
      updatedData = {
        ...data,
        editorsPicks: [updatedArticle, ...(data?.editorsPicks || [])],
        heroArticle: !data.heroArticle ? updatedArticle : data.heroArticle,
        mostRead: [updatedArticle, ...(data?.mostRead || data?.editorsPicks || [])].filter(Boolean).slice(0, 5)
      };
    }

    setData(updatedData);

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
        cache: 'no-store'
      });
      const saveResult = await res.json().catch(() => ({}));
      if (!res.ok || !saveResult.success) {
        throw new Error(saveResult.message || `Server error (${res.status})`);
      }
      
      setTimeout(() => {
        setIsSaving(false);
        setShowUploadForm(false);
        setEditingArticle(null);
        setSelectedImage(null);
        setImagePreview(null);
      }, 500);
    } catch (error) {
      console.error("Save failed:", error);
      alert(`Publish Failed: ${error.message}\nYour draft was retained.`);
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Editor Dashboard</h1>
          <p>Manage Readers 24's editorial content and media assets.</p>
        </div>
        <div className={styles.headerRight}>
          {isSaving && <span className={styles.autoSave}>Auto-saving...</span>}
          <button 
            className={styles.primaryBtn}
            onClick={() => {
              if (showUploadForm) {
                setShowUploadForm(false);
                setEditingArticle(null);
                setSelectedImage(null);
                setImagePreview(null);
              } else {
                setShowUploadForm(true);
              }
            }}
          >
            {showUploadForm ? "Back to Dashboard" : (
              <>
                <Plus size={18} /> Upload New Article
              </>
            )}
          </button>
        </div>
      </div>

      {showUploadForm ? (
        <section className={styles.uploadSection}>
          <div className={styles.uploadCard}>
            <h2>{editingArticle ? "Edit Article" : "Create New Article"}</h2>
            <form className={styles.articleForm} onSubmit={handlePublish}>
              <div className={styles.formGrid}>
                <div className={styles.formCol}>
                  <div className={styles.inputGroup}>
                    <label>Article Title</label>
                    <input type="text" name="title" placeholder="Enter a compelling headline..." defaultValue={editingArticle?.title} required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Category</label>
                    <select name="category" defaultValue={editingArticle?.category}>
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
                  <div className={styles.inputGroup}>
                    <label>Excerpt / Summary</label>
                    <textarea name="excerpt" rows="3" placeholder="Brief summary for homepages..." defaultValue={editingArticle?.excerpt}></textarea>
                  </div>
                </div>
                
                <div className={styles.formCol}>
                  <div className={styles.imageUpload}>
                    <label>Featured Image</label>
                    <div 
                      className={`${styles.dropZone} ${imagePreview ? styles.hasImage : ''}`}
                      onClick={() => document.getElementById('fileInput').click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) processFile(file);
                      }}
                    >
                      <input 
                        type="file" 
                        id="fileInput" 
                        hidden 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {imagePreview ? (
                        <div className={styles.imagePreviewContainer}>
                          <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                          <button type="button" className={styles.removeImage} onClick={removeImage}>
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <ImageIcon size={48} strokeWidth={1} />
                          <p>Click to upload or drag & drop</p>
                          <span>SVG, PNG, JPG or GIF (max. 800x400px)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Article Content</label>
                <div className={styles.editorPlaceholder}>
                  <div className={styles.editorToolbar}>
                    <span>B</span> <span>I</span> <span>U</span> <span>Link</span> <span>H1</span> <span>H2</span> <span>Quote</span>
                  </div>
                  <textarea name="content" rows="15" placeholder="Start writing your story..." defaultValue={editingArticle?.content}></textarea>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.secondaryBtn}>Save Draft</button>
                <button type="submit" className={styles.primaryBtn} disabled={isSaving}>
                  {isSaving ? "Saving..." : (
                    <>
                      <Send size={18} /> {editingArticle ? "Save Changes" : "Publish Article"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      ) : (
        <>




          <section className={styles.contentGrid}>
            <div className={styles.tableCard}>
              <div className={styles.cardHeader}>
                <h2>Recent Articles</h2>
                <button className={styles.textBtn}>View all</button>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.articleTable}>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Author</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.editorsPicks || []).length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                          No articles yet. Click "Upload New Article" to get started.
                        </td>
                      </tr>
                    )}
                    {(data?.editorsPicks || []).map((article) => (
                      <tr key={article.id}>
                        <td className={styles.titleCell}>{article.title}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles.published}`}>
                            {article.status || "Published"}
                          </span>
                        </td>
                        <td>{article.date || article.time || '—'}</td>
                        <td>{article.author || '—'}</td>
                        <td>
                          <div className={styles.actionGroup}>
                            <Link href={`/article/${article.id}`} target="_blank" className={styles.iconBtn}>
                              <Eye size={16} />
                            </Link>
                            <button className={styles.iconBtn} onClick={() => handleEdit(article)}>
                              <FileEdit size={16} />
                            </button>
                            <button className={styles.iconBtn} onClick={() => handleDelete(article.id)} style={{ color: '#f43f5e' }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.sidebarCard}>
              <h2>Top Categories</h2>
              <div className={styles.categoryList}>
                <div className={styles.categoryItem}>
                  <span>Tech</span>
                  <div className={styles.progressBar}><div style={{ width: '85%' }}></div></div>
                </div>
                <div className={styles.categoryItem}>
                  <span>Politics</span>
                  <div className={styles.progressBar}><div style={{ width: '65%' }}></div></div>
                </div>
                <div className={styles.categoryItem}>
                  <span>Business</span>
                  <div className={styles.progressBar}><div style={{ width: '45%' }}></div></div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
