'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserSession, AuthResponse } from '@/types/user';

interface AuthContextType {
  session: UserSession;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, name: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => void;
  resetCredits: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('drawtica_user');
        if (storedUser) {
          setSession({
            user: JSON.parse(storedUser),
            isLoading: false,
          });
        } else {
          setSession({ user: null, isLoading: false });
        }
      } catch {
        setSession({ user: null, isLoading: false });
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok && data.user) {
        localStorage.setItem('drawtica_user', JSON.stringify(data.user));
        setSession({ user: data.user, isLoading: false });
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Giriş başarısız' };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return { success: false, error: 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.' };
      }
      return { success: false, error: 'Giriş işlemi başarısız. Lütfen daha sonra tekrar deneyin.' };
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      
      const data = await res.json();
      
      if (res.ok && data.user) {
        localStorage.setItem('drawtica_user', JSON.stringify(data.user));
        setSession({ user: data.user, isLoading: false });
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Kayıt başarısız' };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return { success: false, error: 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.' };
      }
      return { success: false, error: 'Kayıt işlemi başarısız. Lütfen daha sonra tekrar deneyin.' };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('drawtica_user');
    setSession({ user: null, isLoading: false });
  };

  const updateUser = (user: User) => {
    localStorage.setItem('drawtica_user', JSON.stringify(user));
    setSession({ user, isLoading: false });
  };

  // Kullanıcı kredilerini sıfırla (veya 3'e çek)
  const resetCredits = () => {
    if (session.user) {
      const updatedUser = { ...session.user, credits: 3 };
      localStorage.setItem('drawtica_user', JSON.stringify(updatedUser));
      setSession({ ...session, user: updatedUser });
    }
  };

  return (
    <AuthContext.Provider value={{
      ...session,
      session,
      signIn,
      signUp,
      signOut,
      updateUser,
      resetCredits,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 