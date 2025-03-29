import React, { useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CartContext } from "../App";
import Header from "./header";
import Footer from "./footer";

const stripePromise = loadStripe(
  "pk_test_51R6TITC2IqeseeFMzu45cabmU4kaW8RVIp1ZYt7Xo0v1KGuKHwflLSjkxVtk2YKQ8zgCRkdtehc1TFqHZvHowr9m00ZCjMWe3I"
); // Replace with your key
console.log("loadStripe imported:", loadStripe);

function CartPage() {
  const { cart, setCart } = useContext(CartContext);
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
    const stripe = await stripePromise;
    console.log("Stripe instance:", stripe);
    const response = await fetch("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart }),
    });
    const { id } = await response.json();
    console.log("Checkout session ID:", id);
    stripe.redirectToCheckout({ sessionId: id });
  };

  return (
    <div>
      <Header />
      <div
        className="shoppingCartContainer"
        style={styles.shoppingCartContainer}
      >
        <h1 className="shoppingCartTitle" style={styles.shoppingCartTitle}>
          Shopping Cart
        </h1>
        <div
          className="shoppingCartColumnHeads"
          style={styles.shoppingCartColumnHeads}
        >
          <h5 className="columnHeader">Title</h5>
          <h5 className="columnHeader" style={styles.quantityHeader}>
            Quantity
          </h5>
          <h5 className="columnHeader">Total Price</h5>
        </div>
        <div className="shoppingCartItems" style={styles.shoppingCartItems}>
          {cart.length ? ( // Changed to cart
            cart.map(
              (
                item // Changed to cart, key uses item.id
              ) => (
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
              )
            )
          ) : (
            <p>No items in cart.</p>
          )}
        </div>
        <div
          className="shoppingCartSubtotals"
          style={styles.shoppingCartSubtotals}
        >
          <p className="subtotal" style={styles.subtotal}>
            Subtotal: ${(total / 100).toFixed(2)}
          </p>
          <p className="shipping" style={styles.shipping}>
            Shipping: Free
          </p>
        </div>
        <div className="totals" style={styles.totals}>
          <h2 className="total">Total:</h2>
          <h2 className="total">${(total / 100).toFixed(2)}</h2>
        </div>

        <div className="stripe">
          <button onClick={handleCheckout} className="checkoutButton">
            Checkout with Stripe
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
    height: "100vh",
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
    width: "40%", // Match headers
    display: "flex",
    flexDirection: "column",
  },
  item: {
    display: "flex",
    justifyContent: "space-between", // Or remove if using fixed widths
    fontSize: "10px",
  },
  titleColumn: {
    width: "50%", // Adjust % or use px
    textAlign: "left",
  },
  quantityColumn: {
    width: "25%",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    alignItems: "center",
    height: "24px", // Cap height
  },
  quantityButton: {
    appearance: "none",
    background: "transparent",
    border: "none",
    padding: "0 5px",
    fontSize: "16px", // Smaller symbol
    color: "#333",
    cursor: "pointer",
    fontFamily: "inherit",
    lineHeight: 1,
    height: "16px", // Match fontSize
    minHeight: "16px", // Override defaults
    display: "block", // Contain hitbox
  },
  priceColumn: {
    width: "25%",
    textAlign: "right",
  },
  quantityHeader: {
    marginLeft: "200px",
  },
  shoppingCartSubtotals: {
    width: "40%", // Match cart width
    display: "flex", // Flex its contents
    flexDirection: "column", // Stack subtotal, shipping, etc.
    alignItems: "flex-end", // Right-align contents
    borderBottom: "1px solid #ccc",
    marginBottom: "10px",
    fontSize: "14px",
  },
  totals: {
    width: "40%", // Match cart width
    display: "flex", // Flex its contents
    flexDirection: "column", // Stack subtotal, shipping, etc.
    alignItems: "flex-end", // Right-align contents
  },
};

export default CartPage;
