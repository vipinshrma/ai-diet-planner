import { Session } from '@supabase/supabase-js';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

type SignUpResult = {
  error: string | null;
  needsEmailVerification: boolean;
};

type AuthContextValue = {
  session: Session | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<string | null>;
  signUpWithPassword: (email: string, password: string) => Promise<SignUpResult>;
  sendOtp: (email: string) => Promise<string | null>;
  verifyOtp: (email: string, token: string) => Promise<string | null>;
  signInWithGoogle: () => Promise<string | null>;
  sendPasswordReset: (email: string) => Promise<string | null>;
  updatePassword: (password: string) => Promise<string | null>;
  signOut: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const redirectUri = makeRedirectUri({
  scheme: 'ai-diet-planner',
  path: 'auth',
  preferLocalhost: true,
});

const resetRedirectUri = makeRedirectUri({
  scheme: 'ai-diet-planner',
  path: 'reset-password',
  preferLocalhost: true,
});

function formatErrorMessage(message?: string) {
  if (!message) {
    return 'Something went wrong. Please try again.';
  }

  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password.';
  }

  if (message.includes('Email rate limit exceeded')) {
    return 'Too many attempts. Please wait a minute before retrying.';
  }

  return message;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      loading,
      async signInWithPassword(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? formatErrorMessage(error.message) : null;
      },
      async signUpWithPassword(email, password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUri,
            data: { onboarded: false },
          },
        });

        return {
          error: error ? formatErrorMessage(error.message) : null,
          needsEmailVerification: !data.session,
        };
      },
      async sendOtp(email) {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectUri,
            shouldCreateUser: true,
          },
        });
        return error ? formatErrorMessage(error.message) : null;
      },
      async verifyOtp(email, token) {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'email',
        });
        return error ? formatErrorMessage(error.message) : null;
      },
      async signInWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUri,
            skipBrowserRedirect: Platform.OS !== 'web',
          },
        });

        if (error) {
          return formatErrorMessage(error.message);
        }

        if (Platform.OS === 'web') {
          return null;
        }

        if (data?.url) {
          const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
          if (result.type === 'success' && result.url) {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(result.url);
            return exchangeError ? formatErrorMessage(exchangeError.message) : null;
          }

          return 'Google sign-in was cancelled.';
        }

        return null;
      },
      async sendPasswordReset(email) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: resetRedirectUri,
        });
        return error ? formatErrorMessage(error.message) : null;
      },
      async updatePassword(password) {
        const { error } = await supabase.auth.updateUser({ password });
        return error ? formatErrorMessage(error.message) : null;
      },
      async signOut() {
        const { error } = await supabase.auth.signOut();
        return error ? formatErrorMessage(error.message) : null;
      },
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
