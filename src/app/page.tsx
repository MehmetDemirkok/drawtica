"use client";
import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import PricingPlans from "@/components/PricingPlans";
import type { PricingPlan } from "@/types/user";

const MAX_FREE_CREDITS = 3;

const features = [
  {
    icon: "🎨",
    title: "Kolay Kullanım",
    description: "Sadece birkaç tıklama ile fotoğraflarınızı boyama sayfasına dönüştürün"
  },
  {
    icon: "🤖",
    title: "AI Teknolojisi",
    description: "En son yapay zeka teknolojisi ile mükemmel sonuçlar"
  },
  {
    icon: "⚡",
    title: "Hızlı İşlem",
    description: "Saniyeler içinde boyama sayfanız hazır"
  },
  {
    icon: "🔒",
    title: "Güvenli",
    description: "Fotoğraflarınız güvenle işlenir ve saklanmaz"
  }
];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const { session, updateUser, resetCredits, signOut } = useAuth();
  const { user } = session;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    // Kullanıcı giriş yapmamışsa
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Kredisi yoksa
    if (user.credits <= 0) {
      setShowPricingModal(true);
      return;
    }

    setLoading(true);
    setMessage("");
    setImageBase64(null);
    setShowImage(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      console.log("API response:", data); // Debug için eklendi

      if (res.ok && data.imageBase64) {
        setMessage("Fotoğraf başarıyla işlendi!");
        setImageBase64(data.imageBase64);
        // Krediyi güncelle
        if (user && typeof user.credits === "number") {
          updateUser({
            ...user,
            credits: user.credits - 1,
          });
        }
        setTimeout(() => setShowImage(true), 100);
      } else {
        setMessage(data.error || "Bir hata oluştu. Lütfen tekrar deneyin.");
        setImageBase64(null);
        setShowImage(false);
      }
    } catch (err) {
      setMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!imageBase64) return;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });
    // A4: 210mm x 297mm
    // Görseli ortala ve tam sayfaya sığdır
    pdf.addImage(
      `data:image/png;base64,${imageBase64}`,
      "PNG",
      0,
      0,
      210,
      297
    );
    pdf.save("coloring-page.pdf");
  };

  const handleSelectPlan = async (plan: PricingPlan) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // TODO: Implement payment integration
    alert("Ödeme sistemi entegrasyonu yakında!");
  };

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-white flex flex-col items-center px-2">
      {/* Header */}
      <header className="w-full max-w-7xl flex items-center justify-between py-6 px-4">
        <div className="text-2xl font-bold gradient-text">Drawtica</div>
        <nav className="flex items-center gap-6">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">
            Özellikler
          </a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
            Fiyatlandırma
          </a>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-300">
                {typeof user.credits === "number" ? user.credits : 0} kredi
              </span>
              <span className="text-gray-300 font-semibold">
                {user.name || user.email}
              </span>
              <button
                onClick={() => setShowPricingModal(true)}
                className="bg-indigo-900/50 text-white px-4 py-2 rounded-lg hover:bg-indigo-900/70 
                         transition-all duration-200"
              >
                Kredi Al
              </button>
              <button
                onClick={signOut}
                className="bg-red-900/60 text-red-300 px-4 py-2 rounded-lg ml-2 hover:bg-red-900/80"
              >
                Çıkış Yap
              </button>
              {process.env.NEXT_PUBLIC_USE_MOCK_OPENAI === "true" && (
                <button
                  onClick={resetCredits}
                  className="bg-green-900/60 text-green-300 px-4 py-2 rounded-lg ml-2 hover:bg-green-900/80"
                >
                  Kredileri Sıfırla
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-6 py-2 
                       rounded-lg font-semibold hover:from-indigo-600 hover:to-cyan-600 
                       transition-all duration-200"
            >
              Giriş Yap
            </button>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-10 py-16 md:py-24 px-4">
        <div className="flex-1 flex flex-col gap-6 items-start">
          <div className="flex items-center gap-2 bg-indigo-900/30 px-4 py-2 rounded-full">
            <span className="animate-pulse-soft">✨</span>
            <span className="text-sm text-indigo-300">AI Powered Coloring Pages</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Fotoğrafını <span className="gradient-text">Boyama Sayfasına</span> Dönüştür!
          </h1>
          <p className="text-lg text-gray-300">
            Drawtica ile fotoğrafını yükle, yapay zeka ile <span className="font-semibold text-cyan-400">boyama sayfası</span> olarak indir.
            İlk <span className="font-bold text-orange-400">3 hakkın ücretsiz!</span>
          </p>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-400">Kalan ücretsiz hakkın:</span>
            <span className={`text-lg font-bold px-3 py-1 rounded-full ${
              typeof user?.credits === "number" && user.credits > 0
                ? "bg-green-900/60 text-green-300"
                : "bg-red-900/60 text-red-300"
            }`}>
              {typeof user?.credits === "number" ? user.credits : 0} / {MAX_FREE_CREDITS}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-start mt-6 w-full max-w-sm">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                       file:text-sm file:font-semibold file:bg-indigo-900/80 file:text-indigo-200 
                       hover:file:bg-indigo-800 w-full transition-all duration-200 
                       bg-[var(--card-background)] rounded-lg text-gray-200 
                       border border-indigo-900/50 focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!file || loading}
              className={`relative overflow-hidden bg-gradient-to-r from-indigo-500 to-cyan-500 
                         text-white px-6 py-3 rounded-lg font-semibold w-full transition-all 
                         duration-200 shadow-lg hover:shadow-indigo-500/25 
                         hover:from-indigo-600 hover:to-cyan-600 focus:ring-2 
                         focus:ring-cyan-400 disabled:opacity-50 ${loading ? "animate-pulse" : ""}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loader border-2 border-t-2 border-white border-t-cyan-400 
                                 rounded-full w-5 h-5 inline-block animate-spin"></span>
                  Yükleniyor...
                </span>
              ) : (
                "Oluştur"
              )}
            </button>
            {message && (
              <div className="text-center text-green-400 font-medium mt-2 animate-fade-in">
                {message}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full max-w-7xl py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Özellikler</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Drawtica ile fotoğraflarınızı saniyeler içinde profesyonel boyama sayfalarına dönüştürün
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="hover-card bg-[var(--card-background)] rounded-xl p-6 
                                      border border-indigo-900/50">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-300">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="w-full max-w-7xl py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Nasıl Çalışır?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="hover-card bg-[var(--card-background)] rounded-xl p-8 
                         border border-indigo-900/50 text-center">
            <div className="text-4xl mb-4">📤</div>
            <h3 className="text-xl font-semibold mb-4 text-indigo-300">1. Fotoğrafını Yükle</h3>
            <p className="text-gray-400">
              Her türlü fotoğrafı yükleyebilirsin. (Hayvan, insan, obje, manzara...)
            </p>
          </div>

          <div className="hover-card bg-[var(--card-background)] rounded-xl p-8 
                         border border-indigo-900/50 text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-4 text-cyan-300">2. AI ile Dönüştür</h3>
            <p className="text-gray-400">
              Yapay zeka fotoğrafını temiz, kolay boyanabilir çizgi haline getirir.
            </p>
          </div>

          <div className="hover-card bg-[var(--card-background)] rounded-xl p-8 
                         border border-indigo-900/50 text-center">
            <div className="text-4xl mb-4">⬇️</div>
            <h3 className="text-xl font-semibold mb-4 text-orange-300">3. PDF/PNG Olarak İndir</h3>
            <p className="text-gray-400">
              Çıktını PDF veya PNG olarak indir, dilediğince boya!
            </p>
          </div>
        </div>
      </section>

      {/* Result Section */}
      {loading && (
        <div className="text-center text-cyan-400 mt-8">Yükleniyor, lütfen bekleyin...</div>
      )}

      {imageBase64 && (
        <section className={`w-full max-w-7xl flex flex-col gap-8 items-center border-t 
                           border-indigo-900/50 py-16 px-4 ${
                             showImage ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                           }`}>
          <h2 className="text-2xl font-bold gradient-text">Boyama Sayfan Hazır!</h2>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 
                          rounded-xl filter blur-3xl"></div>
            <img
              src={`data:image/png;base64,${imageBase64}`}
              alt="Coloring Page"
              className="relative max-w-md w-full border-2 border-indigo-900/50 rounded-xl 
                       shadow-xl bg-[var(--card-background)]"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleDownloadPDF}
              className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-6 py-3 
                       rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-500 
                       transition-all duration-200 shadow-lg hover:shadow-orange-500/25 
                       focus:ring-2 focus:ring-yellow-400"
            >
              PDF olarak indir
            </button>
          </div>
        </section>
      )}

      {!loading && !imageBase64 && message === "Fotoğraf başarıyla işlendi!" && (
        <div className="text-center text-red-500 mt-8">Görsel oluşturulamadı. Lütfen tekrar deneyin.</div>
      )}

      {/* Sonuç Modalı */}
      {showResultModal && imageBase64 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div
            className="relative flex flex-col items-center p-8 rounded-2xl shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #232046 60%, #1a2a3a 100%)",
              maxWidth: 520,
              width: '95%',
              boxShadow: '0 8px 40px 0 rgba(0,0,0,0.25)',
              border: '2px solid #2e2e4d',
              minHeight: 600,
            }}
          >
            <button
              onClick={() => setShowResultModal(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 text-white text-2xl font-bold shadow-lg transition-all"
              aria-label="Kapat"
              style={{ zIndex: 2 }}
            >
              ×
            </button>
            <h2 className="text-3xl font-extrabold gradient-text mb-4 text-center tracking-tight" style={{letterSpacing: 1}}>
              Boyama Sayfan Hazır!
            </h2>
            <div style={{
              width: '420px',
              height: '595px',
              maxWidth: '100%',
              maxHeight: '60vh',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '18px',
              overflow: 'hidden',
              marginBottom: '2rem',
              boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)',
              border: '1.5px solid #e0e0e0',
              padding: 12,
            }}>
              <img
                src={`data:image/png;base64,${imageBase64}`}
                alt="Coloring Page Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  background: 'white',
                  display: 'block',
                  boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
                  borderRadius: 12,
                }}
              />
            </div>
            <div className="w-full flex flex-col items-center gap-4">
              <button
                onClick={handleDownloadPDF}
                className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-orange-600 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-orange-500/25 focus:ring-2 focus:ring-yellow-400"
              >
                PDF olarak indir
              </button>
              <div className="text-green-400 font-semibold text-base mt-2">Çizimin başarıyla oluşturuldu! Dilediğin gibi indirip kullanabilirsin.</div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Section */}
      <section id="pricing">
        <PricingPlans
          onSelectPlan={handleSelectPlan}
          currentPlan={user?.role === 'premium' ? 'premium-monthly' : 'free'}
        />
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in min-h-screen p-2">
          <div className="bg-[var(--card-background)] rounded-xl shadow-xl p-4 sm:p-8 w-full max-w-md mx-2 sm:mx-4 border border-indigo-900/50 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold gradient-text">Kredi Satın Al</h3>
              <button
                onClick={() => setShowPricingModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
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
            <PricingPlans
              onSelectPlan={(plan) => {
                handleSelectPlan(plan);
                setShowPricingModal(false);
              }}
              currentPlan={user?.role === 'premium' ? 'premium-monthly' : 'free'}
              isModal
            />
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section id="faq" className="w-full max-w-7xl flex flex-col md:flex-row gap-10 py-20 px-4">
        <div className="flex-1 bg-[var(--card-background)] rounded-2xl p-8 shadow-lg 
                       border border-indigo-900/50">
          <h3 className="text-2xl font-bold text-indigo-300 mb-6">Sıkça Sorulan Sorular</h3>
          <div className="flex flex-col gap-6">
            <div className="hover-card">
              <h4 className="font-semibold text-indigo-200 mb-2">
                Yüklediğim fotoğraflar güvende mi?
              </h4>
              <p className="text-gray-400">
                Evet, tüm fotoğraflarınız güvenli bir şekilde işlenir ve asla üçüncü şahıslarla paylaşılmaz.
              </p>
            </div>
            <div className="hover-card">
              <h4 className="font-semibold text-indigo-200 mb-2">
                Hangi dosya türlerini yükleyebilirim?
              </h4>
              <p className="text-gray-400">
                PNG, JPG ve JPEG formatındaki fotoğrafları yükleyebilirsiniz.
              </p>
            </div>
            <div className="hover-card">
              <h4 className="font-semibold text-indigo-200 mb-2">
                Çıktı hangi formatta?
              </h4>
              <p className="text-gray-400">
                PNG olarak gösterilir, PDF olarak indirilebilir.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[var(--card-background)] rounded-2xl p-8 shadow-lg 
                       border border-indigo-900/50">
          <h3 className="text-2xl font-bold text-cyan-300 mb-6">Gizlilik & Güvenlik</h3>
          <p className="text-gray-400 leading-relaxed">
            Drawtica ile yüklediğiniz fotoğraflar sadece sizin için işlenir ve asla paylaşılmaz. 
            Sunucularımızda kalıcı olarak saklanmaz. Tüm işlemler güvenli bağlantı üzerinden gerçekleşir.
          </p>
          <div className="mt-8 p-4 bg-indigo-900/30 rounded-xl">
            <h4 className="font-semibold text-indigo-200 mb-2">🔒 Güvenlik Garantisi</h4>
            <p className="text-gray-400">
              Tüm verileriniz SSL şifrelemesi ile korunur ve işlem sonrası otomatik olarak silinir.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[var(--card-background)] border-t border-indigo-900/50 mt-20">
        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-bold gradient-text mb-2">Drawtica</span>
              <p className="text-gray-400 text-sm text-center md:text-left">
                AI Powered Coloring Page Generator
              </p>
            </div>
            <div className="flex gap-8">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                Özellikler
              </a>
              <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                Nasıl Çalışır
              </a>
              <a href="#faq" className="text-gray-400 hover:text-white transition-colors">
                SSS
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-indigo-900/50 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Drawtica. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
