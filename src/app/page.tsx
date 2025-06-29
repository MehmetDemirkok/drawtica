"use client";
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import PricingPlans from "@/components/PricingPlans";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage, { SuccessMessage } from "@/components/ErrorMessage";
import FileUpload from "@/components/FileUpload";

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

const howItWorks = [
  {
    step: 1,
    icon: "📤",
    title: "Fotoğrafını Yükle",
    description: "JPEG veya PNG formatında fotoğrafınızı yükleyin"
  },
  {
    step: 2,
    icon: "🤖",
    title: "AI İşleme",
    description: "Yapay zeka fotoğrafınızı analiz eder ve boyama sayfasına dönüştürür"
  },
  {
    step: 3,
    icon: "📄",
    title: "PDF İndir",
    description: "Hazır boyama sayfanızı PDF formatında indirin"
  }
];

function HomeContent() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [freeCreditsUsed, setFreeCreditsUsed] = useState(0);

  const { session, updateUser, resetCredits, signOut } = useAuth();
  const { user } = session;
  const searchParams = useSearchParams();

  // localStorage'ı client-side'da güvenli şekilde kullan
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const used = parseInt(localStorage.getItem('freeCreditsUsed') || '0');
      setFreeCreditsUsed(used);
    }
  }, []);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      setShowPaymentSuccess(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!file) return;

    // Kullanıcı giriş yapmamışsa ve ücretsiz hakları bittiyse
    if (!user) {
      // Ücretsiz hakları kontrol et
      if (freeCreditsUsed >= MAX_FREE_CREDITS) {
        setShowAuthModal(true);
        return;
      }
    } else {
      // Giriş yapmış kullanıcının kredisi yoksa
      if (user.credits <= 0) {
        setShowPricingModal(true);
        return;
      }
    }

    setPdfBase64(null);
    setImageBase64(null);
    setShowResultModal(false);

    const processRequest = async (base64Image: string | null) => {
      setLoading(true);
      try {
        const payload = {
          inputImage: base64Image,
        };

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        console.log("API response:", data);

        if (res.ok && data.success && data.pdfBase64) {
          setMessage("PDF başarıyla oluşturuldu!");
          setPdfBase64(data.pdfBase64);
          setImageBase64(data.imageBase64 || null);
          
          // Kredi kullanımını güncelle
          if (user && typeof user.credits === "number") {
            updateUser({
              ...user,
              credits: user.credits - 1,
            });
          } else {
            // Ücretsiz hakları kullan
            const newUsed = freeCreditsUsed + 1;
            setFreeCreditsUsed(newUsed);
            if (typeof window !== 'undefined') {
              localStorage.setItem('freeCreditsUsed', newUsed.toString());
            }
          }
          
          setShowResultModal(true);
        } else {
          setMessage(data.error || "Bir hata oluştu. Lütfen tekrar deneyin.");
          setPdfBase64(null);
          setImageBase64(null);
          setShowResultModal(false);
        }
      } catch {
        setMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        processRequest(reader.result as string);
      };
      reader.onerror = (error) => {
        console.error("File reading error: ", error);
        setMessage("Dosya okunurken bir hata oluştu.");
        setLoading(false);
      };
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfBase64) return;
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${pdfBase64}`;
    link.download = "coloring-page.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectPlan = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // TODO: Implement payment integration
    alert("Ödeme sistemi entegrasyonu yakında!");
  };

  return (
    <>
      <div className="min-h-screen w-full bg-[var(--background)] text-white flex flex-col items-center px-2">
        {/* Header */}
        <header className="w-full max-w-7xl flex flex-col sm:flex-row items-center justify-between py-6 px-4 gap-4">
          <div className="text-2xl font-bold gradient-text">Drawtica</div>
          <nav className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center" role="navigation" aria-label="Ana navigasyon">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
              Özellikler
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
              Fiyatlandırma
            </a>
            {user ? (
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
                <span className="text-gray-300 text-sm sm:text-base">
                  {typeof user.credits === "number" ? user.credits : 0} kredi
                </span>
                <span className="text-gray-300 font-semibold text-sm sm:text-base hidden sm:block">
                  {user.name || user.email}
                </span>
                <button
                  onClick={() => setShowPricingModal(true)}
                  className="bg-indigo-900/50 text-white px-3 py-2 rounded-lg hover:bg-indigo-900/70 
                           transition-all duration-200 text-sm"
                >
                  Kredi Al
                </button>
                <button
                  onClick={signOut}
                  className="bg-red-900/60 text-red-300 px-3 py-2 rounded-lg hover:bg-red-900/80 text-sm"
                >
                  Çıkış
                </button>
                {user?.role === "ADMIN" && (
                  <button
                    onClick={resetCredits}
                    className="bg-green-900/60 text-green-300 px-3 py-2 rounded-lg hover:bg-green-900/80 text-sm"
                  >
                    Sıfırla
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
                <span className="text-gray-300 text-sm sm:text-base">
                  {MAX_FREE_CREDITS - freeCreditsUsed} ücretsiz hak
                </span>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-4 py-2 
                         rounded-lg font-semibold hover:from-indigo-600 hover:to-cyan-600 
                         transition-all duration-200 text-sm"
                >
                  Giriş Yap
                </button>
              </div>
            )}
          </nav>
        </header>

        {/* Hero Section */}
        <section className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12 py-16 md:py-24 px-4" role="banner">
          <div className="flex-1 flex flex-col gap-8 items-start">
            <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-900/30 to-cyan-900/30 px-4 py-2 rounded-full border border-indigo-500/30">
              <span className="animate-pulse">✨</span>
              <span className="text-sm text-indigo-300 font-medium">AI Powered Coloring Pages</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                Fotoğrafını <span className="gradient-text">Boyama Sayfasına</span> Dönüştür!
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl">
                Drawtica ile fotoğrafını yükle, yapay zeka ile <span className="font-semibold text-cyan-400">boyama sayfası</span> olarak indir.
                İlk <span className="font-bold text-orange-400">3 hakkın ücretsiz!</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-[var(--card-background)] px-4 py-3 rounded-lg border border-indigo-900/50">
              <span className="text-sm text-gray-400">Kalan ücretsiz hakkın:</span>
              <span className={`text-lg font-bold px-3 py-1 rounded-full ${
                user && typeof user.credits === "number" && user.credits > 0
                  ? "bg-green-900/60 text-green-300"
                  : "bg-red-900/60 text-red-300"
              }`}>
                {user && typeof user.credits === "number" ? user.credits : MAX_FREE_CREDITS} / {MAX_FREE_CREDITS}
              </span>
            </div>

            <div className="w-full max-w-md">
              <FileUpload
                onFileSelect={setFile}
                loading={loading}
                className="mb-4"
              />
              
              <button
                onClick={handleSubmit}
                disabled={!file || loading}
                className={`relative overflow-hidden bg-gradient-to-r from-indigo-500 to-cyan-500 
                           text-white px-8 py-4 rounded-lg font-semibold w-full transition-all 
                           duration-300 shadow-lg hover:shadow-indigo-500/25 
                           hover:from-indigo-600 hover:to-cyan-600 focus:ring-2 
                           focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed
                           transform hover:scale-105 active:scale-95 ${loading ? "animate-pulse" : ""}`}
              >
                {loading ? (
                  <LoadingSpinner size="sm" text="Oluşturuluyor..." />
                ) : (
                  "Oluştur"
                )}
              </button>
              
              {message && (
                <div className="mt-4">
                  {message.includes('başarıyla') || message.includes('successfully') ? (
                    <SuccessMessage message={message} />
                  ) : (
                    <ErrorMessage message={message} type="error" />
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Hero Image/Illustration */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-[var(--card-background)] rounded-3xl p-8 border border-indigo-900/50 shadow-2xl">
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-xl font-bold text-white">AI Boyama Sayfası</h3>
                  <p className="text-gray-400 text-sm">
                    Fotoğrafınızı yükleyin, AI ile boyama sayfasına dönüştürün
                  </p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full max-w-7xl py-20 px-4" role="region" aria-labelledby="features-heading">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Özellikler</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Drawtica ile fotoğraflarınızı saniyeler içinde profesyonel boyama sayfalarına dönüştürün
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <article key={index} className="hover-card bg-[var(--card-background)] rounded-xl p-6 
                                        border border-indigo-900/50">
                <div className="text-4xl mb-4" role="img" aria-label={feature.title}>{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-indigo-300">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="w-full max-w-7xl py-20 px-4" role="region" aria-labelledby="how-it-works-heading">
          <div className="text-center mb-16">
            <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Nasıl Çalışır?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Sadece 3 adımda fotoğrafınızı boyama sayfasına dönüştürün
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <article key={index} className="hover-card bg-[var(--card-background)] rounded-xl p-8 
                           border border-indigo-900/50 text-center">
                <div className="text-4xl mb-4" role="img" aria-label={step.title}>{step.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-indigo-300">{step.step}. {step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="w-full max-w-7xl py-20 px-4" role="region" aria-labelledby="seo-content-heading">
          <div className="text-center mb-16">
            <h2 id="seo-content-heading" className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">AI Boyama Sayfası Oluşturucu</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <article className="space-y-6">
              <h3 className="text-2xl font-bold text-indigo-300 mb-4">Çocuklar İçin Eğitici Aktivite</h3>
              <p className="text-gray-300 leading-relaxed">
                Drawtica, çocukların yaratıcılığını geliştirmek için tasarlanmış yapay zeka destekli bir boyama sayfası oluşturucudur. 
                Fotoğraflarınızı yükleyerek saniyeler içinde profesyonel boyama sayfaları oluşturabilirsiniz.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Özellikle ebeveynler, öğretmenler ve çocuk bakıcıları için ideal olan bu araç, 
                çocukların el-göz koordinasyonunu geliştirirken eğlenceli vakit geçirmelerini sağlar.
              </p>
            </article>
            
            <article className="space-y-6">
              <h3 className="text-2xl font-bold text-indigo-300 mb-4">Ücretsiz AI Teknolojisi</h3>
              <p className="text-gray-300 leading-relaxed">
                En son yapay zeka teknolojisi kullanarak fotoğraflarınızı analiz eder ve 
                mükemmel çizgi çizimlerine dönüştürür. Google&apos;ın Gemini AI modeli sayesinde 
                yüksek kaliteli sonuçlar elde edersiniz.
              </p>
              <p className="text-gray-300 leading-relaxed">
                İlk 3 kullanımınız tamamen ücretsizdir. Daha fazla boyama sayfası oluşturmak için 
                uygun fiyatlı paketlerimizi inceleyebilirsiniz.
              </p>
            </article>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full max-w-7xl py-20 px-4" role="region" aria-labelledby="pricing-heading">
          <div className="text-center mb-16">
            <h2 id="pricing-heading" className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Fiyatlandırma</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              İhtiyacınıza uygun paketi seçin ve sınırsız boyama sayfası oluşturun
            </p>
          </div>
          
          <PricingPlans onSelectPlan={handleSelectPlan} />
        </section>

        {/* FAQ Section */}
        <section className="w-full max-w-7xl py-20 px-4" role="region" aria-labelledby="faq-heading">
          <div className="text-center mb-16">
            <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Sık Sorulan Sorular</span>
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <article className="bg-[var(--card-background)] rounded-xl p-6 border border-indigo-900/50">
              <h3 className="text-xl font-semibold mb-3 text-indigo-300">Hangi dosya formatları desteklenir?</h3>
              <p className="text-gray-300">JPEG ve PNG formatındaki fotoğraflar desteklenmektedir. Maksimum dosya boyutu 5MB&apos;dır.</p>
            </article>
            
            <article className="bg-[var(--card-background)] rounded-xl p-6 border border-indigo-900/50">
              <h3 className="text-xl font-semibold mb-3 text-indigo-300">Boyama sayfaları nasıl indirilir?</h3>
              <p className="text-gray-300">Oluşturulan boyama sayfaları PDF formatında indirilir. Bu sayede yazdırma ve paylaşım kolaylaşır.</p>
            </article>
            
            <article className="bg-[var(--card-background)] rounded-xl p-6 border border-indigo-900/50">
              <h3 className="text-xl font-semibold mb-3 text-indigo-300">Fotoğraflarım güvende mi?</h3>
              <p className="text-gray-300">Evet, fotoğraflarınız sadece işlem sırasında kullanılır ve sunucularımızda saklanmaz.</p>
            </article>
          </div>
        </section>

        {/* Result Modal */}
        {showResultModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[var(--card-background)] rounded-xl p-8 max-w-md w-full border border-indigo-900/50">
              <h3 className="text-2xl font-bold mb-4 text-center">🎉 Başarılı!</h3>
              <p className="text-gray-300 mb-6 text-center">
                Boyama sayfanız başarıyla oluşturuldu. PDF dosyasını indirebilirsiniz.
              </p>
              
              {imageBase64 && (
                <div className="mb-6">
                  <Image 
                    src={imageBase64} 
                    alt="Oluşturulan boyama sayfası" 
                    width={400}
                    height={300}
                    className="w-full rounded-lg border border-indigo-900/50"
                  />
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-4 py-3 
                           rounded-lg font-semibold hover:from-indigo-600 hover:to-cyan-600 
                           transition-all duration-200"
                >
                  PDF İndir
                </button>
                <button
                  onClick={() => setShowResultModal(false)}
                  className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold 
                           hover:bg-gray-700 transition-all duration-200"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Success Modal */}
        {showPaymentSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[var(--card-background)] rounded-xl p-8 max-w-md w-full border border-indigo-900/50 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-4">Ödeme Başarılı!</h3>
              <p className="text-gray-300 mb-6">
                Kredileriniz hesabınıza eklendi. Artık daha fazla boyama sayfası oluşturabilirsiniz.
              </p>
              <button
                onClick={() => setShowPaymentSuccess(false)}
                className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-6 py-3 
                         rounded-lg font-semibold hover:from-indigo-600 hover:to-cyan-600 
                         transition-all duration-200"
              >
                Tamam
              </button>
            </div>
          </div>
        )}

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        )}

        {/* Pricing Modal */}
        {showPricingModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[var(--card-background)] rounded-xl p-8 max-w-4xl w-full border border-indigo-900/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Kredi Satın Al</h3>
                <button
                  onClick={() => setShowPricingModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <PricingPlans onSelectPlan={handleSelectPlan} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen w-full bg-[var(--background)] flex items-center justify-center">
      <LoadingSpinner size="lg" text="Yükleniyor..." />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}
