import Link from "next/link";

export default function AdminTrapPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      color: '#0f172a',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, margin: '0 0 10px 0', color: '#9b2226' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0 0 16px 0' }}>Page Not Found</h2>
      <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 0 24px 0', lineHeight: 1.6 }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" style={{
        backgroundColor: '#0f172a',
        color: '#ffffff',
        padding: '10px 20px',
        borderRadius: '6px',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '0.9rem'
      }}>
        Return to Homepage
      </Link>
    </div>
  );
}
