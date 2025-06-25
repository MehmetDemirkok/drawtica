"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("Geçersiz doğrulama linki.");
      setLoading(false);
      return;
    }
    fetch(`/api/auth/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setMessage("E-posta adresiniz başarıyla doğrulandı. Giriş yapabilirsiniz.");
        } else {
          setError(data.error || "Bir hata oluştu.");
        }
      })
      .catch(() => setError("Bir hata oluştu."))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">E-posta Doğrulama</h1>
        {loading && <div>Doğrulanıyor...</div>}
        {message && <div className="text-green-600">{message}</div>}
        {error && <div className="text-red-600">{error}</div>}
      </div>
    </div>
  );
} 