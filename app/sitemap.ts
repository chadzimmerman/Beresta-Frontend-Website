import { createClient } from '@supabase/supabase-js';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: books } = await supabase.from('books').select('slug');

  const bookUrls = (books ?? []).map((book: { slug: string }) => ({
    url: `https://berestapress.com/book/${book.slug}`,
    priority: 0.9,
    changeFrequency: 'monthly' as const,
  }));

  return [
    { url: 'https://berestapress.com', priority: 1.0, changeFrequency: 'weekly' },
    { url: 'https://berestapress.com/about', priority: 0.8, changeFrequency: 'monthly' },
    { url: 'https://berestapress.com/faq', priority: 0.6, changeFrequency: 'monthly' },
    ...bookUrls,
  ];
}
