import React, { createContext, useState, useEffect } from "react";
import "./App.css";
import Home from "./components/home";
import BookPage from "./components/bookPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AboutPage from "./components/aboutPage";
import CartPage from "./components/CartPage";
import SuccessPage from "./components/success";
import CategoryPage from "./components/categoryPage";

export const CartContext = createContext<{
  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
}>({
  cart: [],
  setCart: () => {}, // Default empty function
});

function App() {
  const [cart, setCart] = useState<any[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
        </Routes>
      </Router>
    </CartContext.Provider>
  );
}

export default App;
