import React, { useContext, useEffect } from "react";
import { CartContext } from "../App";
import Header from "./header";
import Footer from "./footer";
import { useTranslation } from "react-i18next";

function SuccessPage() {
  const { setCart } = useContext(CartContext);
  const { t } = useTranslation() as { t: (key: string) => string };

  // Clear cart after showing success
  useEffect(() => {
    setCart([]);
  }, [setCart]);

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.title}>
          {t("successPage.thankYou") || "Payment Successful!"}
        </h1>
        <p style={styles.subtitle}>
          {t("successPage.orderProcessed") || "Your order has been processed."}
        </p>

        <div style={styles.shippingBox}>
          <p style={styles.shippingText}>
            Your order will be shipped within <strong>2–3 business days</strong> via USPS Media Mail and should arrive within <strong>7–10 days</strong>.
          </p>
          <p style={styles.shippingText}>
            A receipt has been sent to your email. If you have any questions, please reach out to us at <strong>zimkarafly@gmail.com</strong>.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "50px 20px",
    minHeight: "70vh",
  },
  title: {
    fontSize: "28px",
    marginBottom: "10px",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "18px",
    marginBottom: "30px",
    textAlign: "center",
  },
  itemsContainer: {
    width: "40%",
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    marginBottom: "10px",
  },
  titleColumn: {
    width: "50%",
    textAlign: "left",
  },
  quantityColumn: {
    width: "25%",
    textAlign: "center",
  },
  priceColumn: {
    width: "25%",
    textAlign: "right",
  },
  shippingBox: {
    maxWidth: "500px",
    backgroundColor: "#F7F4EF",
    borderLeft: "4px solid #AC3737",
    borderRadius: "6px",
    padding: "24px 28px",
    marginTop: "10px",
  },
  shippingText: {
    fontSize: "16px",
    lineHeight: "1.7",
    margin: "0 0 12px 0",
    color: "#333",
  },
};

export default SuccessPage;
