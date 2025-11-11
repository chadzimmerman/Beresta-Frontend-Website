import React, { useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CartContext } from "../App";
import Header from "./header";
import Footer from "./footer";
import { useTranslation } from "react-i18next";

const stripePromise = loadStripe(
  "pk_test_51R6TITC2IqeseeFMzu45cabmU4kaW8RVIp1ZYt7Xo0v1KGuKHwflLSjkxVtk2YKQ8zgCRkdtehc1TFqHZvHowr9m00ZCjMWe3I"
);
console.log("loadStripe imported:", loadStripe);

function CartPage() {
  const { cart, setCart } = useContext(CartContext);
  const { t } = useTranslation() as { t: (key: string) => string };
  console.log("CartPage rendered, cart:", cart);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const increaseQuantity = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      console.log("Stripe instance:", stripe);
      console.log("Cart sent to backend:", cart);
      const response = await fetch("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} - ${await response.text()}`
        );
      }
      const { id } = await response.json();
      console.log("Checkout session ID:", id);
      await stripe!.redirectToCheckout({ sessionId: id });
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div>
      <Header />
      <div
        className="shoppingCartContainer"
        style={styles.shoppingCartContainer}
      >
        <h1 className="shoppingCartTitle" style={styles.shoppingCartTitle}>
          {t("cartPage.shoppingCart")}
        </h1>
        <div
          className="shoppingCartColumnHeads"
          style={styles.shoppingCartColumnHeads}
        >
          <h5 className="columnHeader">{t("cartPage.title")}</h5>
          <h5 className="columnHeader" style={styles.quantityHeader}>
            {t("cartPage.quantity")}
          </h5>
          <h5 className="columnHeader">{t("cartPage.totalPrice")}</h5>
        </div>
        <div className="shoppingCartItems" style={styles.shoppingCartItems}>
          {cart.length ? (
            cart.map((item) => (
              <div key={item.id} className="item" style={styles.item}>
                <div style={styles.titleColumn}>{item.title}</div>
                <div style={styles.quantityColumn}>
                  <button
                    style={styles.quantityButton}
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    style={styles.quantityButton}
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </button>
                </div>
                <div style={styles.priceColumn}>
                  ${((item.price * item.quantity) / 100).toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <p>{t("cartPage.noItemsInCart")}</p>
          )}
        </div>
        <div
          className="shoppingCartSubtotals"
          style={styles.shoppingCartSubtotals}
        >
          <p className="subtotal" style={styles.subtotal}>
            {t("cartPage.subtotal")} ${(total / 100).toFixed(2)}
          </p>
          <p className="shipping" style={styles.shipping}>
            {t("cartPage.shipping")}: {t("cartPage.free")}
          </p>
        </div>
        <div className="totals" style={styles.totals}>
          <h2 className="total">{t("cartPage.total")}</h2>
          <h2 className="total">${(total / 100).toFixed(2)}</h2>
        </div>

        <div className="stripe">
          <button
            onClick={handleCheckout}
            className="checkoutButton"
            style={styles.checkoutButton}
          >
            {t("cartPage.checkoutWithStripe")}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  shoppingCartContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "82vh",
  },
  shoppingCartTitle: {
    textAlign: "left",
    width: "40%",
  },
  shoppingCartColumnHeads: {
    display: "flex",
    justifyContent: "space-between",
    width: "40%",
    borderBottom: "1px solid #ccc",
    marginBottom: "10px",
  },
  shoppingCartItems: {
    width: "40%",
    display: "flex",
    flexDirection: "column",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
  },
  titleColumn: {
    width: "50%",
    textAlign: "left",
  },
  quantityColumn: {
    width: "25%",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    alignItems: "center",
    height: "24px",
  },
  quantityButton: {
    appearance: "none",
    background: "transparent",
    border: "none",
    padding: "0 5px",
    fontSize: "16px",
    color: "#333",
    cursor: "pointer",
    fontFamily: "inherit",
    lineHeight: 1,
    height: "16px",
    minHeight: "16px",
    display: "block",
  },
  priceColumn: {
    width: "25%",
    textAlign: "right",
  },
  quantityHeader: {
    marginLeft: "200px",
  },
  shoppingCartSubtotals: {
    width: "40%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    borderBottom: "1px solid #ccc",
    marginBottom: "10px",
    fontSize: "14px",
  },
  subtotal: {
    display: "flex",
    gap: "10px", // Space between children
  },
  shipping: {
    display: "flex",
    gap: "10px",
  },

  totals: {
    width: "40%",
    display: "flex",
    alignSelf: "flex-end",
    gap: "10px",
  },
  checkoutButton: {
    flex: 1,
    backgroundColor: "#AC3737",
    color: "white",
    padding: "1px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontFamily: "'inknut antiqua', sans-serif",
  },
};

export default CartPage;
