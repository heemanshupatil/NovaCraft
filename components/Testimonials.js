'use client';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import styles from './Testimonials.module.css';

const testimonials = [
  { name: 'Sarah Mitchell', role: 'CEO, LuxeCart Fashion', color: '#7C3AED',
    text: 'NovaCraft completely transformed our online presence. Our new eCommerce site looks stunning and our conversions doubled within the first month. Absolutely incredible team!', rating: 5 },
  { name: 'James Okonkwo', role: 'Founder, GrowBrew Café', color: '#f59e0b',
    text: 'They built us a website that truly captures the warmth of our brand. The online ordering system they integrated has added 30% to our monthly revenue. Highly recommended.', rating: 5 },
  { name: 'Priya Sharma', role: 'Marketing Head, ViralEdge', color: '#06B6D4',
    text: 'Our Instagram went from 2,000 to 85,000 followers in 6 months thanks to NovaCraft\'s social strategy. The content quality and engagement is beyond anything we expected.', rating: 5 },
  { name: 'Marcus Chen', role: 'Director, MedConnect', color: '#a855f7',
    text: 'The team delivered a complex HIPAA-compliant medical platform on time and on budget. Their technical expertise is world-class. We\'ll definitely work with them again.', rating: 5 },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const intervalRef = useRef(null);

  const go = (next) => {
    setDir(next > current ? 1 : -1);
    setCurrent(next);
    resetInterval();
  };
  const prev = () => go((current - 1 + testimonials.length) % testimonials.length);
  const next = () => go((current + 1) % testimonials.length);

  const resetInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDir(1);
      setCurrent(c => (c + 1) % testimonials.length);
    }, 5000);
  };

  useEffect(() => {
    resetInterval();
    return () => clearInterval(intervalRef.current);
  }, []);

  const t = testimonials[current];

  return (
    <section className={`section ${styles.section}`} id="testimonials">
      <div className={styles.bg} />
      <div className="container-narrow">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="section-tag">Testimonials</div>
          <h2 className="display-lg">What Our <span className="gradient-text">Clients Say</span></h2>
        </div>

        <div className={styles.card}>
          <div className={styles.stars}>
            {Array(t.rating).fill(0).map((_, i) => <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />)}
          </div>
          <blockquote className={styles.quote} key={current}>&ldquo;{t.text}&rdquo;</blockquote>
          <div className={styles.author}>
            <div className={styles.avatarCircle} style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}E6)` }}>
              {t.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div className={styles.name}>{t.name}</div>
              <div className={styles.role}>{t.role}</div>
            </div>
          </div>
        </div>

        <div className={styles.controls}>
          <button onClick={prev} className={styles.btn} aria-label="Previous"><ChevronLeft size={20} /></button>
          <div className={styles.dots}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => go(i)} className={`${styles.dot} ${i === current ? styles.dotActive : ''}`} />
            ))}
          </div>
          <button onClick={next} className={styles.btn} aria-label="Next"><ChevronRight size={20} /></button>
        </div>
      </div>
    </section>
  );
}
