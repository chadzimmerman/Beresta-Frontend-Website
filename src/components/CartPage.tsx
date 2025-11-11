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
    // STICKY FOOTER WRAPPER
    <div className="app-page-wrapper">
      <Header />

      {/* VERTICAL STRETCH WRAPPER */}
      <div className="cart-content-and-stretch">
        <div className="shoppingCartContainer">
          <h1 className="shoppingCartTitle">{t("cartPage.shoppingCart")}</h1>
          <div className="shoppingCartColumnHeads">
            <h5 className="columnHeader">{t("cartPage.title")}</h5>
            <h5 className="columnHeader quantity-header">
              {t("cartPage.quantity")}
            </h5>
            <h5 className="columnHeader">{t("cartPage.totalPrice")}</h5>
          </div>
          <div className="shoppingCartItems">
            {cart.length ? (
              cart.map((item) => (
                <div key={item.id} className="item">
                  <div className="title-column">{item.title}</div>
                  <div className="quantity-column">
                    <button
                      className="quantity-button"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="quantity-button"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>
                  <div className="price-column">
                    ${((item.price * item.quantity) / 100).toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-items-message">{t("cartPage.noItemsInCart")}</p>
            )}
          </div>
          <div className="shoppingCartSubtotals">
            <p className="subtotal">
              {t("cartPage.subtotal")} ${(total / 100).toFixed(2)}
            </p>
            <p className="shipping">
              {t("cartPage.shipping")}: {t("cartPage.free")}
            </p>
          </div>
          <div className="totals">
            <h2 className="total-label">{t("cartPage.total")}</h2>
            <h2 className="total-amount">${(total / 100).toFixed(2)}</h2>
          </div>

          <div className="stripe">
            <button onClick={handleCheckout} className="checkoutButton">
              {t("cartPage.checkoutWithStripe")}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CartPage;
