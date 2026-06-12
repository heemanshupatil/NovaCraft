'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import styles from './auth.module.css';

export default function SignupPage() {
  const { register, user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) router.push('/dashboard');
  }, [user, authLoading, router]);

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [show, setShow]       = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.name.trim())          return 'Please enter your full name.';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) return 'Please enter a valid email address.';
    if (form.password.length < 6)   return 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    
    const result = await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
    if (result.ok) {
      router.push('/dashboard');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setError(''); };

  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#22C55E'];

  return (
    <div className={styles.page}>
      <div className={styles.orbA} />
      <div className={styles.orbB} />

      <div className={styles.card}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Nova</span>
          <span className={styles.logoAccent}>Craft</span>
        </Link>

        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join NovaCraft to track your projects.</p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            <input id="signup-name" className={styles.input} placeholder="John Smith"
              value={form.name} onChange={set('name')} autoComplete="name" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input id="signup-email" type="email" className={styles.input} placeholder="you@example.com"
              value={form.email} onChange={set('email')} autoComplete="email" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.passWrap}>
              <input id="signup-password" type={show ? 'text' : 'password'}
                className={`${styles.input} ${styles.passInput}`} placeholder="Min. 6 characters"
                value={form.password} onChange={set('password')} autoComplete="new-password" />
              <button type="button" className={styles.eyeBtn} onClick={() => setShow(s => !s)} aria-label="Toggle">
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {form.password.length > 0 && (
              <div className={styles.strengthRow}>
                <div className={styles.strengthBars}>
                  {[1,2,3].map(i => (
                    <div key={i} className={styles.strengthBar}
                      style={{ background: i <= strength ? strengthColor[strength] : '#E2E8F0' }} />
                  ))}
                </div>
                <span style={{ color: strengthColor[strength], fontSize: '0.72rem', fontWeight: 600 }}>
                  {strengthLabel[strength]}
                </span>
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.passWrap}>
              <input id="signup-confirm" type={show ? 'text' : 'password'}
                className={`${styles.input} ${styles.passInput}`} placeholder="Repeat password"
                value={form.confirm} onChange={set('confirm')} autoComplete="new-password" />
              {form.confirm && (
                <span className={styles.matchIcon}>
                  {form.confirm === form.password
                    ? <CheckCircle size={17} color="#22C55E" />
                    : <AlertCircle size={17} color="#EF4444" />}
                </span>
              )}
            </div>
          </div>

          {error && <div className={styles.errorBox}><AlertCircle size={15} /> {error}</div>}

          <button id="signup-submit" type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : <><UserPlus size={17} /> Create Account</>}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account? <Link href="/login" className={styles.switchLink}>Sign in →</Link>
        </p>
        <p className={styles.backLink}><Link href="/">← Back to website</Link></p>
      </div>
    </div>
  );
}
