import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
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

  try {
    const category = req.query.category?.toString();

    let query = supabase.from('books').select('*');

    // Optional category filtering (assuming `tags` is a text[] or JSON column)
    if (category) {
      query = query.contains('tags', [category]); // works if tags is JSON array
    }

    const { data: books, error } = await query;

    if (error) throw error;

    res.status(200).json(books);
  } catch (err) {
    console.error('books error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
