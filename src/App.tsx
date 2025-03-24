import React from "react";
import "./App.css";
import Home from "./components/home";
import BookPage from "./components/bookPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AboutPage from "./components/aboutPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<BookPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
