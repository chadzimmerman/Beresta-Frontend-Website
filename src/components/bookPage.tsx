import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CartContext } from "../App";
import AltHeader from "./altHeader";
import Footer from "./footer";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabaseClient";

interface Book {
  id: number;
  title: string;
  subtitle: string;
  authors: string;
  translators: string;
  price: number;
  description: string;
  cover_photo: string;
  isbn: string;
  illustrators?: string;
  amazon_link: string | null;
  is_autographed_available: boolean;
  autographed_price?: number;
  status: "available" | "upcoming";
  gallery_photos?: string[];
}

const AMAZON_STORE =
  "https://www.amazon.com/stores/Chad-Michael-Zimmerman/author/B093YNBZX3?ref=sr_ntt_srch_lnk_3&qid=1759242462&sr=1-3&isDramIntegrated=true&shoppingPortalEnabled=true&ccs_id=c0969932-854f-468b-a234-26f687fa5ebd";

function BookPage() {
  const { t, i18n } = useTranslation() as { t: (key: string) => string; i18n: any };
  const isRu = i18n.language === "ru";
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const { setCart } = useContext(CartContext);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data, error } = await supabase
          .from("books")
          .select("*")
          .eq("id", Number(id))
          .single();
        if (error) throw error;
        setBook(data);
      } catch (error) {
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  // Close lightbox on Escape, navigate with arrow keys
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!lightboxOpen || !book) return;
      const allImages = [book.cover_photo, ...(book.gallery_photos ?? [])];
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i + 1) % allImages.length);
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i - 1 + allImages.length) % allImages.length);
    },
    [lightboxOpen, book]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  const handleNotify = async () => {
    if (!book || !notifyEmail) return;
    const { error } = await supabase
      .from("release_notifications")
      .insert({ email: notifyEmail, book_id: book.id });
    if (error && error.code !== "23505") {
      toast.error("Something went wrong. Please try again.");
    } else {
      setNotifySubmitted(true);
      toast.success("You'll be notified when this book is released!");
    }
  };

  const addToCart = (price?: number) => {
    if (!book) return;
    const newItem = {
      id: book.id,
      title: book.title,
      price: Math.round((price ?? book.price) * 100),
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
    toast.success(`${book.title} added to cart!`);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <p>{t("loading")}</p>
    </div>
  );
  if (!book) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <p>{t("bookNotFound")}</p>
    </div>
  );

  const allImages = [book.cover_photo, ...(book.gallery_photos ?? [])];

  return (
    <div style={styles.page}>
      <AltHeader />
      <div className="book-page-container" style={styles.container}>
        {/* Cover image — clickable */}
        <div style={styles.coverColumn}>
          <img
            className="book-cover-image"
            src={book.cover_photo}
            alt={book.title}
            style={styles.cover}
            onClick={() => openLightbox(0)}
          />
          {/* Thumbnail strip — only shown if there are extra photos */}
          {(book.gallery_photos ?? []).length > 0 && (
            <div style={styles.thumbnailStrip}>
              {allImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`View ${i + 1}`}
                  style={{
                    ...styles.thumbnail,
                    outline: i === 0 ? "2px solid #AC3737" : "2px solid transparent",
                  }}
                  onClick={() => openLightbox(i)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="book-right-column" style={styles.rightColumn}>
          {/* Title Section */}
          <div style={styles.titleSection}>
            <h1 style={{ ...styles.title, fontSize: isRu ? "30px" : "28px" }}>{book.title}</h1>
            {book.subtitle && <p style={{ ...styles.subtitle, fontSize: isRu ? "20px" : "18px" }}>{book.subtitle}</p>}
            {book.authors && <p style={{ ...styles.metaText, fontSize: isRu ? "17px" : "16px" }}>by {book.authors}</p>}
            {book.translators && (
              <p style={{ ...styles.metaText, fontSize: isRu ? "17px" : "16px" }}>Translators: {book.translators}</p>
            )}
          </div>

          {/* Paperback Box */}
          <div style={styles.paperbackBox}>
            {book.status === "upcoming" ? (
              <>
                <h2 style={styles.paperbackTitle}>Coming Soon</h2>
                <p style={{ ...styles.text, marginBottom: "15px" }}>
                  This title is not yet available. Enter your email below and
                  we'll notify you when it releases.
                </p>
                {notifySubmitted ? (
                  <p style={{ color: "#AC3737", fontWeight: "bold" }}>
                    ✓ You're on the list!
                  </p>
                ) : (
                  <div style={styles.notifyForm}>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      style={styles.notifyInput}
                    />
                    <button onClick={handleNotify} style={styles.notifyButton}>
                      Notify Me
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
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
                  <a
                    href={book.amazon_link ?? AMAZON_STORE}
                    style={styles.amazonButton}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("bookPage.purchaseOnAmazon")}
                  </a>
                  {book.is_autographed_available &&
                  book.autographed_price != null ? (
                    <button
                      style={styles.cartButton}
                      onClick={() => addToCart(book.autographed_price!)}
                    >
                      {t("bookPage.purchaseAutographedCopy")}
                    </button>
                  ) : null}
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <div style={styles.bottomSection}>
            {book.description && (
              <div style={styles.description}>
                <h3 style={{ ...styles.sectionTitle, fontSize: isRu ? "22px" : "20px" }}>Description</h3>
                <p style={{ ...styles.text, fontSize: isRu ? "17px" : "16px", lineHeight: isRu ? "1.8" : "1.6" }}>{book.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div style={styles.lightboxOverlay} onClick={() => setLightboxOpen(false)}>
          <div style={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button style={styles.lightboxClose} onClick={() => setLightboxOpen(false)}>
              ✕
            </button>

            {/* Main image */}
            <div style={styles.lightboxMain}>
              {allImages.length > 1 && (
                <button
                  style={styles.lightboxArrow}
                  onClick={() => setLightboxIndex((i) => (i - 1 + allImages.length) % allImages.length)}
                >
                  &#8249;
                </button>
              )}
              <img
                src={allImages[lightboxIndex]}
                alt={`${book.title} — view ${lightboxIndex + 1}`}
                style={styles.lightboxImage}
              />
              {allImages.length > 1 && (
                <button
                  style={styles.lightboxArrow}
                  onClick={() => setLightboxIndex((i) => (i + 1) % allImages.length)}
                >
                  &#8250;
                </button>
              )}
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div style={styles.lightboxThumbs}>
                {allImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Thumbnail ${i + 1}`}
                    style={{
                      ...styles.lightboxThumb,
                      outline: i === lightboxIndex ? "2px solid #AC3737" : "2px solid transparent",
                      opacity: i === lightboxIndex ? 1 : 0.55,
                    }}
                    onClick={() => setLightboxIndex(i)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
  coverColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flexShrink: 0,
  },
  cover: {
    maxWidth: "300px",
    width: "100%",
    height: "auto",
    marginTop: 0,
    borderRadius: "4px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.22)",
    cursor: "zoom-in",
  },
  thumbnailStrip: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    maxWidth: "300px",
  },
  thumbnail: {
    width: "60px",
    height: "78px",
    objectFit: "cover",
    borderRadius: "3px",
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  rightColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    fontFamily: "inherit",
    marginTop: 0,
  },
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
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "18px",
    marginBottom: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  },
  paperbackTitle: {
    color: "#AC3737",
    fontSize: "18px",
    margin: "0 0 10px 0",
  },
  infoContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "15px",
  },
  infoColumn: {
    flex: 1,
    display: "block",
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
  bottomSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: "20px",
    margin: "0 0 10px 0",
  },
  notifyForm: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  notifyInput: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontFamily: "inherit",
  },
  notifyButton: {
    backgroundColor: "#AC3737",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    fontFamily: "inherit",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  // Lightbox
  lightboxOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  lightboxContent: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    maxWidth: "90vw",
    maxHeight: "90vh",
  },
  lightboxClose: {
    position: "absolute",
    top: "-40px",
    right: 0,
    background: "none",
    border: "none",
    color: "white",
    fontSize: "24px",
    cursor: "pointer",
    lineHeight: 1,
  },
  lightboxMain: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  lightboxImage: {
    maxHeight: "70vh",
    maxWidth: "75vw",
    objectFit: "contain",
    borderRadius: "4px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
  },
  lightboxArrow: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "56px",
    lineHeight: 1,
    cursor: "pointer",
    userSelect: "none",
    padding: "0 8px",
    opacity: 0.8,
  },
  lightboxThumbs: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  lightboxThumb: {
    width: "60px",
    height: "78px",
    objectFit: "cover",
    borderRadius: "3px",
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  description: {},
};

export default BookPage;
