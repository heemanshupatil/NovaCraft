import Link from 'next/link';
import { Heart, Target, Zap, Users, ArrowRight, CheckCircle, Code, Gauge, Shield, Search, MessageSquare } from 'lucide-react';

export const metadata = {
  title: 'About Us — NovaCraft Digital',
  description: 'Learn about NovaCraft Digital — who we are, what drives us, and why clients trust us with their digital presence.',
};

const values = [
  { icon: Target, title: 'Results-Driven', desc: 'Every decision we make is tied to measurable outcomes for your business.', color: '#1D4ED8' },
  { icon: Heart, title: 'Client-First', desc: 'We work as an extension of your team — your success is genuinely our success.', color: '#ec4899' },
  { icon: Zap, title: 'Cutting-Edge', desc: 'We stay ahead of trends so your brand always looks modern and competitive.', color: '#f59e0b' },
  { icon: Users, title: 'Collaborative', desc: 'Transparent communication and real partnership — no jargon, just clarity.', color: '#22c55e' },
];



const milestones = [
  { year: '2024', event: 'NovaCraft Founded', desc: 'Started with a vision to build high-performance, premium digital experiences.' },
  { year: '2025', event: 'First 8 Projects & Growth', desc: 'Scaled our developer team and successfully completed our first 8 digital products.' },
  { year: '2026', event: '12 Projects & Scaling', desc: 'Reached the milestone of 12 completed projects and expanded our services globally.' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="section" style={{ paddingTop: '140px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '20%', width: '500px', height: '500px', background: 'rgba(29,78,216,0.07)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '700px' }}>
            <div className="section-tag">About Us</div>
            <h1 className="display-lg" style={{ marginBottom: '24px' }}>
              We&apos;re the Team Behind <span className="gradient-text">Your Digital Growth</span>
            </h1>
            <p className="body-lg" style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              NovaCraft Digital was founded on a simple belief: every business deserves a stunning online presence and a social media strategy that actually works.
            </p>
            <p className="body-lg" style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
              Since 2024, we&apos;ve partnered with 12 businesses — from solo founders to multi-location companies — delivering websites, eCommerce stores, and social campaigns that drive real, measurable growth.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Work With Us <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ paddingTop: '40px' }}>
        <div className="container">
          <div style={{ marginBottom: '48px', textAlign: 'center' }}>
            <div className="section-tag">Our Values</div>
            <h2 className="display-md">What We Stand For</h2>
          </div>
          <div className="grid-4">
            {values.map(v => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="card" style={{ padding: '32px', textAlign: 'center' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '16px',
                    background: `${v.color}18`, border: `1px solid ${v.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}>
                    <Icon size={24} color={v.color} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>{v.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.65 }}>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quality Standards & Testing Section */}
      <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', right: '10%', width: '300px', height: '300px', background: 'rgba(29, 78, 216, 0.05)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div className="container">
          <div className="card" style={{ 
            padding: '56px 48px', 
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.01), rgba(30, 41, 59, 0.03))',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div className="grid-2" style={{ alignItems: 'center' }}>
              <div>
                <div className="section-tag" style={{ background: 'rgba(34,197,94,0.1)', color: '#16A34A', border: '1px solid rgba(34,197,94,0.3)', display: 'inline-block', marginBottom: '16px' }}>
                  Our Quality Guarantee
                </div>
                <h2 className="display-md" style={{ marginBottom: '20px', color: 'var(--text)' }}>
                  Engineered for <span className="gradient-text">Absolute Precision</span>
                </h2>
                <p className="body-lg" style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '20px' }}>
                  Our team is composed entirely of seasoned, professional developers who craft every single website with extreme precision and attention to detail. We do not compromise on code quality.
                </p>
                <p className="body-lg" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  Before any project is completed, it undergoes a rigorous suite of cross-device compatibility audits, performance checks, and detailed testing. Only when every single check passes successfully is the final product delivered to you.
                </p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { icon: Code, title: 'Professional Developers', desc: 'Expert engineering using modern web frameworks and optimized code structures.' },
                  { icon: Gauge, title: 'Extreme Precision (Bariki Se Coding)', desc: 'Meticulous attention to detail in layout, speed, custom animations, and security.' },
                  { icon: Shield, title: 'Rigorous Multi-Phase Testing', desc: 'Every feature, form, link, and script is thoroughly tested before final handover.' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ 
                        width: '44px', height: '44px', borderRadius: '12px', 
                        background: 'rgba(29, 78, 216, 0.08)', border: '1px solid rgba(29, 78, 216, 0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        <Icon size={20} color="#1D4ED8" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{item.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Order, Pay & Track */}
      <section className="section" style={{ paddingTop: '40px', paddingBottom: '40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '5%', width: '350px', height: '350px', background: 'rgba(29, 78, 216, 0.04)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '350px', height: '350px', background: 'rgba(124, 58, 237, 0.04)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
        
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-tag">Client Guide</div>
            <h2 className="display-md">How to <span className="gradient-text">Order, Pay & Track</span></h2>
            <p className="body-lg" style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '16px auto 0' }}>
              We have designed our entire checkout and support ecosystem to be transparent, straightforward, and 100% digital.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '32px' }}>
            {/* Card 1: Placing Order & Paying */}
            <div className="card" style={{ 
              padding: '40px', 
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.01), rgba(30, 41, 59, 0.02))',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}>
              <div>
                <div className="section-tag" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'inline-block', marginBottom: '20px' }}>
                  Ordering & Payments
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '16px' }}>
                  How to Place Order & Pay
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '24px' }}>
                  Purchase any development or social media plan instantly using standard UPI payments.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                  {[
                    {
                      step: '01',
                      title: 'Select a Plan',
                      desc: 'Choose from our structured Web or Social packages on the Pricing page, or build a custom scope of work.'
                    },
                    {
                      step: '02',
                      title: 'Scan QR or Pay UPI',
                      desc: 'Log in and click "Pay Now" to open our UPI gateway. Scan the custom QR code or copy the UPI ID using GPay, Paytm, or PhonePe.'
                    },
                    {
                      step: '03',
                      title: 'Submit Receipt & Start',
                      desc: 'Enter your 12-digit transaction UTR ID and upload your payment screenshot. Our team will verify and start your project within 24 hours.'
                    }
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: '#3B82F6',
                        background: 'rgba(59, 130, 246, 0.08)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {item.step}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>{item.title}</h4>
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Link href="/pricing" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  View Plans & Pricing <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Card 2: Support & Live tracking */}
            <div className="card" style={{ 
              padding: '40px', 
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.01), rgba(30, 41, 59, 0.02))',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}>
              <div>
                <div className="section-tag" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED', border: '1px solid rgba(124, 58, 237, 0.3)', display: 'inline-block', marginBottom: '20px' }}>
                  Full Transparency
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '16px' }}>
                  Track Requests & Complaints
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '24px' }}>
                  Track every submission or support inquiry transparently with real-time status updates.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                  {[
                    {
                      step: '01',
                      title: 'Submit Query / Complaint',
                      desc: 'Go to the Contact page and fill out the form with your query or complaint, using your registered email.'
                    },
                    {
                      step: '02',
                      title: 'Enter Email in Tracker',
                      desc: 'Scroll down to the "Track My Request" tool on the Contact page, and enter your email address.'
                    },
                    {
                      step: '03',
                      title: 'Monitor Live Resolution',
                      desc: 'Instantly view whether your request is Open, Under Review, or Resolved, along with direct manager replies.'
                    }
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: '#7C3AED',
                        background: 'rgba(124, 58, 237, 0.08)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {item.step}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>{item.title}</h4>
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Link href="/contact#track" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                  Go to Live Tracker <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Timeline */}
      <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #EFF6FF, #FFFBEB)', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }} />
        <div className="container-narrow" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-tag">Our Journey</div>
            <h2 className="display-md">A Story of <span className="gradient-text">Growth</span></h2>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, transparent, rgba(29,78,216,0.5), transparent)', transform: 'translateX(-50%)' }} />
            {milestones.map((m, i) => (
              <div key={m.year} style={{
                display: 'flex', gap: '32px', marginBottom: '40px',
                flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                alignItems: 'flex-start',
              }}>
                <div style={{ flex: 1, textAlign: i % 2 === 0 ? 'right' : 'left' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#3B82F6', textTransform: 'uppercase', marginBottom: '4px' }}>{m.year}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>{m.event}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{m.desc}</div>
                </div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'linear-gradient(135deg, #1D4ED8, #F59E0B)', flexShrink: 0, marginTop: '4px', boxShadow: '0 0 16px rgba(29,78,216,0.5)' }} />
                <div style={{ flex: 1 }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
