import React, { createContext, useState, useEffect } from "react";
import "./App.css";
import Home from "./components/home";
import BookPage from "./components/bookPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AboutPage from "./components/aboutPage";
import CartPage from "./components/CartPage";
import SuccessPage from "./components/success";
import CategoryPage from "./components/categoryPage";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CartContext = createContext<{
  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}>({
  cart: [],
  setCart: () => {}, // Default empty function
  searchQuery: "",
  setSearchQuery: () => {}, // Default empty function
});

function App() {
  const [cart, setCart] = useState<any[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState("");

  // For adding seperate language fonts
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <div className={currentLanguage === "ru" ? "lang-ru" : "lang-en"}>
      <CartContext.Provider
        value={{ cart, setCart, searchQuery, setSearchQuery }}
      >
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
        />
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
    </div>
  );
}

export default App;
