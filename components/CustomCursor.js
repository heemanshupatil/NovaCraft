'use client';
import { useEffect, useRef } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let raf;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
      raf = requestAnimationFrame(animate);
    };

    const onEnter = (e) => {
      const el = e.target;
      const isClickable = el.closest('a, button, [data-cursor]');
      if (isClickable) {
        dot.classList.add(styles.dotExpand);
        ring.classList.add(styles.ringExpand);
      }
    };
    const onLeave = () => {
      dot.classList.remove(styles.dotExpand);
      ring.classList.remove(styles.ringExpand);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);
    raf = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={styles.dot} />
      <div ref={ringRef} className={styles.ring} />
    </>
  );
}
