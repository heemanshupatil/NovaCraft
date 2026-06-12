'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ExternalLink, ArrowRight, Receipt, MapPin, Building2,
  ShoppingBag, TrendingUp, Activity, Coffee, Rocket, HardHat,
  Flower2, Utensils, Laptop
} from 'lucide-react';

const projects = [
  { id: 10, title: 'BillKart', category: 'Web App', color: '#10B981', icon: Receipt,
    desc: 'High-speed digital invoicing and receipt generation platform with instant POS print support.',
    tags: ['React', 'Netlify', 'TailwindCSS', 'Invoicing'],
    url: 'https://billkart.netlify.app/' },
  { id: 11, title: 'Navya Yatra', category: 'Web App', color: '#3B82F6', icon: MapPin,
    desc: 'Full-featured travel booking app with real-time seat selection, payment gateways, and ticket generation.',
    tags: ['React', 'Netlify', 'Booking', 'API Integration'],
    url: 'https://navyatrabooking.netlify.app/' },
  { id: 12, title: 'SmartBill Enterprise', category: 'Web App', color: '#8B5CF6', icon: Building2,
    desc: 'SaaS ledger billing and enterprise resource planning (ERP) platform for mid-market business chains.',
    tags: ['React', 'Netlify', 'SaaS', 'ERP'],
    url: 'https://smartbill-enterprise.netlify.app/' },
  { id: 1, title: 'LuxeCart', category: 'eCommerce', color: '#7C3AED', icon: ShoppingBag,
    desc: 'Premium fashion eCommerce store with AI recommendations and seamless checkout experience. Increased conversions by 180%.',
    tags: ['Next.js', 'Shopify', 'UI/UX', 'Stripe'] },
  { id: 2, title: 'ViralEdge Fitness', category: 'Social Media', color: '#06B6D4', icon: TrendingUp,
    desc: 'Social media strategy that grew a fitness brand from 2K to 85K followers and 340% engagement boost in 6 months.',
    tags: ['Instagram', 'TikTok', 'Content', 'Strategy'] },
  { id: 3, title: 'MedConnect', category: 'Web App', color: '#a855f7', icon: Activity,
    desc: 'HIPAA-compliant patient booking and telemedicine platform. Serving 3,000+ patients monthly.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Security'] },
  { id: 4, title: 'GrowBrew Café', category: 'Business', color: '#f59e0b', icon: Coffee,
    desc: 'Multi-location café website with online ordering and loyalty system. Added 30% monthly revenue.',
    tags: ['Next.js', 'Stripe', 'CMS', 'SEO'] },
  { id: 5, title: 'NeonSkin Ads', category: 'Social Media', color: '#ec4899', icon: Rocket,
    desc: 'D2C skincare brand paid campaigns with 6x ROAS across Meta and Google. $200K revenue in 3 months.',
    tags: ['Meta Ads', 'Google Ads', 'Analytics', 'ROAS'] },
  { id: 6, title: 'BuildPro Construction', category: 'Business', color: '#22c55e', icon: HardHat,
    desc: 'Construction company rebrand + website with project showcase and CRM. Tripled inbound leads.',
    tags: ['Next.js', 'PHP', 'SEO', 'CRM'] },
  { id: 7, title: 'ZenFlow Yoga', category: 'Business', color: '#06B6D4', icon: Flower2,
    desc: 'Online yoga studio with class scheduling, membership payments and live stream integration.',
    tags: ['React', 'Stripe', 'Live', 'Booking'] },
  { id: 8, title: 'ChefDrop', category: 'eCommerce', color: '#f59e0b', icon: Utensils,
    desc: 'Meal-kit subscription eCommerce with recurring billing, menu management, and delivery tracking.',
    tags: ['Next.js', 'Stripe', 'Subscriptions', 'Logistics'] },
  { id: 9, title: 'ByteGear Tech', category: 'Social Media', color: '#7C3AED', icon: Laptop,
    desc: 'B2B tech brand social media growth from 500 to 22K LinkedIn followers in 4 months.',
    tags: ['LinkedIn', 'Twitter', 'B2B', 'Content'] },
];

const cats = ['All', 'Business', 'eCommerce', 'Web App', 'Social Media'];

export default function PortfolioPage() {
  const [active, setActive] = useState('All');
  const [visible, setVisible] = useState([]);
  const cardRefs = useRef([]);

  const filtered = active === 'All' ? projects : projects.filter(p => p.category === active);

  useEffect(() => {
    const ids = filtered.map(p => p.id);
    const timer = setTimeout(() => setVisible(ids), 50);
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <>
      <section className="section" style={{ paddingTop: '140px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '30%', width: '500px', height: '500px', background: 'rgba(6,182,212,0.1)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div className="container-narrow" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-tag">Our Work</div>
          <h1 className="display-lg" style={{ marginBottom: '20px' }}>
            Projects That <span className="gradient-text">Drive Results</span>
          </h1>
          <p className="body-lg" style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto' }}>
            Real projects. Real results. From startups to established brands.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container">
          {/* Filter */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '48px' }}>
            {cats.map(c => (
              <button
                key={c}
                onClick={() => {
                  setVisible([]);
                  setActive(c);
                }}
                style={{
                  padding: '8px 20px', borderRadius: '9999px',
                  background: active === c ? 'linear-gradient(135deg, #1D4ED8, #3B82F6)' : 'var(--bg-2)',
                  color: active === c ? 'white' : 'var(--text-muted)',
                  fontSize: '0.875rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.3s ease',
                  border: active === c ? '1px solid transparent' : '1px solid var(--border)',
                  boxShadow: active === c ? '0 4px 14px rgba(29,78,216,0.25)' : 'none',
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {filtered.map((p) => (
              <div
                key={p.id}
                className="card"
                style={{
                  overflow: 'hidden', padding: 0, cursor: 'pointer',
                  opacity: visible.includes(p.id) ? 1 : 0,
                  transform: visible.includes(p.id) ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.4s ease, transform 0.4s ease',
                  position: 'relative',
                }}
                onClick={() => p.url && window.open(p.url, '_blank')}
              >
                <div style={{
                  height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${p.color}12`, borderBottom: `1px solid ${p.color}20`, position: 'relative',
                }}>
                  {(() => {
                    const ProjectIcon = p.icon;
                    return (
                      <span style={{ fontSize: '3.8rem', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ProjectIcon size={52} color={p.color} />
                      </span>
                    );
                  })()}
                  <div style={{
                    position: 'absolute', width: '120px', height: '120px', borderRadius: '50%',
                    background: p.color, opacity: 0.15, filter: 'blur(40px)',
                  }} />
                  {/* Hover overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `${p.color}E6`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.3s ease',
                    fontSize: '0.9rem', fontWeight: 600, color: 'white', gap: '8px',
                  }}
                    className="project-overlay"
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                  >
                    <ExternalLink size={16} /> View Project
                  </div>
                </div>
                <div style={{ padding: '22px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: p.color }}>{p.category}</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', margin: '6px 0 8px' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '14px' }}>{p.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {p.tags.map(t => (
                      <span key={t} style={{
                        fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px',
                        background: 'var(--bg-3)', border: '1px solid var(--border)',
                        borderRadius: '9999px', color: 'var(--text-muted)',
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-dim)' }}>
              No projects in this category yet.
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm" style={{ textAlign: 'center', background: 'linear-gradient(135deg, var(--bg-2), var(--bg-3))', borderTop: '1px solid var(--border)' }}>
        <div className="container-narrow">
          <h2 className="display-md" style={{ marginBottom: '16px' }}>
            Ready to Be Our <span className="gradient-text">Next Success Story?</span>
          </h2>
          <p className="body-lg" style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
            Let&apos;s talk about your project and build something great together.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary">
              Start Your Project <ArrowRight size={18} />
            </Link>
            <Link href="/pricing" className="btn btn-outline">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
