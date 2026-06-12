'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Bot, User, ShieldCheck, 
  HelpCircle, AlertCircle, ArrowRight, Sparkles, ChevronLeft,
  Search, Clipboard, Check, Phone, ArrowUpRight, Calendar, UserCheck, Clock,
  Package, Ticket, Mail, Zap, MapPin
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import styles from './Chatbot.module.css';

// ─── Help Articles Database (Enterprise SLA Version) ─────────────────────────
const ARTICLES = [
  {
    id: 'art-pricing',
    title: 'Plans, Pricing & Service Packages',
    desc: 'Pricing details for web dev, custom dashboards, SMM, and campaign options.',
    keywords: ['pricing', 'price', 'cost', 'charge', 'packages', 'plans', 'buy', 'purchase', 'starter', 'growth', 'enterprise'],
    content: "We operate on a transparent, project-based model. Tax invoices are auto-generated upon kickoff:\n\n• **Starter Web (₹19,999)**: Responsive 5-page startup landing page, structural SEO, contact routing, Google Analytics, 5-7 days SLA.\n• **Growth Web (₹49,999)**: Custom animations, full-blown CMS panel, advanced on-page SEO audits, responsive speed optimization, 2-3 weeks SLA.\n• **Enterprise Web (Bespoke)**: Custom eCommerce, bespoke application architecture, proprietary database schemes.\n• **SMM campaign setups**: Starting at ₹14,999/month for targeted ad optimization.\n\nYou can review packages and proceed with payment options on our [Pricing Page](/pricing)."
  },
  {
    id: 'art-timeline',
    title: 'Project Timelines & Delivery SLA',
    desc: 'Delivery schedules and coordination processes from kickoff to launch.',
    keywords: ['timeline', 'duration', 'time', 'days', 'weeks', 'deadline', 'delivery', 'launch', 'milestone'],
    content: "We enforce strict Service Level Agreements (SLAs) for milestones:\n\n• **Starter Web**: 5–7 business days. Deliverable includes design mockup approval and code launch.\n• **Growth Web**: 14–21 business days. Includes interactive Figma phase, staging review, and database integration.\n• **Enterprise Apps**: 4–6 weeks. Follows strict agile sprints.\n\nProject deadlines are updated in real-time on your customer dashboard."
  },
  {
    id: 'art-tech',
    title: 'Tech Stack & Quality Standards',
    desc: 'The code frameworks, CMS panels, and cloud environments we use for projects.',
    keywords: ['tech', 'stack', 'languages', 'code', 'nextjs', 'react', 'gsap', 'html', 'backend', 'mongodb', 'hosting', 'vercel'],
    content: "Our system engineering relies on modern, lightweight, high-performance architecture:\n\n• **Frontend**: React and Next.js (version 16/15/14) for fast load times, semantic HTML, and structured SEO.\n• **Animations**: GSAP (GreenSock) for high-end micro-interactions and smooth scrolling layouts.\n• **Styling**: Tailored, modern CSS Modules and Tailwind CSS.\n• **Database**: MongoDB (NoSQL) and PostgreSQL.\n• **Hosting**: Hosted globally on Vercel, Netlify, and AWS."
  },
  {
    id: 'art-custom',
    title: 'Figma Design & Bespoke Development',
    desc: 'Why we do not use prebuilt themes and how our custom design pipeline works.',
    keywords: ['custom', 'figma', 'design', 'template', 'theme', 'unique', 'scratch'],
    content: "We never deploy bloated templates or pre-made WordPress themes! Every site is custom-crafted:\n\n1. **Figma Phase**: We design layout mockups from scratch based on your target audience.\n2. **Review & Iterate**: We work with you to align on design layouts.\n3. **Development Phase**: We translate your approved design into optimized clean code.\n\nThis workflow ensures high SEO rank, zero security overhead, and a unique digital footprint."
  },
  {
    id: 'art-payments',
    title: 'UPI Payments, Invoicing & Terms',
    desc: 'Security information, installment splits, and client invoice downloads.',
    keywords: ['payment terms', 'instalment', 'instalments', 'advance', 'refund', 'gst', 'billing terms'],
    content: "We provide secure transaction flows:\n\n• **Secured Transactions**: Direct UPI verification and bank transfer invoices.\n• **Split Payment**: For Growth/Enterprise clients, we use a 50% upfront deposit / 50% upon final testing model.\n• **Invoicing**: Detailed invoices are generated automatically with GST (18%) and downloadable in PDF format from your dashboard."
  },
  {
    id: 'art-location',
    title: 'Remote Collaboration & Support Office',
    desc: 'Where our engineers work and how clients book coordination sync calls.',
    keywords: ['location', 'office', 'where', 'country', 'india', 'remote', 'whatsapp', 'call', 'meet'],
    content: "NovaCraft operates as a distributed remote-first agency:\n\n• **HQ**: Headquartered in India, serving startups worldwide.\n• **Meeting Platforms**: We conduct sprints and checkpoints via Google Meet, Zoom, and Slack.\n• **Client Support Hours**: 9 AM to 8 PM IST. You can chat with us live, check your dashboard projects, or drop messages in this chat widget anytime."
  },
  {
    id: 'art-receipt',
    title: 'How to Download a Receipt or Invoice',
    desc: 'Instructions on how to download tax invoices and payment receipts for your orders.',
    keywords: ['receipt', 'invoice', 'download receipt', 'download invoice', 'bill', 'tax invoice', 'pdf', 'download'],
    content: "You can download a detailed PDF tax invoice/receipt for any purchase easily:\n\n1. **On Checkout Success**: Right after submitting your payment screenshot and UTR ID on the Pricing page, click the **\"Download Invoice / Receipt\"** button on the success screen.\n2. **In Your Dashboard**: Log in and go to the [Client Dashboard](/dashboard). Navigate to **\"Payment History\"** or **\"Active Orders\"**, find the transaction, and click the **\"Download Receipt\"** button.\n3. **Email Copy**: A copy of your verified payment receipt is also sent to your registered email address once our finance team completes manual verification."
  },
  {
    id: 'art-pay',
    title: 'How to Make a Payment',
    desc: 'Step-by-step guide on using our secure UPI checkout system to pay for plans.',
    keywords: ['pay', 'payment', 'how to pay', 'checkout', 'upi', 'gpay', 'paytm', 'phonepe', 'bank transfer'],
    content: "To pay for any development or marketing package:\n\n1. Go to the [Pricing Page](/pricing).\n2. Choose a package (Starter, Growth, Pro, or SMM) and click **\"Pay Now\"** (or use the Custom Quote Calculator to build a bespoke plan).\n3. Scan the secure UPI QR code or copy the UPI ID (`7875652144-2@ybl`) to pay via GPay, PhonePe, Paytm, or BHIM.\n4. Complete the transfer in your payment app.\n5. Copy the 12-digit transaction UTR/Txn ID, upload a screenshot of the payment receipt, and click **\"Submit Payment Request\"**.\n6. Our team will verify and activate your dashboard/plan within 24 hours."
  },
  {
    id: 'art-complaint',
    title: 'How to File a Complaint or Support Ticket',
    desc: 'Step-by-step explanation on how to submit a bug report, query, or formal complaint.',
    keywords: ['complaint', 'support', 'help', 'ticket', 'problem', 'error', 'bug', 'report', 'issue', 'raise complaint', 'submit ticket'],
    content: "We take customer support and complaints very seriously. You can log and track them through these channels:\n\n1. **Within This Chatbot**: Select the **\"Log Ticket\"** shortcut chip at the bottom of the chat widget (or type **\"ticket\"**). If logged in, type your query to instantly generate a support ticket.\n2. **On the Contact Page**: Go to the [Contact Page](/contact) and fill out the \"Send Us a Message\" form, choosing **\"Support/Complaint\"** as the subject.\n3. **Track Live Status**: Enter your email in the **\"Live Request Status\"** tracker on the Contact page, or click **\"Track Ticket\"** in this chat to monitor resolution progress in real time."
  },
  {
    id: 'art-contact',
    title: 'How to Use the Contact Form',
    desc: 'How to send requirements, queries, or messages to our team via the contact form.',
    keywords: ['contact', 'form', 'message', 'send message', 'contact form', 'how to contact', 'email form', 'ask'],
    content: "Our contact form is fully digital and integrated with our live ticketing system:\n\n1. Visit the [Contact Page](/contact).\n2. If you are signed in, your registered Name and Email will be automatically auto-filled to ensure secure request tracking.\n3. Select the **\"Service Needed\"** (e.g. Web Development, eCommerce, SMM, Support/Complaint, etc.) in the dropdown.\n4. Describe your project requirements, questions, or complaint in the message box.\n5. Click **\"Send Message\"**.\n6. Our team will review the request and get back to you via email within **12 hours**."
  },
  {
    id: 'art-quality',
    title: 'How We Deliver Quality & Perfectness',
    desc: 'Our engineering standards, figma review cycles, and quality assurance workflows.',
    keywords: ['quality', 'perfectness', 'code quality', 'standards', 'testing', 'design', 'custom design', 'perfection', 'perfect', 'test'],
    content: "We enforce high-performance standards to deliver perfect results:\n\n• **Bespoke Coding (Bariki Se Coding)**: We write clean, semantic code using React, Next.js, and custom GSAP modules. We never use bloated, generic WordPress templates.\n• **Figma Review Sprints**: Every project goes through a collaborative Figma phase where you approve layout designs before a single line of code is written.\n• **Rigorous QA Audits**: Before final handover, our team runs cross-device compatibility audits, layout checks, speed optimization (lighthouse audit), and security checks.\n• **SLA Guarantee**: Standard packages are delivered under strict SLA limits (5-7 days for Starter, 2-3 weeks for Growth)."
  },
  {
    id: 'art-dashboard',
    title: 'How to Access and Use the Client Dashboard',
    desc: 'Instructions on logging into and navigating your personal dashboard.',
    keywords: ['dashboard', 'client dashboard', 'my dashboard', 'track order', 'orders', 'projects', 'login', 'see dashboard', 'dashboard url'],
    content: "Your client dashboard is the central hub for managing your projects and payments:\n\n1. Sign up or log in to your account.\n2. Click your name/profile dropdown in the navigation bar and select [My Dashboard](/dashboard) (or go to `/dashboard` directly).\n3. **Track Project Status**: Monitor production progress (e.g. In Review, In Progress, Completed) of your active builds.\n4. **Payment Receipts**: View all past payment requests, transaction details, and download tax invoices/receipts.\n5. **Support Tickets**: Review, check status, and read replies to your submitted support tickets."
  }
];

// Helper to resolve custom Lucide icons for FAQ articles
const getArticleIcon = (id) => {
  switch (id) {
    case 'art-pricing':   return <Zap size={14} color="#3B82F6" />;
    case 'art-timeline':  return <Clock size={14} color="#8B5CF6" />;
    case 'art-tech':      return <Sparkles size={14} color="#06B6D4" />;
    case 'art-quality':   return <ShieldCheck size={14} color="#10B981" />;
    case 'art-location':  return <MapPin size={14} color="#EC4899" />;
    case 'art-pay':       return <ArrowUpRight size={14} color="#3B82F6" />;
    case 'art-receipt':    return <Clipboard size={14} color="#8B5CF6" />;
    case 'art-dashboard':  return <UserCheck size={14} color="#06B6D4" />;
    case 'art-complaint':  return <AlertCircle size={14} color="#EF4444" />;
    case 'art-contact':    return <Mail size={14} color="#F59E0B" />;
    case 'art-custom':     return <Package size={14} color="#10B981" />;
    default:              return <HelpCircle size={14} />;
  }
};

// Helper to pull localStorage messages (for support tickets)
const getLocalMessages = () => {
  try {
    return JSON.parse(localStorage.getItem('nc_messages') || '[]');
  } catch {
    return [];
  }
};

// Helper to pull localStorage orders
const getLocalOrders = () => {
  try {
    return JSON.parse(localStorage.getItem('nc_orders') || '[]');
  } catch {
    return [];
  }
};

// Helper to save support message
const saveSupportMessage = (msg) => {
  try {
    const existing = JSON.parse(localStorage.getItem('nc_messages') || '[]');
    existing.unshift(msg);
    localStorage.setItem('nc_messages', JSON.stringify(existing));
  } catch { /* ignore */ }
};

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // Screen views: 'home' | 'chat' | 'article'
  const [screen, setScreen] = useState('home');
  const [activeArticle, setActiveArticle] = useState(null);
  
  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello! Welcome to **NovaCraft Client Desk**. I'm Sarah, your Client Success lead today.\n\nHow can I help you? Select an option below or type a query!`,
      time: 'Just now',
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState('idle'); // idle | awaiting_order_id | awaiting_ticket_id | awaiting_support_email | awaiting_support_message
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [tempSupportEmail, setTempSupportEmail] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [userOrders, setUserOrders] = useState([]);

  const messageEndRef = useRef(null);

  // Welcome message is initialized lazily in useState with static time to avoid hydration mismatch.

  // Sync client orders for shortcuts
  useEffect(() => {
    if (user) {
      const orders = getLocalOrders();
      const filtered = orders.filter(o => o.userEmail?.toLowerCase() === user.email?.toLowerCase());
      setTimeout(() => {
        setUserOrders(filtered);
      }, 0);
    } else {
      setTimeout(() => {
        setUserOrders([]);
      }, 0);
    }
  }, [user, isOpen]);

  // Show notification pop trigger for un-opened chat
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setShowNotification(true), 6000);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Scroll to bottom
  useEffect(() => {
    if (screen === 'chat') {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, screen]);

  // Live Help Center Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setTimeout(() => setSearchResults([]), 0);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const matches = ARTICLES.filter(art => 
      art.title.toLowerCase().includes(q) || 
      art.desc.toLowerCase().includes(q) ||
      art.keywords.some(kw => q.includes(kw) || kw.includes(q))
    );
    setTimeout(() => setSearchResults(matches), 0);
  }, [searchQuery]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowNotification(false);
  };

  const navigateToChat = () => {
    setScreen('chat');
  };

  const navigateToHome = () => {
    setScreen('home');
    setSearchQuery('');
  };

  const handleOpenArticle = (art) => {
    setActiveArticle(art);
    setScreen('article');
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const simulateBotResponse = (text, cardData = null, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text,
          card: cardData,
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        }
      ]);
    }, delay);
  };

  // ─── Chat Actions ────────────────────────────────────────────────────────────
  const handleSend = (customText = null) => {
    const query = customText || inputValue;
    if (!query.trim()) return;

    const newMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    if (!customText) setInputValue('');

    const normalizedQuery = query.toLowerCase().trim();

    // Command resets
    if (['cancel', 'exit', 'reset', 'back'].some(kw => normalizedQuery === kw)) {
      setChatMode('idle');
      setTempSupportEmail('');
      simulateBotResponse("I've returned the conversation to search mode. What other service can I help you check?");
      return;
    }

    // ── Mode: Awaiting Order ID ──
    if (chatMode === 'awaiting_order_id') {
      const allOrders = getLocalOrders();
      const matchedOrder = allOrders.find(
        o => o.orderId?.toLowerCase() === normalizedQuery || o.txnId?.toLowerCase() === normalizedQuery
      );

      if (matchedOrder) {
        setChatMode('idle');
        simulateBotResponse(
          `I found your order! Here is the live tracking details card:`,
          {
            type: 'order',
            title: `${matchedOrder.plan?.name || 'Custom'} Plan`,
            category: matchedOrder.plan?.category || 'Development',
            orderId: matchedOrder.orderId,
            txnId: matchedOrder.txnId,
            date: matchedOrder.date,
            status: matchedOrder.status || 'confirmed',
            amount: matchedOrder.plan?.price || '0',
          }
        );
      } else {
        simulateBotResponse(
          `⚠️ We couldn't find an order matching **"${query}"** in our system.\n\nPlease check the Order ID on your receipt, or type **"cancel"** to exit.`
        );
      }
      return;
    }

    // ── Mode: Awaiting Ticket ID ──
    if (chatMode === 'awaiting_ticket_id') {
      const checkTicket = async () => {
        try {
          const res = await fetch(`/api/support/ticket?ticketId=${encodeURIComponent(normalizedQuery)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.ticket) {
              const ticket = data.ticket;
              setChatMode('idle');
              simulateBotResponse(
                `I located your support ticket in our database! Here is the latest timeline:`,
                {
                  type: 'ticket_status',
                  ticketId: ticket.id,
                  email: ticket.email,
                  message: ticket.message,
                  date: ticket.created_at,
                  status: ticket.status || 'Open',
                  adminReply: ticket.admin_reply || null,
                  replyDate: ticket.reply_date || null,
                }
              );
              return;
            }
          }
          throw new Error('Not found in database');
        } catch (dbErr) {
          // Fallback to localStorage
          const allMessages = getLocalMessages();
          const matchedTicket = allMessages.find(
            m => m.id?.toLowerCase() === normalizedQuery
          );

          if (matchedTicket) {
            setChatMode('idle');
            simulateBotResponse(
              `I located your support ticket from your local browser history! Here is the details:`,
              {
                type: 'ticket_status',
                ticketId: matchedTicket.id,
                email: matchedTicket.email,
                message: matchedTicket.message,
                date: matchedTicket.date,
                status: matchedTicket.status || 'Open',
                adminReply: matchedTicket.adminReply || null,
                replyDate: matchedTicket.replyDate || null,
              }
            );
          } else {
            simulateBotResponse(
              `⚠️ We couldn't find a support ticket matching ID **"${query}"** in our database or local history.\n\nPlease check your Ticket ID (UUID or local code) and enter it again, or type **"cancel"** to go back.`
            );
          }
        }
      };

      checkTicket();
      return;
    }

    // ── Mode: Awaiting Support Email ──
    if (chatMode === 'awaiting_support_email') {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (emailRegex.test(normalizedQuery)) {
        setTempSupportEmail(normalizedQuery);
        setChatMode('awaiting_support_message');
        simulateBotResponse(`Got it. Now describe your inquiry or problem in detail. We'll register it for review:`);
      } else {
        simulateBotResponse(`⚠️ That email formatting doesn't look correct. Please check and re-enter:`);
      }
      return;
    }

    // ── Mode: Awaiting Support Message ──
    if (chatMode === 'awaiting_support_message') {
      const ticketEmail = user ? user.email : tempSupportEmail;
      const ticketName = user ? user.name : 'Guest Client';

      const submitTicket = async () => {
        try {
          const payload = {
            name: ticketName,
            email: ticketEmail,
            service: 'Support Chat Ticket',
            message: query
          };

          const { data: { session } } = await supabase.auth.getSession();
          const token = session?.access_token;
          const headers = { 'Content-Type': 'application/json' };
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const res = await fetch('/api/contact', {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.message) {
              const inserted = data.message;
              
              // Save to localStorage for client reference
              saveSupportMessage({
                id: inserted.id,
                name: ticketName,
                email: ticketEmail,
                service: 'Support Chat Ticket',
                message: query,
                date: inserted.created_at,
                status: inserted.status,
                adminReply: null,
                read: false
              });

              setChatMode('idle');
              setTempSupportEmail('');
              simulateBotResponse(
                `Your support ticket has been submitted to the operations queue! Please save your Ticket ID for tracking.`,
                {
                  type: 'ticket',
                  ticketId: inserted.id,
                  email: ticketEmail,
                  message: query,
                  date: inserted.created_at,
                }
              );
              return;
            }
          }
          throw new Error('API submission failed');
        } catch (err) {
          console.error('Offline fallback submission:', err);
          // Fallback to local storage
          const ticketId = 'TKT-' + Date.now().toString(36).toUpperCase();
          saveSupportMessage({
            id: ticketId,
            name: ticketName,
            email: ticketEmail,
            service: 'Support Chat Ticket',
            message: query,
            date: new Date().toISOString(),
            status: 'Open',
            adminReply: null,
            read: false
          });

          setChatMode('idle');
          setTempSupportEmail('');
          simulateBotResponse(
            `Your support ticket has been registered locally (offline mode). Please save your local Ticket ID:`,
            {
              type: 'ticket',
              ticketId,
              email: ticketEmail,
              message: query,
              date: new Date().toISOString(),
            }
          );
        }
      };

      submitTicket();
      return;
    }

    // ── Mode: Idle (Match FAQs / Help Articles) ──
    let answered = false;
    for (const art of ARTICLES) {
      if (art.keywords.some(kw => normalizedQuery.includes(kw))) {
        const actionLinks = {
          'art-pricing': { url: '/pricing', label: 'View Pricing & Packages' },
          'art-timeline': { url: '/dashboard', label: 'Track Timelines' },
          'art-tech': { url: '/about', label: 'Tech Stack & Standards' },
          'art-custom': { url: '/portfolio', label: 'View Bespoke Designs' },
          'art-payments': { url: '/dashboard', label: 'Go to Billing' },
          'art-location': { url: '/contact', label: 'Get Support & Location' },
          'art-receipt': { url: '/dashboard', label: 'Download Receipt / Invoice' },
          'art-pay': { url: '/pricing', label: 'Go to Payments & UPI' },
          'art-complaint': { url: '/contact#track', label: 'Track Support Ticket' },
          'art-contact': { url: '/contact', label: 'Open Contact Form' },
          'art-quality': { url: '/about', label: 'Our Quality Standards' },
          'art-dashboard': { url: '/dashboard', label: 'Access Client Dashboard' }
        };
        const linkConfig = actionLinks[art.id] || null;

        simulateBotResponse(
          `Based on your query, here is an article: **${art.title}**\n\n${art.content}`,
          linkConfig ? {
            type: 'action_link',
            url: linkConfig.url,
            label: linkConfig.label,
          } : null,
          800
        );
        answered = true;
        break;
      }
    }

    if (!answered) {
      if (['hi', 'hello', 'hey', 'greetings', 'gday'].some(g => normalizedQuery.startsWith(g))) {
        simulateBotResponse(
          `Hello! 😊 How can I help you today? You can search our articles, track your orders or ticket statuses, or log a new support ticket.`
        );
      } else {
        simulateBotResponse(
          `I couldn't match that exact phrasing in our FAQ articles.\n\n` +
          `Would you like to speak to an agent or register a support ticket? Click the options below, or try keywords like "pricing", "delivery", "payment terms", or "hosting".`
        );
      }
    }
  };

  const handleQuickAction = (action) => {
    navigateToChat();
    
    if (action === 'track_menu') {
      setChatMode('awaiting_order_id');
      setMessages(prev => [
        ...prev,
        {
          id: 'act-track-' + Date.now(),
          sender: 'user',
          text: 'Track Order Progress',
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        }
      ]);
      simulateBotResponse("I can help you check your order status. Please enter your **Order ID** below:");
    } else if (action === 'ticket_track_menu') {
      setChatMode('awaiting_ticket_id');
      setMessages(prev => [
        ...prev,
        {
          id: 'act-tkt-track-' + Date.now(),
          sender: 'user',
          text: 'Track Support Ticket Status',
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        }
      ]);
      simulateBotResponse("I can check your ticket timeline. Please enter your **Ticket ID** (e.g. \`TKT-XXXXXX\`):");
    } else if (action === 'ticket_menu') {
      if (user) {
        setChatMode('awaiting_support_message');
        setMessages(prev => [
          ...prev,
          {
            id: 'act-ticket-' + Date.now(),
            sender: 'user',
            text: 'Log Support Ticket',
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          }
        ]);
        simulateBotResponse(`Hi ${user.name.split(' ')[0]}, please type your support message below:`);
      } else {
        setChatMode('awaiting_support_email');
        setMessages(prev => [
          ...prev,
          {
            id: 'act-ticket-anon-' + Date.now(),
            sender: 'user',
            text: 'Log Support Ticket',
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          }
        ]);
        simulateBotResponse("Sure, let's open a ticket. Please enter your **email address** so we can contact you:");
      }
    } else if (action === 'chat_agent') {
      setMessages(prev => [
        ...prev,
        {
          id: 'act-agent-' + Date.now(),
          sender: 'user',
          text: 'Speak to Support',
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        }
      ]);
      simulateBotResponse("Hello! Sarah here. Describe your inquiry and I will help you look into it.");
    } else if (action === 'book_call') {
      setMessages(prev => [
        ...prev,
        {
          id: 'act-call-' + Date.now(),
          sender: 'user',
          text: 'Book Discovery Call',
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        }
      ]);
      simulateBotResponse(
        `Here is our scheduling card. Let's align on a video call:`,
        {
          type: 'booking_card',
          desc: '15-Min Project Strategy & Scope Kickoff'
        }
      );
    }
  };

  const handleTrackShortcut = (order) => {
    navigateToChat();
    setMessages(prev => [
      ...prev,
      {
        id: 'short-track-' + Date.now(),
        sender: 'user',
        text: `Track Status: ${order.orderId}`,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      }
    ]);
    simulateBotResponse(
      `I've looked up your active order:`,
      {
        type: 'order',
        title: `${order.plan?.name || 'Custom'} Plan`,
        category: order.plan?.category || 'Development',
        orderId: order.orderId,
        txnId: order.txnId,
        date: order.date,
        status: order.status || 'confirmed',
        amount: order.plan?.price || '0',
      }
    );
  };

  const renderMessageText = (text) => {
    return text.split('\n').map((line, idx) => {
      let content = line;
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      content = content.replace(/`(.*?)`/g, '<code class="mono-code">$1</code>');

      const linkRegex = /\[(.*?)\]\((.*?)\)/g;
      const matches = [...content.matchAll(linkRegex)];
      
      if (matches.length > 0) {
        let parts = [];
        let lastIdx = 0;
        matches.forEach((match) => {
          const start = match.index;
          parts.push(<span key={idx + '-p1'} dangerouslySetInnerHTML={{ __html: content.substring(lastIdx, start) }} />);
          parts.push(
            <a key={idx + '-link'} href={match[2]} className={styles.chatLink}>
              {match[1]}
            </a>
          );
          lastIdx = start + match[0].length;
        });
        parts.push(<span key={idx + '-p2'} dangerouslySetInnerHTML={{ __html: content.substring(lastIdx) }} />);
        return <div key={idx} style={{ minHeight: '1.2em' }}>{parts}</div>;
      }

      return (
        <div key={idx} 
          dangerouslySetInnerHTML={{ __html: content }} 
          style={{ minHeight: '1.2em' }}
        />
      );
    });
  };

  // ─── Rich Card Render Elements ──────────────────────────────────────────────
  const renderCard = (card) => {
    if (!card) return null;

    switch (card.type) {
      case 'order': {
        const dateStr = new Date(card.date).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric'
        });
        const progress = card.status === 'completed' ? 100 : card.status === 'in-progress' ? 60 : 20;
        return (
          <div className={styles.cardOrder}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIconBox}><ShieldCheck size={18} color="#22C55E" /></div>
              <div>
                <div className={styles.cardPlanTitle}>{card.title}</div>
                <div className={styles.cardCategory}>{card.category}</div>
              </div>
              <span className={`${styles.cardBadge} ${styles['badge' + card.status]}`}>{card.status}</span>
            </div>
            
            <div className={styles.cardBody}>
              <div className={styles.cardStatRow}>
                <span>Order ID</span>
                <span className={styles.cardCode}>{card.orderId}</span>
              </div>
              <div className={styles.cardStatRow}>
                <span>Placed Date</span>
                <span>{dateStr}</span>
              </div>
              <div className={styles.cardStatRow}>
                <span>Amount Paid</span>
                <span>₹{card.amount}</span>
              </div>
              <div className={styles.cardStatRow}>
                <span>Txn ID</span>
                <span className={styles.cardCode}>{card.txnId}</span>
              </div>

              {/* Progress bar */}
              <div className={styles.cardProgressWrap}>
                <div className={styles.cardProgressLabel}>
                  <span>Production Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className={styles.cardProgressBar}>
                  <div className={styles.cardProgressFill} style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'ticket': {
        const tktDate = new Date(card.date).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
        return (
          <div className={styles.cardTicket}>
            <div className={styles.cardTicketHeader}>
              <div className={styles.ticketCheckCircle}><Check size={16} /></div>
              <h4>Support Ticket Created</h4>
            </div>
            <p className={styles.cardTicketDesc}>
              Your support inquiry has been submitted. Sarah and the team will follow up via email within 12 hours.
            </p>
            <div className={styles.ticketMetaBox}>
              <div className={styles.ticketMetaField}>
                <span>TICKET ID</span>
                <div className={styles.ticketCopyGroup}>
                  <strong>{card.ticketId}</strong>
                  <button onClick={() => handleCopy(card.ticketId, 'ticket')} className={styles.copyBtn}>
                    {copiedId === 'ticket' ? <Check size={12} color="#22C55E" /> : <Clipboard size={12} />}
                  </button>
                </div>
              </div>
              <div className={styles.ticketMetaField}>
                <span>CONTACT EMAIL</span>
                <strong>{card.email}</strong>
              </div>
              <div className={styles.ticketMetaField}>
                <span>CREATED ON</span>
                <span>{tktDate}</span>
              </div>
            </div>
          </div>
        );
      }

      case 'ticket_status': {
        const createdDate = new Date(card.date).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric'
        });
        
        // Match status colors
        const ticketStatusColors = {
          'Open': { bg: '#FEF3C7', text: '#D97706', label: 'Open In Queue' },
          'Under Review': { bg: '#DBEAFE', text: '#2563EB', label: 'Under Review' },
          'Resolved': { bg: '#D1FAE5', text: '#059669', label: 'Resolved ✓' }
        };
        const currentCol = ticketStatusColors[card.status] || ticketStatusColors['Open'];

        return (
          <div className={styles.cardTicketStatus}>
            <div className={styles.ticketStatusHeader}>
              <div className={styles.ticketStatusIconBox}><Clock size={16} /></div>
              <div>
                <span className={styles.statusLabelTitle}>Support Case History</span>
                <div className={styles.statusTicketId}>{card.ticketId}</div>
              </div>
              <span className={styles.statusBadge} style={{ backgroundColor: currentCol.bg, color: currentCol.text }}>
                {currentCol.label}
              </span>
            </div>

            <div className={styles.statusBody}>
              <div className={styles.statusQueryLabel}>Inquiry details:</div>
              <p className={styles.statusQueryText}>&ldquo;{card.message}&rdquo;</p>
              
              <div className={styles.statusMetaRow}>
                <span>Created Date</span>
                <span>{createdDate}</span>
              </div>

              {/* Admin reply panel */}
              {card.adminReply ? (
                <div className={styles.statusReplyBox}>
                  <div className={styles.replyHeader}>
                    <div className={styles.replyAuthorBadge}>S</div>
                    <div>
                      <div className={styles.replyAuthor}>Sarah (NovaCraft Support)</div>
                      <div className={styles.replyTime}>
                        {card.replyDate ? new Date(card.replyDate).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        }) : ''}
                      </div>
                    </div>
                  </div>
                  <p className={styles.replyText}>{card.adminReply}</p>
                </div>
              ) : (
                <div className={styles.statusWaitingBox}>
                  <Clock size={12} /> Pending operational engineer review
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'booking_card': {
        return (
          <div className={styles.bookingCard}>
            <div className={styles.bookingIconCircle}><Calendar size={18} /></div>
            <div className={styles.bookingDetails}>
              <h4 className={styles.bookingTitle}>Discovery strategy sync</h4>
              <p className={styles.bookingDesc}>{card.desc}</p>
              <div className={styles.bookingInfoRow}>
                <span>⏳ Duration: <strong>15 mins</strong></span>
                <span>📞 Platform: <strong>Google Meet</strong></span>
              </div>
              <a 
                href="/contact" 
                className={styles.bookingActionBtn}
                onClick={() => {
                  toggleChat();
                }}
              >
                Schedule Meeting <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        );
      }

      case 'action_link': {
        if (!card.url) return null;
        return (
          <div className={styles.actionCard}>
            <a href={card.url} className={styles.actionLinkBtn}>
              {card.label || 'Learn More'} <ArrowUpRight size={14} />
            </a>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button 
        id="chatbot-trigger"
        className={`${styles.chatBtn} ${isOpen ? styles.chatBtnOpen : ''}`} 
        onClick={toggleChat}
        aria-label="Open client support center"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <div className={styles.triggerInner}>
            <MessageSquare size={24} />
            {showNotification && (
              <div className={styles.notificationBubble}>
                <UserCheck size={12} /> Sarah online
              </div>
            )}
            <span className={styles.activePulse} />
          </div>
        )}
      </button>

      {/* Chat Window Panel */}
      <div className={`${styles.chatWindow} ${isOpen ? styles.chatWindowOpen : ''}`}>
        
        {/* ─── SCREEN 1: HOME DASHBOARD ────────────────────────────────────────── */}
        {screen === 'home' && (
          <div className={styles.homeScreen}>
            
            {/* Logo and Greeting Header */}
            <div className={styles.homeHeader}>
              <div className={styles.logoRow}>
                <div className={styles.homeLogo}>
                  <span>Nova</span><span className={styles.logoAccent}>Craft</span>
                </div>
                <div className={styles.supportBadges}>
                  <div className={styles.avatarStack}>
                    <span className={`${styles.stackedAvatar} ${styles.avatar1}`}>S</span>
                    <span className={`${styles.stackedAvatar} ${styles.avatar2}`}>A</span>
                    <span className={`${styles.stackedAvatar} ${styles.avatar3}`}>D</span>
                  </div>
                  <span className={styles.teamStatus}>Sarah & engineers online</span>
                </div>
              </div>
              
              <h2 className={styles.homeGreeting}>
                {user ? `Hi, ${user.name.split(' ')[0]}! 👋` : 'Hi there! 👋'}
              </h2>
              <p className={styles.homeSubtitle}>
                Welcome to our customer portal. How can we help you launch your product today?
              </p>
            </div>

            <div className={styles.homeBody}>
              
              {/* Start a conversation box */}
              <div className={styles.homeBoxCard}>
                <div className={styles.cardHeading}>Direct Support</div>
                <p className={styles.cardText}>Speak with our designers and engineers regarding custom builds and operations.</p>
                <button className={styles.homeActionBtn} onClick={navigateToChat}>
                  <MessageSquare size={16} /> Start Conversation 
                  <ArrowRight size={14} style={{ marginLeft: 'auto' }} />
                </button>
                <div className={styles.responseTime} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={12} color="#F59E0B" /> Sarah replies in under 10 minutes
                </div>
              </div>

              {/* Client Orders shortcuts (Context-Aware) */}
              {user && userOrders.length > 0 && (
                <div className={styles.homeBoxCard}>
                  <div className={styles.cardHeading}>Your Active Orders</div>
                  <div className={styles.orderShortcuts}>
                    {userOrders.slice(0, 2).map(o => (
                      <button 
                        key={o.orderId} 
                        className={styles.orderShortcutRow}
                        onClick={() => handleTrackShortcut(o)}
                      >
                        <ShieldCheck size={14} color="#3B82F6" />
                        <span className={styles.shortcutName}>{o.plan?.name || 'Custom'} Plan</span>
                        <span className={styles.shortcutStatus}>{o.status}</span>
                        <ArrowUpRight size={12} className={styles.shortcutArrow} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Help Center Search */}
              <div className={styles.homeBoxCard}>
                <div className={styles.cardHeading}>Help Center Articles</div>
                <div className={styles.searchContainer}>
                  <Search size={14} className={styles.searchIcon} />
                  <input
                    id="chatbot-search-input"
                    className={styles.searchInput}
                    placeholder="Search pricing plans, milestones, languages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className={styles.clearSearch} onClick={() => setSearchQuery('')}>
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Live Search Results */}
                {searchQuery.trim() && (
                  <div className={styles.searchResults}>
                    {searchResults.length > 0 ? (
                      searchResults.map(art => (
                        <button 
                          key={art.id} 
                          className={styles.searchResultRow}
                          onClick={() => handleOpenArticle(art)}
                        >
                          <HelpCircle size={13} />
                          <div>
                            <div className={styles.rowTitle}>{art.title}</div>
                            <div className={styles.rowDesc}>{art.desc}</div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className={styles.noSearchMatches}>
                        No articles match your query. Try &quot;pricing&quot;, &quot;delivery&quot;, or &quot;upi&quot;.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Process & Policy FAQ */}
              <div className={styles.homeBoxCard}>
                <div className={styles.cardHeading}>Core Process & Policies</div>
                <div className={styles.articleList}>
                  {ARTICLES.filter(art => ['art-pricing', 'art-timeline', 'art-tech', 'art-quality', 'art-location'].includes(art.id)).map(art => (
                    <button 
                      key={art.id} 
                      className={styles.articleRow}
                      onClick={() => handleOpenArticle(art)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getArticleIcon(art.id)}
                        <span>{art.title}</span>
                      </div>
                      <ArrowRight size={12} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Guides & Actions FAQ */}
              <div className={styles.homeBoxCard}>
                <div className={styles.cardHeading}>Client Guides & Actions</div>
                <div className={styles.articleList}>
                  {ARTICLES.filter(art => ['art-pay', 'art-receipt', 'art-dashboard', 'art-complaint', 'art-contact', 'art-custom'].includes(art.id)).map(art => (
                    <button 
                      key={art.id} 
                      className={styles.articleRow}
                      onClick={() => handleOpenArticle(art)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getArticleIcon(art.id)}
                        <span>{art.title}</span>
                      </div>
                      <ArrowRight size={12} />
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className={styles.homeFooter}>
              <span>Protected by Enterprise Security Standards</span>
            </div>
          </div>
        )}

        {/* ─── SCREEN 2: ACTIVE CHAT SCREEN ───────────────────────────────────── */}
        {screen === 'chat' && (
          <div className={styles.chatScreen}>
            
            {/* Chat header */}
            <div className={styles.header}>
              <button className={styles.backBtn} onClick={navigateToHome} aria-label="Back to dashboard">
                <ChevronLeft size={20} />
              </button>
              <div className={styles.headerAvatar}>
                <Bot size={20} color="#FFFFFF" />
                <span className={styles.statusDot} />
              </div>
              <div>
                <div className={styles.headerTitle}>NovaCraft Desk</div>
                <div className={styles.headerSubtitle}>Sarah (Account Lead) & team</div>
              </div>
              <button className={styles.headerClose} onClick={toggleChat} aria-label="Close Chat">
                <X size={18} />
              </button>
            </div>

            {/* Message Feed */}
            <div className={styles.messagesContainer}>
              {messages.map(m => (
                <div key={m.id} className={`${styles.msgRow} ${m.sender === 'user' ? styles.msgRowUser : styles.msgRowBot}`}>
                  <div className={styles.msgBubble}>
                    <div className={styles.msgText}>
                      {renderMessageText(m.text)}
                    </div>
                    {/* Rich card elements */}
                    {m.card && renderCard(m.card)}
                    <div className={styles.msgTime}>{m.time}</div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className={`${styles.msgRow} ${styles.msgRowBot}`}>
                  <div className={styles.msgBubble}>
                    <div className={styles.typingIndicator}>
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messageEndRef} />
            </div>

            {/* Interactive chips */}
            {chatMode === 'idle' && (
              <div className={styles.chipsContainer}>
                <button className={styles.chip} onClick={() => handleQuickAction('chat_agent')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare size={13} /> Ask Question
                </button>
                <button className={styles.chip} onClick={() => handleQuickAction('track_menu')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Package size={13} /> Track Order
                </button>
                <button className={styles.chip} onClick={() => handleQuickAction('ticket_track_menu')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Ticket size={13} /> Track Ticket
                </button>
                <button className={styles.chip} onClick={() => handleQuickAction('ticket_menu')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={13} /> Log Ticket
                </button>
                <button className={styles.chip} onClick={() => handleQuickAction('book_call')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} /> Book Call
                </button>
              </div>
            )}

            {/* Active flow tag */}
            {chatMode !== 'idle' && (
              <div className={styles.modeIndicator}>
                <span>Flow active: <strong>{chatMode.replace('awaiting_', '').replace('_', ' ')}</strong></span>
                <button className={styles.modeCancel} onClick={() => handleSend('cancel')}>
                  Exit <X size={10} />
                </button>
              </div>
            )}

            {/* Text entry area */}
            <form 
              className={styles.inputArea} 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            >
              <input
                id="chatbot-input"
                className={styles.input}
                placeholder={
                  chatMode === 'awaiting_order_id' 
                    ? 'Type Order ID (or "cancel")...' 
                    : chatMode === 'awaiting_ticket_id'
                    ? 'Type Ticket ID (or "cancel")...'
                    : chatMode === 'awaiting_support_email'
                    ? 'Type email address...'
                    : chatMode === 'awaiting_support_message'
                    ? 'Describe support problem...'
                    : 'Type message or FAQ keyword...'
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button 
                id="chatbot-submit"
                type="submit" 
                className={styles.sendBtn} 
                disabled={!inputValue.trim()}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

        {/* ─── SCREEN 3: ARTICLE DETAILS VIEW ──────────────────────────────────── */}
        {screen === 'article' && activeArticle && (
          <div className={styles.articleScreen}>
            
            {/* Article Header */}
            <div className={styles.articleHeader}>
              <button className={styles.backBtn} onClick={navigateToHome} aria-label="Back to Home">
                <ChevronLeft size={20} />
              </button>
              <span className={styles.articleHeaderTitle}>Knowledge Base</span>
              <button className={styles.headerClose} onClick={toggleChat} aria-label="Close Chat">
                <X size={18} />
              </button>
            </div>

            {/* Article Content */}
            <div className={styles.articleScrollBody}>
              <h1 className={styles.articleMainTitle}>{activeArticle.title}</h1>
              <p className={styles.articleMainDesc}>{activeArticle.desc}</p>
              
              <div className={styles.articleDivider} />
              
              <div className={styles.articleContentBody}>
                {renderMessageText(activeArticle.content)}
              </div>

              {/* Was this helpful block */}
              <div className={styles.feedbackCard}>
                <div className={styles.feedbackTitle}>Was this article helpful?</div>
                <div className={styles.feedbackRow}>
                  <button className={styles.feedbackBtn} onClick={() => alert('Thanks for your feedback!')}>👍 Yes</button>
                  <button className={styles.feedbackBtn} onClick={() => alert('Thanks for letting us know! We will improve this article.')}>👎 No</button>
                </div>
              </div>
            </div>

            {/* Talk to an Agent trigger banner */}
            <div className={styles.articleFooter}>
              <span>Need further details?</span>
              <button 
                className={styles.articleTalkBtn}
                onClick={() => {
                  navigateToChat();
                  simulateBotResponse(`Hi! I noticed you were reading our article: **${activeArticle.title}**.\n\nDo you have specific questions or need support help with this?`);
                }}
              >
                Start Chat <MessageSquare size={13} />
              </button>
            </div>

          </div>
        )}

      </div>
    </>
  );
}
