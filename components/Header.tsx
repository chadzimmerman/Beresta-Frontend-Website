'use client';

import { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LanguageToggle from './LanguageToggle';
import { CartContext } from './Providers';
import { supabase } from '@/lib/supabaseClient';
import '@/styles/header.css';

const categories = [
  'Fiction', 'Non-Fiction', 'Fairy Tales', 'Translation',
  'Japanese', 'Russian', 'Children', 'Poetry', 'Coloring',
];

interface BookSuggestion {
  id: number;
  slug: string;
  title: string;
  authors: string;
}

export default function Header() {
  const { t } = useTranslation() as { t: (key: string) => string };
  const { cart, searchQuery, setSearchQuery } = useContext(CartContext);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
    if (isMenuOpen) setIsMenuOpen(false);
    setSearchQuery('');
    router.push(`/category/${encodeURIComponent(category)}`);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) { setSuggestions([]); return; }
      const { data } = await supabase
        .from('books')
        .select('id, slug, title, authors')
        .or(`title.ilike.%${searchQuery}%,authors.ilike.%${searchQuery}%`)
        .limit(6);
      if (data) { setSuggestions(data); setShowSuggestions(true); }
    };
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  useEffect(() => {
    const handler = () => setShowSuggestions(false);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  return (
    <header className="header-main">
      <div className="logo-container" onClick={() => { router.push('/'); setSearchQuery(''); }}>
        <img src="/beresta-logo.png" alt="Logo" className="logo-image" />
        <h1 className="header-name">Beresta Literary Press</h1>
      </div>

      <button className="menu-toggle" onClick={() => setIsMenuOpen((p) => !p)}>
        {isMenuOpen ? '✕' : '☰'}
      </button>

      <nav className={`nav-main ${isMenuOpen ? 'is-open' : ''}`}>
        <ul className="nav-list">
          <li className="nav-item category-item">
            <button className="nav-trigger" onClick={() => setIsCategoryOpen((p) => !p)}>
              {selectedCategory || t('header.categories')}
            </button>
            {isCategoryOpen && (
              <ul className="dropdown-menu">
                {categories.map((cat) => (
                  <li key={cat} className="dropdown-item" onClick={() => handleCategorySelect(cat)}>
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="nav-item">
            <Link href="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              {t('header.aboutUs')}
            </Link>
          </li>
          <li className="nav-item">
            <a href="/#contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              {t('header.contactUs')}
            </a>
          </li>
          <li className="nav-item language-toggle-wrapper">
            <LanguageToggle />
          </li>

          <li className="nav-item search-item">
            <input
              type="text"
              placeholder={t('header.searchBar')}
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  setShowSuggestions(false);
                  router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="search-suggestions">
                {suggestions.map((book) => (
                  <li
                    key={book.id}
                    className="suggestion-item"
                    onClick={() => {
                      setShowSuggestions(false);
                      router.push(`/book/${book.slug}`);
                    }}
                  >
                    <span className="suggestion-title">{book.title}</span>
                    <span className="suggestion-author"> — {book.authors}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="nav-item">
            <Link href="/cart" className="cart-link" onClick={() => setIsMenuOpen(false)}>
              <div className="cart-icon-wrapper">
                <img src="/assets/shopping-cart-line.png" alt="Cart" className="cart-icon" />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
              <span>{t('header.cart')}</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
