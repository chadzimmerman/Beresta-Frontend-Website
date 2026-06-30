import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import '@/styles/globals.css';
import '@/styles/header.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://berestapress.com'),
  title: 'Beresta Press',
  description:
    'Beresta Press is an independent literary publisher specializing in translated works. Purchase signed author copies directly or find our books on Amazon.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inknut+Antiqua:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/beresta-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/beresta-logo.png" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
