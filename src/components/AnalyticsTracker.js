"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const sessionIdRef = useRef(null);

  useEffect(() => {
    // Initialize session ID
    if (typeof window !== 'undefined' && !sessionIdRef.current) {
      let id = sessionStorage.getItem('readers24_session');
      if (!id) {
        id = 'sess_' + Math.random().toString(36).substring(2, 11);
        sessionStorage.setItem('readers24_session', id);
      }
      sessionIdRef.current = id;
    }

    // Only track public pages
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
      return;
    }

    const trackView = async () => {
      try {
        let pageId = null;
        if (pathname.startsWith('/article/')) {
          pageId = pathname.replace('/article/', '');
        }

        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            type: 'pageview', 
            pageId, 
            sessionId: sessionIdRef.current 
          }),
          cache: 'no-store'
        });
        // Also notify Google Analytics 4 on route change
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
          window.gtag('config', 'G-NJQLKRHJ9J', {
            page_path: pathname,
          });
        }
      } catch (err) {
        console.error("Tracking error:", err);
      }
    };

    trackView();

    // Heartbeat to keep session active (every 1 minute)
    const heartbeat = setInterval(() => {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'heartbeat', 
          sessionId: sessionIdRef.current 
        }),
        cache: 'no-store'
      });
    }, 60000);

    return () => clearInterval(heartbeat);
  }, [pathname]);

  return null;
}
