import type { Metadata } from 'next';
import AmberCursor from '@/components/AmberCursor';
import CyberPreloader from '@/components/CyberPreloader';
import './globals.css';

export const metadata: Metadata = {
  title: 'AdaptivePrereq // Educational Roadmap',
  description: 'AI-grounded prerequisite knowledge graph and curriculum generator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#050505] text-[#f4f4f5] antialiased overflow-x-hidden selection:bg-yellow-400 selection:text-black">
        {/* Visual FX Layers */}
        <CyberPreloader />
        <AmberCursor />
        {children}
      </body>
    </html>
  );
}