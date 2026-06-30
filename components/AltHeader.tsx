'use client';

import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LanguageToggle from './LanguageToggle';
import { CartContext } from './Providers';

const categories = [
  'Fiction', 'Non-Fiction', 'Fairy Tales', 'Translation',
  'Japanese', 'Russian', 'Children', 'Poetry', 'Coloring',
];

const styles: { [key: string]: React.CSSProperties } = {
  header: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: '#fff' },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer' },
  logo: { height: '100px' },
  headerName: { fontSize: '24px', fontFamily: "'inknut antiqua', sans-serif", color: 'black', margin: 0 },
  nav: { display: 'flex', justifyContent: 'center' },
  navList: { display: 'flex', listStyleType: 'none', padding: 0, margin: 0, gap: '20px' },
  navItem: { display: 'flex', alignItems: 'center', position: 'relative' },
  trigger: { color: 'black', textDecoration: 'none', fontSize: '12px', fontFamily: 'inherit', background: 'none', border: 'none', padding: '5px 10px', cursor: 'pointer' },
  navLink: { color: 'black', textDecoration: 'none', fontSize: '12px', fontFamily: 'inherit' },
  dropdown: { position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#FFFFFF', listStyle: 'none', padding: '5px 0', margin: 0, border: '1px solid #ccc', zIndex: 1 },
  dropdownItem: { color: 'black', textDecoration: 'none', fontSize: '12px', fontFamily: "'inknut antiqua', sans-serif", padding: '5px 10px', cursor: 'pointer', whiteSpace: 'nowrap' },
  cartLink: { display: 'flex', alignItems: 'center', color: 'black', textDecoration: 'none', fontSize: '12px', fontFamily: 'inherit' },
  cartIcon: { width: '20px', marginRight: '5px' },
};

export default function AltHeader() {
  const { t } = useTranslation() as { t: (key: string) => string };
  const { cart } = useContext(CartContext);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsOpen(false);
    router.push(`/category/${encodeURIComponent(category)}`);
  };

  return (
    <header style={styles.header}>
      <div style={styles.logoContainer} onClick={() => router.push('/')}>
        <img src="/beresta-logo.png" alt="Logo" style={styles.logo} />
        <h1 style={styles.headerName}>Beresta Literary Press</h1>
      </div>
      <nav style={styles.nav}>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <button style={styles.trigger} onClick={() => setIsOpen((p) => !p)}>
              {selectedCategory || t('header.categories')}
            </button>
            {isOpen && (
              <ul style={styles.dropdown}>
                {categories.map((cat) => (
                  <li key={cat} style={styles.dropdownItem} onClick={() => handleCategorySelect(cat)}>
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li style={styles.navItem}>
            <Link href="/about" style={styles.navLink}>{t('header.aboutUs')}</Link>
          </li>
          <li style={styles.navItem}>
            <Link href="/faq" style={styles.navLink}>FAQ</Link>
          </li>
          <li style={styles.navItem}>
            <Link href="/#contact" style={styles.navLink}>{t('header.contactUs')}</Link>
          </li>
          <li style={styles.navItem}>
            <LanguageToggle />
          </li>
          <li style={styles.navItem}>
            <Link href="/cart" style={styles.cartLink}>
              <div className="cart-icon-wrapper">
                <img src="/assets/shopping-cart-line.png" alt="Cart" style={styles.cartIcon} />
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
