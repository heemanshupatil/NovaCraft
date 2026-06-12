'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Lock, X, LogIn, UserPlus } from 'lucide-react';
import styles from './LoginPromptModal.module.css';

/**
 * Shows when an unauthenticated user tries to do a protected action.
 * Props:
 *   onClose   – close the prompt
 *   action    – short string describing what they were trying to do (e.g. "make a payment")
 */
export default function LoginPromptModal({ onClose, action = 'continue' }) {
  const overlayRef = useRef(null);

  // Close on overlay click
  const handleOverlay = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleOverlay}>
      <div className={styles.card}>
        {/* Close */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {/* Icon */}
        <div className={styles.lockRing}>
          <Lock size={32} color="#1D4ED8" strokeWidth={1.8} />
        </div>

        {/* Text */}
        <h2 className={styles.title}>Login Required</h2>
        <p className={styles.subtitle}>
          You need to be signed in to <strong>{action}</strong>.<br />
          Please log in or create a free account to continue.
        </p>

        {/* Buttons */}
        <div className={styles.actions}>
          <Link href="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
            <LogIn size={17} /> Sign In
          </Link>
          <Link href="/signup" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
            <UserPlus size={17} /> Create Account
          </Link>
        </div>

        <button className={styles.cancelLink} onClick={onClose}>
          Cancel — continue browsing
        </button>
      </div>
    </div>
  );
}
