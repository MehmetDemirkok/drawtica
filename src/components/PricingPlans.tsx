'use client';

import React from 'react';
import { PricingPlan } from '@/types/user';

const plans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Ücretsiz',
    price: 0,
    credits: 3,
    features: [
      '3 ücretsiz dönüştürme hakkı',
      'Temel kalite',
      'PNG ve PDF indirme',
    ],
  },
  {
    id: 'premium-monthly',
    name: 'Premium Aylık',
    price: 29.99,
    credits: 100,
    features: [
      'Aylık 100 dönüştürme hakkı',
      'Yüksek kalite',
      'PNG ve PDF indirme',
      'Öncelikli destek',
      'Reklamsız deneyim',
    ],
    recommended: true,
  },
  {
    id: 'premium-yearly',
    name: 'Premium Yıllık',
    price: 299.99,
    credits: 1500,
    features: [
      'Yıllık 1500 dönüştürme hakkı',
      'En yüksek kalite',
      'PNG ve PDF indirme',
      '7/24 öncelikli destek',
      'Reklamsız deneyim',
      '2 ay bedava',
    ],
  },
];

interface PricingPlansProps {
  onSelectPlan: (plan: PricingPlan) => void;
  currentPlan?: string;
  isModal?: boolean;
}

export default function PricingPlans({ onSelectPlan, currentPlan, isModal }: PricingPlansProps) {
  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="gradient-text">Üyelik Planları</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          İhtiyacınıza en uygun planı seçin ve hemen boyama sayfaları oluşturmaya başlayın
        </p>
      </div>

      <div className={`grid gap-8 ${isModal ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-[var(--card-background)] rounded-2xl p-8 
                       border-2 transition-all duration-300 hover:transform hover:-translate-y-2
                       ${plan.recommended 
                         ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' 
                         : 'border-indigo-900/50'}`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-indigo-500 text-white text-sm px-4 py-1 rounded-full">
                  Önerilen
                </span>
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl font-bold text-white">₺{plan.price}</span>
                {plan.id.includes('monthly') && (
                  <span className="text-gray-400">/ay</span>
                )}
                {plan.id.includes('yearly') && (
                  <span className="text-gray-400">/yıl</span>
                )}
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-300">
                  <svg
                    className="w-5 h-5 text-indigo-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelectPlan(plan)}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200
                        ${currentPlan === plan.id
                          ? 'bg-indigo-600 text-white cursor-default'
                          : plan.recommended
                            ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:from-indigo-600 hover:to-cyan-600'
                            : 'bg-indigo-900/50 text-white hover:bg-indigo-900/70'
                        }`}
              disabled={currentPlan === plan.id}
            >
              {currentPlan === plan.id ? 'Mevcut Plan' : 'Planı Seç'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 