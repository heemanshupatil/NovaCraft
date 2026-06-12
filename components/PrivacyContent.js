'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Lock,
  Eye,
  FileText,
  Globe,
  Mail,
  Search,
  Printer,
  Copy,
  Check,
  Info,
  Server,
  HeartHandshake
} from 'lucide-react';
import styles from './PrivacyContent.module.css';

const sectionsData = [
  {
    id: 'overview',
    icon: FileText,
    title: '1. Overview & Agreement',
    detailedText: [
      'NovaCraft Digital ("we", "our", or "us") is committed to protecting your personal data and ensuring compliance with modern privacy protocols. This Privacy Policy details how we collect, store, verify, and safeguard the information you provide when using our agency website, client portal, manual billing gateways, and online chatbot tools.',
      'By registering an account, submitting contact forms, or uploading transaction records to our platform, you acknowledge and agree to the policies outlined herein. We regularly audit our security practices to exceed regulatory guidelines.'
    ],
    summaryBulletPoints: [
      'We value your privacy and comply with global standards (GDPR, CCPA).',
      'This policy explains what data we collect and how we keep it safe.',
      'By using NovaCraft Digital, you agree to these transparent terms.'
    ]
  },
  {
    id: 'collect',
    icon: Eye,
    title: '2. Information We Collect',
    detailedText: [
      'We limit data collection to the minimum required to fulfill agency coordination and security auditing. This includes:',
      'Identity Credentials: Email addresses, passwords (hashed), and full names provided during sign-up. These sessions are securely processed client-side via Supabase Authentication.',
      'Manual Transaction Logs: When purchasing service plans, you provide a mobile phone number, a 12-digit transaction UTR ID, and upload a screenshot receipt image showing payment.',
      'Communication Records: Names, emails, selected project services, and descriptions sent via our contact form or registered chatbot support tickets.',
      'Technical Cookies: Client-side local storage records used to persist your visual theme choice (light or dark mode) and tracking tickets on our local chatbot desk.'
    ],
    summaryBulletPoints: [
      'Identity: Basic login info (name, email) encrypted using Supabase.',
      'Payments: Phone number and payment reference (UTR ID) for UPI transactions.',
      'Inquiries: Info provided via contact forms or chatbot.',
      'Theme & Chat: Cookies and localStorage to save theme preferences.'
    ]
  },
  {
    id: 'use-data',
    icon: Globe,
    title: '3. How We Use & Process Data',
    detailedText: [
      'Your data is processed strictly for administrative and operational purposes:',
      'To initialize and activate project milestones on your client dashboard.',
      'To manually audit and verify UPI screenshot receipts submitted for pending invoices.',
      'To dispatch welcoming notes and automatic verification emails using secure Nodemailer SMTP relays.',
      'To reply to customer support requests and coordinate developer sprints.'
    ],
    summaryBulletPoints: [
      'To deliver services, configure your workspace, and track project tasks.',
      'To verify manual UPI payments and approve transactions.',
      'To send emails, updates, and verify auth accounts.',
      'To provide support via chatbot and address queries.'
    ]
  },
  {
    id: 'security',
    icon: Lock,
    title: '4. Data Security & Storage',
    detailedText: [
      'We enforce high security standards to protect client databases:',
      'Supabase Cloud Infrastructure: All files, profile indices, payment records, and support logs are securely hosted in Supabase PostgreSQL databases and encrypted storage buckets.',
      'Row Level Security (RLS): SQL constraints prevent users from query-accessing any payment logs, receipts, or contact entries that do not belong to their specific authenticated user ID.',
      'Third-Party Sharing: We do not share, sell, or rent your files, payment history, or correspondence to marketing agencies or ad trackers. Your data remains your own.'
    ],
    summaryBulletPoints: [
      'Secure Hosting: Backed by Supabase enterprise-level cloud hosting.',
      'Row-Level Security: Only you can access your own files and payment logs.',
      'No Tracking: We never share or sell your details to third-party ad networks.'
    ]
  },
  {
    id: 'rights',
    icon: Shield,
    title: '5. Your Rights & Control',
    detailedText: [
      'You retain full ownership of your data. At any time, you can:',
      'Log into your Client Dashboard to inspect, view, or review your current payments and support records.',
      'Request the complete deletion of your account profiles, project records, and contact histories from our databases by emailing hello@novacraft.digital. We process data removals within 48 hours.'
    ],
    summaryBulletPoints: [
      'Data Access: Easily view your transactions and account status in your dashboard.',
      'Deletion Right: Request a complete erase of your data at any time by emailing us.',
      'Portability: Export your logs or receipts directly from our support.'
    ]
  },
  {
    id: 'contact',
    icon: Mail,
    title: '6. Contact our Privacy Office',
    detailedText: [
      'If you have any questions, compliance concerns, or audit requests regarding our data storage practices, please reach out to our team at hello@novacraft.digital.',
      'Our dedicated Data Protection Officer handles all requests in compliance with national and international regulatory standards.'
    ],
    summaryBulletPoints: [
      'Need help? Email hello@novacraft.digital for compliance or data requests.',
      'Data Officer: Direct replies within 24 business hours.'
    ]
  }
];

export default function PrivacyContent() {
  const [viewMode, setViewMode] = useState('detailed'); // 'detailed' | 'summary'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const sectionRefs = useRef({});

  // Scroll spy & reading progress
  useEffect(() => {
    const handleScroll = () => {
      // 1. Reading progress bar
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const scrolled = (window.scrollY / totalScroll) * 100;
        setScrollProgress(scrolled);
      }

      // 2. Active section highlights (scroll spy)
      let currentSection = 'overview';
      for (const section of sectionsData) {
        const ref = sectionRefs.current[section.id];
        if (ref) {
          const rect = ref.getBoundingClientRect();
          // If the element is near or above the middle of viewport
          if (rect.top <= window.innerHeight * 0.4) {
            currentSection = section.id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set up Intersection Observer for scrolling click jumps
  const scrollToSection = (id) => {
    const element = sectionRefs.current[id];
    if (element) {
      const offset = 90; // account for fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  // Utility to print page
  const handlePrint = () => {
    window.print();
  };

  // Utility to copy page link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if a section contains search match
  const checkMatch = (section) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const matchesTitle = section.title.toLowerCase().includes(query);
    const matchesDetails = section.detailedText.some(p => p.toLowerCase().includes(query));
    const matchesSummary = section.summaryBulletPoints.some(b => b.toLowerCase().includes(query));
    return matchesTitle || matchesDetails || matchesSummary;
  };

  const filteredSections = sectionsData.filter(checkMatch);

  // Helper to highlight matching text
  const highlightText = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className={styles.highlight}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <>
      {/* Top Reading Progress */}
      <div className={styles.progressContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className={styles.pageLayout}>
        {/* Left Sidebar */}
        <aside className={styles.sidebar}>
          {/* Search box */}
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={16} />
            <input
              type="text"
              placeholder="Search policy..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Quick Outline list */}
          <ul className={styles.sidebarNav}>
            {sectionsData.map((sec) => {
              const Icon = sec.icon;
              const hasMatch = checkMatch(sec);
              if (!hasMatch && searchQuery) return null;

              return (
                <li key={sec.id}>
                  <button
                    onClick={() => scrollToSection(sec.id)}
                    className={`${styles.navLink} ${
                      activeSection === sec.id ? styles.navActive : ''
                    }`}
                  >
                    <Icon size={16} />
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {sec.title.split('. ')[1]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Compliance Panel */}
          <div className={styles.compliancePanel}>
            <div className={styles.complianceTitle}>Security &amp; Certs</div>
            <div className={styles.badgeGrid}>
              <div className={styles.badge}>
                <Shield size={16} className={styles.badgeIcon} />
                <span className={styles.badgeLabel}>GDPR</span>
                <span className={styles.badgeSub}>Ready</span>
              </div>
              <div className={styles.badge}>
                <Lock size={16} className={styles.badgeIcon} />
                <span className={styles.badgeLabel}>CCPA</span>
                <span className={styles.badgeSub}>Compliant</span>
              </div>
              <div className={styles.badge}>
                <Server size={16} className={styles.badgeIcon} />
                <span className={styles.badgeLabel}>SSL</span>
                <span className={styles.badgeSub}>Encrypted</span>
              </div>
              <div className={styles.badge}>
                <HeartHandshake size={16} className={styles.badgeIcon} />
                <span className={styles.badgeLabel}>ISO 27001</span>
                <span className={styles.badgeSub}>Aligned</span>
              </div>
            </div>

            {/* DPO Card */}
            <div className={styles.dpoCard}>
              <div className={styles.dpoTitle}>Privacy Office</div>
              <p style={{ color: 'var(--text-muted)' }}>
                Questions or data deletion requests? Write directly to our DPO:
              </p>
              <a
                href="mailto:hello@novacraft.digital"
                style={{
                  color: 'var(--primary)',
                  fontWeight: 600,
                  marginTop: '8px',
                  display: 'inline-block'
                }}
              >
                hello@novacraft.digital
              </a>
            </div>
          </div>
        </aside>

        {/* Right Content Pane */}
        <div className={styles.contentPane}>
          {/* Header Action Bar */}
          <div className={styles.headerBar}>
            {/* View Mode Switch */}
            <div className={styles.toggleWrapper}>
              <button
                className={`${styles.toggleBtn} ${
                  viewMode === 'detailed' ? styles.toggleBtnActive : ''
                }`}
                onClick={() => setViewMode('detailed')}
              >
                Detailed View
              </button>
              <button
                className={`${styles.toggleBtn} ${
                  viewMode === 'summary' ? styles.toggleBtnActive : ''
                }`}
                onClick={() => setViewMode('summary')}
              >
                Quick Summary (TL;DR)
              </button>
            </div>

            {/* Print and Share buttons */}
            <div className={styles.actionBar}>
              <button
                onClick={handleCopyLink}
                className={styles.actionBtn}
                title="Copy link to clipboard"
              >
                {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
              <button
                onClick={handlePrint}
                className={styles.actionBtn}
                title="Print Policy Document"
              >
                <Printer size={14} />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Policy Document Body Card */}
          <div className={styles.documentCard}>
            {filteredSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <section
                  key={sec.id}
                  id={sec.id}
                  ref={(el) => (sectionRefs.current[sec.id] = el)}
                  className={styles.section}
                >
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionNumber}>
                      {sec.title.split('. ')[0]}
                    </span>
                    <Icon size={18} color="var(--primary)" />
                    <h2 className={styles.sectionTitle}>
                      {highlightText(sec.title.split('. ')[1])}
                    </h2>
                  </div>

                  {viewMode === 'detailed' ? (
                    <div className={styles.detailedText}>
                      {sec.detailedText.map((para, i) => (
                        <p key={i}>{highlightText(para)}</p>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.summaryContainer}>
                      <div className={styles.summaryTitle}>
                        <Info size={14} /> Key Takeaways
                      </div>
                      <ul className={styles.summaryList}>
                        {sec.summaryBulletPoints.map((bullet, i) => (
                          <li key={i} className={styles.summaryItem}>
                            <Check size={14} className={styles.summaryCheck} />
                            <span>{highlightText(bullet)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              );
            })}

            {filteredSections.length === 0 && (
              <div className={styles.noResults}>
                No policy sections match your search: &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
