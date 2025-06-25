"use client";
import React, { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Eğer bu e-posta sistemde varsa, sıfırlama linki gönderildi.");
      } else {
        setError(data.error || "Bir hata oluştu.");
      }
    } catch {
      setError("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Şifremi Unuttum</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-posta adresiniz"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Gönderiliyor..." : "Sıfırlama Linki Gönder"}
          </button>
        </form>
        {message && <div className="text-green-600">{message}</div>}
        {error && <div className="text-red-600">{error}</div>}
      </div>
    </div>
  );
} 