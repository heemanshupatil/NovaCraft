import Link from 'next/link';
import { Globe, Share2, AtSign, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import styles from './Footer.module.css';

const links = {
  Company: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
  ],
  Services: [
    { label: 'Web Development', href: '/services' },
    { label: 'eCommerce Stores', href: '/services' },
    { label: 'Social Media Marketing', href: '/services' },
    { label: 'Paid Advertising', href: '/services' },
  ],
};

const socials = [
  { icon: Globe, href: 'https://novacraft.digital', label: 'Website' },
  { icon: Share2, href: 'https://www.instagram.com/nova_craft.in?igsh=OXF1MHEzdXhyY2E4', label: 'Instagram' },
  { icon: AtSign, href: 'mailto:hello@novacraft.digital', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.glow} />
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoText}>Nova</span>
              <span className={styles.logoAccent}>Craft</span>
            </div>
            <p className={styles.brandDesc}>
              We build stunning digital experiences that grow businesses — from websites to social media mastery.
            </p>
            <div className={styles.socials}>
              {socials.map(s => {
                const Icon = s.icon;
                return (
                  <a key={s.label} href={s.href} className={styles.social} aria-label={s.label}>
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 className={styles.heading}>{heading}</h4>
              <ul className={styles.list}>
                {items.map(item => (
                  <li key={item.label}>
                    <Link href={item.href} className={styles.link}>
                      <ArrowRight size={13} /> {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className={styles.heading}>Contact</h4>
            <ul className={styles.list}>
              <li><a href="mailto:hello@novacraft.digital" className={styles.link}><Mail size={13} /> hello@novacraft.digital</a></li>
              <li><a href="tel:7875652144" className={styles.link}><Phone size={13} /> 7875652144</a></li>
              <li><span className={styles.link} style={{ cursor: 'default' }}><MapPin size={13} /> Available Worldwide</span></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {new Date().getFullYear()} NovaCraft Digital. All rights reserved.
            <Link href="/privacy" className={styles.privacyLink}>Privacy Policy</Link>
          </p>
          <p>
            by Heemanshu Patil
          </p>
        </div>
      </div>
    </footer>
  );
}
