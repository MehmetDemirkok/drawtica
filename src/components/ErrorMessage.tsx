import React from 'react';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  className?: string;
}

export default function ErrorMessage({ 
  message, 
  type = 'error', 
  onRetry, 
  className = '' 
}: ErrorMessageProps) {
  const typeStyles = {
    error: 'bg-red-900/20 border-red-500/50 text-red-400',
    warning: 'bg-yellow-900/20 border-yellow-500/50 text-yellow-400',
    info: 'bg-blue-900/20 border-blue-500/50 text-blue-400'
  };

  const icons = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`p-4 rounded-lg border ${typeStyles[type]} ${className}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg">{icons[type]}</span>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-xs underline hover:no-underline transition-all"
            >
              Tekrar Dene
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function SuccessMessage({ message, className = '' }: { message: string; className?: string }) {
  return (
    <div className={`p-4 rounded-lg border bg-green-900/20 border-green-500/50 text-green-400 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="text-lg">✅</span>
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
} 