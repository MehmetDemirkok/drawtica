'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const checkoutFormContent = searchParams.get('checkoutFormContent');
  const planId = searchParams.get('plan');

  if (!checkoutFormContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Ödeme Hatası</h1>
          <p className="text-gray-400 mb-6">Ödeme formu bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">
            <span className="gradient-text">Güvenli Ödeme</span>
          </h1>
          <p className="text-gray-400">
            iyzico ile güvenli ödeme yapın
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Ödeme Formu */}
          <div className="bg-[var(--card-background)] p-6 rounded-lg border border-indigo-900/50">
            <h3 className="text-lg font-semibold text-white mb-4">Ödeme Bilgileri</h3>
            <div
              id="iyzipay-checkout-form"
              className="min-h-[400px]"
              dangerouslySetInnerHTML={{ __html: checkoutFormContent || '' }}
            />
          </div>
          {/* Ödeme Özeti */}
          <div className="bg-[var(--card-background)] p-6 rounded-lg border border-indigo-900/50">
            <h3 className="text-lg font-semibold text-white mb-4">Ödeme Özeti</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Plan:</span>
                <span className="text-white">
                  {planId === 'premium-monthly' ? 'Premium Aylık' : 'Premium Yıllık'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tutar:</span>
                <span className="text-white font-semibold">
                  ₺{planId === 'premium-monthly' ? '29.99' : '299.99'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Kredi:</span>
                <span className="text-white">
                  {planId === 'premium-monthly' ? '100' : '1500'} kredi
                </span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-indigo-900/30 rounded-lg">
              <h4 className="font-semibold text-indigo-200 mb-2">🔒 Güvenli Ödeme</h4>
              <p className="text-gray-400 text-sm">
                iyzico ile 256-bit SSL şifrelemesi ile güvenli ödeme yapın. 
                Kart bilgileriniz asla saklanmaz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 