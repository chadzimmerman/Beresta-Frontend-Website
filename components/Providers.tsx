'use client';

import { createContext, useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/lib/i18n';
import { useTranslation } from 'react-i18next';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  inventory?: number;
  autographed?: boolean;
}

export const CartContext = createContext<{
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}>({
  cart: [],
  setCart: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartHydrated, setCartHydrated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { i18n } = useTranslation();
  const [lang, setLang] = useState('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) setCart(JSON.parse(saved));
    } catch {}
    setCartHydrated(true);
  }, []);

  useEffect(() => {
    if (!cartHydrated) return;
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch {}
  }, [cart, cartHydrated]);

  useEffect(() => {
    setLang(i18n.language);
    const handler = (lng: string) => setLang(lng);
    i18n.on('languageChanged', handler);
    return () => i18n.off('languageChanged', handler);
  }, [i18n]);

  return (
    <CartContext.Provider value={{ cart, setCart, searchQuery, setSearchQuery }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
      <div className={lang === 'ru' ? 'lang-ru' : 'lang-en'}>
        {children}
      </div>
    </CartContext.Provider>
  );
}
