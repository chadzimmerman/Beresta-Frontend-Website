import React, { useState } from "react";
import AltHeader from "./altHeader";
import Footer from "./footer";

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}

interface FAQSection {
  title: string;
  items: FAQItemProps[];
}

const linkStyle: React.CSSProperties = {
  color: "#AC3737",
  textDecoration: "underline",
};

const faqSections: FAQSection[] = [
  {
    title: "Autographed Copies",
    items: [
      {
        question: "Who signs the autographed copies?",
        answer:
          "All autographed copies sold directly through berestapress.com are personally signed by C. M. Zimmerman and Svetlana Zimmerman. For original works, both the author and illustrator sign. For translated works, the signatures are from our translation and illustration team — not the original historical authors.",
      },
      {
        question: "For translated books, is the autograph from the original author?",
        answer:
          "No. For translated works such as our Russian folktale collections, the original authors are historical figures. The autographs are from C. M. Zimmerman (translator) and Svetlana Zimmerman (illustrator), who produced the Beresta Literary Press edition of that work.",
      },
    ],
  },
  {
    title: "Shipping & Delivery",
    items: [
      {
        question: "How long does shipping take?",
        answer:
          "Orders are shipped within 2–3 business days via USPS Media Mail and typically arrive within 7–10 business days. We currently ship to US addresses only.",
      },
      {
        question: "What if my package is lost or damaged?",
        answer: (
          <>
            Please email us at{" "}
            <a href="mailto:halftonellc@gmail.com" style={linkStyle}>
              halftonellc@gmail.com
            </a>{" "}
            with your order details and a photo if applicable. We'll work with
            you to make it right.
          </>
        ),
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Not at this time. We currently only ship within the United States. For international customers, some of our titles are available through Amazon's international storefronts.",
      },
    ],
  },
  {
    title: "Amazon vs. Direct Purchase",
    items: [
      {
        question: "What is the difference between buying on Amazon and buying directly?",
        answer:
          "Buying directly from our site supports us more as a small independent press — more of the sale goes directly to the creators. Direct purchases also give you the option of an autographed copy. Amazon is a great option if you prefer their checkout experience or want faster Prime shipping.",
      },
      {
        question: "Why are some books only available on Amazon?",
        answer:
          "Some titles are currently distributed exclusively through Amazon's network. We're working to make all titles available directly through our site as well.",
      },
    ],
  },
  {
    title: "Supporting Beresta Literary Press",
    items: [
      {
        question: "How can I best support your press?",
        answer:
          "The single most impactful thing you can do is leave an honest review on Amazon. Reviews directly help our books reach more readers through Amazon's algorithm, and for a small independent press, even a short review makes an enormous difference. We're genuinely grateful for every one.",
      },
    ],
  },
  {
    title: "Bulk Sales & Wholesale",
    items: [
      {
        question: "Do you offer bulk or wholesale pricing for bookstores and libraries?",
        answer: (
          <>
            Yes — we welcome inquiries from bookstores, libraries, schools, and
            other institutions interested in carrying our titles. Please reach
            out to us at{" "}
            <a href="mailto:halftonellc@gmail.com" style={linkStyle}>
              halftonellc@gmail.com
            </a>{" "}
            with your organization name, the titles you're interested in, and
            the quantity you have in mind. We'll respond with pricing and terms.
          </>
        ),
      },
      {
        question: "Can I resell Beresta Literary Press books in my store?",
        answer: (
          <>
            Absolutely. We're happy to work with independent retailers who want
            to carry our books. Contact us at{" "}
            <a href="mailto:halftonellc@gmail.com" style={linkStyle}>
              halftonellc@gmail.com
            </a>{" "}
            to discuss wholesale arrangements.
          </>
        ),
      },
    ],
  },
  {
    title: "Contact & General",
    items: [
      {
        question: "How do I get in touch with you?",
        answer: (
          <>
            You can reach us at{" "}
            <a href="mailto:halftonellc@gmail.com" style={linkStyle}>
              halftonellc@gmail.com
            </a>
            . We typically respond within 1–2 business days.
          </>
        ),
      },
      {
        question: "Do you accept returns?",
        answer:
          "Due to the nature of physical books and autographed copies, we do not accept returns. However, if your order arrives damaged or incorrect, please contact us and we will make it right.",
      },
    ],
  },
];

function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div style={styles.item}>
      <button style={styles.question} onClick={() => setOpen((o) => !o)}>
        <span>{question}</span>
        <span style={styles.chevron}>{open ? "−" : "+"}</span>
      </button>
      {open && <div style={styles.answer}>{answer}</div>}
    </div>
  );
}

function FAQPage() {
  return (
    <div className="app-page-wrapper">
      <AltHeader />
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Frequently Asked Questions</h1>
        <p style={styles.intro}>
          Have a question not covered here? Email us at{" "}
          <a href="mailto:halftonellc@gmail.com" style={linkStyle}>
            halftonellc@gmail.com
          </a>
          .
        </p>
        {faqSections.map((section) => (
          <div key={section.title} style={styles.section}>
            <h2 style={styles.sectionTitle}>{section.title}</h2>
            {section.items.map((item) => (
              <FAQItem key={item.question} {...item} />
            ))}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "760px",
    margin: "0 auto",
    padding: "40px 20px 60px",
    flex: 1,
  },
  pageTitle: {
    fontSize: "32px",
    marginBottom: "10px",
    fontFamily: "'inknut antiqua', sans-serif",
  },
  intro: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "40px",
    lineHeight: "1.6",
  },
  section: {
    marginBottom: "36px",
  },
  sectionTitle: {
    fontSize: "18px",
    color: "#AC3737",
    borderBottom: "1px solid #e0d6cc",
    paddingBottom: "8px",
    marginBottom: "12px",
    fontFamily: "'inknut antiqua', sans-serif",
  },
  item: {
    borderBottom: "1px solid #f0ebe5",
  },
  question: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    background: "none",
    border: "none",
    padding: "14px 4px",
    fontSize: "15px",
    fontFamily: "inherit",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "left",
    color: "#222",
    gap: "12px",
  },
  chevron: {
    fontSize: "20px",
    color: "#AC3737",
    flexShrink: 0,
    lineHeight: 1,
  },
  answer: {
    padding: "0 4px 16px",
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#444",
  },
};

export default FAQPage;
