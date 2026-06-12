'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Globe, ShoppingBag, Palette, Megaphone, BarChart2,
  Smartphone, CheckCircle, ArrowRight, CalendarDays, Video,
  Clock, Users, Zap, Gift, Phone
} from 'lucide-react';
import AppointmentModal from '@/components/AppointmentModal';

const webServices = [
  {
    icon: Globe, title: 'Business Websites',
    desc: 'We create professional, high-converting websites that make your brand shine online. Every site is fast, responsive, and built with SEO from the ground up.',
    features: ['Custom Design', 'Mobile Responsive', 'SEO Optimised', 'CMS Integration', 'Fast Load Times', 'Analytics Setup'],
    color: '#7C3AED',
  },
  {
    icon: ShoppingBag, title: 'eCommerce Stores',
    desc: 'Launch and scale your online store with a powerful, visually stunning eCommerce platform. We handle design, development, and integrations.',
    features: ['Product Pages', 'Cart & Checkout', 'Payment Gateways', 'Inventory System', 'Order Tracking', 'Mobile Shopping'],
    color: '#06B6D4',
  },
  {
    icon: Palette, title: 'Custom Web Apps',
    desc: "When off-the-shelf solutions won't cut it, we engineer bespoke applications tailored to your workflow, data, and user journey.",
    features: ['React / Next.js', 'REST & GraphQL APIs', 'Database Design', 'Authentication', 'Real-time Features', 'Cloud Hosting'],
    color: '#a855f7',
  },
  {
    icon: Smartphone, title: 'Mobile-First Design',
    desc: 'Over 70% of your visitors browse on mobile. We obsess over perfect mobile experiences — responsive layouts, touch-optimised interactions.',
    features: ['Responsive Layouts', 'Touch Gestures', 'PWA Support', 'Performance', 'App-like Feel', 'Cross-browser'],
    color: '#ec4899',
  },
];

const marketingServices = [
  {
    icon: Megaphone, title: 'Social Media Marketing',
    desc: 'Grow your brand organically across Instagram, Facebook, TikTok and more. We create content that stops the scroll and starts conversations.',
    features: ['Content Strategy', 'Post Creation', 'Community Mgmt', 'Stories & Reels', 'Influencer Outreach', 'Monthly Reports'],
    color: '#f59e0b',
  },
  {
    icon: BarChart2, title: 'Paid Advertising',
    desc: 'Targeted paid campaigns on Meta, Google, and TikTok that reach the right people at the right time — with full ROI transparency.',
    features: ['Meta Ads', 'Google Ads', 'TikTok Ads', 'A/B Testing', 'Retargeting', 'ROI Reporting'],
    color: '#22c55e',
  },
];

function ServiceCard({ icon: Icon, title, desc, features, color }) {
  return (
    <div className="card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        width: '60px', height: '60px', borderRadius: '16px',
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={28} color={color} />
      </div>
      <div>
        <h3 className="display-sm" style={{ color: 'var(--text)', marginBottom: '12px' }}>{title}</h3>
        <p className="body-md" style={{ color: 'var(--text-muted)' }}>{desc}</p>
      </div>
      <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', listStyle: 'none' }}>
        {features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <CheckCircle size={14} color={color} style={{ flexShrink: 0 }} /> {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

const HOW_IT_WORKS = [
  { icon: CalendarDays, color: '#1D4ED8', title: 'Pick a Date & Time', desc: 'Choose any weekday slot that works for you — slots available Mon–Sat, 9am to 6pm IST.' },
  { icon: Video,        color: '#7C3AED', title: 'Choose Your Platform', desc: 'We support Google Meet, Zoom, or a WhatsApp call — whatever you prefer.' },
  { icon: Users,        color: '#06B6D4', title: 'Meet the Team',       desc: 'Our expert team joins the call ready to discuss your project, budget, and timeline.' },
  { icon: Zap,          color: '#22c55e', title: 'Get a Free Proposal', desc: 'Walk away with a clear roadmap and a no-obligation custom quote within 24 hours.' },
];

export default function ServicesPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && <AppointmentModal onClose={() => setShowModal(false)} />}

      {/* Hero */}
      <section className="section" style={{ paddingTop: '140px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '30%', width: '500px', height: '500px', background: 'rgba(29,78,216,0.07)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
        <div className="container-narrow" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-tag">What We Do</div>
          <h1 className="display-lg" style={{ marginBottom: '20px', color: 'var(--text)' }}>
            Full-Service Digital <span className="gradient-text">Agency</span>
          </h1>
          <p className="body-lg" style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto 40px' }}>
            Everything you need to dominate online — web development, eCommerce, and social media marketing under one roof.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <CalendarDays size={18} /> Schedule Free Call
            </button>
            <Link href="/contact" className="btn btn-outline">
              Get a Quote <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Web Dev */}
      <section className="section" style={{ paddingTop: '40px' }}>
        <div className="container">
          <div style={{ marginBottom: '48px' }}>
            <div className="section-tag">Web Development</div>
            <h2 className="display-md">Websites &amp; Web Apps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
            {webServices.map(s => <ServiceCard key={s.title} {...s} />)}
          </div>
        </div>
      </section>

      {/* Marketing */}
      <section className="section" style={{ paddingTop: '40px' }}>
        <div className="container">
          <div style={{ marginBottom: '48px' }}>
            <div className="section-tag">Digital Marketing</div>
            <h2 className="display-md">Social Media &amp; Ads</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
            {marketingServices.map(s => <ServiceCard key={s.title} {...s} />)}
          </div>
        </div>
      </section>

      {/* ── Schedule Appointment Section ────────────────────────────────────── */}
      <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #EFF6FF, #F5F3FF)', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }} />
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: '400px', height: '400px', background: 'rgba(124,58,237,0.06)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>

          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="section-tag" style={{ background: 'rgba(29,78,216,0.1)', color: '#1D4ED8', border: '1px solid rgba(29,78,216,0.25)' }}>
              <CalendarDays size={13} /> Book a Free Call
            </div>
            <h2 className="display-md" style={{ marginTop: '12px' }}>
              Talk to Our Team — <span className="gradient-text">Schedule a Meeting</span>
            </h2>
            <p className="body-lg" style={{ color: 'var(--text-muted)', maxWidth: '560px', margin: '16px auto 0' }}>
              Not sure where to start? Book a free 30-minute video call with our team. We&apos;ll understand your goals and give you a clear plan — no pressure, no commitment.
            </p>
          </div>

          <div className="grid-2" style={{ alignItems: 'center', gap: '48px' }}>

            {/* Left: How it works */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>
                How it works
              </h3>
              {HOW_IT_WORKS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: `${item.color}12`, border: `1px solid ${item.color}25`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={20} color={item.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '3px' }}>{item.title}</div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Booking CTA card */}
            <div className="card" style={{
              padding: '40px',
              background: 'linear-gradient(135deg, #fff, #F8FAFC)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(29,78,216,0.12), rgba(124,58,237,0.12))',
                border: '1px solid rgba(29,78,216,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Video size={32} color="#1D4ED8" />
              </div>

              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>
                  Free 30-Min Strategy Call
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Choose a time, pick your preferred platform (Google Meet, Zoom, or WhatsApp), and we&apos;ll send you the meeting link instantly.
                </p>
              </div>

              {/* Availability pills */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {[
                  { icon: CalendarDays, text: 'Mon – Sat' },
                  { icon: Clock, text: '9 AM – 6 PM IST' },
                  { icon: Gift, text: 'Completely Free' },
                ].map(p => {
                  const Icon = p.icon;
                  return (
                    <div key={p.text} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 14px', borderRadius: '9999px',
                      background: 'var(--bg-2)', border: '1px solid var(--border)',
                      fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)',
                    }}>
                      <Icon size={13} color="#1D4ED8" /> {p.text}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {[
                  { icon: Video, label: 'Google Meet' },
                  { icon: Video, label: 'Zoom' },
                  { icon: Phone, label: 'WhatsApp' }
                ].map(p => {
                  const PlatformIcon = p.icon;
                  return (
                    <div key={p.label} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '5px 12px', borderRadius: '8px',
                      background: 'rgba(29,78,216,0.06)', border: '1px solid rgba(29,78,216,0.15)',
                      fontSize: '0.75rem', fontWeight: 600, color: '#1D4ED8',
                    }}>
                      <PlatformIcon size={12} /> {p.label}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                <Clock size={14} /> Confirmation sent to your email &amp; WhatsApp within 2 hours
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '14px' }}
                onClick={() => setShowModal(true)}
              >
                <CalendarDays size={18} /> Book My Free Call
              </button>

              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '-8px' }}>
                No spam. No commitment. We hate that too.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm" style={{ textAlign: 'center' }}>
        <div className="container-narrow">
          <h2 className="display-md" style={{ marginBottom: '16px' }}>
            Ready to Get <span className="gradient-text">Started?</span>
          </h2>
          <p className="body-lg" style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
            Book a free 30-minute strategy call — no commitment, just ideas.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <CalendarDays size={18} /> Schedule Free Call
            </button>
            <Link href="/contact" className="btn btn-outline">
              Send a Message <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
