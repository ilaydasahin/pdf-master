import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {Geist, Geist_Mono} from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "../globals.css";
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { StructuredData } from '@/components/StructuredData';
import { GoogleAnalytics, GoogleAdSense } from '@/components/Analytics';
import CookieConsent from '@/components/common/CookieConsent';
import type { Metadata, Viewport } from 'next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

// Viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#6366f1' },
    { media: '(prefers-color-scheme: dark)', color: '#1e293b' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// Enhanced metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://pdftools.com'),
  title: {
    default: 'PDF Tools - Free Online PDF Editor & Converter',
    template: '%s | PDF Tools'
  },
  description: 'Free online PDF tools: merge, split, compress, convert. No installation required. 100% secure.',
  keywords: ['pdf', 'merge pdf', 'split pdf', 'compress pdf', 'pdf converter', 'ocr', 'free pdf'],
  authors: [{ name: 'PDF Tools Team' }],
  creator: 'PDF Tools',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://pdftools.com',
    siteName: 'PDF Tools',
    title: 'PDF Tools - Free PDF Editor',
    description: 'Free online PDF tools. Secure and fast.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Tools',
    description: 'Free Online PDF Tools',
  },
  alternates: {
    canonical: 'https://pdftools.com',
    languages: {
      'en': 'https://pdftools.com/en',
      'tr': 'https://pdftools.com/tr',
    },
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const messages = await getMessages();
  const { locale } = await params;
 
  return (
    <html lang={locale} className="h-full">
      <head>
        <StructuredData type="organization" />
        <StructuredData type="website" />
        <StructuredData type="software" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col`}>
        {/* Google Analytics */}
        <GoogleAnalytics />
        {/* Google AdSense */}
        <GoogleAdSense />
        
        <ErrorBoundary>
          <NextIntlClientProvider messages={messages}>
            <Toaster position="top-right" />
            <Navbar />
            <main className="flex-grow bg-gray-50">
              {children}
            </main>
            <Footer />
            
            {/* GDPR Cookie Consent */}
            <CookieConsent />
          </NextIntlClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}


