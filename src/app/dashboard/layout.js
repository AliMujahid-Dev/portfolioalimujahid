"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Play, 
  BarChart3, 
  Settings, 
  LogOut, 
  PlusCircle,
  Search,
  Bell,
  User,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import styles from "./dashboard.module.css";
import Logo from "@/components/Logo";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [profile, setProfile] = useState({ name: "James Doe", role: "Senior Editor" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // 1. Immediate client-side cookie verification
    const hasAuthCookie = typeof document !== 'undefined' && document.cookie
      .split('; ')
      .some(row => row.startsWith('auth=admin'));

    if (!hasAuthCookie) {
      window.location.replace('/admin-secure');
      return;
    }

    // 2. Server-side session verification
    fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'check' }),
      cache: 'no-store'
    })
      .then(res => res.json())
      .then(authData => {
        if (authData?.authenticated) {
          setIsAuthenticated(true);
          setIsCheckingAuth(false);
          // Load profile settings
          fetch('/api/data', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
              if (data.settings) {
                setProfile({
                  name: data.settings.userName || "James Doe",
                  role: data.settings.userRole || "Senior Editor"
                });
              }
            })
            .catch(err => console.error("Error loading profile:", err));
        } else {
          window.location.replace('/admin-secure');
        }
      })
      .catch(() => {
        window.location.replace('/admin-secure');
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      });
    } catch (e) {
      console.error("Logout error:", e);
    }
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
    window.location.replace('/admin-secure');
  };

  const navItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Articles", icon: FileText, href: "/dashboard/articles" },
    { name: "Multimedia", icon: Play, href: "/dashboard/multimedia" },
    { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    { name: "Readers 24 AI", icon: Sparkles, href: "/dashboard/ai-hub" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  if (isCheckingAuth || !isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#9b2226',
          borderRadius: '50%',
          animation: 'dashboardSpin 0.8s linear infinite',
          marginBottom: '16px'
        }} />
        <style>{`@keyframes dashboardSpin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', letterSpacing: '0.08em', fontWeight: 600 }}>
          AUTHENTICATING EDITORIAL SESSION...
        </p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && <div className={styles.sidebarOverlay} onClick={() => setIsSidebarOpen(false)}></div>}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            <Logo siteName="Readers 24" size="sm" variant="light" />
          </Link>
          <button className={styles.mobileClose} onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className={styles.sideNav}>
          <div className={styles.navLabel}>Menu</div>
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ""}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button 
            className={styles.logoutBtn}
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Top Header */}
        <header className={styles.dashboardHeader}>
          <div className={styles.headerLeft}>
            <button className={styles.mobileMenuBtn} onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <form 
              className={styles.searchBox}
              onSubmit={(e) => {
                e.preventDefault();
                const q = e.currentTarget.elements[0].value;
                window.location.href = `/dashboard/articles?q=${encodeURIComponent(q)}`;
              }}
            >
              <Search size={18} />
              <input type="text" placeholder="Search articles, tags..." />
            </form>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.actionBtn}>
              <Bell size={20} />
              <span className={styles.notificationBadge}></span>
            </button>
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{profile.name}</span>
                <span className={styles.userRole}>{profile.role}</span>
              </div>
            </div>
          </div>
        </header>


        {/* Dynamic Content */}
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
