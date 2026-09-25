"use client";
import { useState, useEffect } from "react";
import { Play, Mic, Video, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import styles from "../dashboard.module.css";

export default function MultimediaPage() {
  const [data, setData] = useState(null);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => {
        setData(json);
        const mapped = (json.multimediaArticles || []).map(a => ({
          id: a.id,
          name: a.title,
          type: a.category === "Video" ? "Video" : (a.category === "Audio" ? "Audio" : "Image"),
          duration: a.duration || "N/A",
          size: "45MB",
          date: a.time || "Just now"
        }));
        setAssets(mapped);
      })
      .catch(err => console.error("Error loading multimedia data:", err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;

    const previousAssets = assets;
    const previousData = data;

    const updatedAssets = assets.filter(a => a.id !== id);
    setAssets(updatedAssets);

    // BUG FIX: Null safety on multimediaArticles
    const updatedData = {
      ...data,
      multimediaArticles: (data.multimediaArticles || []).filter(a => a.id !== id)
    };

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (!res.ok) throw new Error("Server error");
      setData(updatedData);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete asset. Please try again.");
      // Rollback on failure
      setAssets(previousAssets);
      setData(previousData);
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case "Video": return <Video size={18} />;
      case "Audio": return <Mic size={18} />;
      case "Image": return <ImageIcon size={18} />;
      default: return <Play size={18} />;
    }
  };

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Multimedia Library</h1>
          <p>Manage your video, audio, and high-resolution image assets.</p>
        </div>
        <button className={styles.primaryBtn}><Plus size={18} /> Upload Media</button>
      </div>



      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.articleTable}>
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Type</th>
                <th>Duration / Qty</th>
                <th>File Size</th>
                <th>Uploaded</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {assets.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    No multimedia assets found. Click "Upload Media" to add content.
                  </td>
                </tr>
              )}
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td className={styles.titleCell}>{asset.name}</td>
                  <td>
                    <div className={styles.typeTag}>
                      {getTypeIcon(asset.type)} {asset.type}
                    </div>
                  </td>
                  <td>{asset.duration}</td>
                  <td>{asset.size}</td>
                  <td>{asset.date}</td>
                  <td>
                    <div className={styles.actionGroup}>
                      <button className={styles.secondaryBtn}>Manage</button>
                      <button className={styles.iconBtn} onClick={() => handleDelete(asset.id)} style={{ color: '#f43f5e' }}>
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
    </div>
  );
}
