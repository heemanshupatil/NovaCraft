'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Check, Zap, ArrowRight, Star, FileText, RefreshCw, Phone } from 'lucide-react';
import styles from './pricing.module.css';
import PaymentModal from '@/components/PaymentModal';
import OrderSuccessOverlay from '@/components/OrderSuccessOverlay';
import LoginPromptModal from '@/components/LoginPromptModal';
import { useAuth } from '@/components/AuthProvider';
import ScopeCalculator from '@/components/ScopeCalculator';

const webPlans = [
  {
    name: 'Starter',
    category: 'Web Development',
    price: '14,999',
    duration: 'one-time',
    desc: 'Perfect for freelancers, local businesses, and personal brands getting started online.',
    highlight: false,
    badge: null,
    features: [
      '5-page responsive website',
      'Mobile-friendly design',
      'Contact form',
      'Basic SEO setup',
      'Google Maps integration',
      '1 round of revisions',
      '1 month free support',
      'Hosting guidance',
    ],
    cta: 'Get Started',
    showPayment: true,
  },
  {
    name: 'Growth',
    category: 'Web Development',
    price: '34,999',
    duration: 'one-time',
    desc: 'For growing businesses that need a powerful website with more pages and features.',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Up to 10 pages',
      'Premium custom design',
      'Blog / News section',
      'Advanced SEO optimization',
      'WhatsApp chat integration',
      'Speed & performance optimization',
      '3 rounds of revisions',
      '3 months free support',
      'Social media links setup',
      'Analytics dashboard',
    ],
    cta: 'Get Started',
    showPayment: true,
  },
  {
    name: 'Premium',
    category: 'Web Development',
    price: '74,999',
    duration: 'one-time',
    desc: 'Full custom web application for businesses that need advanced functionality.',
    highlight: false,
    badge: null,
    features: [
      'Unlimited pages',
      'Full custom UI/UX design',
      'eCommerce / booking system',
      'Payment gateway integration',
      'Admin dashboard',
      'User login & accounts',
      'Advanced SEO + sitemap',
      'Unlimited revisions',
      '6 months free support',
      'Priority delivery',
    ],
    cta: 'Contact Us',
    showPayment: false,
  },
];

const socialPlans = [
  {
    name: 'Basic',
    category: 'Social Media Marketing',
    price: '9,999',
    duration: 'per month',
    desc: 'Ideal for businesses that want a consistent social presence without the hassle.',
    highlight: false,
    badge: null,
    features: [
      '2 platforms (Instagram + Facebook)',
      '12 posts per month',
      'Basic graphic design',
      'Caption & hashtag writing',
      'Monthly performance report',
      '1 story per week',
    ],
    cta: 'Get Started',
    showPayment: true,
  },
  {
    name: 'Pro',
    category: 'Social Media Marketing',
    price: '19,999',
    duration: 'per month',
    desc: 'For brands serious about growing their audience and driving real engagement.',
    highlight: true,
    badge: 'Best Value',
    features: [
      '3 platforms',
      '20 posts per month',
      'Premium graphic design',
      'Reels / Short videos (4/month)',
      'Community management',
      'Hashtag & SEO strategy',
      'Bi-weekly performance report',
      'Competitor analysis',
      'Story highlights setup',
    ],
    cta: 'Get Started',
    showPayment: true,
  },
  {
    name: 'Enterprise',
    category: 'Social Media Marketing',
    price: '39,999',
    duration: 'per month',
    desc: 'Complete social media domination — content, ads, and growth strategy combined.',
    highlight: false,
    badge: null,
    features: [
      'All platforms (4+)',
      '30+ posts per month',
      'Professional photo/video editing',
      'Reels / Shorts (8/month)',
      'Paid ad management',
      'Influencer outreach',
      'Weekly reports',
      'Dedicated account manager',
      'Brand strategy consulting',
    ],
    cta: 'Contact Us',
    showPayment: false,
  },
];

function PlanCard({ plan, onPay }) {
  return (
    <div className={`${styles.card} ${plan.highlight ? styles.highlighted : ''}`}>
      {plan.badge && (
        <div className={styles.badge}>
          <Star size={12} fill="currentColor" /> {plan.badge}
        </div>
      )}
      <div className={styles.cardTop}>
        <h3 className={styles.planName}>{plan.name}</h3>
        <div className={styles.price}>
          <span className={styles.currency}>₹</span>
          <span className={styles.amount}>{plan.price}</span>
          <span className={styles.dur}>/{plan.duration}</span>
        </div>
        <p className={styles.desc}>{plan.desc}</p>
      </div>
      <ul className={styles.features}>
        {plan.features.map(f => (
          <li key={f} className={styles.feature}>
            <div className={`${styles.check} ${plan.highlight ? styles.checkHighlight : ''}`}>
              <Check size={12} />
            </div>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {plan.showPayment ? (
        <button
          className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline'} ${styles.cta}`}
          onClick={() => onPay(plan)}
        >
          {plan.cta} — Pay Now <ArrowRight size={16} />
        </button>
      ) : (
        <Link href="/contact" className={`btn btn-outline ${styles.cta}`}>
          {plan.cta} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}

// localStorage helper
const saveOrder = (order, userEmail, userName) => {
  try {
    const existing = JSON.parse(localStorage.getItem('nc_orders') || '[]');
    existing.unshift({
      orderId: order.orderId,
      txnId: order.txnId,
      plan: order.plan,
      userEmail,
      userName,
      date: new Date().toISOString(),
      status: 'confirmed',
    });
    localStorage.setItem('nc_orders', JSON.stringify(existing));
  } catch { /* ignore */ }
};

export default function PricingPage() {
  const { user } = useAuth();
  const [tab, setTab]                   = useState('web');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [loginPrompt, setLoginPrompt]   = useState(false);

  const plans = tab === 'web' ? webPlans : socialPlans;

  // Auth-gated: open payment modal only if logged in
  const handlePay = (plan) => {
    if (!user) { setLoginPrompt(true); return; }
    setSelectedPlan(plan);
  };


  return (
    <>
      {/* Login prompt — for unauthenticated users */}
      {loginPrompt && (
        <LoginPromptModal
          action="make a payment"
          onClose={() => setLoginPrompt(false)}
        />
      )}

      {/* Order Success Overlay — shown after payment verified */}
      {completedOrder && (
        <OrderSuccessOverlay
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
        />
      )}

      {/* UPI Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onPaymentSuccess={(order) => {
            setSelectedPlan(null);
            // Save order to localStorage for dashboard/admin
            if (user) saveOrder(order, user.email, user.name);
            setCompletedOrder(order);
          }}
        />
      )}

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className="container-narrow" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="section-tag"><Zap size={13} /> Transparent Pricing</div>
          <h1 className="display-lg" style={{ color: 'var(--text)', marginBottom: '16px' }}>
            Simple, <span className="gradient-text">Honest Pricing</span>
          </h1>
          <p className="body-lg" style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 40px' }}>
            No hidden fees, no surprises. Choose a plan, scan & pay instantly via UPI — and we get to work.
          </p>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'web' ? styles.tabActive : ''}`}
              onClick={() => setTab('web')}
            >
              Web Development
            </button>
            <button
              className={`${styles.tab} ${tab === 'social' ? styles.tabActive : ''}`}
              onClick={() => setTab('social')}
            >
              Social Media Marketing
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="section" style={{ paddingTop: '40px' }}>
        <div className="container">
          <div className={styles.grid}>
            {plans.map(plan => (
              <PlanCard key={plan.name} plan={plan} onPay={handlePay} />
            ))}
          </div>
          <p className={styles.note}>
            * All prices are in Indian Rupees (INR) + 18% GST applicable. Enterprise or custom needs?{' '}
            <Link href="/contact" style={{ color: 'var(--primary)', fontWeight: 600 }}>Contact us</Link> for a quote.
          </p>

          <ScopeCalculator onCheckoutCustom={handlePay} />
        </div>
      </section>

      {/* Trust strip */}
      <section className="section-sm" style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className={styles.trustGrid}>
            {[
              { icon: Zap, title: 'Instant UPI Payment', desc: 'Pay via GPay, PhonePe, Paytm or any UPI app in seconds.' },
              { icon: FileText, title: 'Written Agreement', desc: 'Every project comes with a clear scope of work document.' },
              { icon: RefreshCw, title: 'Revisions Included', desc: 'We work until you\'re 100% satisfied with the result.' },
              { icon: Phone, title: '24-hr Response', desc: 'Our team responds to all enquiries within 24 hours.' },
            ].map(t => {
              const Icon = t.icon;
              return (
                <div key={t.title} className={styles.trustCard}>
                  <div className={styles.trustIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color="#1D4ED8" />
                  </div>
                  <h4 className={styles.trustTitle}>{t.title}</h4>
                  <p className={styles.trustDesc}>{t.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm" style={{ textAlign: 'center' }}>
        <div className="container-narrow">
          <h2 className="display-md" style={{ color: 'var(--text)', marginBottom: '16px' }}>
            Not sure which plan? <span className="gradient-text">Let&apos;s Talk.</span>
          </h2>
          <p className="body-lg" style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
            Every business is unique. We&apos;ll help you find the right solution for your goals and budget.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Get a Free Consultation <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
