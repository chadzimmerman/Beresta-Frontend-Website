'use client';

import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  return (
    <button onClick={() => i18n.changeLanguage(isEn ? 'ru' : 'en')} className="language-toggle">
      {isEn ? 'Russian' : 'Английский'}
    </button>
  );
}
