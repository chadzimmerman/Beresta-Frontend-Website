import React from "react";
import Header from "./header";
import Banner from "./banner";
import Carousel from "./carousel";
import About from "./about";
import MailingList from "./mailinglist";
import ContactUs from "./contact";
import Footer from "./footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function Home() {
  //useLocation and useEffect help scrolling down to contact upon navigation
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div>
      <Header />
      <Banner />
      <Carousel />
      <About />
      <MailingList />
      <ContactUs />
      <Footer />
    </div>
  );
}

export default Home;
