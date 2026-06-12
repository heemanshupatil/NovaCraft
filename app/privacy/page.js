import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';
import PrivacyContent from '@/components/PrivacyContent';

export const metadata = {
  title: 'Privacy Policy — NovaCraft Digital',
  description: 'Privacy Policy and data protection guidelines for NovaCraft Digital services and client portal.',
};

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--bg-2)', minHeight: '100vh', transition: 'background-color 0.3s ease' }}>
      {/* Header Spacer */}
      <div style={{ height: '120px' }} />

      <div className="container" style={{ maxWidth: '1100px', paddingBottom: '80px' }}>
        {/* Back navigation */}
        <Link href="/" className="backHomeLink">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Hero Title */}
        <div style={{ marginBottom: '40px' }}>
          <div className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={12} /> Compliance &amp; Security
          </div>
          <h1 className="display-md" style={{ color: 'var(--text)', margin: '12px 0 8px' }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Last updated: June 7, 2026. Effective immediately.
          </p>
        </div>

        {/* Main Interactive Content */}
        <PrivacyContent />
      </div>
    </div>
  );
}

