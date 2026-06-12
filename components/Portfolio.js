'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ExternalLink, Receipt, MapPin, Building2, ShoppingBag,
  TrendingUp, Activity, Coffee, Rocket, HardHat
} from 'lucide-react';
import styles from './Portfolio.module.css';

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
    desc: 'Premium fashion eCommerce store with AI recommendations and seamless checkout.',
    tags: ['Next.js', 'Shopify', 'UI/UX'] },
  { id: 2, title: 'ViralEdge', category: 'Social Media', color: '#06B6D4', icon: TrendingUp,
    desc: 'Social media strategy that grew a fitness brand from 2K to 85K followers in 6 months.',
    tags: ['Instagram', 'TikTok', 'Content'] },
  { id: 3, title: 'MedConnect', category: 'Web App', color: '#a855f7', icon: Activity,
    desc: 'HIPAA-compliant patient booking and telemedicine platform for a healthcare group.',
    tags: ['React', 'Node.js', 'PostgreSQL'] },
  { id: 4, title: 'GrowBrew', category: 'Business', color: '#f59e0b', icon: Coffee,
    desc: 'Multi-location café website with online ordering, loyalty points, and blog.',
    tags: ['Next.js', 'Stripe', 'CMS'] },
  { id: 5, title: 'NeonAds', category: 'Social Media', color: '#ec4899', icon: Rocket,
    desc: 'Paid ad campaigns that delivered 6x ROAS for a D2C skincare brand in 3 months.',
    tags: ['Meta Ads', 'Google Ads', 'Analytics'] },
  { id: 6, title: 'BuildPro', category: 'Business', color: '#22c55e', icon: HardHat,
    desc: 'Construction company website with project showcase, quote calculator, and CRM integration.',
    tags: ['WordPress', 'PHP', 'SEO'] },
];

export default function Portfolio() {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    cardRefs.current.forEach(c => c && observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section" id="portfolio">
      <div className="container">
        <div className="reveal" ref={el => cardRefs.current[0] = el} style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="section-tag">Our Work</div>
          <h2 className="display-lg">Projects That <span className="gradient-text">Speak Volumes</span></h2>
          <p className="body-lg" style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '16px auto 0' }}>
            A snapshot of the results we&apos;ve delivered for our clients.
          </p>
        </div>

        <div className={styles.grid}>
          {projects.map((p, i) => (
            <div
              key={p.id}
              className={`card ${styles.card} reveal`}
              ref={el => cardRefs.current[i + 1] = el}
              style={{ transitionDelay: `${i * 80}ms` }}
              onClick={() => p.url && window.open(p.url, '_blank')}
            >
              <div className={styles.thumb} style={{ background: `${p.color}18`, borderColor: `${p.color}20` }}>
                <span className={styles.emoji} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p.icon size={44} color={p.color} />
                </span>
                <div className={styles.thumbOrb} style={{ background: p.color }} />
              </div>
              <div className={styles.body}>
                <span className={styles.cat} style={{ color: p.color }}>{p.category}</span>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.desc}>{p.desc}</p>
                <div className={styles.tags}>
                  {p.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                </div>
              </div>
              <div className={styles.hoverOverlay}>
                <span>View Project <ExternalLink size={14} /></span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '56px' }}>
          <Link href="/portfolio" className="btn btn-primary">
            View All Projects <ExternalLink size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
