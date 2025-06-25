"use client";
import React from "react";

const faqs = [
  {
    q: "Drawtica nedir?",
    a: "Drawtica, fotoğraflarınızı yapay zeka ile boyama sayfasına dönüştüren bir web uygulamasıdır."
  },
  {
    q: "Ücretsiz hakkım bitti, ne yapmalıyım?",
    a: "Daha fazla boyama sayfası oluşturmak için premium satın alabilirsiniz."
  },
  {
    q: "Yüklediğim fotoğraflar güvende mi?",
    a: "Evet, tüm fotoğraflarınız güvenli bir şekilde işlenir ve asla üçüncü şahıslarla paylaşılmaz."
  },
  {
    q: "Hangi dosya türlerini yükleyebilirim?",
    a: "PNG, JPG ve JPEG formatındaki fotoğrafları yükleyebilirsiniz."
  },
  {
    q: "Boyama sayfası çıktısı hangi formatta?",
    a: "Çıktı PNG olarak gösterilir ve PDF olarak indirilebilir."
  },
  {
    q: "Satın alma işlemi güvenli mi?",
    a: "Evet, ödeme işlemleri Stripe altyapısı ile güvenli şekilde gerçekleşir."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Sıkça Sorulan Sorular</h1>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">{faq.q}</div>
              <div className="text-gray-700 dark:text-gray-300">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 