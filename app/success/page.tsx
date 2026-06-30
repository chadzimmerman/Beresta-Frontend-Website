'use client';

import { useContext, useEffect } from 'react';
import { CartContext } from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

export default function SuccessPage() {
  const { setCart } = useContext(CartContext);
  const { t } = useTranslation() as { t: (key: string) => string };

  useEffect(() => {
    setCart([]);
  }, [setCart]);

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.title}>{t('successPage.thankYou') || 'Payment Successful!'}</h1>
        <p style={styles.subtitle}>{t('successPage.orderProcessed') || 'Your order has been processed.'}</p>
        <div style={styles.shippingBox}>
          <p style={styles.shippingText}>
            Your order will be shipped within <strong>2–3 business days</strong> via USPS Media Mail and should arrive within <strong>7–10 days</strong>.
          </p>
          <p style={styles.shippingText}>
            A receipt has been sent to your email. If you have any questions, please reach out to us at <strong>halftonellc@gmail.com</strong>.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 20px', minHeight: '70vh' },
  title: { fontSize: '28px', marginBottom: '10px', textAlign: 'center' },
  subtitle: { fontSize: '18px', marginBottom: '30px', textAlign: 'center' },
  shippingBox: { maxWidth: '500px', backgroundColor: '#F7F4EF', borderLeft: '4px solid #AC3737', borderRadius: '6px', padding: '24px 28px', marginTop: '10px' },
  shippingText: { fontSize: '16px', lineHeight: '1.7', margin: '0 0 12px 0', color: '#333' },
};
