import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StructuredData from '@/components/StructuredData';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prems.in';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Prem Saktheesh - AI & Cloud Transformation Leader',
    template: '%s | Prem Saktheesh',
  },
  description: '26+ years leading $35M portfolios, 300+ global teams, and $100M+ modernization programs across Tier-1 financial institutions.',
  keywords: [
    'AI Transformation',
    'Cloud Architecture',
    'Enterprise Technology',
    'Digital Transformation',
    'Financial Services Technology',
    'Technology Leadership',
    'AI/ML Platforms',
    'Cloud Migration',
    'Enterprise Architecture',
  ],
  authors: [{ name: 'Prem Saktheesh' }],
  creator: 'Prem Saktheesh',
  publisher: 'Prem Saktheesh',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Prem Saktheesh',
    title: 'Prem Saktheesh - AI & Cloud Transformation Leader',
    description: '26+ years leading $35M portfolios, 300+ global teams, and $100M+ modernization programs across Tier-1 financial institutions.',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Prem Saktheesh - AI & Cloud Transformation Leader',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prem Saktheesh - AI & Cloud Transformation Leader',
    description: '26+ years leading $35M portfolios, 300+ global teams, and $100M+ modernization programs.',
    images: [`${baseUrl}/og-image.jpg`],
    creator: '@prems',
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
  alternates: {
    canonical: baseUrl,
    types: {
      'application/rss+xml': [{ url: `${baseUrl}/feed.xml`, title: 'Prem Saktheesh Blog RSS Feed' }],
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#3B82F6' },
    ],
  },
  manifest: `${baseUrl}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <GoogleAnalytics />
        <StructuredData />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
