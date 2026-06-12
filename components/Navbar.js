'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogIn, LogOut, LayoutDashboard, UserPlus, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import styles from './Navbar.module.css';

const links = [
  { href: '/',          label: 'Home' },
  { href: '/services',  label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/pricing',   label: 'Pricing' },
  { href: '/about',     label: 'About' },
  { href: '/contact',   label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [theme, setTheme]       = useState('light'); // Default to light theme
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem('theme') || 'light';
    setTimeout(() => {
      setTheme(stored);
    }, 0);
    document.documentElement.setAttribute('data-theme', stored);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setOpen(false);
      setDropOpen(false);
    }, 0);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    router.push('/');
  };

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`${styles.inner} container`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Nova</span>
          <span className={styles.logoAccent}>Craft</span>
        </Link>

        <nav className={`${styles.links} ${open ? styles.open : ''}`}>
          {/* Mobile-only Close Button */}
          <button 
            type="button" 
            className={styles.mobileCloseBtn}
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} /> Close Menu
          </button>

          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.link} ${pathname === l.href ? styles.active : ''}`}
            >
              {l.label}
              <span className={styles.linkUnderline} />
            </Link>
          ))}

          {/* Theme Toggle Button */}
          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {user ? (
            /* ── Logged-in state ── */
            <div 
              className={styles.userMenu}
              onMouseEnter={() => setDropOpen(true)}
              onMouseLeave={() => setDropOpen(false)}
            >
              <button
                className={styles.avatarBtn}
                onClick={() => setDropOpen(d => !d)}
                aria-label="User menu"
              >
                <span className={styles.avatarCircle}>{user.name.charAt(0)}</span>
                <span className={styles.avatarName}>{user.name}</span>
              </button>
              {dropOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropEmail}>{user.email}</div>
                  <Link href="/dashboard" className={styles.dropItem}>
                    <LayoutDashboard size={15} /> My Dashboard
                  </Link>
                  <button className={`${styles.dropItem} ${styles.dropLogout}`} onClick={handleLogout}>
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Guest state ── */
            <>
              <Link href="/signup" className={`${styles.loginBtn}`}>
                <UserPlus size={15} /> Sign Up
              </Link>
              <Link href="/login" className={`${styles.loginBtn} ${styles.loginBtnAlt}`}>
                <LogIn size={15} /> Login
              </Link>
              <Link href="/contact" className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.875rem' }}>
                Get Started
              </Link>
            </>
          )}
        </nav>

        <button
          className={styles.hamburger}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
