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
        `${
          process.env.REACT_APP_API_BASE_URL
        }/api/books?category=${encodeURIComponent(category)}`
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
      <div className="category-content-and-stretch">
        <div className="category-page-container">
          <h1 className="category-title">{category}</h1>
          <div className="category-grid">
            {books.map((book) => (
              <div key={book.id} className="category-card">
                <img
                  src={book.cover_photo}
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
