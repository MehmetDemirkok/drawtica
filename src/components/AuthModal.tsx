'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register' | 'forgot';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setForgotMessage('');
    
    try {
      if (mode === 'login') {
        const response = await signIn(email, password);
        if (response.success) {
          onClose();
        } else {
          setError(response.error || 'Giriş başarısız');
        }
      } else if (mode === 'register') {
        const response = await signUp(email, password, name);
        if (response.success) {
          onClose();
        } else {
          setError(response.error || 'Kayıt başarısız');
        }
      } else if (mode === 'forgot') {
        // Şifremi unuttum formu
        const res = await fetch('/api/auth/request-password-reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok) {
          setForgotMessage(data.message || 'Eğer bu e-posta sistemde varsa, sıfırlama linki gönderildi.');
        } else {
          setError(data.error || 'Şifre sıfırlama başarısız');
        }
      }
    } catch (_) {
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (newMode: 'login' | 'register' | 'forgot') => {
    setMode(newMode);
    setError('');
    setForgotMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
      <div className="bg-[var(--card-background)] rounded-xl shadow-xl p-8 max-w-md w-full 
                     border border-indigo-900/50 animate-fade-in relative">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold gradient-text mb-2">
            {mode === 'login' && 'Giriş Yap'}
            {mode === 'register' && 'Hesap Oluştur'}
            {mode === 'forgot' && 'Şifremi Unuttum'}
          </h2>
          <p className="text-gray-400">
            {mode === 'login' && 'Drawtica hesabınıza giriş yapın'}
            {mode === 'register' && 'Yeni bir Drawtica hesabı oluşturun'}
            {mode === 'forgot' && 'E-posta adresinizi girin, sıfırlama linki gönderelim.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Ad Soyad
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-indigo-900/50 
                         text-white focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                required
              />
            </div>
          )}

          {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                E-posta
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-indigo-900/50 
                         text-white focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                required
              />
            </div>
          )}

          {(mode === 'login' || mode === 'register') && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Şifre
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-indigo-900/50 
                         text-white focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                required
              />
              {mode === 'login' && (
                <button
                  type="button"
                  className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 underline"
                  onClick={() => handleModeChange('forgot')}
                >
                  Şifremi Unuttum?
                </button>
              )}
            </div>
          )}

          {mode === 'forgot' && forgotMessage && (
            <div className="text-green-400 text-sm bg-green-900/20 p-3 rounded-lg">
              {forgotMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200
                     bg-gradient-to-r from-indigo-500 to-cyan-500 text-white
                     hover:from-indigo-600 hover:to-cyan-600 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loader border-2 border-t-2 border-white border-t-cyan-400 
                               rounded-full w-5 h-5 inline-block animate-spin"></span>
                Yükleniyor...
              </span>
            ) : mode === 'login' ? (
              'Giriş Yap'
            ) : mode === 'register' ? (
              'Kayıt Ol'
            ) : (
              'Sıfırlama Linki Gönder'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          {mode === 'login' && (
            <button
              onClick={() => handleModeChange('register')}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Hesabınız yok mu? Kayıt olun
            </button>
          )}
          {mode === 'register' && (
            <button
              onClick={() => handleModeChange('login')}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Zaten hesabınız var mı? Giriş yapın
            </button>
          )}
          {mode === 'forgot' && (
            <button
              onClick={() => handleModeChange('login')}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Giriş ekranına dön
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
} 