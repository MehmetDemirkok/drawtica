import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600`} />
      {text && <span className="text-sm text-gray-400">{text}</span>}
    </div>
  );
}

export function LoadingOverlay({ text = 'Yükleniyor...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[var(--card-background)] rounded-xl p-8 border border-indigo-900/50 shadow-2xl">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
} 