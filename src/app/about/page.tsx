"use client";
import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Hakkında</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          <span className="font-bold text-blue-600">Drawtica</span>, yapay zeka destekli bir platformdur. Amacımız, kullanıcıların kendi fotoğraflarını kolayca <span className="font-semibold">boyama sayfasına</span> dönüştürmelerini sağlamak ve yaratıcılıklarını özgürce ortaya koymalarına yardımcı olmaktır.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Drawtica ile yüklediğiniz fotoğraflar, güvenli bir şekilde işlenir ve asla üçüncü şahıslarla paylaşılmaz. Kullanıcı gizliliği ve veri güvenliği en büyük önceliğimizdir.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Vizyonumuz:</span> Herkesin kendi sanatını yaratabileceği, güvenli ve erişilebilir bir dijital platform sunmak.
        </p>
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          İletişim: <a href="mailto:destek@drawtica.com" className="text-blue-600 hover:underline">destek@drawtica.com</a>
        </div>
      </div>
    </div>
  );
} 