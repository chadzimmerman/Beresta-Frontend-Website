import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AltHeader from "./altHeader";
import Footer from "./footer";

interface Book {
  id: number;
  title: string;
  authors: string;
  cover_photo: string;
}

function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!category) return;

    axios
      .get(
        `http://localhost:3000/api/books?category=${encodeURIComponent(
          category
        )}`
      )
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err));
  }, [category]);

  const goToBook = (id: number) => {
    navigate(`/book/${id}`);
  };

  return (
    <div style={styles.container}>
      <AltHeader />
      <h1 style={styles.title}>{category}</h1>
      <div style={styles.grid}>
        {books.map((book) => (
          <div key={book.id} style={styles.card}>
            <img
              src={`http://localhost:3000${book.cover_photo}`} // prepend backend URL
              alt={book.title}
              style={styles.cover}
              onClick={() => goToBook(book.id)}
            />

            <h3 style={styles.bookTitle}>{book.title}</h3>
            <p style={styles.author}>{book.authors}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: { fontSize: "28px", marginBottom: "20px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  },
  card: { cursor: "pointer", textAlign: "center" },
  cover: { width: "100%", height: "auto" },
  bookTitle: { margin: "10px 0 5px 0", fontSize: "16px" },
  author: { margin: 0, fontSize: "14px", color: "#555" },
};

export default CategoryPage;
