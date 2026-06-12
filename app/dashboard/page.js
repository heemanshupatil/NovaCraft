'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User, LogOut, Globe, TrendingUp, Clock, CheckCircle, AlertCircle,
  MessageSquare, ArrowRight, Zap, Star, Package, ShoppingBag,
  ExternalLink, Search, Filter, Mail, Phone, Eye, Check, X, Send, Inbox, DollarSign
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { gsap } from 'gsap';
import styles from './dashboard.module.css';

const statusColor = {
  'approved': { bg: 'rgba(34, 197, 94, 0.1)', color: '#16A34A', border: 'rgba(34, 197, 94, 0.2)', icon: CheckCircle, label: 'Approved' },
  'rejected': { bg: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.2)', icon: AlertCircle, label: 'Rejected' },
  'pending':  { bg: 'rgba(245, 158, 11, 0.1)', color: '#D97706', border: 'rgba(245, 158, 11, 0.2)', icon: Clock, label: 'Pending' },
};

const ticketStatusColor = {
  'Resolved': { bg: 'rgba(34, 197, 94, 0.1)', color: '#16A34A', border: 'rgba(34, 197, 94, 0.2)', label: 'Resolved' },
  'Open':  { bg: 'rgba(245, 158, 11, 0.1)', color: '#D97706', border: 'rgba(245, 158, 11, 0.2)', label: 'Open' },
  'Under Review': { bg: 'rgba(59, 130, 246, 0.1)', color: '#2563EB', border: 'rgba(59, 130, 246, 0.2)', label: 'Under Review' }
};

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  // Welcome Gate States
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [readInfo, setReadInfo] = useState(false);

  // Check sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasWelcomed = sessionStorage.getItem('nova_welcomed');
      if (!hasWelcomed) {
        setShowWelcome(true);
      }
    }
  }, []);

  // GSAP Intro animation for Step 1 on mount
  useEffect(() => {
    if (showWelcome && welcomeStep === 1) {
      gsap.fromTo(`.${styles.welcomeGateCard}`, 
        { scale: 0.96, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [showWelcome, welcomeStep]);

  const handleNextStep = () => {
    // Slide Step 1 card contents out to the left
    gsap.to(`.${styles.welcomeGateStep}`, {
      opacity: 0,
      x: -30,
      duration: 0.25,
      ease: 'power3.in',
      onComplete: () => {
        setWelcomeStep(2);
        // Instantly position Step 2 to the right, then slide in
        gsap.fromTo(`.${styles.welcomeGateStep}`,
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out' }
        );
      }
    });
  };

  const handlePrevStep = () => {
    // Slide Step 2 card contents out to the right
    gsap.to(`.${styles.welcomeGateStep}`, {
      opacity: 0,
      x: 30,
      duration: 0.25,
      ease: 'power3.in',
      onComplete: () => {
        setWelcomeStep(1);
        // Instantly position Step 1 to the left, then slide in
        gsap.fromTo(`.${styles.welcomeGateStep}`,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out' }
        );
      }
    });
  };

  const handleEnterDashboard = () => {
    if (!acceptedTerms || !readInfo) return;

    const overlay = document.querySelector(`.${styles.welcomeGateOverlay}`);
    const card = document.querySelector(`.${styles.welcomeGateCard}`);

    // Play transition GSAP animation
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('nova_welcomed', 'true');
        setShowWelcome(false);
      }
    });

    // 1. Scale down and fade card content
    tl.to(card, {
      scale: 0.9,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in'
    });

    // 2. Circular iris-wipe animation on the overlay backdrop
    tl.to(overlay, {
      clipPath: 'circle(0% at 50% 50%)',
      duration: 0.85,
      ease: 'power4.inOut'
    }, '-=0.15');

    // 3. Simultaneously fade out the overlay opacity to match
    tl.to(overlay, {
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out'
    }, '-=0.7');
  };

  // Client States
  const [payments, setPayments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Admin States
  const [adminPayments, setAdminPayments] = useState([]);
  const [adminMessages, setAdminMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('payments'); // payments | messages | overview
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Interactive Dialog/Input States
  const [processingId, setProcessingId] = useState(null); // paymentId or messageId being replied to
  const [actionNotes, setActionNotes] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(null); // paymentId
  const [zoomImg, setZoomImg] = useState(null); // image url for zoom modal
  const [submitError, setSubmitError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      try {
        setLoadingData(true);
        if (user.role === 'admin') {
          // Fetch All Payments for admin
          const { data: pData, error: pError } = await supabase
            .from('payments')
            .select('*')
            .order('created_at', { ascending: false });

          if (pError) throw pError;
          setAdminPayments(pData || []);

          // Fetch All Messages for admin
          const { data: mData, error: mError } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

          if (mError) throw mError;
          setAdminMessages(mData || []);
        } else {
          // Fetch User's Payments
          const { data: pData, error: pError } = await supabase
            .from('payments')
            .select('*')
            .order('created_at', { ascending: false });

          if (pError) throw pError;
          setPayments(pData || []);

          // Fetch User's Messages
          const { data: mData, error: mError } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

          if (mError) throw mError;
          setMessages(mData || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoadingData(false);
      }
    }
    loadDashboardData();
  }, [user]);

  if (loading || !user) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner} />
      </div>
    );
  }

  const handleLogout = () => { logout(); router.push('/'); };

  // ─── ADMIN ACTIONS ─────────────────────────────────────────────────────────
  const handleApprovePayment = async (paymentId) => {
    setSubmitLoading(true);
    setSubmitError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Session token not found.');

      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentId,
          status: 'approved',
          adminNotes: 'Verified receipt check successful. Plan activated.'
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to approve payment.');

      // Update state locally
      setAdminPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'approved', admin_notes: 'Verified receipt check successful. Plan activated.' } : p));
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRejectPayment = async (e, paymentId) => {
    e.preventDefault();
    if (!actionNotes.trim()) {
      setSubmitError('Please provide a reason for rejection.');
      return;
    }
    setSubmitLoading(true);
    setSubmitError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Session token not found.');

      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentId,
          status: 'rejected',
          adminNotes: actionNotes.trim()
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to reject payment.');

      // Update state locally
      setAdminPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'rejected', admin_notes: actionNotes.trim() } : p));
      setShowRejectForm(null);
      setActionNotes('');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReplyMessage = async (e, messageId) => {
    e.preventDefault();
    if (!actionNotes.trim()) {
      setSubmitError('Please enter a response message.');
      return;
    }
    setSubmitLoading(true);
    setSubmitError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Session token not found.');

      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messageId,
          replyText: actionNotes.trim()
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to submit support reply.');

      // Update state locally
      setAdminMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: 'Resolved', admin_reply: actionNotes.trim(), reply_date: new Date().toISOString() } : m));
      setProcessingId(null);
      setActionNotes('');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // ─── ADMIN RENDERING LOGIC ──────────────────────────────────────────────────
  if (user.role === 'admin') {
    // Metrics
    const totalPaymentsCount = adminPayments.length;
    const pendingPaymentsCount = adminPayments.filter(p => p.status === 'pending').length;
    const approvedPaymentsCount = adminPayments.filter(p => p.status === 'approved').length;
    const totalRevenue = adminPayments
      .filter(p => p.status === 'approved')
      .reduce((sum, p) => sum + Number(p.amount), 0);
    const openInquiriesCount = adminMessages.filter(m => m.status === 'Open').length;

    // Filters & Search logic
    const filteredPayments = adminPayments.filter(p => {
      const matchesSearch = p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.utr_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.plan_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const filteredMessages = adminMessages.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            m.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            m.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            m.service.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return (
      <div className={styles.page}>
        {/* Screenshot zoom overlay modal */}
        {zoomImg && (
          <div className={styles.modalOverlay} onClick={() => setZoomImg(null)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={() => setZoomImg(null)}><X size={20} /></button>
              <div className={styles.modalBody}>
                <img src={zoomImg} alt="Transaction Screenshot Zoomed" className={styles.zoomedImg} />
                <a href={zoomImg} target="_blank" rel="noreferrer" className={styles.externalLinkBtn}>
                  <ExternalLink size={14} /> Open in New Tab
                </a>
              </div>
            </div>
          </div>
        )}

        <main className={styles.main}>
          <div className={styles.welcome} style={{ paddingTop: '100px' }}>
            <div>
              <h1 className={styles.welcomeTitle}>Admin Control Console 👑</h1>
              <p className={styles.welcomeSub}>Manage transaction requests, user plans, and customer tickets.</p>
            </div>
            <div>
              <button onClick={handleLogout} className="btn btn-outline" style={{ fontSize: '0.875rem', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LogOut size={16} /> Log Out
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className={styles.statsRow}>
            {[
              { icon: DollarSign,   label: 'Gross Verified Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: '#22c55e' },
              { icon: Clock,        label: 'Pending Transaction Reviews', value: String(pendingPaymentsCount), color: '#F59E0B' },
              { icon: CheckCircle,  label: 'Approved Subscriptions', value: String(approvedPaymentsCount), color: '#3B82F6' },
              { icon: MessageSquare, label: 'Active Support Tickets', value: String(openInquiriesCount), color: '#8B5CF6' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className={styles.statCard}>
                  <Icon size={20} color={s.color || '#1D4ED8'} />
                  <div className={styles.statValue}>{s.value}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Navigation Tab controls */}
          <div className={styles.tabsContainer}>
            <div className={styles.tabsRow}>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'payments' ? styles.tabActive : ''}`} 
                onClick={() => { setActiveTab('payments'); setSearchTerm(''); setStatusFilter('all'); }}
              >
                <ShoppingBag size={15} /> Payment Orders ({totalPaymentsCount})
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'messages' ? styles.tabActive : ''}`} 
                onClick={() => { setActiveTab('messages'); setSearchTerm(''); setStatusFilter('all'); }}
              >
                <MessageSquare size={15} /> Support Tickets ({adminMessages.length})
              </button>
            </div>

            {/* Filter controls */}
            <div className={styles.filtersRow}>
              <div className={styles.searchBox}>
                <Search size={16} className={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder={activeTab === 'payments' ? "Search client, email, plan, UTR..." : "Search sender, email, inquiry..."}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.filterBox}>
                <Filter size={16} className={styles.filterIcon} />
                <select 
                  value={statusFilter} 
                  onChange={e => setStatusFilter(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All Statuses</option>
                  {activeTab === 'payments' ? (
                    <>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </>
                  ) : (
                    <>
                      <option value="Open">Open</option>
                      <option value="Resolved">Resolved</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Error notice banner */}
          {submitError && (
            <div className={styles.errorNoticeBanner}>
              <AlertCircle size={16} />
              <span>{submitError}</span>
              <button onClick={() => setSubmitError('')} className={styles.errorBannerClose}><X size={14} /></button>
            </div>
          )}

          {/* payments list tab */}
          {activeTab === 'payments' && (
            <section className={styles.section}>
              {loadingData ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
                  <div className={styles.spinner} style={{ margin: '0 auto 12px' }} />
                  Loading payment logs...
                </div>
              ) : filteredPayments.length > 0 ? (
                <div className={styles.adminTableContainer}>
                  <table className={styles.adminTable}>
                    <thead>
                      <tr>
                        <th>Client Details</th>
                        <th>Subscription Details</th>
                        <th>Amount Paid</th>
                        <th>Transaction ID / UTR</th>
                        <th>Screenshot</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map(p => {
                        const sc = statusColor[p.status] || statusColor.pending;
                        const Icon = sc.icon;
                        const isPending = p.status === 'pending';
                        return (
                          <tr key={p.id} className={styles.tableRow}>
                            <td>
                              <div className={styles.cellMain}>{p.full_name}</div>
                              <div className={styles.cellSub}><Mail size={11} style={{ display: 'inline', marginRight: '3px' }} />{p.email}</div>
                              <div className={styles.cellSub}><Phone size={11} style={{ display: 'inline', marginRight: '3px' }} />{p.phone}</div>
                            </td>
                            <td>
                              <div className={styles.cellMain}>{p.plan_name}</div>
                              <div className={styles.cellSub}>{p.plan_category}</div>
                              <div className={styles.cellSub}>{new Date(p.created_at).toLocaleDateString('en-IN')}</div>
                            </td>
                            <td className={styles.amountCell}>₹{Number(p.amount).toLocaleString('en-IN')}</td>
                            <td className={styles.utrCell}>{p.utr_id}</td>
                            <td>
                              <div className={styles.screenshotThumbWrapper} onClick={() => setZoomImg(p.screenshot_url)}>
                                <img src={p.screenshot_url} alt="Receipt Thumb" className={styles.screenshotThumb} />
                                <div className={styles.screenshotHoverOverlay}><Eye size={12} /></div>
                              </div>
                            </td>
                            <td>
                              <span className={styles.projectStatus} style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                                <Icon size={11} /> {sc.label}
                              </span>
                            </td>
                            <td>
                              {isPending ? (
                                <div className={styles.actionsWrap}>
                                  <button 
                                    className={`${styles.actionBtn} ${styles.actionApprove}`}
                                    onClick={() => handleApprovePayment(p.id)}
                                    disabled={submitLoading}
                                    title="Approve Subscription Plan"
                                  >
                                    <Check size={14} /> Approve
                                  </button>
                                  <button 
                                    className={`${styles.actionBtn} ${styles.actionReject}`}
                                    onClick={() => { setShowRejectForm(p.id); setActionNotes(''); setSubmitError(''); }}
                                    disabled={submitLoading}
                                    title="Reject Receipt Request"
                                  >
                                    <X size={14} /> Reject
                                  </button>
                                </div>
                              ) : (
                                <div className={styles.adminNotesDisplay}>
                                  <div className={styles.cellSub}>
                                    <strong>Notes:</strong> {p.admin_notes || 'No notes saved.'}
                                  </div>
                                </div>
                              )}
                              
                              {/* Rejection input area overlay inline */}
                              {showRejectForm === p.id && (
                                <div className={styles.inlineRejectPanel}>
                                  <form onSubmit={(e) => handleRejectPayment(e, p.id)} style={{ width: '100%' }}>
                                    <label className={styles.rejectLabel}>Rejection Reason:</label>
                                    <textarea 
                                      className={styles.rejectTextarea}
                                      value={actionNotes}
                                      onChange={e => setActionNotes(e.target.value)}
                                      placeholder="e.g. Screenshot blurred. UTR does not match merchant history..."
                                      rows={2}
                                      required
                                    />
                                    <div className={styles.rejectActionsRow}>
                                      <button 
                                        type="submit" 
                                        className={styles.submitRejectBtn}
                                        disabled={submitLoading}
                                      >
                                        Submit Rejection
                                      </button>
                                      <button 
                                        type="button" 
                                        className={styles.cancelRejectBtn}
                                        onClick={() => setShowRejectForm(null)}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyCard}>
                  <Inbox size={32} color="#CBD5E1" />
                  <p>No transactions match your search filters.</p>
                </div>
              )}
            </section>
          )}

          {/* support messages tab */}
          {activeTab === 'messages' && (
            <section className={styles.section}>
              {loadingData ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
                  <div className={styles.spinner} style={{ margin: '0 auto 12px' }} />
                  Loading customer inquiries...
                </div>
              ) : filteredMessages.length > 0 ? (
                <div className={styles.ticketsGrid}>
                  {filteredMessages.map(m => {
                    const status = m.status || 'Open';
                    const sc = ticketStatusColor[status] || ticketStatusColor.Open;
                    const isOpen = status === 'Open';
                    return (
                      <div key={m.id} className={styles.ticketCard}>
                        <div className={styles.ticketCardHeader}>
                          <div>
                            <span className={styles.ticketServiceBadge}>{m.service || 'General Inquiry'}</span>
                            <h3 className={styles.ticketSenderName}>{m.name}</h3>
                          </div>
                          <span className={styles.projectStatus} style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                            {sc.label}
                          </span>
                        </div>

                        <div className={styles.ticketContactDetails}>
                          <span><Mail size={12} /> {m.email}</span>
                          <span style={{ marginLeft: '12px' }}><Clock size={12} /> {new Date(m.created_at).toLocaleString('en-IN')}</span>
                        </div>

                        <p className={styles.ticketContentText}>"{m.message}"</p>

                        {/* Reply box if unresolved */}
                        {isOpen ? (
                          <div className={styles.ticketReplyContainer}>
                            {processingId === m.id ? (
                              <form onSubmit={(e) => handleReplyMessage(e, m.id)} className={styles.replyFormActive}>
                                <textarea
                                  className={styles.replyTextareaField}
                                  value={actionNotes}
                                  onChange={e => setActionNotes(e.target.value)}
                                  placeholder="Write your email response to the customer..."
                                  rows={4}
                                  required
                                  disabled={submitLoading}
                                />
                                <div className={styles.replyFormActions}>
                                  <button 
                                    type="submit" 
                                    className={styles.submitReplyBtn}
                                    disabled={submitLoading}
                                  >
                                    {submitLoading ? <span className={styles.spinnerSmall} /> : <><Send size={12} /> Send Response</>}
                                  </button>
                                  <button 
                                    type="button" 
                                    className={styles.cancelReplyBtn}
                                    onClick={() => { setProcessingId(null); setActionNotes(''); setSubmitError(''); }}
                                    disabled={submitLoading}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <button 
                                className={styles.replyTriggerBtn}
                                onClick={() => { setProcessingId(m.id); setActionNotes(''); setSubmitError(''); }}
                              >
                                <MessageSquare size={13} /> Respond to Ticket
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className={styles.ticketResolvedDetails}>
                            <div className={styles.resolvedLabel}>Resolved Reply:</div>
                            <p className={styles.resolvedText}>{m.admin_reply}</p>
                            {m.reply_date && (
                              <div className={styles.resolvedTime}>
                                Replied on: {new Date(m.reply_date).toLocaleString('en-IN')}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.emptyCard}>
                  <Inbox size={32} color="#CBD5E1" />
                  <p>No support tickets match your search filters.</p>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    );
  }

  // ─── CLIENT RENDERING LOGIC ────────────────────────────────────────────────
  const pendingOrders = payments.filter(p => p.status === 'pending').length;
  const approvedOrders = payments.filter(p => p.status === 'approved').length;
  const totalSpent = payments
    .filter(p => p.status === 'approved')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const projects = payments.map(o => ({
    id: o.id,
    title: `${o.plan_name} Plan`,
    service: o.plan_category,
    desc: `Submitted on ${new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}. Transaction ID / UTR: ${o.utr_id}`,
    status: o.status,
    admin_notes: o.admin_notes,
    progress: o.status === 'approved' ? 100 : o.status === 'rejected' ? 0 : 30,
    amount: `₹${Number(o.amount).toLocaleString('en-IN')}`,
  }));

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Welcome */}
        <div className={styles.welcome} style={{ paddingTop: '100px' }}>
          <div>
            <h1 className={styles.welcomeTitle}>Welcome, {user.name.split(' ')[0]} 👋</h1>
            <p className={styles.welcomeSub}>Here&apos;s a snapshot of your projects and account.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/contact" className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '10px 20px' }}>
              <MessageSquare size={16} /> Contact Team
            </Link>
            <button onClick={handleLogout} className="btn btn-outline" style={{ fontSize: '0.875rem', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className={styles.statsRow}>
          {[
            { icon: Package,       label: 'Pending Reviews',    value: String(pendingOrders) },
            { icon: CheckCircle,   label: 'Approved Projects',   value: String(approvedOrders), color: '#22c55e' },
            { icon: ShoppingBag,   label: 'Total Active Value',  value: totalSpent > 0 ? `₹${totalSpent.toLocaleString('en-IN')}` : '—' },
            { icon: MessageSquare, label: 'Messages Sent',       value: String(messages.length), color: '#7C3AED' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={styles.statCard}>
                <Icon size={20} color={s.color || '#1D4ED8'} />
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Projects / Orders */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>My Orders</h2>
          {loadingData ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
              <div className={styles.spinner} style={{ margin: '0 auto 12px' }} />
              Loading order details...
            </div>
          ) : (
            <div className={styles.projectGrid}>
              {projects.length > 0 ? projects.map(p => {
                const sc = statusColor[p.status] || statusColor.pending;
                const Icon = sc.icon;
                return (
                  <div key={p.id} className={styles.projectCard}>
                    <div className={styles.projectTop}>
                      <div>
                        <div className={styles.projectService}>{p.service}</div>
                        <div className={styles.projectTitle}>{p.title}</div>
                      </div>
                      <span className={styles.projectStatus}
                        style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                        <Icon size={12} /> {sc.label}
                      </span>
                    </div>
                    <p className={styles.projectDesc}>{p.desc}</p>
                    
                    {p.admin_notes && (
                      <div style={{
                        marginTop: '12px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: p.status === 'rejected' ? '#FEF2F2' : '#F8FAFC',
                        borderLeft: `3px solid ${p.status === 'rejected' ? '#EF4444' : '#64748B'}`,
                        fontSize: '0.8rem',
                        color: p.status === 'rejected' ? '#991B1B' : '#475569',
                      }}>
                        <strong>Billing Feedback:</strong> {p.admin_notes}
                      </div>
                    )}

                    <div className={styles.progressWrap} style={{ marginTop: '16px' }}>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${p.progress}%`, background: p.status === 'rejected' ? '#EF4444' : 'linear-gradient(135deg, #1D4ED8, #3B82F6)' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', marginTop: '4px' }}>
                        <span>{p.progress}% complete</span>
                        <strong>{p.amount}</strong>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className={styles.projectAdd} style={{ gridColumn: '1 / -1' }}>
                  <Package size={32} color="#CBD5E1" />
                  <p>No orders yet. Browse our services and pricing to get started!</p>
                  <Link href="/pricing" className="btn btn-primary" style={{ fontSize: '0.82rem', padding: '8px 18px' }}>
                    View Pricing <ArrowRight size={14} />
                  </Link>
                </div>
              )}

              {/* Placeholder — add new project */}
              {projects.length > 0 && (
                <div className={styles.projectAdd}>
                  <Globe size={28} color="#CBD5E1" />
                  <p>Want to start a new project?</p>
                  <Link href="/services" className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '8px 18px' }}>
                    View Services <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Recent Messages */}
        {messages.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>My Messages</h2>
            <div className={styles.quickLinks}>
              {messages.slice(0, 5).map((m, i) => (
                <div key={m.id || i} className={styles.quickCard} style={{ cursor: 'default', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MessageSquare size={20} color="#1D4ED8" />
                    <div style={{ flex: 1 }}>
                      <div className={styles.quickLabel}>{m.service || 'General Inquiry'}</div>
                      <div className={styles.quickDesc}>{m.message}</div>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                      {new Date(m.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  {m.admin_reply && (
                    <div style={{
                      marginLeft: '32px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#F1F5F9',
                      borderLeft: '3px solid #1D4ED8',
                      fontSize: '0.8rem',
                      color: '#334155',
                    }}>
                      <strong>Admin Reply:</strong> {m.admin_reply}
                      {m.reply_date && (
                        <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '4px' }}>
                          Replied on {new Date(m.reply_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Links */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick Links</h2>
          <div className={styles.quickLinks}>
            {[
              { href: '/services',  icon: Zap,          label: 'Our Services',   desc: 'Browse what we offer' },
              { href: '/pricing',   icon: Package,       label: 'Pricing',        desc: 'View plans & pay' },
              { href: '/portfolio', icon: Globe,         label: 'Portfolio',      desc: 'See our past work' },
              { href: '/contact',   icon: MessageSquare, label: 'Contact Us',     desc: 'Talk to the team' },
            ].map(l => {
              const Icon = l.icon;
              return (
                <Link key={l.href} href={l.href} className={styles.quickCard}>
                  <Icon size={22} color="#1D4ED8" />
                  <div>
                    <div className={styles.quickLabel}>{l.label}</div>
                    <div className={styles.quickDesc}>{l.desc}</div>
                  </div>
                  <ArrowRight size={16} color="#CBD5E1" style={{ marginLeft: 'auto' }} />
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      {/* Welcome Gate Overlay */}
      {showWelcome && (
        <div className={styles.welcomeGateOverlay}>
          <div className={styles.welcomeGateCard}>
            {welcomeStep === 1 ? (
              <div className={styles.welcomeGateStep}>
                <div className={styles.welcomeGateLogoText}>
                  <span>Nova</span>Craft
                </div>
                <h1 className={styles.welcomeGateTitleLarge}>Hello, {user.name.split(' ')[0]}! 👋</h1>
                <p className={styles.welcomeGateText}>
                  Welcome back to your company workspace. We've compiled your project trackers, documents, and support channels in one single place.
                </p>
                <button 
                  className={`${styles.welcomeGateBtn} ${styles.welcomeGateBtnActive}`}
                  onClick={handleNextStep}
                >
                  Get Started <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className={styles.welcomeGateStep}>
                <div className={styles.welcomeGateLogoText}>
                  <span>Nova</span>Craft
                </div>
                <h1 className={styles.welcomeGateTitle}>Review Guidelines</h1>
                <p className={styles.welcomeGateText}>
                  Please review and accept our guidelines and terms to open your active client console.
                </p>
                
                <div className={styles.welcomeGateChecklist}>
                  <div 
                    className={`${styles.welcomeGateCheckItem} ${acceptedTerms ? styles.welcomeGateCheckItemActive : ''}`}
                    onClick={() => setAcceptedTerms(a => !a)}
                  >
                    <div className={`${styles.welcomeGateCheckbox} ${acceptedTerms ? styles.welcomeGateCheckboxChecked : ''}`}>
                      {acceptedTerms && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className={`${styles.welcomeGateCheckLabel} ${acceptedTerms ? styles.welcomeGateCheckLabelChecked : ''}`}>
                      I accept the terms of service & privacy policies.
                    </span>
                  </div>

                  <div 
                    className={`${styles.welcomeGateCheckItem} ${readInfo ? styles.welcomeGateCheckItemActive : ''}`}
                    onClick={() => setReadInfo(r => !r)}
                  >
                    <div className={`${styles.welcomeGateCheckbox} ${readInfo ? styles.welcomeGateCheckboxChecked : ''}`}>
                      {readInfo && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className={`${styles.welcomeGateCheckLabel} ${readInfo ? styles.welcomeGateCheckLabelChecked : ''}`}>
                      I confirm that I have read the project guidelines.
                    </span>
                  </div>
                </div>

                <button 
                  className={`${styles.welcomeGateBtn} ${acceptedTerms && readInfo ? styles.welcomeGateBtnActive : styles.welcomeGateBtnDisabled}`}
                  disabled={!acceptedTerms || !readInfo}
                  onClick={handleEnterDashboard}
                >
                  Enter Workspace <ArrowRight size={16} />
                </button>

                <button 
                  className={styles.welcomeGateBtnBack}
                  onClick={handlePrevStep}
                >
                  ← Go Back
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
