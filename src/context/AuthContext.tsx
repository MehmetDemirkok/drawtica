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
      } catch (error) {
        setSession({ user: null, isLoading: false, error: 'Session error' });
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      // TODO: Replace with actual API call
      const mockUser: User = {
        id: '1',
        email,
        role: 'free',
        credits: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      localStorage.setItem('drawtica_user', JSON.stringify(mockUser));
      setSession({ user: mockUser, isLoading: false });
      
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<AuthResponse> => {
    try {
      // TODO: Replace with actual API call
      const mockUser: User = {
        id: '1',
        email,
        name,
        role: 'free',
        credits: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      localStorage.setItem('drawtica_user', JSON.stringify(mockUser));
      setSession({ user: mockUser, isLoading: false });
      
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
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