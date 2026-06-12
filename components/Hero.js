'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import styles from './Hero.module.css';
import CyberParticles from './CyberParticles';

export default function Hero() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const els = [titleRef.current, subtitleRef.current, ctaRef.current];
    els.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200 + i * 180);
    });
  }, []);

  return (
    <section className={styles.hero}>
      {/* Interactive canvas background */}
      <CyberParticles />
      {/* Animated grid background */}
      <div className={styles.grid} />
      {/* Orbs */}
      <div className={`${styles.orb} ${styles.orbA}`} />
      <div className={`${styles.orb} ${styles.orbB}`} />
      <div className={`${styles.orb} ${styles.orbC}`} />

      <div className={`container ${styles.content}`}>
        <div className={styles.badge} ref={subtitleRef}>
          <Zap size={13} />
          <span>Web Development &amp; Social Media Marketing</span>
        </div>

        <h1 ref={titleRef} className={`display-xl ${styles.title}`}>
          We Build{' '}
          <span className="gradient-text">Digital</span>
          <br />
          <span className={styles.strokeText}>Experiences</span>
          <br />
          That Convert
        </h1>

        <p ref={subtitleRef} className={`body-lg ${styles.subtitle}`}>
          From stunning websites to viral social media campaigns — NovaCraft Digital
          turns your vision into a powerful online presence that drives real results.
        </p>

        <div ref={ctaRef} className={styles.ctas}>
          <Link href="/contact" className="btn btn-primary">
            Start Your Project <ArrowRight size={18} />
          </Link>
          <Link href="/portfolio" className="btn btn-outline">
            View Our Work
          </Link>
        </div>

        <div className={styles.stats}>
          {[
            { num: '12+', label: 'Projects Delivered' },
            { num: '98%', label: 'Client Satisfaction' },
            { num: '2+', label: 'Years Experience' },
          ].map(s => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating cards */}
      <div className={styles.floatCardA}>
        <span className={styles.floatDot} />
        <span>New client onboarded</span>
      </div>
      <div className={styles.floatCardB}>
        <span>+340% social growth</span>
        <span className={styles.floatArrow}>↑</span>
      </div>

      <div className={styles.scrollIndicator}>
        <div className={styles.scrollLine} />
        <span>Scroll</span>
      </div>
    </section>
  );
}
