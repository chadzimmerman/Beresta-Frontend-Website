import React, { useContext, useEffect } from "react";
import { CartContext } from "../App";
import Header from "./header";
import Footer from "./footer";
import { useTranslation } from "react-i18next";

function SuccessPage() {
  const { cart, setCart } = useContext(CartContext);
  const { t } = useTranslation() as { t: (key: string) => string };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

        <div style={styles.itemsContainer}>
          {cart.length ? (
            cart.map((item) => (
              <div key={item.id} style={styles.item}>
                <div style={styles.titleColumn}>{item.title}</div>
                <div style={styles.quantityColumn}>x{item.quantity}</div>
                <div style={styles.priceColumn}>
                  ${((item.price * item.quantity) / 100).toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <p style={styles.subtitle}>
              {t("successPage.nextSteps") ||
                "You will receive an email confirmation shortly."}
            </p>
          )}
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
  totalContainer: {
    width: "40%",
    display: "flex",
    justifyContent: "flex-end",
    fontSize: "18px",
    fontWeight: "bold",
  },
};

export default SuccessPage;
