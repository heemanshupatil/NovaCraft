'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Globe, ShoppingBag, Megaphone, BarChart2, Palette, Smartphone, ArrowRight } from 'lucide-react';
import styles from './Services.module.css';

const services = [
  {
    icon: Globe, color: '#7C3AED',
    title: 'Business Websites',
    desc: 'Professional, conversion-optimised websites for businesses of all sizes. Fast, responsive, and built to impress.',
    tags: ['Corporate', 'Landing Pages', 'Portfolios'],
  },
  {
    icon: ShoppingBag, color: '#06B6D4',
    title: 'eCommerce Stores',
    desc: 'High-converting online stores with seamless checkout, inventory management, and powerful product pages.',
    tags: ['Shopify', 'WooCommerce', 'Custom'],
  },
  {
    icon: Palette, color: '#a855f7',
    title: 'Custom Web Apps',
    desc: 'Bespoke web applications tailored to your business logic — dashboards, booking systems, SaaS platforms.',
    tags: ['React', 'Next.js', 'Full-Stack'],
  },
  {
    icon: Megaphone, color: '#f59e0b',
    title: 'Social Media Marketing',
    desc: 'Strategic content creation, community management and paid campaigns that grow your brand and drive sales.',
    tags: ['Instagram', 'Facebook', 'TikTok'],
  },
  {
    icon: BarChart2, color: '#22c55e',
    title: 'Paid Ads & Analytics',
    desc: 'Data-driven ad campaigns across Meta, Google and TikTok, with full reporting and ROI transparency.',
    tags: ['Meta Ads', 'Google Ads', 'Analytics'],
  },
  {
    icon: Smartphone, color: '#ec4899',
    title: 'Mobile-First Design',
    desc: 'Every project is crafted mobile-first — because over 70% of your customers browse on their phone.',
    tags: ['Responsive', 'PWA', 'App-Like'],
  },
];

export default function Services() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.15 }
    );
    cardRefs.current.forEach(c => c && observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section" ref={sectionRef} id="services">
      <div className="container">
        <div className="reveal" ref={el => cardRefs.current[0] = el} style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="section-tag">Our Services</div>
          <h2 className="display-lg">Everything You Need to<br /><span className="gradient-text">Dominate Online</span></h2>
          <p className="body-lg" style={{ color: 'var(--text-muted)', maxWidth: '560px', margin: '20px auto 0' }}>
            From first click to loyal customer — we handle the full digital journey.
          </p>
        </div>

        <div className={styles.grid}>
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className={`card ${styles.card} reveal`}
                ref={el => cardRefs.current[i + 1] = el}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={styles.iconWrap} style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                  <Icon size={24} color={s.color} />
                </div>
                <h3 className={`display-sm ${styles.cardTitle}`}>{s.title}</h3>
                <p className="body-sm" style={{ color: 'var(--text-muted)', flex: 1 }}>{s.desc}</p>
                <div className={styles.tags}>
                  {s.tags.map(t => (
                    <span key={t} className={styles.tag} style={{ borderColor: `${s.color}30`, color: s.color }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '56px' }}>
          <Link href="/services" className="btn btn-outline">
            Explore All Services <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
