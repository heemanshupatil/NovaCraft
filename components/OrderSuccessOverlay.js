'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Download, ArrowRight, X, Shield, Phone } from 'lucide-react';
import styles from './OrderSuccessOverlay.module.css';

// ─── PDF Receipt Generator ────────────────────────────────────────────────────
function generateReceiptHTML(order) {
  const now        = new Date();
  const dateStr    = now.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr    = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const gst        = Math.round((parseInt(order.plan.price.replace(/,/g, '')) * 0.18));
  const subtotal   = parseInt(order.plan.price.replace(/,/g, ''));
  const totalINR   = (subtotal + gst).toLocaleString('en-IN');
  const subtotalFmt = subtotal.toLocaleString('en-IN');
  const gstFmt     = gst.toLocaleString('en-IN');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Invoice ${order.orderId} — NovaCraft Digital</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #fff;
      color: #0F172A;
      padding: 40px;
      max-width: 780px;
      margin: 0 auto;
      position: relative;
    }
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 5rem;
      font-weight: 900;
      color: rgba(29, 78, 216, 0.05);
      white-space: nowrap;
      pointer-events: none;
      z-index: -1;
      user-select: none;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 28px;
      border-bottom: 3px solid #1D4ED8;
      margin-bottom: 32px;
    }
    .logo { font-size: 2rem; font-weight: 900; letter-spacing: -0.03em; }
    .logo-nova { color: #0F172A; }
    .logo-craft { color: #1D4ED8; }
    .invoice-badge {
      text-align: right;
    }
    .invoice-title {
      font-size: 1.4rem; font-weight: 800;
      color: #1D4ED8; letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .invoice-id {
      font-size: 0.85rem; color: #64748B;
      font-weight: 600; margin-top: 4px;
    }

    /* Details grid */
    .info-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }
    .info-block h4 {
      font-size: 0.7rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.1em;
      color: #94A3B8; margin-bottom: 8px;
    }
    .info-block p { font-size: 0.875rem; line-height: 1.7; color: #334155; }
    .info-block strong { color: #0F172A; font-size: 0.95rem; }

    /* Table */
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead tr { background: #1D4ED8; color: white; }
    thead th {
      padding: 12px 16px; text-align: left;
      font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    tbody tr { border-bottom: 1px solid #F1F5F9; }
    tbody tr:last-child { border-bottom: none; }
    tbody td { padding: 14px 16px; font-size: 0.875rem; color: #334155; }
    tbody tr:nth-child(even) { background: #F8FAFC; }

    /* Totals */
    .totals {
      margin-left: auto;
      width: 280px;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 32px;
    }
    .total-row {
      display: flex; justify-content: space-between;
      padding: 10px 16px; font-size: 0.875rem;
      border-bottom: 1px solid #F1F5F9;
    }
    .total-row:last-child {
      border-bottom: none;
      background: #1D4ED8; color: white;
      font-weight: 800; font-size: 1rem;
    }
    .total-row span:last-child { font-weight: 700; }

    /* PAID stamp */
    .paid-stamp {
      display: inline-block;
      border: 4px solid #22C55E;
      border-radius: 10px;
      padding: 6px 20px;
      color: #16A34A;
      font-size: 1.4rem;
      font-weight: 900;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      transform: rotate(-5deg);
      margin-bottom: 24px;
      opacity: 0.85;
    }

    /* Verification */
    .verify-box {
      background: #F0FDF4;
      border: 1.5px solid #86EFAC;
      border-radius: 12px;
      padding: 18px 20px;
      display: flex; align-items: flex-start; gap: 14px;
      margin-bottom: 32px;
    }
    .verify-icon { font-size: 1.4rem; }
    .verify-text h4 { font-size: 0.875rem; font-weight: 700; color: #15803D; margin-bottom: 4px; }
    .verify-text p  { font-size: 0.8rem; color: #166534; line-height: 1.55; }

    /* Footer */
    .footer {
      border-top: 1px solid #E2E8F0;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
      color: #94A3B8;
    }
    .footer a { color: #1D4ED8; text-decoration: none; }

    @media print {
      body { padding: 24px; }
      @page { margin: 0; }
    }
  </style>
</head>
<body>
  <!-- Watermark -->
  <div class="watermark">NovaCraft</div>

  <!-- Header -->
  <div class="header">
    <div>
      <div class="logo">
        <span class="logo-nova">Nova</span><span class="logo-craft">Craft</span>
      </div>
      <p style="font-size:0.78rem;color:#64748B;margin-top:4px;">
        hello@novacraft.digital &nbsp;|&nbsp; 7875652144<br>
        Available Worldwide
      </p>
    </div>
    <div class="invoice-badge">
      <div class="invoice-title">Tax Invoice</div>
      <div class="invoice-id"># ${order.orderId}</div>
      <p style="font-size:0.75rem;color:#94A3B8;margin-top:6px;">${dateStr} at ${timeStr}</p>
    </div>
  </div>

  <!-- Info -->
  <div class="info-row">
    <div class="info-block">
      <h4>Billed To</h4>
      <p>
        <strong>Valued Client</strong><br>
        NovaCraft Digital Customer<br>
        Order placed via website
      </p>
    </div>
    <div class="info-block">
      <h4>Payment Info</h4>
      <p>
        <strong>Method:</strong> UPI Payment<br>
        <strong>Transaction ID:</strong> ${order.txnId}<br>
        <strong>Status:</strong> <span style="color:#16A34A;font-weight:700;">✓ Verified</span>
      </p>
    </div>
  </div>

  <!-- Line Items -->
  <table>
    <thead>
      <tr>
        <th>Service</th>
        <th>Plan</th>
        <th>Type</th>
        <th style="text-align:right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${order.plan.category}</td>
        <td><strong>${order.plan.name} Plan</strong></td>
        <td>${order.plan.duration}</td>
        <td style="text-align:right;">₹${subtotalFmt}</td>
      </tr>
    </tbody>
  </table>

  <!-- Totals -->
  <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:28px;">
    <div class="paid-stamp">✓ PAID</div>
    <div class="totals">
      <div class="total-row"><span>Subtotal</span><span>₹${subtotalFmt}</span></div>
      <div class="total-row"><span>GST (18%)</span><span>₹${gstFmt}</span></div>
      <div class="total-row"><span>Total Paid</span><span>₹${totalINR}</span></div>
    </div>
  </div>

  <!-- Verified badge -->
  <div class="verify-box">
    <div class="verify-icon" style="font-size: 1.2rem; color: #16A34A;">✓</div>
    <div class="verify-text">
      <h4>Payment Request Received — NovaCraft Digital</h4>
      <p>
        This invoice confirms that a payment request of ₹${totalINR} (incl. GST) has been received
        for order <strong>${order.orderId}</strong>.
        Our team will verify your UPI payment and contact you within <strong>12 hours</strong> to confirm
        your order and discuss next steps.
        Please keep this document and your Transaction ID for reference.
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div>
      <strong>NovaCraft Digital</strong> &nbsp;·&nbsp;
      <a href="https://novacraft.digital">novacraft.digital</a>
    </div>
    <div>Thank you for choosing us!</div>
  </div>

  <script>window.onload = () => window.print();</script>
</body>
</html>`;
}

// ─── Confetti particle ────────────────────────────────────────────────────────
const COLORS = ['#1D4ED8','#F59E0B','#22C55E','#EC4899','#8B5CF6','#06B6D4','#F97316'];
function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => {
    const r1 = ((i * 17) % 100) / 100;
    const r2 = ((i * 29) % 150) / 100;
    const r3 = 2.5 + ((i * 41) % 200) / 100;
    const r4 = 6 + ((i * 53) % 80) / 10;
    return {
      id:    i,
      color: COLORS[i % COLORS.length],
      left:  `${r1 * 100}%`,
      delay: `${r2}s`,
      dur:   `${r3}s`,
      size:  `${r4}px`,
      shape: i % 3 === 0 ? 'circle' : 'square',
    };
  });
  return (
    <div className={styles.confettiWrap} aria-hidden="true">
      {pieces.map(p => (
        <span key={p.id} className={styles.confettiPiece} style={{
          left: p.left,
          background: p.color,
          width: p.size, height: p.size,
          borderRadius: p.shape === 'circle' ? '50%' : '2px',
          animationDelay: p.delay,
          animationDuration: p.dur,
        }} />
      ))}
    </div>
  );
}

// ─── Main Overlay ─────────────────────────────────────────────────────────────
export default function OrderSuccessOverlay({ order, onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // slight delay so CSS transition plays
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 350);
  };

  const downloadReceipt = () => {
    const html = generateReceiptHTML(order);
    const win  = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  return (
    <div className={`${styles.overlay} ${show ? styles.overlayVisible : ''}`}>
      <Confetti />

      <div className={`${styles.card} ${show ? styles.cardVisible : ''}`}>
        {/* Close */}
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* Icon */}
        <div className={styles.iconRing}>
          <CheckCircle size={56} color="#22C55E" strokeWidth={1.8} />
        </div>

        {/* Headline */}
        <h1 className={styles.title}>Request Received!</h1>
        <p className={styles.subtitle}>
          We have received your payment request. Our team will <strong>verify your payment</strong> and
          contact you within <strong>12 hours</strong> regarding your order.
        </p>

        {/* Order Details */}
        <div className={styles.detailsCard}>
          <div className={styles.verifiedBadge}>
            <Shield size={14} /> Payment Verified ✓
          </div>
          <div className={styles.detailsGrid}>
            <div className={styles.detailRow}>
              <span>Plan</span>
              <strong>{order.plan.name} — {order.plan.category}</strong>
            </div>
            <div className={styles.detailRow}>
              <span>Amount Paid</span>
              <strong>₹{order.plan.price}</strong>
            </div>
            <div className={styles.detailRow}>
              <span>Transaction ID</span>
              <strong className={styles.mono}>{order.txnId}</strong>
            </div>
            <div className={styles.detailRow}>
              <span>Order ID</span>
              <strong className={styles.mono}>{order.orderId}</strong>
            </div>
            <div className={styles.detailRow}>
              <span>Status</span>
              <span className={styles.statusPill}><CheckCircle size={12} /> Confirmed</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.downloadBtn} onClick={downloadReceipt}>
            <Download size={18} /> Download Invoice / Receipt
          </button>
          <Link href="/contact" className={`btn btn-outline ${styles.contactBtn}`}>
            <Phone size={16} /> Talk to Our Team
          </Link>
        </div>

        <p className={styles.note}>
          📋 Keep your <strong>Order ID ({order.orderId})</strong> and <strong>Transaction ID</strong> handy —
          our team will reference these when they contact you.
        </p>

        <button className={styles.doneBtn} onClick={handleClose}>
          Done — Back to Website <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
