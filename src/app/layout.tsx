import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drawtica - AI ile Fotoğrafını Boyama Sayfasına Dönüştür | Ücretsiz",
  description: "Yapay zeka teknolojisi ile fotoğraflarınızı saniyeler içinde boyama sayfasına çevirin. Ücretsiz deneme, PDF indirme, çocuklar için eğitici aktivite. En iyi AI boyama sayfası oluşturucu.",
  keywords: [
    "boyama sayfası",
    "AI boyama sayfası",
    "fotoğraf boyama sayfası",
    "çocuk boyama sayfası",
    "PDF boyama sayfası",
    "yapay zeka boyama",
    "ücretsiz boyama sayfası",
    "eğitici aktivite",
    "çocuk aktivitesi",
    "AI görsel işleme"
  ],
  authors: [{ name: "Drawtica Team" }],
  creator: "Drawtica",
  publisher: "Drawtica",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://drawtica.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Drawtica - AI ile Fotoğrafını Boyama Sayfasına Dönüştür",
    description: "Yapay zeka teknolojisi ile fotoğraflarınızı saniyeler içinde boyama sayfasına çevirin. Ücretsiz deneme, PDF indirme.",
    url: "https://drawtica.com/",
    siteName: "Drawtica",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Drawtica - AI Boyama Sayfası Oluşturucu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drawtica - AI ile Fotoğrafını Boyama Sayfasına Dönüştür",
    description: "Yapay zeka teknolojisi ile fotoğraflarınızı saniyeler içinde boyama sayfasına çevirin.",
    images: ["/og-image.jpg"],
    creator: "@drawtica",
    site: "@drawtica",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "VHtyX1kl8bZX5K0L-7BnEI0fZ0ZuuqVuEfN3eHoFWRc",
    yandex: "your-yandex-verification-code",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://drawtica.com/" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Drawtica",
              "description": "Yapay zeka ile fotoğraflarınızı boyama sayfasına dönüştürün",
              "url": "https://drawtica.com",
              "applicationCategory": "EntertainmentApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "TRY"
              },
              "creator": {
                "@type": "Organization",
                "name": "Drawtica"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <main className="flex-1 flex flex-col items-center justify-center">
            {children}
          </main>
        </AuthProvider>
        <footer className="w-full py-6 text-center text-gray-400 text-xs border-t border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 mt-10">
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2 items-center justify-center">
              <span className="font-semibold text-gray-700 dark:text-gray-200">Drawtica</span>
            </div>
            <div>
              &copy; {new Date().getFullYear()} Drawtica. Tüm hakları saklıdır.
            </div>
            <div className="flex gap-4 justify-center mt-1">
              <a href="mailto:destek@drawtica.com" className="hover:underline">İletişim</a>
              <a href="/about" className="hover:underline">Hakkında</a>
              <a href="/faq" className="hover:underline">SSS</a>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
