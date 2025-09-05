import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KnowYourRights Now',
  description: 'Your instant guide to rights and de-escalation during police interactions',
  keywords: 'civil rights, police interaction, legal rights, de-escalation, emergency alert',
  authors: [{ name: 'KnowYourRights Now Team' }],
  creator: 'KnowYourRights Now',
  publisher: 'KnowYourRights Now',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'KnowYourRights Now',
    description: 'Your instant guide to rights and de-escalation during police interactions',
    url: '/',
    siteName: 'KnowYourRights Now',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KnowYourRights Now - Know Your Rights',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KnowYourRights Now',
    description: 'Your instant guide to rights and de-escalation during police interactions',
    images: ['/og-image.png'],
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
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Farcaster Frame meta tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="/frame-image.png" />
        <meta property="fc:frame:button:1" content="Know Your Rights" />
        <meta property="fc:frame:button:2" content="Emergency Alert" />
        <meta property="fc:frame:button:3" content="Get Scripts" />
        <meta property="fc:frame:post_url" content="/api/frame" />
        
        {/* PWA meta tags */}
        <meta name="application-name" content="KnowYourRights Now" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KnowYourRights Now" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#2563eb" />
        
        {/* Viewport and mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <div id="root">
          <main className="min-h-screen bg-bg">
            {children}
          </main>
        </div>
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

