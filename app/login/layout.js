'use client';
import { useEffect } from 'react';

export default function LoginLayout({ children }) {
  useEffect(() => {
    // Hide global navbar, footer, and chatbot on login page
    const nav = document.querySelector('[data-global-nav]');
    const footer = document.querySelector('[data-global-footer]');
    const chatbot = document.querySelector('[data-global-chatbot]');
    if (nav) nav.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (chatbot) chatbot.style.display = 'none';
    return () => {
      if (nav) nav.style.display = '';
      if (footer) footer.style.display = '';
      if (chatbot) chatbot.style.display = '';
    };
  }, []);

  return children;
}
