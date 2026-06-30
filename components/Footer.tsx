'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const { t } = useTranslation() as { t: (key: string) => string };
  const router = useRouter();

  return (
    <footer className="footer">
      <div className="footer-logo-copyright">
        <h3 className="footer-logo" onClick={() => router.push('/')}>
          Beresta Literary Press
        </h3>
        <p className="footer-copyright">Copyright ©2025</p>
      </div>
      <nav className="footer-links">
        <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
          {t('footer.home')}
        </Link>
        <Link href="/about" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
          {t('footer.aboutUs')}
        </Link>
        <Link href="/faq" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
          FAQ
        </Link>
        <a href="/#contact">{t('footer.contactUs')}</a>
      </nav>
    </footer>
  );
}
