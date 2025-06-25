import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
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
  title: "Drawtica - Fotoğrafını Boyama Sayfasına Dönüştür!",
  description: "Yapay zeka ile fotoğrafını kolayca boyama sayfasına çevir ve PDF olarak indir.",
  openGraph: {
    title: "Drawtica - Fotoğrafını Boyama Sayfasına Dönüştür!",
    description: "Yapay zeka ile fotoğrafını kolayca boyama sayfasına çevir ve PDF olarak indir.",
    url: "https://drawtica.com/",
    siteName: "Drawtica",
    images: [
      {
        url: "/examples/pattern.png",
        width: 1200,
        height: 630,
        alt: "Drawtica Logo",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drawtica - Fotoğrafını Boyama Sayfasına Dönüştür!",
    description: "Yapay zeka ile fotoğrafını kolayca boyama sayfasına çevir ve PDF olarak indir.",
    images: ["/examples/pattern.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
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
              <Image src="/examples/object.png" alt="Drawtica Logo" width={24} height={24} className="inline dark:invert" />
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
