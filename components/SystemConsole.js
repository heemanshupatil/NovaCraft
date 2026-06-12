'use client';
import { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, RefreshCw, Cpu, Database, Activity } from 'lucide-react';
import styles from './SystemConsole.module.css';

const LOG_TEMPLATES = [
  { prefix: '[INFO]', message: 'Initialized client sync handshake with Supabase cluster rkkaseekbthvwsdkivyf', color: '#60A5FA' },
  { prefix: '[RLS]', message: 'Enforcing column-level security filters on table schema "profiles"', color: '#34D399' },
  { prefix: '[DEPLOY]', message: 'Vercel Edge functions routing optimized for AP-SOUTH-1 region', color: '#818CF8' },
  { prefix: '[ANALYTICS]', message: 'Meta Graph API returned positive CTR growth: +14.2% on campaign NC-GROW', color: '#FBBF24' },
  { prefix: '[CONFIG]', message: 'UPI payment listener listening on channel public:payments:INSERT', color: '#F472B6' },
  { prefix: '[SYSTEM]', message: 'Optimizing static page assets: Next.js image optimization ratio 82% [OK]', color: '#34D399' },
  { prefix: '[MONITOR]', message: 'Database capacity status: 0.12 GB used / 0.50 GB free (SLA tier normal)', color: '#A78BFA' },
  { prefix: '[INFO]', message: 'E-mail dispatcher verified: Nodemailer SMTP relay online via SSL port 465', color: '#60A5FA' },
  { prefix: '[STAGE]', message: 'Auto-running unit tests: 34 assertions passed. Coverage: 98.4%', color: '#34D399' },
  { prefix: '[CRYPTO]', message: 'Bcrypt session token generation completed (salt: 12 rounds)', color: '#60A5FA' },
  { prefix: '[FILE]', message: 'Uploaded screenshot receipt NC-TR-924 to bucket "payment-screenshots"', color: '#FB7185' },
  { prefix: '[DISCORD]', message: 'Operational webhook fired: Customer lead submitted contact details', color: '#818CF8' }
];

export default function SystemConsole() {
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState({
    cpu: 12,
    net: 1.4,
    db: 24,
    uptime: '00:00:00'
  });
  const screenRef = useRef(null);

  // Populate initial logs on client-side mount to prevent SSR hydration mismatch
  useEffect(() => {
    const initialLogs = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const template = LOG_TEMPLATES[(i * 7) % LOG_TEMPLATES.length];
      const logTime = new Date(now.getTime() - (6 - i) * 8000);
      initialLogs.push({
        id: `init-${i}`,
        time: logTime.toLocaleTimeString('en-US', { hour12: false }),
        prefix: template.prefix,
        message: template.message,
        color: template.color
      });
    }
    setLogs(initialLogs);
  }, []);

  // Track uptime
  useEffect(() => {
    let seconds = 0;
    const uptimeTimer = setInterval(() => {
      seconds++;
      const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
      const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
      const secs = String(seconds % 60).padStart(2, '0');
      setMetrics(m => ({ ...m, uptime: `${hrs}:${mins}:${secs}` }));
    }, 1000);

    return () => clearInterval(uptimeTimer);
  }, []);

  // Append new logs dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      const newLog = {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        prefix: template.prefix,
        message: template.message,
        color: template.color
      };
      setLogs(prev => [...prev.slice(-30), newLog]); // Keep last 30 logs

      // Shift metrics slightly to look dynamic
      setMetrics(m => ({
        ...m,
        cpu: Math.max(8, Math.min(48, Math.floor(m.cpu + (Math.random() * 10 - 5)))),
        net: Math.max(0.5, Math.min(4.5, Number((m.net + (Math.random() * 0.8 - 0.4)).toFixed(1)))),
        db: Math.max(15, Math.min(85, Math.floor(m.db + (Math.random() * 6 - 3))))
      }));
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Auto scroll inner console screen container to bottom
  useEffect(() => {
    if (screenRef.current) {
      screenRef.current.scrollTop = screenRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <section className={styles.wrapper}>
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="section-tag" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#06B6D4' }}>
            Live System
          </div>
          <h2 className="display-lg">
            Our Digital <span style={{ background: 'linear-gradient(135deg, #06B6D4, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Lab in Action</span>
          </h2>
          <p className="body-lg" style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '12px auto 0' }}>
            We build transparently. Watch our background processes sync database schemas, deploy builds, and run real-time audits.
          </p>
        </div>

        {/* Futuristic Terminal Console */}
        <div className={styles.terminal}>
          {/* Top Window Bar */}
          <div className={styles.terminalHeader}>
            <div className={styles.dots}>
              <span className={`${styles.dot} ${styles.red}`} />
              <span className={`${styles.dot} ${styles.yellow}`} />
              <span className={`${styles.dot} ${styles.green}`} />
            </div>
            <div className={styles.terminalTitle}>
              <Terminal size={14} /> core-engine-relay.sh (sh_node_ap-south)
            </div>
            <div className={styles.statusGroup}>
              <span className={styles.pulseDot} />
              <span className={styles.statusText}>ENGINE ACTIVE</span>
            </div>
          </div>

          {/* Terminal Screen Output */}
          <div className={styles.terminalScreen} ref={screenRef}>
            <div className={styles.welcomeText}>
              <div>NOVACRAFT OS v16.2.7-LTS (x86_64-pc-linux-gnu)</div>
              <div>Welcome to the core service console. Uptime telemetry enabled.</div>
              <div>----------------------------------------------------------------------</div>
            </div>

            <div className={styles.logContainer}>
              {logs.map(log => (
                <div key={log.id} className={styles.logRow}>
                  <span className={styles.logTime}>[{log.time}]</span>{' '}
                  <span className={styles.logPrefix} style={{ color: log.color }}>{log.prefix}:</span>{' '}
                  <span className={styles.logMsg}>{log.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Metrics Dashboard Grid */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <Cpu size={16} color="#06B6D4" />
                <span>CPU Load</span>
              </div>
              <div className={styles.metricVal}>{metrics.cpu}%</div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${metrics.cpu}%`, background: '#06B6D4' }} />
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <Activity size={16} color="#7C3AED" />
                <span>Bandwidth</span>
              </div>
              <div className={styles.metricVal}>{metrics.net} MB/s</div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${(metrics.net / 5) * 100}%`, background: '#7C3AED' }} />
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <Database size={16} color="#FBBF24" />
                <span>Supabase Conns</span>
              </div>
              <div className={styles.metricVal}>{metrics.db}/100</div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${metrics.db}%`, background: '#FBBF24' }} />
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <Shield size={16} color="#34D399" />
                <span>Engine Uptime</span>
              </div>
              <div className={styles.metricVal} style={{ fontFamily: 'monospace', color: '#34D399' }}>{metrics.uptime}</div>
              <div className={styles.metricDesc}>SECURE CHANNEL</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
