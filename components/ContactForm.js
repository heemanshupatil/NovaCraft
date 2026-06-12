'use client';
import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import LoginPromptModal from '@/components/LoginPromptModal';
import { supabase } from '@/lib/supabase';
import styles from './ContactForm.module.css';

const services = ['Web Development', 'eCommerce Store', 'Social Media Marketing', 'Paid Ads', 'Custom Web App', 'Other'];

// localStorage helper
const saveMessage = (msg) => {
  try {
    const existing = JSON.parse(localStorage.getItem('nc_messages') || '[]');
    existing.unshift(msg);
    localStorage.setItem('nc_messages', JSON.stringify(existing));
  } catch { /* ignore */ }
};

export default function ContactForm() {
  const { user } = useAuth();
  const [form, setForm]     = useState({ name: '', email: '', service: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errors, setErrors] = useState({});
  const [loginPrompt, setLoginPrompt] = useState(false);

  // Auto-fill name & email when user is logged in
  const effectiveName  = user ? user.name : form.name;
  const effectiveEmail = user ? user.email : form.email;

  const validate = () => {
    const e = {};
    if (!effectiveName.trim()) e.name = 'Name is required';
    if (!effectiveEmail.match(/^\S+@\S+\.\S+$/)) e.email = 'Valid email required';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    // Auth gate
    if (!user) { setLoginPrompt(true); return; }

    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStatus('loading');

    const payload = {
      name: effectiveName,
      email: effectiveEmail,
      service: form.service,
      message: form.message,
    };

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const result = await res.json();
        const dbMsg = result.message;
        // Save to localStorage for admin panel to read
        saveMessage({
          ...payload,
          date: dbMsg?.created_at || new Date().toISOString(),
          id: dbMsg?.id || 'MSG-' + Date.now().toString(36).toUpperCase(),
          read: false,
        });
        setStatus('success');
        setForm({ name: '', email: '', service: '', message: '' });
      } else { setStatus('error'); }
    } catch { setStatus('error'); }
  };

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(er => { const n = { ...er }; delete n[k]; return n; });
  };

  if (status === 'success') {
    return (
      <div className={styles.success}>
        <CheckCircle size={48} color="#22c55e" />
        <h3>Message Sent!</h3>
        <p>Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
        <button onClick={() => setStatus('idle')} className="btn btn-outline">Send Another</button>
      </div>
    );
  }

  return (
    <>
      {/* Login prompt for unauthenticated users */}
      {loginPrompt && (
        <LoginPromptModal
          action="send us a message"
          onClose={() => setLoginPrompt(false)}
        />
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Your Name</label>
            <input
              id="contact-name"
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="John Smith"
              value={user ? user.name : form.name}
              onChange={set('name')}
              disabled={!!user}
              style={user ? { background: 'var(--bg-2)', cursor: 'not-allowed', color: 'var(--text-dim)' } : {}}
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input
              id="contact-email"
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="john@company.com"
              value={user ? user.email : form.email}
              onChange={set('email')}
              disabled={!!user}
              style={user ? { background: 'var(--bg-2)', cursor: 'not-allowed', color: 'var(--text-dim)' } : {}}
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Service Needed</label>
          <select
            id="contact-service"
            className={styles.input}
            value={form.service}
            onChange={set('service')}
          >
            <option value="">Select a service...</option>
            {services.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Your Message</label>
          <textarea
            id="contact-message"
            className={`${styles.input} ${styles.textarea} ${errors.message ? styles.inputError : ''}`}
            placeholder="Tell us about your project..."
            rows={5}
            value={form.message}
            onChange={set('message')}
          />
          {errors.message && <span className={styles.error}>{errors.message}</span>}
        </div>

        {status === 'error' && (
          <div className={styles.errorBanner}>
            <AlertCircle size={16} /> Something went wrong. Please try again.
          </div>
        )}

        {/* Hint for guests */}
        {!user && (
          <p className={styles.authHint} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <Lock size={12} color="#64748B" /> You&apos;ll need to <a href="/login" className={styles.authLink}>sign in</a> or{' '}
            <a href="/signup" className={styles.authLink}>create an account</a> to send a message.
          </p>
        )}

        <button
          id="contact-submit"
          type="submit"
          className={`btn btn-primary ${styles.submit}`}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <span className={styles.spinner} />
          ) : (
            <><Send size={16} /> Send Message</>
          )}
        </button>
      </form>
    </>
  );
}
