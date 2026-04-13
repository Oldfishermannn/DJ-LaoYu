import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DJ Cyber - AI 实时音乐',
  description: 'Chat with DJ Cyber, generate real-time music with Google Lyria',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className="min-h-screen bg-[var(--stage-bg)]">{children}</body>
    </html>
  );
}
