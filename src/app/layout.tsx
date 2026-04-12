import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cyber Band',
  description: 'Chat with your cyber band, create music, get sheet music for real performance',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--stage-bg)]">{children}</body>
    </html>
  );
}
