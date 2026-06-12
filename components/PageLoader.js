'use client';
import { useEffect, useState } from 'react';
import styles from './PageLoader.module.css';

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Prevent scrolling during page load
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setVisible(false);
        // Restore scrolling
        document.body.style.overflow = '';
      }, 700);
    }, 1800);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`${styles.loader} ${fadeOut ? styles.fadeOut : ''}`}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.logoText}>Nova</span>
          <span className={styles.logoAccent}>Craft</span>
        </div>
        <div className={styles.bar}>
          <div className={styles.barFill} />
        </div>
        <p className={styles.tagline}>Building Digital Excellence</p>
      </div>
      <div className={styles.orbA} />
      <div className={styles.orbB} />
    </div>
  );
}
