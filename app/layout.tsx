import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import '@/styles/globals.css';
import '@/styles/header.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://berestapress.com'),
  title: 'Beresta Press | Independent Literary Publisher of Eastern Thought & Folklore',
  description:
    'Beresta Press (Beresta Literary Press) is an independent publisher bringing rare and untranslated works into English — Japanese yokai and Slavic folklore, philosophy, history, fairy tales, and Orthodox Christian texts. Purchase signed author copies directly or find our books on Amazon.',
  alternates: { canonical: '/' },
  openGraph: {
    siteName: 'Beresta Press',
    type: 'website',
    url: 'https://berestapress.com',
  },
};

// schema.org Organization + WebSite — tells Google that "Beresta Press",
// "Beresta Literary Press", and berestapress.com are the same entity
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://berestapress.com/#organization',
  name: 'Beresta Press',
  alternateName: ['Beresta Literary Press', 'berestapress'],
  url: 'https://berestapress.com',
  logo: 'https://berestapress.com/assets/logo-site.png',
  description:
    'Independent literary publisher bringing rare and untranslated works into English — Japanese yokai and Slavic folklore, philosophy, history, fairy tales, and Orthodox Christian texts.',
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://berestapress.com/#website',
  name: 'Beresta Press',
  alternateName: 'Beresta Literary Press',
  url: 'https://berestapress.com',
  publisher: { '@id': 'https://berestapress.com/#organization' },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://berestapress.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
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
        <link rel="icon" href="/assets/logo-site-letters.png" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/logo-site-letters.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
