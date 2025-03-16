import React from "react";
import Header from "./header";
import Banner from "./banner";
import Carousel from "./carousel";
import About from "./about";
import MailingList from "./mailinglist";
import ContactUs from "./contact";
import Footer from "./footer";

function Home() {
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
