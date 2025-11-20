import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }

  const queryStr = (req.query.query || "").trim();
  if (!queryStr) return res.status(200).json([]);

  try {
    // Supabase search using ilike for case-insensitive pattern matching
    const { data: books, error } = await supabase
      .from('books')
      .select('id, title, authors')
      .or(`title.ilike.%${queryStr}%,authors.ilike.%${queryStr}%`)
      .limit(5);

    if (error) throw error;

    res.status(200).json(books);
  } catch (err) {
    console.error('search error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
