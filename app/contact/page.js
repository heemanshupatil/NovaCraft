'use client';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import ContactForm from '@/components/ContactForm';
import RequestTracker from '@/components/RequestTracker';
import AppointmentModal from '@/components/AppointmentModal';
import { Mail, Phone, MapPin, Clock, MessageSquare, CalendarDays, Video, Users, Zap, Gift, Heart } from 'lucide-react';

const info = [
  { icon: Mail,   label: 'Email',         value: 'hello@novacraft.digital', href: 'mailto:hello@novacraft.digital', color: '#7C3AED' },
  { icon: Phone,  label: 'Phone',         value: '7875652144',              href: 'tel:7875652144',                 color: '#06B6D4' },
  { icon: MapPin, label: 'Location',      value: 'Available Worldwide',     href: null,                             color: '#a855f7' },
  { icon: Clock,  label: 'Response Time', value: 'Within 12 hours',         href: null,                             color: '#22c55e' },
];

const HOW_IT_WORKS = [
  { icon: CalendarDays, color: '#1D4ED8', title: 'Pick a Date & Time',    desc: 'Choose any weekday slot — Mon–Sat, 9 AM to 6 PM IST.' },
  { icon: Video,        color: '#7C3AED', title: 'Choose Your Platform',   desc: 'Google Meet, Zoom, or a WhatsApp call — your choice.' },
  { icon: Users,        color: '#06B6D4', title: 'Meet the Team',          desc: 'Our expert team joins ready to discuss your project & budget.' },
  { icon: Zap,          color: '#22c55e', title: 'Get a Free Proposal',    desc: 'Walk away with a clear roadmap and a no-obligation quote.' },
];

export default function ContactPage() {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <>
      {showModal && <AppointmentModal onClose={() => setShowModal(false)} />}

      <section className="section" style={{ paddingTop: '140px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: '500px', height: '500px', background: 'rgba(29,78,216,0.07)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '350px', height: '350px', background: 'rgba(245,158,11,0.07)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Page Header */}
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <div className="section-tag">Get In Touch</div>
            <h1 className="display-lg" style={{ marginBottom: '16px' }}>
              Let&apos;s Build Something <span className="gradient-text">Great</span>
            </h1>
            <p className="body-lg" style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
              Tell us about your project. We&apos;ll get back to you within 24 hours with ideas and a custom plan.
            </p>
          </div>

          {/* Contact Info + Form */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>
            {/* Left: info cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {info.map(item => {
                const Icon = item.icon;
                const Wrap = item.href ? 'a' : 'div';
                return (
                  <Wrap
                    key={item.label}
                    {...(item.href ? { href: item.href } : {})}
                    className="card"
                    style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}
                  >
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      background: `${item.color}18`, border: `1px solid ${item.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={20} color={item.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>{item.label}</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text)' }}>{item.value}</div>
                    </div>
                  </Wrap>
                );
              })}

              {/* Prefer a call card — now clickable */}
              <button
                className="card"
                onClick={() => setShowModal(true)}
                style={{
                  padding: '28px', textAlign: 'left', cursor: 'pointer', width: '100%',
                  background: 'linear-gradient(135deg, rgba(29,78,216,0.08), rgba(124,58,237,0.08))',
                  border: '1px solid rgba(29,78,216,0.2)',
                  transition: 'border-color 0.2s ease, transform 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1D4ED8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(29,78,216,0.2)'; e.currentTarget.style.transform = 'none'; }}
              >
                <CalendarDays size={24} color="#1D4ED8" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>Prefer a video call?</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '12px' }}>
                  Book a free 30-minute discovery call — Google Meet, Zoom, or WhatsApp.
                </p>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1D4ED8' }}>
                  Schedule Now →
                </span>
              </button>
            </div>

            {/* Right: form */}
            <div className="card" style={{ padding: '40px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Send Us a Message</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '28px' }}>Fill out the form and we&apos;ll be in touch shortly.</p>
              <ContactForm />
            </div>
          </div>


          {/* ── Track My Request ──────────────────────────────────────────── */}
          <div id="track" style={{ marginTop: '72px' }}>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '48px' }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, var(--border))' }} />
              <div className="section-tag" style={{
                margin: 0,
                background: 'rgba(59,130,246,0.1)',
                color: '#3B82F6',
                border: '1px solid rgba(59,130,246,0.3)',
                padding: '8px 20px',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
              }}>
                🔍 Track My Request
              </div>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, var(--border))' }} />
            </div>

            {/* Highlighted wrapper */}
            <div style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 50%, #F5F3FF 100%)',
              border: '1.5px solid rgba(59,130,246,0.2)',
              padding: '48px',
              boxShadow: '0 8px 40px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
            }}>
              {/* Decorative glow blobs */}
              <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '200px', height: '200px', background: 'rgba(59,130,246,0.08)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(34,197,94,0.07)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

              <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'start' }}>

                {/* Left: explainer */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '5px 14px', borderRadius: '9999px',
                      background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                      fontSize: '0.72rem', fontWeight: 700, color: '#16A34A',
                      letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px',
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                      Live Updates
                    </div>
                    <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text)', marginBottom: '12px', lineHeight: 1.2 }}>
                      Live <span className="gradient-text">Request Status</span>
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                      Enter your email to instantly see the live status of any message, inquiry, or complaint you submitted. Our team updates every ticket in real time.
                    </p>
                  </div>

                  {/* Status legend */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', label: 'Open',        desc: 'Request received — in our queue.' },
                      { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)',  label: 'Under Review', desc: 'Our team is actively working on it.' },
                      { color: '#22C55E', bg: 'rgba(34,197,94,0.08)',   label: 'Resolved',     desc: 'Completed with a direct reply.' },
                    ].map(s => (
                      <div key={s.label} style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '12px 16px', borderRadius: '12px',
                        background: s.bg, border: `1px solid ${s.color}25`,
                      }}>
                        <div style={{
                          width: '10px', height: '10px', borderRadius: '50%',
                          background: s.color, flexShrink: 0,
                          boxShadow: `0 0 0 4px ${s.color}25`,
                        }} />
                        <div>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{s.label}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginLeft: '8px' }}>{s.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: tracker card — premium highlighted */}
                <div style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1.5px solid rgba(59,130,246,0.15)',
                  padding: '32px',
                  boxShadow: '0 4px 24px rgba(59,130,246,0.1), 0 1px 4px rgba(0,0,0,0.04)',
                }}>
                  <RequestTracker />
                </div>
              </div>
            </div>
          </div>

          {/* ── Schedule a Call ────────────────────────────────────────────── */}
          <div id="schedule" style={{ marginTop: '72px' }}>
            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '56px' }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, var(--border))' }} />
              <div className="section-tag" style={{ margin: 0 }}>
                <CalendarDays size={13} /> Schedule a Call
              </div>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, var(--border))' }} />
            </div>

            <div style={{
              position: 'relative', borderRadius: '24px', overflow: 'hidden',
              background: 'linear-gradient(135deg, #EFF6FF, #F5F3FF)',
              border: '1px solid #E2E8F0', padding: '56px 48px',
            }}>
              <div style={{ position: 'absolute', top: '10%', right: '5%', width: '300px', height: '300px', background: 'rgba(124,58,237,0.05)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text)', marginBottom: '12px' }}>
                  Talk to Our Team — <span className="gradient-text">Schedule a Meeting</span>
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
                  Not sure where to start? Book a free 30-minute video call. We&apos;ll understand your goals and give you a clear plan — no pressure, no commitment.
                </p>
              </div>

              <div className="grid-2" style={{ alignItems: 'center', gap: '48px' }}>
                {/* Left: How it works */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>How it works</h3>
                  {HOW_IT_WORKS.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '12px',
                          background: `${item.color}12`, border: `1px solid ${item.color}25`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <Icon size={20} color={item.color} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '3px' }}>{item.title}</div>
                          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Booking CTA card */}
                <div className="card" style={{
                  padding: '40px',
                  background: 'linear-gradient(135deg, #fff, #F8FAFC)',
                  border: '1px solid var(--border)',
                  borderRadius: '24px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                }}>
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(29,78,216,0.12), rgba(124,58,237,0.12))',
                    border: '1px solid rgba(29,78,216,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Video size={32} color="#1D4ED8" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>Free 30-Min Strategy Call</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      Choose a time, pick your preferred platform, and we&apos;ll send you the meeting link instantly.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[
                      { icon: CalendarDays, text: 'Mon – Sat' },
                      { icon: Clock, text: '9 AM – 6 PM IST' },
                      { icon: Gift, text: 'Completely Free' },
                    ].map(p => {
                      const Icon = p.icon;
                      return (
                        <div key={p.text} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 14px',
                          borderRadius: '9999px',
                          background: 'var(--bg-2)',
                          border: '1px solid var(--border)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                        }}>
                          <Icon size={13} color="#1D4ED8" /> {p.text}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[
                      { icon: Video, label: 'Google Meet' },
                      { icon: Video, label: 'Zoom' },
                      { icon: Phone, label: 'WhatsApp' }
                    ].map(p => {
                      const PlatformIcon = p.icon;
                      return (
                        <div key={p.label} style={{
                          padding: '5px 12px',
                          borderRadius: '8px',
                          background: 'rgba(29,78,216,0.06)',
                          border: '1px solid rgba(29,78,216,0.15)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#1D4ED8',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}>
                          <PlatformIcon size={12} /> {p.label}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    <Clock size={14} /> Confirmation sent to your email &amp; WhatsApp within 2 hours
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '14px' }}
                    onClick={() => setShowModal(true)}
                  >
                    <CalendarDays size={18} /> Book My Free Call
                  </button>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '-8px' }}>
                    No spam. No commitment. We hate that too.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Priority Tagline & Animation ───────────────────────────────── */}
          <div style={{
            marginTop: '80px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            padding: '40px 24px',
            background: 'linear-gradient(180deg, transparent, rgba(59,130,246,0.03))',
            borderRadius: '24px',
            border: '1px dashed rgba(29,78,216,0.15)',
          }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Glow effect */}
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="laptopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>

                {/* Rotating Gears (representing Work) */}
                <g style={{ transformOrigin: '30px 30px', animation: 'spin 12s linear infinite' }}>
                  <circle cx="30" cy="30" r="9" stroke="rgba(59,130,246,0.4)" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="30" cy="30" r="5" fill="#3B82F6" />
                </g>
                <g style={{ transformOrigin: '70px 25px', animation: 'spin-reverse 8s linear infinite' }}>
                  <circle cx="70" cy="25" r="7" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" strokeDasharray="2 2" />
                  <circle cx="70" cy="25" r="4" fill="#8B5CF6" />
                </g>

                {/* Laptop Base & Screen */}
                <rect x="25" y="45" width="50" height="32" rx="3" fill="#1E293B" stroke="url(#laptopGrad)" strokeWidth="2" />
                {/* Screen Content Line blinking */}
                <rect x="30" y="50" width="40" height="22" rx="1" fill="#0F172A" />
                {/* Blinking/typing code lines */}
                <line x1="34" y1="55" x2="48" y2="55" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" style={{ animation: 'pulse 1.5s infinite' }} />
                <line x1="34" y1="60" x2="62" y2="60" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" style={{ animation: 'pulse 1.8s infinite', animationDelay: '0.3s' }} />
                <line x1="34" y1="65" x2="56" y2="65" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" style={{ animation: 'pulse 2s infinite', animationDelay: '0.6s' }} />

                {/* Keyboard part */}
                <path d="M20 77h60l4 4H16l4-4z" fill="#334155" stroke="url(#laptopGrad)" strokeWidth="1.5" />
                <line x1="30" y1="79" x2="70" y2="79" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

                {/* Pulsing Priority Heart on Top */}
                <g style={{ transformOrigin: '50px 32px', animation: 'pulse-heart 1.2s infinite ease-in-out' }}>
                  <path d="M50 34c-.2-.68-.83-1.25-1.55-1.25-1.2 0-2 1-2 2.2 0 1.9 2.55 3.8 3.55 4.8 1-.9 3.55-2.85 3.55-4.8 0-1.2-.8-2.2-2-2.2-.72 0-1.35.57-1.55 1.25z" fill="#EF4444" filter="url(#glow)" />
                </g>

                {/* Decorative floaty dots */}
                <circle cx="15" cy="55" r="2" fill="#3B82F6" style={{ animation: 'pulse 2.5s infinite', animationDelay: '0.2s' }} />
                <circle cx="85" cy="60" r="2" fill="#34D399" style={{ animation: 'pulse 2s infinite', animationDelay: '0.8s' }} />
                <circle cx="50" cy="20" r="1.5" fill="#F59E0B" style={{ animation: 'pulse 3s infinite', animationDelay: '0.5s' }} />
              </svg>

              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes spin-reverse {
                  from { transform: rotate(360deg); }
                  to { transform: rotate(0deg); }
                }
                @keyframes pulse {
                  0%, 100% { opacity: 0.2; }
                  50% { opacity: 1; }
                }
                @keyframes pulse-heart {
                  0%, 100% { transform: scale(0.9); }
                  50% { transform: scale(1.15); }
                }
              `}} />
            </div>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <Heart size={18} fill="#EF4444" color="#EF4444" style={{ flexShrink: 0 }} /> Customer is our first priority
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              We are dedicated to turning your vision into reality. Your satisfaction, trust, and business growth will always be our absolute top priority.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
