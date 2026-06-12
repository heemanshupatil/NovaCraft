'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync session and profile state
  const handleSession = async (session) => {
    if (session?.user) {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          // If profile welcome_sent flag is false, trigger serverless welcome API
          if (!profile.welcome_sent) {
            fetch('/api/auth/welcome', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: profile.id, email: profile.email, name: profile.name }),
            })
            .then(res => {
              if (res.ok) {
                // local update to profiles state
                profile.welcome_sent = true;
              }
            })
            .catch(() => {});
          }

          setUser({
            id: session.user.id,
            email: session.user.email,
            name: profile.name,
            role: profile.role,
            avatar: profile.name.charAt(0).toUpperCase(),
          });
        } else {
          // Fallback if profile trigger is delayed
          const metaName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Valued Client';
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: metaName,
            role: 'client',
            avatar: metaName.charAt(0).toUpperCase(),
          });
        }
      } catch (err) {
        console.error('Session sync error:', err);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    // 1. Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      handleSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  /** Register user in Supabase Auth. Sync trigger creates profile. */
  const register = async ({ name, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  };

  /** Login user in Supabase Auth */
  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  };

  /** Google Sign-In redirect */
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  };

  /** Sign out session */
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, signInWithGoogle, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
