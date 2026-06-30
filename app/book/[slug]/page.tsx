import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';
import BookPageClient from '@/components/BookPageClient';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Rebuild each book page at most once per hour; new slugs work immediately via ISR
export const revalidate = 3600;

// Pre-render all known book slugs at build time
export async function generateStaticParams() {
  const { data } = await getSupabase().from('books').select('slug');
  return (data ?? []).map((book: { slug: string }) => ({ slug: book.slug }));
}

// Per-page <title> and <meta description> injected into the HTML <head>
export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const { data: book } = await getSupabase()
    .from('books')
    .select('title, description, cover_photo')
    .eq('slug', slug)
    .single();

  if (!book) return { title: 'Book Not Found | Beresta Press' };

  return {
    title: `${book.title} | Beresta Press`,
    description: book.description,
    openGraph: {
      title: `${book.title} | Beresta Press`,
      description: book.description,
      images: book.cover_photo ? [{ url: book.cover_photo }] : [],
    },
  };
}

export default async function BookPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const { data: book } = await getSupabase()
    .from('books')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!book) notFound();

  // schema.org/Book — embedded in the server-rendered HTML so Google reads it
  // immediately without executing JavaScript
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    description: book.description,
    isbn: book.isbn,
    image: book.cover_photo,
    url: `https://berestapress.com/book/${book.slug}`,
    author: book.authors
      ? book.authors.split(',').map((name: string) => ({
          '@type': 'Person',
          name: name.trim(),
        }))
      : [],
    publisher: {
      '@type': 'Organization',
      name: 'Beresta Press',
      url: 'https://berestapress.com',
    },
    ...(book.page_count ? { numberOfPages: book.page_count } : {}),
    ...(book.status === 'available'
      ? {
          offers: {
            '@type': 'Offer',
            price: book.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `https://berestapress.com/book/${book.slug}`,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BookPageClient book={book} />
    </>
  );
}
