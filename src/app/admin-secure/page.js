"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Lock, ArrowLeft, Shield } from "lucide-react";
import styles from "./login.module.css";
import Logo from "@/components/Logo";
import { loginUser } from "@/data/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, action: 'login' })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Also set client cookie fallback with SameSite Strict
        document.cookie = "auth=admin; path=/; max-age=28800; SameSite=Strict";
        window.location.replace("/dashboard");
      } else {
        setError(data.message || "Invalid editorial credentials.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Secure authentication network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Link href="/" className={styles.backHome}>
        <ArrowLeft size={18} /> Back to Readers 24
      </Link>
      
      <div className={styles.loginCard}>
        <div className={styles.cardHeader}>
          <div className={styles.logoWrapper}>
            <Logo siteName="Readers 24" size="lg" variant="dark" />
          </div>
          <p className={styles.tagline}>Access your editorial workstation</p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputField}>
            <label>Editorial Email</label>
            <div className={styles.inputContainer}>
              <Mail size={18} />
              <input 
                type="email" 
                placeholder="name@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.inputField}>
            <div className={styles.labelRow}>
              <label>Password</label>
            </div>
            <div className={styles.inputContainer}>
              <Lock size={18} />
              <input 
                type="password" 
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? "Authenticating Securely..." : "Enter Workspace"}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className={styles.cardFooter}>
          <p>Protected Editorial Management Area. Authorized personnel only.</p>
        </div>
      </div>
      
      <div className={styles.bottomLegal}>
        <span>&copy; 2026 Readers 24</span>
        <Link href="/info/privacy">Privacy Policy</Link>
        <Link href="/info/terms">Terms of Service</Link>
      </div>
    </div>
  );
}
