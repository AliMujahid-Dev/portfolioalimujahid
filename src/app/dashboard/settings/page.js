"use client";
import { useState, useEffect } from "react";
import { User, Bell, Shield, Globe, Mail, Save, KeyRound, CheckCircle2, ExternalLink } from "lucide-react";
import styles from "../dashboard.module.css";

export default function SettingsPage() {
  const [data, setData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const [saveSuccess, setSaveSuccess] = useState("");

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Error loading settings data:", err));
  }, []);

  const tabs = [
    { name: "Profile", icon: User },
    { name: "API Keys & AI", icon: KeyRound },
    { name: "Notifications", icon: Bell },
    { name: "Security", icon: Shield },
    { name: "Language", icon: Globe },
    { name: "Email", icon: Mail },
  ];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess("");

    const siteName = e.target[0].value;
    const userName = e.target[1].value;
    const userRole = e.target[2].value;

    const updatedData = {
      ...data,
      settings: {
        ...data?.settings,
        siteName,
        userName,
        userRole
      }
    };

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (!res.ok) throw new Error("Server error");
      
      setData(updatedData);
      setSaveSuccess("Profile settings saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveApiKeys = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess("");

    const gnewsApiKey = e.target.gnewsKey.value.trim();
    const aiApiKey = e.target.aiKey.value.trim();

    const updatedData = {
      ...data,
      settings: {
        ...data?.settings,
        gnewsApiKey,
        aiApiKey
      }
    };

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (!res.ok) throw new Error("Server error");
      
      setData(updatedData);
      setSaveSuccess("API keys updated successfully! New keys are now active site-wide.");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to update API keys. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabIcon = (tabName) => {
    const tab = tabs.find(t => t.name === tabName);
    if (!tab) return null;
    const IconComponent = tab.icon;
    return <IconComponent size={40} />;
  };

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.pageHeader}>
        <div>
          <h1>System Settings</h1>
          <p>Configure your workspace, API connections, and editorial defaults.</p>
        </div>
      </div>

      {saveSuccess && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #10b981',
          borderRadius: '8px',
          padding: '12px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#065f46',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} /> {saveSuccess}
        </div>
      )}

      <div className={styles.settingsGrid}>
        <div className={styles.settingsSidebar}>
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button 
                key={tab.name}
                className={`${styles.settingsTab} ${activeTab === tab.name ? styles.activeTab : ""}`}
                onClick={() => {
                  setActiveTab(tab.name);
                  setSaveSuccess("");
                }}
              >
                <TabIcon size={18} /> {tab.name}
              </button>
            );
          })}
        </div>

        <div className={styles.settingsContent}>
          <div className={styles.tableCard}>
            {activeTab === "Profile" && (
              <>
                <h3>Profile Information</h3>
                <p className={styles.subtext}>Update your personal details and editorial role.</p>
                
                <form className={styles.settingsForm} onSubmit={handleSaveProfile}>
                  <div className={styles.inputGroup}>
                    <label>Site Branding Name</label>
                    <input type="text" defaultValue={data?.settings?.siteName || "Readers 24"} />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      <label>Your Full Name</label>
                      <input type="text" defaultValue={data?.settings?.userName || "James Doe"} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Editorial Role</label>
                      <input type="text" defaultValue={data?.settings?.userRole || "Senior Editor"} />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Email Address (Protected)</label>
                    <input type="email" defaultValue="Admin@bussiness.com" disabled style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: '#64748b' }} />
                    <small style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                      Primary administrator email is locked for security.
                    </small>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Biography</label>
                    <textarea rows="4" defaultValue="Senior Editor and Administrator at Readers 24 with over 15 years of experience in investigative journalism and tech reporting."></textarea>
                  </div>

                  <div className={styles.formActions}>
                    <button type="submit" className={styles.primaryBtn} disabled={isSaving}>
                      {isSaving ? "Saving..." : <><Save size={18} /> Save Changes</>}
                    </button>
                  </div>
                </form>
              </>
            )}

            {activeTab === "API Keys & AI" && (
              <>
                <h3>API Keys & Live Integrations</h3>
                <p className={styles.subtext}>
                  Manage your news search and AI content generation keys. You can update these at any time in production without restarting the server.
                </p>

                <form className={styles.settingsForm} onSubmit={handleSaveApiKeys}>
                  <div className={styles.inputGroup}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ margin: 0, fontWeight: 700 }}>GNews.io API Key (Live News Search)</label>
                      <a href="https://gnews.io" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#9b2226', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Get free GNews key <ExternalLink size={12} />
                      </a>
                    </div>
                    <input 
                      type="text" 
                      name="gnewsKey"
                      defaultValue={data?.settings?.gnewsApiKey || "91af3d04d9850ff70e7ba195d769e483"} 
                      placeholder="e.g. 91af3d04d9850ff70e7ba195d769e483"
                      required
                    />
                    <small style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                      Used to fetch real-time breaking news in the AI Hub.
                    </small>
                  </div>

                  <div className={styles.inputGroup} style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ margin: 0, fontWeight: 700 }}>AI Writer API Key (Gemini / Groq / DeepSeek)</label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Free Groq Key (Recommended) <ExternalLink size={12} />
                        </a>
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#9b2226', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Google AI Studio <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                    <input 
                      type="text" 
                      name="aiKey"
                      defaultValue={data?.settings?.aiApiKey || ""} 
                      placeholder="Paste your key here (e.g. gsk_... from Groq or AIzaSy... from Google)"
                    />
                    <small style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                      Supports <strong>Groq</strong> (Free LLaMA 3.3 70B, starts with <code>gsk_</code>), <strong>Google Gemini</strong> (starts with <code>AIzaSy</code>), or <strong>DeepSeek</strong>.
                    </small>
                  </div>

                  <div className={styles.formActions} style={{ marginTop: '28px' }}>
                    <button type="submit" className={styles.primaryBtn} disabled={isSaving}>
                      {isSaving ? "Saving..." : <><Save size={18} /> Update Live API Keys</>}
                    </button>
                  </div>
                </form>
              </>
            )}

            {activeTab === "Security" && (
              <div>
                <h3>Access & Security Hardening</h3>
                <p className={styles.subtext}>Master administrative security controls and password governance.</p>

                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderLeft: '4px solid #9b2226',
                  borderRadius: '8px',
                  padding: '20px 24px',
                  marginTop: '20px'
                }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={20} style={{ color: '#9b2226' }} /> Password Change Policy: LOCKED
                  </h4>
                  <p style={{ margin: '0 0 14px 0', color: '#475569', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    Direct password editing from web forms has been permanently disabled to prevent unauthorized account takeovers and session hijack exploits.
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#334155', fontSize: '0.88rem', lineHeight: 1.8 }}>
                    <li><strong>Brute-Force Guard:</strong> Active (5 failed attempts trigger a mandatory 15-minute system lock).</li>
                    <li><strong>Credential Storage:</strong> Protected environment secret.</li>
                    <li><strong>Bypass Links:</strong> Disabled across all public and newsroom access points.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab !== "Profile" && activeTab !== "API Keys & AI" && activeTab !== "Security" && (
              <div className={styles.aiPlaceholder}>
                <div style={{ background: '#f1f5f9', color: '#64748b', padding: '20px', borderRadius: '50%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {renderTabIcon(activeTab)}
                </div>
                <h3>{activeTab} Settings</h3>
                <p>Configure your {activeTab.toLowerCase()} preferences here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
