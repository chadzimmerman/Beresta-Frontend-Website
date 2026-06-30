'use client';

import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation() as { t: (key: string) => string };
  return (
    <div className="about-us-container">
      <h1 className="about-us-header">{t('aboutUs.title')}</h1>
      <p className="about-us-paragraph">{t('aboutUs.description')}</p>
    </div>
  );
}
