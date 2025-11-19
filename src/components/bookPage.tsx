import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CartContext } from "../App";
import AltHeader from "./altHeader";
import Footer from "./footer";

interface Book {
  id: number;
  title: string;
  subtitle: string;
  authors: string;
  translators: string;
  price: number;
  stock: number;
  description: string;
  reviews: string | null;
  cover_photo: string;
  isbn: string;
  categories: string;
  copyright_date?: number;
  published_date?: string;
  illustrators?: string;
  back_art_url?: string | null;
  inside_peek_url?: string | null;
  created_at?: string;
  amazon_link: string | null;
  cover_art_url: string;
  is_autographed_available: boolean;
  autographed_price?: number;
}

const AMAZON_STORE =
  "https://www.amazon.com/stores/Chad-Michael-Zimmerman/author/B093YNBZX3?ref=sr_ntt_srch_lnk_3&qid=1759242462&sr=1-3&isDramIntegrated=true&shoppingPortalEnabled=true&ccs_id=c0969932-854f-468b-a234-26f687fa5ebd";

function BookPage() {
  const { t } = useTranslation() as { t: (key: string) => string };
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const { cart, setCart } = useContext(CartContext);
  console.log("BookPage CartContext:", { cart, setCart });

  useEffect(() => {
    const fetchBook = async () => {
      console.log("Fetching book for id:", id);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/books`
        ); // Fetch all books
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log("Fetched books:", data);
        const foundBook = data.find((b: Book) => b.id === Number(id)); // Filter by ID
        console.log("Found book:", foundBook);
        setBook(foundBook || null);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return dateString.slice(0, 10);
  };
  const addToCart = (price?: number) => {
    if (!book) return;
    const newItem = {
      id: book.id,
      title: book.title,
      price: Math.round((price ?? book.price) * 100), // use autographed price if provided
      quantity: 1,
    };
    setCart((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  console.log("Rendering - loading:", loading, "book:", book);

  if (loading) return <p>{t("loading")}</p>;
  if (!book) return <p>{t("bookNotFound")}</p>;

  return (
    <div style={styles.page}>
      <AltHeader />
      <div className="book-page-container" style={styles.container}>
        <img
          className="book-cover-image"
          src={book.cover_photo}
          alt={book.title}
          style={styles.cover}
        />
        <div className="book-right-column" style={styles.rightColumn}>
          {/* Title Section */}
          <div style={styles.titleSection}>
            <h1 style={styles.title}>{book.title}</h1>
            {book.subtitle && <p style={styles.subtitle}>{book.subtitle}</p>}
            {book.authors && <p style={styles.metaText}>by {book.authors}</p>}
            {book.translators && (
              <p style={styles.metaText}>Translators: {book.translators}</p>
            )}
          </div>

          {/* Paperback Box */}
          <div style={styles.paperbackBox}>
            <h2 style={styles.paperbackTitle}>Paperback</h2>
            <div style={styles.infoContainer}>
              <div style={styles.infoColumn}>
                <p style={styles.infoLabel}>
                  ISBN: <span style={styles.infoValue}>{book.isbn}</span>
                </p>
                <p style={styles.infoLabel}>
                  List Price:{" "}
                  <span style={styles.infoValue}>${book.price}</span>
                </p>
              </div>
              <div style={styles.infoColumn}>
                <p style={styles.infoLabel}>
                  Page Count: <span style={styles.infoValue}>N/A</span>
                </p>
                <p style={styles.infoLabel}>
                  Autographed Price:{" "}
                  <span style={styles.infoValue}>
                    {book.autographed_price
                      ? `$${Number(book.autographed_price).toFixed(2)}`
                      : "N/A"}
                  </span>
                </p>
              </div>
            </div>
            <div style={styles.buttonContainer}>
              {/* Amazon Button (always shows if link exists) */}
              {book.amazon_link && (
                <a
                  href={book.amazon_link}
                  style={styles.amazonButton}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("bookPage.purchaseOnAmazon")}
                </a>
              )}

              {/* Autographed Copy Add-to-Cart Button */}
              {book.is_autographed_available &&
              book.autographed_price !== undefined ? (
                <button
                  style={styles.cartButton}
                  onClick={() => addToCart(book.autographed_price)}
                >
                  {t("bookPage.purchaseAutographedCopy")}
                </button>
              ) : null}
            </div>
          </div>

          {/* Reviews and Description */}
          <div style={styles.bottomSection}>
            {book.reviews && (
              <div style={styles.reviews}>
                <h3 style={styles.sectionTitle}>Reviews</h3>
                <p style={styles.text}>{book.reviews}</p>
              </div>
            )}
            {book.description && (
              <div style={styles.description}>
                <h3 style={styles.sectionTitle}>Description</h3>
                <p style={styles.text}>{book.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  container: {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    padding: "0 20px 20px 20px",
    maxWidth: "1000px",
    margin: "0 auto",
    flex: 1,
  },
  cover: {
    maxWidth: "300px",
    height: "auto",
    marginTop: 0,
  },
  rightColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    fontFamily: "inherit",
    marginTop: 0,
  },
  // Title Section
  titleSection: {
    margin: 0,
    paddingTop: 0,
  },
  title: {
    fontSize: "28px",
    margin: "0 0 10px 0",
    lineHeight: 1,
  },
  subtitle: {
    fontSize: "18px",
    fontStyle: "italic",
    margin: "0 0 10px 0",
  },
  text: {
    fontSize: "16px",
    margin: "5px 0",
    color: "#000000",
  },
  metaText: {
    fontSize: "16px",
    margin: "5px 0",
    color: "#A3A3A3",
  },
  paperbackBox: {
    border: "1px solid #000000",
    padding: "15px",
    marginBottom: "15px",
  },
  paperbackTitle: {
    color: "#AC3737",
    fontSize: "18px",
    margin: "0 0 10px 0",
  },
  infoContainer: {
    display: "flex", // Two columns side by side
    gap: "20px", // Space between columns
    marginBottom: "15px",
  },
  infoColumn: {
    flex: 1, // Equal width for each column
    display: "block", // Stack items vertically (default)
  },
  infoLabel: {
    color: "#868686",
    fontSize: "16px",
    margin: "5px 0",
  },
  infoValue: {
    color: "#000000",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
    justifyContent: "center",
    fontFamily: "inherit",
  },
  amazonButton: {
    flex: 1,
    backgroundColor: "#AC3737",
    color: "white",
    padding: "20px 20px",
    textDecoration: "none",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "center",
    fontFamily: "inherit",
  },
  cartButton: {
    flex: 1,
    backgroundColor: "#AC3737",
    color: "white",
    padding: "1px 20px",
    fontSize: "16px",
    fontFamily: "inherit",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  // Bottom Section
  bottomSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: "20px",
    margin: "0 0 10px 0",
  },
};

export default BookPage;
