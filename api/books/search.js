// api/books/search.js
const { getPool } = require("../_db");

module.exports = async (req, res) => {

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

  const query = (req.query.query || "").trim();
  if (!query) return res.status(200).json([]);

  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      `SELECT id, title, authors FROM books 
       WHERE title LIKE ? OR authors LIKE ? 
       LIMIT 5`,
      [`%${query}%`, `%${query}%`]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("search error:", err);
    res.status(500).json({ error: "Database query failed" });
  }
};

//handles GET /api/books/search?query=...