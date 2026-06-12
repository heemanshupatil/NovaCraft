import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Stats from '@/components/Stats';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import SystemConsole from '@/components/SystemConsole';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <SystemConsole />
      <Portfolio />
      <Testimonials />

      {/* CTA Banner */}
      <section className="section-sm" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, var(--bg-2), var(--bg-3))',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }} />
        <div className="container-narrow" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 18px', borderRadius: '9999px',
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
            color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em',
            marginBottom: '24px',
          }}>
            <Sparkles size={13} /> Ready to grow?
          </div>
          <h2 className="display-lg" style={{ marginBottom: '20px', color: 'var(--text)' }}>
            Let&apos;s Build Something <span className="gradient-text">Amazing Together</span>
          </h2>
          <p className="body-lg" style={{ color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '520px', margin: '0 auto 40px' }}>
            Tell us about your project and we&apos;ll get back to you within 24 hours with a custom strategy.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary">
              Start Your Project <ArrowRight size={18} />
            </Link>
            <Link href="/about" className="btn btn-outline">
              Meet the Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
