'use client';

import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { CartContext } from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

export default function CartPage() {
  const { cart, setCart } = useContext(CartContext);
  const { t } = useTranslation() as { t: (key: string) => string };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const increaseQuantity = (id: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (item.inventory != null && item.quantity >= item.inventory) return item;
        return { ...item, quantity: item.quantity + 1 };
      })
    );
  };

  const decreaseQuantity = (id: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (checkingOut) return;
    setCheckingOut(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong starting checkout. Please try again.');
      setCheckingOut(false);
    }
  };

  return (
    <div className="app-page-wrapper">
      <Header />
      <div className="cart-content-and-stretch">
        <div className="shoppingCartContainer">
          <h1 className="shoppingCartTitle">{t('cartPage.shoppingCart')}</h1>
          <div className="shoppingCartColumnHeads">
            <h5 className="columnHeader">{t('cartPage.title')}</h5>
            <h5 className="columnHeader quantity-header">{t('cartPage.quantity')}</h5>
            <h5 className="columnHeader">{t('cartPage.totalPrice')}</h5>
          </div>
          <div className="shoppingCartItems">
            {cart.length ? (
              cart.map((item) => (
                <div key={item.id} className="item">
                  <div className="title-column">{item.title}</div>
                  <div className="quantity-column">
                    <button className="quantity-button" onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="quantity-button" onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>
                  <div className="price-column">${((item.price * item.quantity) / 100).toFixed(2)}</div>
                </div>
              ))
            ) : (
              <p className="no-items-message">{t('cartPage.noItemsInCart')}</p>
            )}
          </div>
          <div className="shoppingCartSubtotals">
            <p className="subtotal">{t('cartPage.subtotal')} ${(total / 100).toFixed(2)}</p>
            <p className="shipping">{t('cartPage.shipping')}: {t('cartPage.free')}</p>
          </div>
          <div className="totals">
            <h2 className="total-label">{t('cartPage.total')}</h2>
            <h2 className="total-amount">${(total / 100).toFixed(2)}</h2>
          </div>
          <div className="stripe">
            <button onClick={handleCheckout} className="checkoutButton">
              {t('cartPage.checkoutWithStripe')}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
