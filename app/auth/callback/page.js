'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Completing sign in...');

  useEffect(() => {
    let redirected = false;

    // Listen for the auth state change triggered by the hash tokens
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (redirected) return;
      if (event === 'SIGNED_IN' && session) {
        redirected = true;
        setStatus('Success! Redirecting...');
        router.replace('/dashboard');
      }
    });

    // Also check if session is already set (handles race conditions)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (redirected) return;
      if (session) {
        redirected = true;
        setStatus('Success! Redirecting...');
        router.replace('/dashboard');
      } else {
        // Give it 4 seconds then redirect to login
        setTimeout(() => {
          if (!redirected) {
            redirected = true;
            router.replace('/login?error=Google+sign-in+failed.+Please+try+again.');
          }
        }, 4000);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0A0A0F',
      color: '#E2E8F0',
      fontFamily: 'Inter, sans-serif',
      gap: '20px',
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        border: '3px solid rgba(59,130,246,0.2)',
        borderTop: '3px solid #3B82F6',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ fontSize: '1rem', color: '#94A3B8', margin: 0 }}>{status}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
