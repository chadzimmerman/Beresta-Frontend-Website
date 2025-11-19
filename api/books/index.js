// api/books/index.js
const { getPool } = require("../_db");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const category = req.query.category?.toString();
    let sql = "SELECT * FROM books";
    const params = [];

    if (category) {
      sql += " WHERE JSON_CONTAINS(tags, JSON_QUOTE(?))";
      params.push(category);
    }

    console.log("SQL:", sql, "Params:", params);
    const pool = getPool();
    const [rows] = await pool.execute(sql, params);
    res.status(200).json(rows);
  } catch (err) {
    console.error("books error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

//handles GET /api/books?category=...