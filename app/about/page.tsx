'use client';

import AltHeader from '@/components/AltHeader';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

export default function AboutPage() {
  const { t } = useTranslation() as { t: (key: string) => string };
  return (
    <div className="about-page">
      <AltHeader />
      <div className="about-container">
        <img
          src="/assets/chad-and-svetlana-photo.jpg"
          alt="Chad and Svetlana Zimmerman"
          className="about-cover-image"
        />
        <div className="about-content-column">
          <div className="about-title-section">
            <h1 className="about-main-title">{t('aboutUs.mainTitle')}</h1>
            <h3 className="about-section-title">{t('aboutUs.ourJourneyTitle')}</h3>
            <p className="about-section-text">{t('aboutUs.ourJourney')}</p>
            <h3 className="about-section-title">{t('aboutUs.aboutChadTitle')}</h3>
            <p className="about-section-text">{t('aboutUs.aboutChad')}</p>
            <h3 className="about-section-title">{t('aboutUs.aboutSvetlanaTitle')}</h3>
            <p className="about-section-text">{t('aboutUs.aboutSvetlana')}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
