import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AltHeader from "./altHeader";
import Footer from "./footer";
// Import the dedicated CSS file if you have one, or ensure app.css is linked
// import "./categoryPage.css";

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
    <div className="app-page-wrapper">
      <AltHeader />

      {/* 🚨 FIX 2: Create a new wrapper for content that needs vertical stretch 🚨 */}

      <div className="category-content-and-stretch">
        <div className="category-page-container">
          <h1 className="category-title">{category}</h1>

          <div className="category-grid">
            {books.map((book) => (
              <div key={book.id} className="category-card">
                <img
                  src={`http://localhost:3000${book.cover_photo}`} // prepend backend URL
                  alt={book.title}
                  className="category-cover-image"
                  onClick={() => goToBook(book.id)}
                />

                <h3 className="category-book-title">{book.title}</h3>

                <p className="category-author">{book.authors}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CategoryPage;
