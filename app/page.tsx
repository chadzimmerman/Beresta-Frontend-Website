'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import Banner from '@/components/Banner';
import Carousel from '@/components/Carousel';
import About from '@/components/About';
import MailingList from '@/components/MailingList';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div>
      <Header />
      <Banner />
      <Carousel />
      <About />
      <MailingList />
      <Contact />
      <Footer />
    </div>
  );
}
