'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './Stats.module.css';

const stats = [
  { num: 12, suffix: '+', label: 'Projects Delivered', desc: 'Websites and apps live globally' },
  { num: 98, suffix: '%', label: 'Client Satisfaction', desc: 'Rated 5 stars by our clients' },
  { num: 340, suffix: '%', label: 'Avg Social Growth', desc: 'Followers increase in 90 days' },
  { num: 2, suffix: '+', label: 'Years of Excellence', desc: 'Crafting digital experiences' },
];

function useCountUp(target, duration = 2000, started) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return count;
}

function StatItem({ num, suffix, label, desc, started }) {
  const count = useCountUp(num, 1800, started);
  return (
    <div className={styles.item}>
      <div className={styles.num}>{count}{suffix}</div>
      <div className={styles.label}>{label}</div>
      <div className={styles.desc}>{desc}</div>
    </div>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`section-sm ${styles.section}`} ref={ref}>
      <div className={styles.bg} />
      <div className="container">
        <div className={styles.grid}>
          {stats.map(s => <StatItem key={s.label} {...s} started={started} />)}
        </div>
      </div>
    </section>
  );
}
