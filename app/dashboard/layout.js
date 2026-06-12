'use client';
import { useEffect } from 'react';

export default function DashboardLayout({ children }) {
  useEffect(() => {
    // Hide global footer on dashboard (navbar stays for navigation)
    const footer = document.querySelector('[data-global-footer]');
    if (footer) footer.style.display = 'none';
    return () => {
      if (footer) footer.style.display = '';
    };
  }, []);

  return children;
}
