'use client';
import { useState } from 'react';
import {
  Search, CheckCircle, Clock, AlertCircle, MessageSquare,
  ChevronRight, RefreshCw, Mail, Calendar, LifeBuoy, Inbox
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './RequestTracker.module.css';

const STATUS_CONFIG = {
  'Open': {
    label: 'Open',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    icon: Clock,
    step: 1,
    desc: "We have received your message and it's in our queue.",
  },
  'Under Review': {
    label: 'Under Review',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.25)',
    icon: RefreshCw,
    step: 2,
    desc: 'Our team is actively reviewing your request.',
  },
  'Resolved': {
    label: 'Resolved',
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.25)',
    icon: CheckCircle,
    step: 3,
    desc: 'Your request has been resolved. Check the reply below.',
  },
};

const STEPS = [
  { key: 'Open',         label: 'Received',    icon: Inbox },
  { key: 'Under Review', label: 'Under Review', icon: RefreshCw },
  { key: 'Resolved',     label: 'Resolved',    icon: CheckCircle },
];

function StatusTimeline({ status }) {
  const currentStep = STATUS_CONFIG[status]?.step ?? 1;
  return (
    <div className={styles.timeline}>
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const isDone    = i + 1 < currentStep;
        const isActive  = i + 1 === currentStep;
        const isPending = i + 1 > currentStep;
        return (
          <div key={step.key} className={styles.timelineItem}>
            <div className={styles.timelineLeft}>
              <div
                className={`${styles.timelineDot} ${isDone ? styles.dotDone : ''} ${isActive ? styles.dotActive : ''} ${isPending ? styles.dotPending : ''}`}
              >
                <Icon size={14} />
              </div>
              {i < STEPS.length - 1 && (
                <div className={`${styles.timelineLine} ${isDone ? styles.lineDone : ''}`} />
              )}
            </div>
            <div className={styles.timelineContent}>
              <span className={`${styles.timelineLabel} ${isActive ? styles.timelineLabelActive : ''} ${isPending ? styles.timelineLabelPending : ''}`}>
                {step.label}
              </span>
              {isActive && (
                <span className={styles.timelineActivePill}>Current</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RequestCard({ msg }) {
  const cfg = STATUS_CONFIG[msg.status] || STATUS_CONFIG['Open'];
  const Icon = cfg.icon;
  const dateStr = new Date(msg.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className={styles.card}>
      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.cardMeta}>
          <span className={styles.cardId}>
            <MessageSquare size={13} />
            MSG-{msg.id.slice(0, 8).toUpperCase()}
          </span>
          <span className={styles.cardDate}>
            <Calendar size={13} /> {dateStr}
          </span>
        </div>
        <span
          className={styles.statusBadge}
          style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
        >
          <Icon size={13} /> {cfg.label}
        </span>
      </div>

      {/* Service & Message */}
      <div className={styles.cardBody}>
        {msg.service && (
          <div className={styles.serviceTag}>
            <LifeBuoy size={13} /> {msg.service}
          </div>
        )}
        <p className={styles.messagePreview}>"{msg.message}"</p>
      </div>

      {/* Timeline */}
      <StatusTimeline status={msg.status} />

      {/* Admin Reply */}
      {msg.admin_reply && (
        <div className={styles.replyBox}>
          <div className={styles.replyHeader}>
            <CheckCircle size={14} color="#22C55E" />
            <span>Reply from NovaCraft Digital</span>
            {msg.reply_date && (
              <span className={styles.replyDate}>
                {new Date(msg.reply_date).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short'
                })}
              </span>
            )}
          </div>
          <p className={styles.replyText}>{msg.admin_reply}</p>
        </div>
      )}
    </div>
  );
}

export default function RequestTracker() {
  const [email, setEmail]   = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    setSearched(false);

    try {
      const { data, error: dbError } = await supabase
        .from('messages')
        .select('id, name, service, message, status, admin_reply, reply_date, created_at')
        .eq('email', email.trim().toLowerCase())
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setResults(data || []);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setResults(null);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Search size={22} color="#1D4ED8" />
        </div>
        <div>
          <h3 className={styles.title}>Track Your Request</h3>
          <p className={styles.subtitle}>
            Enter your email to view live status of your support requests.
          </p>
        </div>
      </div>

      {/* Search Form */}
      <form className={styles.searchForm} onSubmit={handleSearch}>
        <div className={styles.inputWrap}>
          <Mail size={16} className={styles.inputIcon} />
          <input
            type="email"
            className={styles.input}
            placeholder="your@email.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
          />
        </div>
        <button
          type="submit"
          className={styles.searchBtn}
          disabled={loading}
        >
          {loading ? (
            <RefreshCw size={16} className={styles.spin} />
          ) : (
            <><Search size={16} /> Track</>
          )}
        </button>
      </form>

      {error && (
        <div className={styles.errorBox}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {/* Results */}
      {searched && results !== null && (
        results.length === 0 ? (
          <div className={styles.empty}>
            <Inbox size={40} color="#CBD5E1" />
            <p>No requests found for this email.</p>
            <span>Double-check the email you used when submitting the form.</span>
          </div>
        ) : (
          <div className={styles.results}>
            <div className={styles.resultsMeta}>
              <span>{results.length} request{results.length > 1 ? 's' : ''} found</span>
              <ChevronRight size={14} />
            </div>
            {results.map(msg => (
              <RequestCard key={msg.id} msg={msg} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
