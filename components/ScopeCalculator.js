'use client';
import { useState, useEffect } from 'react';
import { 
  Plus, Check, Sliders, ShoppingCart, Share2, 
  Layers, Zap, Calendar, Award, CheckCircle2, AlertCircle
} from 'lucide-react';
import styles from './ScopeCalculator.module.css';

export default function ScopeCalculator({ onCheckoutCustom }) {
  const [activeCategory, setActiveCategory] = useState('web'); // web | smm
  
  // Custom Web Solution states
  const [pages, setPages] = useState(5);
  const [webAddons, setWebAddons] = useState({
    branding: false,
    seo: false,
    database: false,
    ecommerce: false,
    auth: false,
    chat: false
  });
  const [urgency, setUrgency] = useState('normal'); // normal | priority | express

  // Custom SMM Campaign states
  const [posts, setPosts] = useState(15);
  const [smmAddons, setSmmAddons] = useState({
    metaAds: false,
    googleAds: false,
    videoReels: false,
    manager: false
  });
  const [smmChannels, setSmmChannels] = useState({
    instagram: true,
    facebook: false,
    youtube: false,
    linkedin: false
  });

  // Share Estimate state
  const [copied, setCopied] = useState(false);

  // Dynamic calculations
  const [totalCost, setTotalCost] = useState(0);
  const [estTimeline, setEstTimeline] = useState('');

  // Web values constants
  const WEB_BASE_PRICE = 5000;
  const WEB_PRICE_PER_PAGE = 2500;
  const WEB_ADDON_PRICES = {
    branding: 4999,
    seo: 3499,
    database: 14999,
    ecommerce: 9999,
    auth: 9999,
    chat: 1999
  };
  const WEB_URGENCY_WEIGHTS = {
    normal: { label: 'Normal (3-4 weeks)', multiplier: 1.0, timeline: '20-25 days' },
    priority: { label: 'Priority (2 weeks)', multiplier: 1.25, timeline: '10-14 days' },
    express: { label: 'Express (1 week)', multiplier: 1.5, timeline: '5-7 days' }
  };

  // SMM values constants
  const SMM_PRICE_PER_POST = 500;
  const SMM_ADDON_PRICES = {
    metaAds: 9999,
    googleAds: 7499,
    videoReels: 12499,
    manager: 4999
  };
  const SMM_CHANNEL_PRICES = {
    instagram: 1999,
    facebook: 1499,
    youtube: 2999,
    linkedin: 2499
  };

  // Run calculation effect
  useEffect(() => {
    if (activeCategory === 'web') {
      let base = WEB_BASE_PRICE + (pages - 1) * WEB_PRICE_PER_PAGE;
      
      // Sum addons
      Object.keys(webAddons).forEach(addon => {
        if (webAddons[addon]) {
          base += WEB_ADDON_PRICES[addon];
        }
      });

      // Apply urgency weighting
      const finalCost = Math.round(base * WEB_URGENCY_WEIGHTS[urgency].multiplier);
      setTotalCost(finalCost);
      setEstTimeline(WEB_URGENCY_WEIGHTS[urgency].timeline);
    } else {
      let base = posts * SMM_PRICE_PER_POST;

      // Sum addons
      Object.keys(smmAddons).forEach(addon => {
        if (smmAddons[addon]) {
          base += SMM_ADDON_PRICES[addon];
        }
      });

      // Sum channels
      Object.keys(smmChannels).forEach(channel => {
        if (smmChannels[channel]) {
          base += SMM_CHANNEL_PRICES[channel];
        }
      });

      setTotalCost(base);
      setEstTimeline('Recurring Monthly');
    }
  }, [activeCategory, pages, webAddons, urgency, posts, smmAddons, smmChannels]);

  const toggleWebAddon = (key) => {
    setWebAddons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSmmAddon = (key) => {
    setSmmAddons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSmmChannel = (key) => {
    setSmmChannels(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Get active features list
  const getSelectedFeatures = () => {
    const list = [];
    if (activeCategory === 'web') {
      list.push(`${pages} Responsive Pages`);
      if (webAddons.branding) list.push('Logo & Branding Kit');
      if (webAddons.seo) list.push('Premium SEO Optimization');
      if (webAddons.database) list.push('Custom Database API');
      if (webAddons.ecommerce) list.push('eCommerce Payment Checkout');
      if (webAddons.auth) list.push('User Accounts & Authentication');
      if (webAddons.chat) list.push('WhatsApp/Live Chat Integration');
      list.push(`Delivery Urgency: ${urgency.toUpperCase()}`);
    } else {
      list.push(`${posts} Premium Graphic Posts`);
      if (smmChannels.instagram) list.push('Instagram SMM Management');
      if (smmChannels.facebook) list.push('Facebook SMM Management');
      if (smmChannels.youtube) list.push('YouTube Shorts Management');
      if (smmChannels.linkedin) list.push('LinkedIn Business SMM');
      if (smmAddons.metaAds) list.push('Meta Advertising optimization');
      if (smmAddons.googleAds) list.push('Google Ads integration');
      if (smmAddons.videoReels) list.push('Reels & Video production');
      if (smmAddons.manager) list.push('Dedicated Account Manager');
    }
    return list;
  };

  // Copy share message
  const handleShareBreakdown = () => {
    const features = getSelectedFeatures().map(f => ` - ${f}`).join('\n');
    const msg = `--- NovaCraft Digital Estimate ---\nCategory: ${activeCategory === 'web' ? 'Web Development' : 'Social Media Marketing'}\nEstimated Total: ₹${totalCost.toLocaleString('en-IN')}\nTimeline: ${estTimeline}\nScope Breakdown:\n${features}\n-----------------------------------`;
    
    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Handle Checkout Custom
  const handleCheckout = () => {
    const name = activeCategory === 'web' ? 'Custom Web App' : 'Custom SMM Strategy';
    const finalPlan = {
      name,
      category: activeCategory === 'web' ? 'Web Development' : 'Social Media Marketing',
      price: totalCost.toLocaleString('en-IN'),
      duration: activeCategory === 'web' ? 'one-time' : 'per month',
      features: getSelectedFeatures()
    };
    onCheckoutCustom(finalPlan);
  };

  return (
    <div className={styles.calculatorCard}>
      <div className={styles.header}>
        <Sliders size={20} className={styles.headerIcon} />
        <h2>Custom Quote Scope Calculator</h2>
        <p>Fine-tune features and get an instant cost and timeline estimate for your custom plan.</p>
      </div>

      {/* Category selector */}
      <div className={styles.categorySelector}>
        <button
          className={`${styles.selectBtn} ${activeCategory === 'web' ? styles.btnActive : ''}`}
          onClick={() => setActiveCategory('web')}
        >
          <Layers size={14} /> Custom Web Development
        </button>
        <button
          className={`${styles.selectBtn} ${activeCategory === 'smm' ? styles.btnActive : ''}`}
          onClick={() => setActiveCategory('smm')}
        >
          <Zap size={14} /> Digital Marketing &amp; SMM
        </button>
      </div>

      <div className={styles.gridSplit}>
        {/* Left: Input options */}
        <div className={styles.controlsSide}>
          {activeCategory === 'web' ? (
            /* ── WEB DEV CONTROLS ── */
            <>
              {/* Slider pages */}
              <div className={styles.controlGroup}>
                <div className={styles.sliderHeader}>
                  <label className={styles.groupLabel}>Number of Pages</label>
                  <span className={styles.badgeVal}>{pages} Pages</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={pages}
                  onChange={e => setPages(Number(e.target.value))}
                  className={styles.rangeSlider}
                />
                <div className={styles.sliderLimits}>
                  <span>1 page</span>
                  <span>30 pages</span>
                </div>
              </div>

              {/* Addons checkbox grid */}
              <div className={styles.controlGroup}>
                <label className={styles.groupLabel}>Custom Feature Add-ons</label>
                <div className={styles.checkboxGrid}>
                  {[
                    { key: 'branding', label: 'Branding & Logo Kit', price: '₹4,999' },
                    { key: 'seo', label: 'Advanced SEO Optimization', price: '₹3,499' },
                    { key: 'database', label: 'Custom APIs & Database', price: '₹14,999' },
                    { key: 'ecommerce', label: 'Checkout & Shop Cart', price: '₹9,999' },
                    { key: 'auth', label: 'User Sign-in / Accounts', price: '₹9,999' },
                    { key: 'chat', label: 'WhatsApp Chat Integration', price: '₹1,999' }
                  ].map(a => (
                    <div 
                      key={a.key}
                      className={`${styles.checkCard} ${webAddons[a.key] ? styles.checkCardActive : ''}`}
                      onClick={() => toggleWebAddon(a.key)}
                    >
                      <div className={styles.checkSquare}>
                        {webAddons[a.key] && <Check size={12} color="white" />}
                      </div>
                      <div className={styles.checkCardDetails}>
                        <span className={styles.checkCardLabel}>{a.label}</span>
                        <span className={styles.checkCardPrice}>{a.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgency/Timeline Selector */}
              <div className={styles.controlGroup}>
                <label className={styles.groupLabel}>Project Timeline Priority</label>
                <div className={styles.radioGroup}>
                  {[
                    { key: 'normal', label: 'Standard', desc: '3-4 weeks (Normal cost)' },
                    { key: 'priority', label: 'Priority', desc: '2 weeks (+25% speed fee)' },
                    { key: 'express', label: 'Express', desc: '1 week (+50% rush fee)' }
                  ].map(u => (
                    <div 
                      key={u.key}
                      className={`${styles.radioCard} ${urgency === u.key ? styles.radioCardActive : ''}`}
                      onClick={() => setUrgency(u.key)}
                    >
                      <span className={styles.radioDot} />
                      <div>
                        <div className={styles.radioLabel}>{u.label}</div>
                        <div className={styles.radioDesc}>{u.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* ── SMM MARKETING CONTROLS ── */
            <>
              {/* Post count slider */}
              <div className={styles.controlGroup}>
                <div className={styles.sliderHeader}>
                  <label className={styles.groupLabel}>Monthly Post Creation</label>
                  <span className={styles.badgeVal}>{posts} Posts</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  value={posts}
                  onChange={e => setPosts(Number(e.target.value))}
                  className={styles.rangeSlider}
                />
                <div className={styles.sliderLimits}>
                  <span>5 posts</span>
                  <span>45 posts</span>
                </div>
              </div>

              {/* SMM Channels selection */}
              <div className={styles.controlGroup}>
                <label className={styles.groupLabel}>Select Social Channels</label>
                <div className={styles.checkboxGrid}>
                  {[
                    { key: 'instagram', label: 'Instagram Campaigns', price: '₹1,999' },
                    { key: 'facebook', label: 'Facebook SMM Profile', price: '₹1,499' },
                    { key: 'youtube', label: 'YouTube Shorts Reels', price: '₹2,999' },
                    { key: 'linkedin', label: 'LinkedIn Brand Business', price: '₹2,499' }
                  ].map(c => (
                    <div 
                      key={c.key}
                      className={`${styles.checkCard} ${smmChannels[c.key] ? styles.checkCardActive : ''}`}
                      onClick={() => toggleSmmChannel(c.key)}
                    >
                      <div className={styles.checkSquare}>
                        {smmChannels[c.key] && <Check size={12} color="white" />}
                      </div>
                      <div className={styles.checkCardDetails}>
                        <span className={styles.checkCardLabel}>{c.label}</span>
                        <span className={styles.checkCardPrice}>{c.price}/mo</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SMM Addons */}
              <div className={styles.controlGroup}>
                <label className={styles.groupLabel}>Add-on Campaign Services</label>
                <div className={styles.checkboxGrid}>
                  {[
                    { key: 'metaAds', label: 'Meta Paid Ads Management', price: '₹9,999' },
                    { key: 'googleAds', label: 'Google Search Campaigns', price: '₹7,499' },
                    { key: 'videoReels', label: 'Short Video / Reel Editing', price: '₹12,499' },
                    { key: 'manager', label: 'Dedicated SMM Account Rep', price: '₹4,999' }
                  ].map(a => (
                    <div 
                      key={a.key}
                      className={`${styles.checkCard} ${smmAddons[a.key] ? styles.checkCardActive : ''}`}
                      onClick={() => toggleSmmAddon(a.key)}
                    >
                      <div className={styles.checkSquare}>
                        {smmAddons[a.key] && <Check size={12} color="white" />}
                      </div>
                      <div className={styles.checkCardDetails}>
                        <span className={styles.checkCardLabel}>{a.label}</span>
                        <span className={styles.checkCardPrice}>{a.price}/mo</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Real-time estimate output card */}
        <div className={styles.estimateSide}>
          <div className={styles.estimateSummaryBox}>
            <div className={styles.estCategoryTitle}>
              {activeCategory === 'web' ? 'Custom Web Development' : 'Custom SMM Growth Package'}
            </div>
            
            <div className={styles.priceContainer}>
              <span className={styles.currencySign}>₹</span>
              <span className={styles.priceAmt}>{totalCost.toLocaleString('en-IN')}</span>
              <span className={styles.pricePeriod}>/{activeCategory === 'web' ? 'one-time' : 'month'}</span>
            </div>

            <div className={styles.metricItem}>
              <Calendar size={15} className={styles.metricIcon} />
              <div>
                <span className={styles.metricLabel}>{activeCategory === 'web' ? 'Est. Delivery timeline' : 'Monthly Retainer'}</span>
                <strong className={styles.metricValue}>{estTimeline}</strong>
              </div>
            </div>

            <div className={styles.selectedScopeWrap}>
              <h4 className={styles.scopeHeader}>Scope Highlights</h4>
              <ul className={styles.scopeList}>
                {getSelectedFeatures().map(item => (
                  <li key={item} className={styles.scopeListItem}>
                    <CheckCircle2 size={13} color="#22c55e" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.actionsBlock}>
              <button 
                onClick={handleCheckout} 
                className={`btn btn-primary ${styles.calcCheckoutBtn}`}
              >
                <ShoppingCart size={16} /> Buy Custom Plan
              </button>

              <button 
                onClick={handleShareBreakdown} 
                className={`btn btn-outline ${styles.calcShareBtn}`}
              >
                <Share2 size={15} /> {copied ? 'Breakdown Copied!' : 'Share Scope Estimate'}
              </button>
            </div>

            <div className={styles.calcTaxesNotice}>
              <AlertCircle size={11} />
              <span>Calculated base cost (excludes standard 18% GST). Launch kickoff within 24 hours of payment authorization.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
