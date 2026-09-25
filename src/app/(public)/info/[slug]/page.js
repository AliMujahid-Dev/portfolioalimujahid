import Link from "next/link";
import { ArrowLeft, Building2, Users, ShieldCheck, ScrollText, Cookie, Accessibility, Map, ExternalLink, CheckCircle, Mail } from "lucide-react";
import styles from "./info.module.css";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const titles = {
    'about': 'Our Company | Readers 24',
    'careers': 'Careers | Readers 24',
    'journalism-ethics': 'Journalism Ethics & Standards | Readers 24',
    'site-map': 'Site Map | Readers 24',
    'terms': 'Terms of Service | Readers 24',
    'privacy': 'Privacy Policy | Readers 24',
    'cookies': 'Cookie Policy & Settings | Readers 24',
    'accessibility': 'Accessibility Statement | Readers 24'
  };
  return { 
    title: titles[slug] || 'Information | Readers 24',
    description: `Official documentation and policies for Readers 24 (www.readers24.com).`
  };
}

export default async function InfoPage({ params }) {
  const { slug } = await params;

  const contentMap = {
    'about': {
      title: "Our Company",
      icon: <Building2 size={40} />,
      content: (
        <>
          <p>
            Founded in 2024, <strong>Readers 24</strong> (<a href="https://www.readers24.com" target="_blank" rel="noopener noreferrer">www.readers24.com</a>) is a next-generation global news organization dedicated to delivering 24/7 intelligent, credible, and modern journalism for a rapidly evolving world.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our core mission is to empower global citizens with verified facts, deep analytical insight, and balanced perspectives. In an era saturated with noise and unverified information, Readers 24 serves as a trusted 24-hour beacon of editorial clarity.
          </p>

          <h2>The Four Pillars of Readers 24</h2>
          <ul>
            <li>
              <strong>1. Uncompromising Accuracy:</strong> Every story published across our platform undergoes multi-layered editorial verification before reaching our readers.
            </li>
            <li>
              <strong>2. 24/7 Global Intelligence:</strong> Operating round-the-clock news desks across international time zones to provide real-time updates as events unfold.
            </li>
            <li>
              <strong>3. Independent Journalism:</strong> Our newsroom is completely free from commercial, political, or special-interest influence.
            </li>
            <li>
              <strong>4. Digital & Multimedia Innovation:</strong> Harnessing live streaming, audio podcasts, and modern data visualization to make complex global events intuitive and accessible.
            </li>
          </ul>

          <h2>Global Bureau Network</h2>
          <p>
            With correspondents and international bureaux in major global centers—including New York, London, Tokyo, Berlin, Paris, Dubai, and Singapore—Readers 24 delivers on-the-ground reporting that captures local nuances while contextualizing their global impact.
          </p>

          <h2>Leadership & Editorial Board</h2>
          <p>
            Our newsroom is led by seasoned editors and investigative journalists with decades of experience at top international publications. Supported by a talented team of software engineers and data scientists, Readers 24 bridges traditional journalistic values with contemporary digital delivery.
          </p>

          <h2>Contact Our Corporate Desk</h2>
          <p>
            For corporate inquiries, partnership proposals, or press relations, please contact our team at{" "}
            <Link href="mailto:contact@readers24.com">contact@readers24.com</Link>.
          </p>
        </>
      )
    },
    'careers': {
      title: "Careers",
      icon: <Users size={40} />,
      content: (
        <>
          <p>
            Join a world-class team of journalists, software engineers, designers, and media producers dedicated to shaping the future of 24/7 global journalism at <strong>Readers 24</strong>.
          </p>

          <h2>Why Work at Readers 24?</h2>
          <p>
            At Readers 24, we cultivate a high-energy, collaborative, and inclusive environment where critical thinking and editorial courage are championed. We believe our strength lies in diverse perspectives and continuous technical innovation.
          </p>

          <h2>Employee Benefits & Culture</h2>
          <ul>
            <li><strong>Global Flexibility:</strong> Hybrid and fully remote work models across international time zones.</li>
            <li><strong>Competitive Package:</strong> Top-tier salary, health coverage, pension plans, and wellness allowances.</li>
            <li><strong>Modern Tooling:</strong> Cutting-edge newsroom software built on Next.js, Turbopack, and real-time analytics.</li>
            <li><strong>Growth & Education:</strong> Annual learning stipends for conferences, investigative courses, and advanced certifications.</li>
          </ul>

          <h2>Current Open Positions</h2>
          <ul>
            <li>
              <strong>Senior Global News Editor</strong> — London / Hybrid
              <br />
              <span style={{ fontSize: '0.95rem', opacity: 0.8 }}>Leading our 24-hour international desk and breaking news curation.</span>
            </li>
            <li>
              <strong>Lead Full-Stack Engineer (Next.js / React)</strong> — New York / Remote
              <br />
              <span style={{ fontSize: '0.95rem', opacity: 0.8 }}>Architecting high-performance web experiences and live stream integrations.</span>
            </li>
            <li>
              <strong>Investigative Data Journalist</strong> — Berlin / Hybrid
              <br />
              <span style={{ fontSize: '0.95rem', opacity: 0.8 }}>Uncovering stories through deep data analysis, public record requests, and interactive charts.</span>
            </li>
            <li>
              <strong>Multimedia Live Producer</strong> — Tokyo / Hybrid
              <br />
              <span style={{ fontSize: '0.95rem', opacity: 0.8 }}>Managing 24/7 video broadcasts and daily news podcasts.</span>
            </li>
          </ul>

          <h2>Spontaneous Applications</h2>
          <p>
            Don't see a role matching your exact skillset? We are always looking for exceptional editorial and engineering talent. Send your CV and portfolio to{" "}
            <Link href="mailto:careers@readers24.com">careers@readers24.com</Link>.
          </p>
        </>
      )
    },
    'journalism-ethics': {
      title: "Journalism Ethics & Standards",
      icon: <ShieldCheck size={40} />,
      content: (
        <>
          <p>
            At <strong>Readers 24</strong>, our credibility is our most vital asset. We hold our newsroom to strict ethical guidelines designed to ensure accuracy, fairness, transparency, and independence.
          </p>

          <h2>1. Accuracy & Fact-Verification</h2>
          <p>
            We strive to report the facts accurately and impartially. Every claim, statistic, and quote published by Readers 24 is subjected to multi-source verification. We require at least two independent primary sources before publishing unconfirmed breaking news.
          </p>

          <h2>2. Transparent Corrections Policy</h2>
          <p>
            When errors occur, we correct them immediately and transparently. Substantive corrections are accompanied by an explicit editor's note explaining what was changed and why, ensuring accountability to our readers.
          </p>

          <h2>3. Editorial Independence</h2>
          <p>
            Readers 24 operates with complete independence from political parties, government entities, and corporate sponsors. Our journalists do not accept gifts, sponsored trips, or financial incentives that could compromise objective reporting.
          </p>

          <h2>4. Anonymous Sources Guidelines</h2>
          <p>
            We prioritize on-the-record reporting. Anonymity is granted only when the source faces personal or professional danger, the information is vital to public interest, and cannot be obtained through alternative means.
          </p>

          <h2>5. Responsible Use of Technology & AI</h2>
          <p>
            Artificial intelligence tools may be utilized within our workflow solely for background research, document indexing, or copy editing assistance. <strong>All published content, reporting, writing, and final editorial decisions are strictly executed and verified by human journalists.</strong>
          </p>

          <h2>6. Reader Feedback & Ombudsman</h2>
          <p>
            We value feedback from our global community. If you have concerns regarding article fairness or factual accuracy, please contact our Editorial Standards Desk at{" "}
            <Link href="mailto:contact@readers24.com">contact@readers24.com</Link>.
          </p>
        </>
      )
    },
    'terms': {
      title: "Terms of Service",
      icon: <ScrollText size={40} />,
      content: (
        <>
          <p><em>Effective Date: April 22, 2026 | Last Updated: September 2026</em></p>
          <p>
            Welcome to <strong>Readers 24</strong> (<a href="https://www.readers24.com" target="_blank" rel="noopener noreferrer">www.readers24.com</a>). By accessing or using our website, mobile applications, or subscription services, you agree to be bound by these Terms of Service.
          </p>

          <h2>1. Acceptance & Use of Content</h2>
          <p>
            All content published on Readers 24—including articles, images, graphics, logos, video streams, audio podcasts, and underlying code—is protected by international copyright and intellectual property laws. You may view and print content for personal, non-commercial use only.
          </p>

          <h2>2. Prohibited Conduct</h2>
          <p>Users agree not to:</p>
          <ul>
            <li>Reproduce, redistribute, or scrape Readers 24 content for commercial purposes without prior written authorization.</li>
            <li>Post unlawful, defamatory, abusive, or hateful content in article comment sections or community forums.</li>
            <li>Attempt to breach the security or disrupt the infrastructure of Readers 24.</li>
          </ul>

          <h2>3. Subscription Terms & Billing</h2>
          <p>
            Paid subscriptions provide access to premium articles and ad-free digital editions. Subscriptions renew automatically based on your selected plan (monthly/annually). You may cancel your subscription at any time through your account settings prior to the next billing cycle.
          </p>

          <h2>4. User Comments & Moderation</h2>
          <p>
            Readers 24 reserves the right to moderate, edit, or remove reader comments that violate our community standards. You retain ownership of your submitted comments, but grant Readers 24 a perpetual, royalty-free license to display them.
          </p>

          <h2>5. Disclaimer of Warranties & Liability</h2>
          <p>
            Services are provided "as is" without warranties of any kind. Readers 24 Media Group is not liable for indirect, incidental, or consequential damages resulting from site access or reliance on published news items.
          </p>

          <h2>6. Governing Law</h2>
          <p>
            These terms are governed by international digital commerce laws. For legal inquiries, please contact <Link href="mailto:contact@readers24.com">contact@readers24.com</Link>.
          </p>
        </>
      )
    },
    'privacy': {
      title: "Privacy Policy",
      icon: <ShieldCheck size={40} />,
      content: (
        <>
          <p><em>Effective Date: April 22, 2026 | Compliant with GDPR & CCPA</em></p>
          <p>
            At <strong>Readers 24</strong>, protecting your personal privacy is fundamental to maintaining your trust. This Privacy Policy details how we collect, process, and safeguard your data when you visit <a href="https://www.readers24.com" target="_blank" rel="noopener noreferrer">www.readers24.com</a>.
          </p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li><strong>Direct Information:</strong> Email address when subscribing to newsletters or creating an editorial account.</li>
            <li><strong>Automated Telemetry:</strong> Anonymized session IDs, device browser type, IP address, and pages visited for performance monitoring.</li>
            <li><strong>Cookies & Local Storage:</strong> Preferences such as dark mode settings and cookie consent selections.</li>
          </ul>

          <h2>2. How We Use Your Data</h2>
          <p>
            We process your information exclusively to provide our news services, send requested daily briefings, process subscription payments, and optimize site speed and security. <strong>We do not sell, rent, or trade personal data to third-party ad brokers.</strong>
          </p>

          <h2>3. Third-Party Service Providers</h2>
          <p>
            We partner with essential infrastructure providers (such as secure cloud hosting and payment processors) who process data strictly under our security instructions and confidentiality agreements.
          </p>

          <h2>4. Data Retention & Security</h2>
          <p>
            We employ industry-standard TLS encryption, firewalls, and restricted data access protocols to protect your personal information against unauthorized disclosure or loss.
          </p>

          <h2>5. Your Privacy Rights (GDPR / CCPA)</h2>
          <p>Depending on your jurisdiction, you have the right to:</p>
          <ul>
            <li>Request a copy of the personal data we hold about you.</li>
            <li>Request correction or complete deletion ("Right to be Forgotten") of your personal data.</li>
            <li>Opt out of marketing communications at any time via the "Unsubscribe" link in any email.</li>
          </ul>

          <h2>6. Advertising Partners & Google AdSense Compliance</h2>
          <p>
            We partner with third-party advertising networks, including <strong>Google AdSense</strong>, to serve advertisements when you visit our website.
          </p>
          <ul>
            <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites on the Internet.</li>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> or through <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</li>
          </ul>

          <h2>7. Contact Our Data Protection Officer</h2>
          <p>
            For privacy inquiries or to exercise your rights, email our DPO at <Link href="mailto:contact@readers24.com">contact@readers24.com</Link>.
          </p>
        </>
      )
    },
    'cookies': {
      title: "Cookie Policy & Cookie Settings",
      icon: <Cookie size={40} />,
      content: (
        <>
          <p>
            This policy explains how <strong>Readers 24</strong> uses cookies and similar technologies to recognize you when you visit <a href="https://www.readers24.com" target="_blank" rel="noopener noreferrer">www.readers24.com</a>.
          </p>

          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files placed on your computer or mobile device when you visit a website. They are widely used by digital publishers to make websites work efficiently, remember user preferences, and provide analytics data.
          </p>

          <h2>Categories of Cookies We Use</h2>
          <ul>
            <li>
              <strong>1. Essential / Strictly Necessary Cookies:</strong>
              <br />
              Required for basic website functionality, user authentication, and secure checkout. These cannot be disabled.
            </li>
            <li>
              <strong>2. Analytics & Performance Cookies:</strong>
              <br />
              Help us measure reader traffic, identify popular articles, and optimize page loading times (e.g. <code>readers24_session</code>).
            </li>
            <li>
              <strong>3. Functional Cookies:</strong>
              <br />
              Remember your customized settings, such as preferred edition, font size, or dark mode choices.
            </li>
            <li>
              <strong>4. Advertising & Commercial Cookies (Google AdSense):</strong>
              <br />
              Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits. You can opt out of personalized ads at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> or <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.
            </li>
          </ul>

          <h2>Managing Cookies in Your Browser</h2>
          <p>
            You can also configure your web browser to accept, block, or delete cookies. Follow your browser's instructions:
          </p>
          <ul>
            <li><strong>Google Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies and other site data.</li>
            <li><strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Block all cookies.</li>
            <li><strong>Mozilla Firefox:</strong> Options &gt; Privacy &amp; Security &gt; Enhanced Tracking Protection.</li>
          </ul>

          <h2>Questions About Cookies?</h2>
          <p>
            If you have questions about our cookie practices, please email <Link href="mailto:contact@readers24.com">contact@readers24.com</Link>.
          </p>
        </>
      )
    },
    'accessibility': {
      title: "Accessibility Statement",
      icon: <Accessibility size={40} />,
      content: (
        <>
          <p>
            <strong>Readers 24</strong> is committed to ensuring digital accessibility for people of all abilities. We continuously improve the user experience for everyone and apply the relevant accessibility standards.
          </p>

          <h2>Conformance Status</h2>
          <p>
            We target compliance with the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> standards. These guidelines outline how to make web content accessible to people with visual, auditory, cognitive, and motor disabilities.
          </p>

          <h2>Accessibility Features Implemented</h2>
          <ul>
            <li><strong>Semantic Structure:</strong> Using landmark HTML elements (<code>header</code>, <code>main</code>, <code>nav</code>, <code>footer</code>) for screen reader navigation.</li>
            <li><strong>Keyboard Accessibility:</strong> Full support for keyboard navigation across menus, links, and forms.</li>
            <li><strong>Color Contrast:</strong> High-contrast text elements adhering to AA visual standards.</li>
            <li><strong>Alternative Text:</strong> Descriptive <code>alt</code> text for editorial photo illustrations and media badges.</li>
            <li><strong>Scalable Typography:</strong> Fluid text sizing that respects browser font scaling preferences.</li>
          </ul>

          <h2>Continuous Testing & Audit</h2>
          <p>
            Our digital platform is regularly audited using automated tools and manual screen-reader testing (NVDA, VoiceOver, JAWS) to identify and eliminate accessibility barriers.
          </p>

          <h2>Feedback & Assistance</h2>
          <p>
            We welcome your feedback on the accessibility of Readers 24. If you encounter any accessibility barriers, please contact our team:
          </p>
          <p>
            Email: <Link href="mailto:accessibility@readers24.com">accessibility@readers24.com</Link>
            <br />
            Response Time: Within 24 business hours.
          </p>
        </>
      )
    },
    'site-map': {
      title: "Site Map",
      icon: <Map size={40} />,
      content: (
        <>
          <p>Comprehensive navigational overview of the <strong>Readers 24</strong> digital publishing platform.</p>
          
          <div className={styles.sitemapGrid}>
            <div>
              <h3>News Sections</h3>
              <ul>
                <li><Link href="/category/world">World News</Link></li>
                <li><Link href="/category/politics">Politics</Link></li>
                <li><Link href="/category/business">Business & Finance</Link></li>
                <li><Link href="/category/tech">Technology</Link></li>
                <li><Link href="/category/science">Science & Innovation</Link></li>
                <li><Link href="/category/health">Health & Medicine</Link></li>
                <li><Link href="/category/sports">Sports</Link></li>
                <li><Link href="/category/arts">Arts & Culture</Link></li>
                <li><Link href="/category/opinion">Opinion & Editorials</Link></li>
              </ul>
            </div>

            <div>
              <h3>Broadcast & Multimedia</h3>
              <ul>
                <li><Link href="/live">Live TV 24/7 Stream</Link></li>
                <li><Link href="/podcasts">Audio Podcasts</Link></li>
              </ul>
            </div>

            <div>
              <h3>About Readers 24</h3>
              <ul>
                <li><Link href="/info/about">Our Company</Link></li>
                <li><Link href="/info/careers">Careers & Openings</Link></li>
                <li><Link href="/info/journalism-ethics">Journalism Ethics & Standards</Link></li>
                <li><Link href="mailto:contact@readers24.com">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h3>Legal & Compliance</h3>
              <ul>
                <li><Link href="/info/terms">Terms of Service</Link></li>
                <li><Link href="/info/privacy">Privacy Policy</Link></li>
                <li><Link href="/info/cookies">Cookie Policy & Settings</Link></li>
                <li><Link href="/info/accessibility">Accessibility Statement</Link></li>
              </ul>
            </div>
          </div>
        </>
      )
    }
  };

  const pageContent = contentMap[slug] || {
    title: "Information",
    icon: <ScrollText size={40} />,
    content: <p>Information about this topic is currently being updated. Please check back soon.</p>
  };

  return (
    <div className={styles.infoPage}>
      <div className="container">
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Readers 24 Home
        </Link>
        
        <div className={styles.header}>
          <div className={styles.iconWrapper}>{pageContent.icon}</div>
          <h1 className={styles.title}>{pageContent.title}</h1>
        </div>

        <div className={styles.contentCard}>
          <div className={styles.richText}>
            {pageContent.content}
          </div>
        </div>

        <div className={styles.footer}>
          <p>&copy; 2026 Readers 24. All rights reserved. 24/7 Global Journalism with Integrity.</p>
        </div>
      </div>
    </div>
  );
}
