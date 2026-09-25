import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

export const viewport = {
  themeColor: '#9b2226',
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL('https://www.readers24.com'),
  manifest: '/manifest.json',
  title: {
    template: '%s | Readers 24',
    default: 'Readers 24 | Premium News Platform',
  },
  description: "Intelligent, credible, and 24/7 modern journalism by Readers 24. Get the latest breaking news, deep analysis, and global perspectives.",
  keywords: [
    "breaking news",
    "world news live",
    "latest global news",
    "international news 2026",
    "world politics today",
    "global economy news",
    "financial markets analysis",
    "stock market updates",
    "technology news AI",
    "science space breakthroughs",
    "health medical updates",
    "sports news live scores",
    "investigative journalism",
    "geopolitical analysis",
    "opinion and editorials",
    "readers 24",
    "readers24 news",
    "verified journalism 24/7"
  ],
  authors: [{ name: "Readers 24 Editorial Team" }],
  creator: "Readers 24",
  publisher: "Readers 24 Media",
  category: "news",
  classification: "News & Media Publications",
  alternates: {
    canonical: "https://www.readers24.com",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Readers 24 | Premium News Platform',
    description: 'Intelligent, credible, and modern journalism. Get the latest breaking news and deep analysis.',
    url: 'https://www.readers24.com',
    siteName: 'Readers 24',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Readers 24 Premium Journalism',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@readers24',
    creator: '@readers24',
    title: 'Readers 24 | Premium Global Journalism',
    description: 'Intelligent, credible, and modern journalism. Get the latest breaking news and deep analysis.',
    images: ['https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&h=630&q=80'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'tTM4lfbgSFbsEoQG9s02QyRzNcu-UMUIk9_F0dT8Pjg',
  },
  other: {
    'google-adsense-account': 'ca-pub-4774792049101813',
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=3', sizes: '48x48' },
      { url: '/readers24-icon.png?v=3', sizes: '512x512', type: 'image/png' },
      { url: '/icon.png?v=3', sizes: '512x512', type: 'image/png' },
      { url: '/icon.svg?v=3', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico?v=3',
    apple: [
      { url: '/apple-icon.png?v=3', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.readers24.com/#website",
        "url": "https://www.readers24.com",
        "name": "Readers 24",
        "description": "Intelligent, credible, and 24/7 modern journalism and analytical reporting.",
        "publisher": {
          "@id": "https://www.readers24.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.readers24.com/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "NewsMediaOrganization",
        "@id": "https://www.readers24.com/#organization",
        "name": "Readers 24",
        "url": "https://www.readers24.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.readers24.com/readers24-icon.png",
          "width": 512,
          "height": 512
        },
        "publishingPrinciples": "https://www.readers24.com/info/journalism-ethics",
        "correctionsPolicy": "https://www.readers24.com/info/journalism-ethics",
        "ethicsPolicy": "https://www.readers24.com/info/journalism-ethics",
        "diversityPolicy": "https://www.readers24.com/info/about",
        "sameAs": [
          "https://twitter.com/readers24",
          "https://facebook.com/readers24"
        ]
      }
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" type="image/png" sizes="512x512" href="/readers24-icon.png?v=3" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=3" />
        <link rel="shortcut icon" href="/favicon.ico?v=3" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png?v=3" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#9b2226" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
        {/* Google Analytics 4 (GA4) - Loaded afterInteractive to free main thread */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NJQLKRHJ9J"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NJQLKRHJ9J', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        {/* Google AdSense - Loaded on idle to prevent mobile Total Blocking Time */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4774792049101813"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans">
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
