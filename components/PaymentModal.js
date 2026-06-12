'use client';
import { useEffect, useRef, useState } from 'react';
import {
  X, Copy, CheckCircle, Smartphone, ArrowRight,
  Shield, Clock, AlertCircle, RefreshCw, ChevronLeft, Upload, FileText, Rocket
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import styles from './PaymentModal.module.css';

// ✏️ UPDATE with your real UPI ID
const UPI_ID = '7875652144-2@ybl';
const MERCHANT_NAME = 'NovaCraft Digital';

function buildUpiUrl(amount, note) {
  return `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
}
function buildQrUrl(upiUrl) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&color=1D4ED8&bgcolor=FFFFFF&data=${encodeURIComponent(upiUrl)}`;
}
function generateOrderId() {
  return 'NC-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
}

const STEPS = ['Review', 'Pay', 'Confirm', 'Done'];

function StepBar({ current }) {
  return (
    <div className={styles.stepBar}>
      {STEPS.map((label, i) => (
        <div key={label} className={styles.stepItem}>
          <div className={`${styles.stepDot} ${i < current ? styles.stepDone : ''} ${i === current ? styles.stepActive : ''}`}>
            {i < current ? <CheckCircle size={13} /> : <span>{i + 1}</span>}
          </div>
          <span className={`${styles.stepLabel} ${i === current ? styles.stepLabelActive : ''}`}>{label}</span>
          {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < current ? styles.stepLineDone : ''}`} />}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1 : Plan Review ────────────────────────────────────────────────────
function StepReview({ plan, onNext }) {
  return (
    <div className={styles.stepContent}>
      <div className={styles.reviewCard}>
        <div className={styles.reviewIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Rocket size={36} color="#1D4ED8" />
        </div>
        <h3 className={styles.reviewPlan}>{plan.name} Plan</h3>
        <p className={styles.reviewCat}>{plan.category}</p>
        <div className={styles.reviewAmount}>
          <span className={styles.reviewCurrency}>₹</span>
          {plan.price}
          <span className={styles.reviewDur}>/{plan.duration}</span>
        </div>
        <ul className={styles.reviewFeatures}>
          {plan.features.slice(0, 5).map(f => (
            <li key={f}><CheckCircle size={14} color="#22c55e" /> {f}</li>
          ))}
          {plan.features.length > 5 && (
            <li className={styles.reviewMore}>+ {plan.features.length - 5} more features</li>
          )}
        </ul>
      </div>
      <div className={styles.reviewTrust}>
        <span className={styles.secureGlowRed}>
          <Shield size={13} /> Secure UPI Payment
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={13} /> 24-hr Project Start
        </span>
      </div>
      <button className={`btn btn-primary ${styles.fullBtn}`} onClick={onNext}>
        Proceed to Payment <ArrowRight size={17} />
      </button>
    </div>
  );
}

// ─── Step 2 : QR & Pay ───────────────────────────────────────────────────────
function StepPay({ plan, onNext }) {
  const [copied, setCopied] = useState(false);
  const rawAmount = plan?.price?.replace(/,/g, '') ?? '0';
  const upiUrl = buildUpiUrl(rawAmount, `${plan?.name} - ${plan?.category}`);
  const qrUrl = buildQrUrl(upiUrl);

  const copyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.qrWrap}>
        <img src={qrUrl} alt="UPI QR Code" width={240} height={240} className={styles.qr} />
        <div className={styles.qrBadge}><Smartphone size={12} /> Scan with any UPI app</div>
      </div>

      <div className={styles.appRow}>
        {['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay'].map(a => (
          <span key={a} className={styles.appChip}>{a}</span>
        ))}
      </div>

      <div className={styles.divider}><span>or pay to UPI ID</span></div>

      <div className={styles.upiBox}>
        <span className={styles.upiId}>{UPI_ID}</span>
        <button className={styles.copyBtn} onClick={copyUpi}>
          {copied ? <CheckCircle size={15} color="#22C55E" /> : <Copy size={15} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className={styles.amountTag}>
        Amount to pay: <strong>₹{plan.price}</strong>
      </div>

      <button className={`btn btn-primary ${styles.fullBtn}`} onClick={onNext}>
        I&apos;ve Paid — Submit Receipt <ArrowRight size={17} />
      </button>
      <p className={styles.hintText}>Only proceed after payment is confirmed in your UPI app.</p>
    </div>
  );
}

// ─── Step 3 : Payment Details & Screenshot Upload ──────────────────────────
function StepConfirm({ plan, onVerify }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  // Form states
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [utrId, setUtrId] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  // Sync auth context if it resolves late
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setFullName(prev => prev || user.name || '');
        setEmail(prev => prev || user.email || '');
      }, 0);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG/JPG).');
      return;
    }

    // Validate size limit (3MB)
    if (file.size > 3 * 1024 * 1024) {
      setError('File size exceeds the 3MB limit.');
      return;
    }

    setScreenshotFile(file);
    setError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError('File must be smaller than 3MB.');
      return;
    }
    setScreenshotFile(file);
    setError('');
  };

  const validate = () => {
    if (!user) return 'You must be signed in to submit a payment request.';
    if (!fullName.trim()) return 'Please enter your Full Name.';
    if (!email.match(/^\S+@\S+\.\S+$/)) return 'Please enter a valid email address.';
    if (!phone.trim() || phone.length < 10) return 'Please enter a valid 10-digit Phone Number.';
    if (!utrId.trim() || utrId.trim().length < 6) return 'Please enter a valid Transaction / UTR ID.';
    if (!screenshotFile) return 'Please upload your transaction screenshot.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setError('');
    setLoading(true);
    setUploadProgress('Uploading screenshot...');

    try {
      // 1. Upload screenshot to Supabase Storage
      const cleanFileName = `${Date.now()}_${screenshotFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = `screenshots/${user.id}/${cleanFileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(filePath, screenshotFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      setUploadProgress('Saving payment record...');

      // 2. Fetch public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-screenshots')
        .getPublicUrl(filePath);

      // 3. Create database payment request
      const rawPrice = parseFloat(plan.price.replace(/,/g, ''));
      const { data: insertData, error: insertError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          amount: rawPrice,
          utr_id: utrId.trim(),
          screenshot_url: publicUrl,
          plan_name: plan.name,
          plan_category: plan.category,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) {
        // Cleanup uploaded screenshot if database insert fails
        await supabase.storage.from('payment-screenshots').remove([filePath]);
        throw new Error(insertError.message.includes('unique') ? 'This UTR ID has already been submitted.' : insertError.message);
      }

      setLoading(false);
      onVerify({ 
        txnId: utrId.trim(), 
        fullName: fullName.trim(),
        screenshotUrl: publicUrl
      });
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.stepContent}>
      {loading ? (
        <div className={styles.verifyingState}>
          <div className={styles.verifySpinner} />
          <h3>Submitting Request…</h3>
          <p>{uploadProgress}</p>
          <div className={styles.verifySteps}>
            <VerifyRow label="Uploading receipt screenshot" delay={0} />
            <VerifyRow label="Registering transaction details" delay={1000} />
            <VerifyRow label="Saving progress to dashboard" delay={2000} />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.txnForm}>
          <div className={styles.txnHeader}>
            <Shield size={28} color="#1D4ED8" />
            <h3>Submit Payment Details</h3>
            <p>Upload your UPI receipt to verify and activate your plan.</p>
          </div>

          {!user && (
            <div className={styles.errorBox}>
              <AlertCircle size={15} /> You must be signed in to submit payments. <a href="/login" style={{ color: 'inherit', fontWeight: 'bold', textDecoration: 'underline' }}>Login here →</a>
            </div>
          )}

          {/* Full Name */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Full Name <span className={styles.req}>*</span></label>
            <input
              className={styles.txnInput}
              placeholder="Enter your name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Email & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Email Address <span className={styles.req}>*</span></label>
              <input
                type="email"
                className={styles.txnInput}
                style={{ background: 'var(--bg-2)', cursor: 'not-allowed', color: 'var(--text-dim)' }}
                value={email}
                disabled={true}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Phone Number <span className={styles.req}>*</span></label>
              <input
                type="tel"
                className={styles.txnInput}
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Transaction UTR ID */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Transaction / UTR ID <span className={styles.req}>*</span></label>
            <input
              className={styles.txnInput}
              placeholder="12-digit UTR No. (e.g. 426831920571)"
              value={utrId}
              onChange={e => { setUtrId(e.target.value); setError(''); }}
              disabled={loading}
              autoComplete="off"
            />
          </div>

          {/* Screenshot Upload Drop Zone */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Screenshot Receipt <span className={styles.req}>*</span></label>
            <input
              type="file"
              accept="image/*"
              className={styles.fileInput}
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={loading}
            />
            
            {screenshotFile ? (
              <div className={styles.fileSelected}>
                <FileText size={16} />
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                  {screenshotFile.name}
                </span>
                <button 
                  type="button" 
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 'bold' }}
                  onClick={() => setScreenshotFile(null)}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div 
                className={styles.fileInputWrap} 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload size={22} color="#64748B" />
                <span className={styles.fileBtn}>Choose Screenshot</span>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>PNG or JPG, maximum 3MB</span>
              </div>
            )}
          </div>

          <div className={styles.txnAmountRow}>
            <span>Amount paid:</span>
            <strong>₹{plan.price}</strong>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <button 
            type="submit" 
            className={`btn btn-primary ${styles.fullBtn}`}
            disabled={loading || !user}
          >
            Submit Payment Request <ArrowRight size={17} />
          </button>
        </form>
      )}
    </div>
  );
}

function VerifyRow({ label, delay }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), delay + 800);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div className={`${styles.verifyRow} ${done ? styles.verifyRowDone : ''}`}>
      {done ? <CheckCircle size={15} color="#22c55e" /> : <RefreshCw size={15} className={styles.spin} />}
      <span>{label}</span>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function PaymentModal({ plan, onClose, onPaymentSuccess }) {
  const [step, setStep] = useState(0); 
  const [orderId] = useState(generateOrderId);
  const overlayRef = useRef(null);

  const handleOverlay = (e) => { if (e.target === overlayRef.current) onClose(); };

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  if (!plan) return null;

  const handleVerify = ({ txnId, screenshotUrl }) => {
    onClose();
    if (onPaymentSuccess) {
      onPaymentSuccess({ 
        txnId, 
        orderId, 
        plan, 
        screenshotUrl 
      });
    }
  };

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleOverlay}>
      <div className={styles.modal}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            {step > 0 && step < 3 && (
              <button className={styles.backBtn} onClick={() => setStep(s => s - 1)} aria-label="Back">
                <ChevronLeft size={18} />
              </button>
            )}
            <div>
              <div className={styles.planLabel}>{plan.category} · {plan.name}</div>
              <div className={styles.planPrice}>₹{plan.price}</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        {/* Step Bar */}
        <div className={styles.stepBarWrap}>
          <StepBar current={step} />
        </div>

        {/* Step Content */}
        {step === 0 && <StepReview plan={plan} onNext={() => setStep(1)} />}
        {step === 1 && <StepPay plan={plan} onNext={() => setStep(2)} />}
        {step === 2 && <StepConfirm plan={plan} onVerify={handleVerify} />}

        {/* Footer */}
        <div className={styles.modalFooter} style={{ flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span className={styles.secureGlowRed}>
              <Shield size={13} /> 100% Secure
            </span>
            <span style={{ color: '#CBD5E1' }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Questions? <a href="/contact" className={styles.footerLink}>Contact us</a>
            </span>
          </div>
          <div style={{ fontSize: '0.7rem' }}>
            <a href="/privacy" className={styles.footerLink}>Privacy & Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}
