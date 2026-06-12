'use client';
import { useState, useEffect } from 'react';
import {
  X, Calendar, Clock, User, Mail, Phone, ChevronRight,
  CheckCircle, Video, ArrowLeft, Loader2, MessageSquare, Briefcase,
  Globe, Megaphone, Sparkles, Smartphone, Shield
} from 'lucide-react';
import styles from './AppointmentModal.module.css';

const SERVICES = [
  { id: 'web-dev', label: 'Web Development', icon: Globe, desc: 'Business sites, eCommerce, web apps' },
  { id: 'social', label: 'Social Media Marketing', icon: Megaphone, desc: 'Content, strategy, growth campaigns' },
  { id: 'custom', label: 'Custom Project', icon: Sparkles, desc: 'Tell us your unique idea' },
  { id: 'general', label: 'General Inquiry', icon: MessageSquare, desc: 'Just want to say hello!' },
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM',
];

const MEETING_PLATFORMS = [
  { id: 'google-meet', label: 'Google Meet', icon: Video },
  { id: 'zoom', label: 'Zoom', icon: Video },
  { id: 'whatsapp', label: 'WhatsApp Call', icon: Smartphone },
];

function getNext7Days() {
  const days = [];
  const today = new Date();
  for (let i = 1; i <= 10; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0 && d.getDay() !== 6) { // skip weekends
      days.push(d);
    }
    if (days.length === 7) break;
  }
  return days;
}

const STEPS = ['Service', 'Date & Time', 'Your Details', 'Confirm'];

function StepBar({ current }) {
  return (
    <div className={styles.stepBar}>
      {STEPS.map((label, i) => (
        <div key={label} className={styles.stepItem}>
          <div className={`${styles.stepDot} ${i < current ? styles.done : ''} ${i === current ? styles.active : ''}`}>
            {i < current ? <CheckCircle size={13} /> : <span>{i + 1}</span>}
          </div>
          <span className={`${styles.stepLabel} ${i === current ? styles.stepLabelActive : ''}`}>{label}</span>
          {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < current ? styles.lineDone : ''}`} />}
        </div>
      ))}
    </div>
  );
}

export default function AppointmentModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState('google-meet');
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const days = getNext7Days();

  // Trap ESC key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const formatDate = (d) => d?.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.match(/^\S+@\S+\.\S+$/) || !form.phone.trim()) {
      setError('Please fill all required fields correctly.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          notes: form.notes,
          service: SERVICES.find(s => s.id === selectedService)?.label,
          date: selectedDate?.toISOString(),
          time: selectedTime,
          platform: selectedPlatform,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <CheckCircle size={48} color="#22C55E" />
            </div>
            <h2>Appointment Confirmed</h2>
            <p>
              We&apos;ve sent a confirmation email to <strong>{form.email}</strong> with your{' '}
              <strong>{MEETING_PLATFORMS.find(p => p.id === selectedPlatform)?.label}</strong> link.
            </p>
            <div className={styles.successDetails}>
              <div className={styles.successRow}>
                <Calendar size={16} /> <span>{formatDate(selectedDate)}</span>
              </div>
              <div className={styles.successRow}>
                <Clock size={16} /> <span>{selectedTime} IST</span>
              </div>
              <div className={styles.successRow}>
                <Briefcase size={16} />
                <span>{SERVICES.find(s => s.id === selectedService)?.label}</span>
              </div>
            </div>
            <p className={styles.successNote}>
              Our team will confirm your slot within 2 hours. Check your inbox (and spam folder).
            </p>
            <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {step > 0 && (
              <button className={styles.backBtn} onClick={() => setStep(s => s - 1)}>
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <div className={styles.headerTitle}>
                <Video size={18} color="#1D4ED8" />
                Schedule a Free Consultation
              </div>
              <div className={styles.headerSub}>30 min · Free · No commitment</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        {/* Step Bar */}
        <div className={styles.stepBarWrap}>
          <StepBar current={step} />
        </div>

        <div className={styles.body}>
          {/* ── Step 0: Select Service ── */}
          {step === 0 && (
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>What can we help you with?</h3>
              <div className={styles.serviceGrid}>
                {SERVICES.map(s => (
                  <button
                    key={s.id}
                    className={`${styles.serviceCard} ${selectedService === s.id ? styles.serviceSelected : ''}`}
                    onClick={() => setSelectedService(s.id)}
                  >
                    <span className={styles.serviceEmoji}>
                      <s.icon size={22} color={selectedService === s.id ? '#1D4ED8' : '#475569'} />
                    </span>
                    <div>
                      <div className={styles.serviceLabel}>{s.label}</div>
                      <div className={styles.serviceDesc}>{s.desc}</div>
                    </div>
                    {selectedService === s.id && <CheckCircle size={18} color="#1D4ED8" className={styles.serviceCheck} />}
                  </button>
                ))}
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                disabled={!selectedService}
                onClick={() => setStep(1)}
              >
                Continue <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* ── Step 1: Date & Time ── */}
          {step === 1 && (
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Pick a date & time</h3>

              <div className={styles.daysRow}>
                {days.map(d => (
                  <button
                    key={d.toISOString()}
                    className={`${styles.dayCard} ${selectedDate?.toDateString() === d.toDateString() ? styles.daySelected : ''}`}
                    onClick={() => setSelectedDate(d)}
                  >
                    <span className={styles.dayName}>{d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                    <span className={styles.dayNum}>{d.getDate()}</span>
                    <span className={styles.dayMon}>{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
                  </button>
                ))}
              </div>

              {selectedDate && (
                <>
                  <div className={styles.timesLabel}>Available slots for <strong>{formatDate(selectedDate)}</strong></div>
                  <div className={styles.timesGrid}>
                    {TIME_SLOTS.map(t => (
                      <button
                        key={t}
                        className={`${styles.timeChip} ${selectedTime === t ? styles.timeSelected : ''}`}
                        onClick={() => setSelectedTime(t)}
                      >
                        <Clock size={13} /> {t}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className={styles.platformRow}>
                <div className={styles.platformLabel}>Meeting Platform</div>
                <div className={styles.platformChips}>
                  {MEETING_PLATFORMS.map(p => {
                    const PlatformIcon = p.icon;
                    return (
                      <button
                        key={p.id}
                        className={`${styles.platformChip} ${selectedPlatform === p.id ? styles.platformSelected : ''}`}
                        onClick={() => setSelectedPlatform(p.id)}
                      >
                        <PlatformIcon size={14} color={selectedPlatform === p.id ? '#1D4ED8' : '#64748B'} /> {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(2)}
              >
                Continue <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* ── Step 2: Your Details ── */}
          {step === 2 && (
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Your details</h3>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}><User size={14} /> Full Name <span className={styles.req}>*</span></label>
                  <input
                    className={styles.input}
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}><Mail size={14} /> Email Address <span className={styles.req}>*</span></label>
                  <input
                    type="email"
                    className={styles.input}
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}><Phone size={14} /> WhatsApp / Phone <span className={styles.req}>*</span></label>
                  <input
                    type="tel"
                    className={styles.input}
                    placeholder="e.g. 9876543210"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}><MessageSquare size={14} /> Brief Notes <span style={{ color: 'var(--text-dim)' }}>(optional)</span></label>
                  <textarea
                    className={styles.textarea}
                    rows={3}
                    placeholder="Tell us a bit about your project or questions..."
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  />
                </div>
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                onClick={() => {
                  if (!form.name.trim() || !form.email.match(/^\S+@\S+\.\S+$/) || !form.phone.trim()) {
                    setError('Please fill all required fields correctly.');
                    return;
                  }
                  setError('');
                  setStep(3);
                }}
              >
                Review Booking <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* ── Step 3: Confirm ── */}
          {step === 3 && (() => {
            const SelectedServiceIcon = SERVICES.find(s => s.id === selectedService)?.icon;
            const SelectedPlatformIcon = MEETING_PLATFORMS.find(p => p.id === selectedPlatform)?.icon;
            return (
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Confirm your appointment</h3>
                <div className={styles.confirmCard}>
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmKey}><Briefcase size={14} /> Service</span>
                    <span className={styles.confirmVal} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      {SelectedServiceIcon && <SelectedServiceIcon size={14} color="#1D4ED8" />}
                      {SERVICES.find(s => s.id === selectedService)?.label}
                    </span>
                  </div>
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmKey}><Calendar size={14} /> Date</span>
                    <span className={styles.confirmVal}>{formatDate(selectedDate)}</span>
                  </div>
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmKey}><Clock size={14} /> Time</span>
                    <span className={styles.confirmVal}>{selectedTime} IST</span>
                  </div>
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmKey}><Video size={14} /> Platform</span>
                    <span className={styles.confirmVal} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      {SelectedPlatformIcon && <SelectedPlatformIcon size={14} color="#1D4ED8" />}
                      {MEETING_PLATFORMS.find(p => p.id === selectedPlatform)?.label}
                    </span>
                  </div>
                  <div className={styles.divider} />
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmKey}><User size={14} /> Name</span>
                    <span className={styles.confirmVal}>{form.name}</span>
                  </div>
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmKey}><Mail size={14} /> Email</span>
                    <span className={styles.confirmVal}>{form.email}</span>
                  </div>
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmKey}><Phone size={14} /> Phone</span>
                    <span className={styles.confirmVal}>{form.phone}</span>
                  </div>
                </div>
                <div className={styles.confirmNote} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Mail size={16} color="#F59E0B" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>
                    A confirmation email with your <strong>{MEETING_PLATFORMS.find(p => p.id === selectedPlatform)?.label}</strong> link will be sent to your inbox.
                  </span>
                </div>
                {error && <div className={styles.error}>{error}</div>}
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? <><Loader2 size={16} className={styles.spin} /> Booking…</> : <>Confirm Appointment <CheckCircle size={18} /></>}
                </button>
              </div>
            );
          })()}
        </div>

        <div className={styles.footer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Shield size={12} color="#94A3B8" /> <span>100% Free · No commitment · NovaCraft Digital</span>
        </div>
      </div>
    </div>
  );
}
