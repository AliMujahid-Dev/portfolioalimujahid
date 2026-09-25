"use client";
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import styles from './page.module.css';

export default function NotFound() {
  return (
    <div className="container">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1 style={{ fontSize: '8rem', marginBottom: '0', color: 'var(--accent-color)', opacity: 0.1, position: 'absolute', zIndex: -1 }}>404</h1>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '2rem' }}>
          We can't find the story you're looking for. It may have been moved, deleted, or the link might be broken.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--text-primary)',
            color: 'white',
            borderRadius: 'var(--radius-sm)',
            fontWeight: '600'
          }}>
            <Home size={18} /> Return Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'white',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '600'
            }}
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
