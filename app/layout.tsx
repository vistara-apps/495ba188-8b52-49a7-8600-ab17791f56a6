import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KnowYourRights Now',
  description: 'Your instant guide to rights and de-escalation during police interactions.',
  keywords: 'civil rights, police interactions, legal rights, de-escalation, safety',
  authors: [{ name: 'KnowYourRights Now Team' }],
  openGraph: {
    title: 'KnowYourRights Now',
    description: 'Your instant guide to rights and de-escalation during police interactions.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KnowYourRights Now',
    description: 'Your instant guide to rights and de-escalation during police interactions.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
