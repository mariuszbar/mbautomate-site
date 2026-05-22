import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MB Automate | AI Automation for Modern Businesses',
  description: 'AI chatbots, workflow automation, and AI agents for service businesses, agencies, clinics, real estate, ecommerce, and local companies.',
  metadataBase: new URL('https://mbautomate.com'),
  openGraph: {
    title: 'MB Automate',
    description: 'AI Automation for Modern Businesses',
    url: 'https://mbautomate.com',
    siteName: 'MB Automate',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
