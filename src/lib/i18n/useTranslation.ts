"use client";

import { useState, useEffect, useCallback } from 'react';
import { getTranslation, Language, TranslationKey } from './translations';

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('appLanguage') as Language) || 'english';
  }
  return 'english';
};

export function useTranslation() {
  const [currentLanguage, setCurrentLang] = useState<Language>(getInitialLanguage());

  const changeLanguage = useCallback((newLanguage: Language) => {
    if (['english', 'telugu'].includes(newLanguage)) {
      localStorage.setItem('appLanguage', newLanguage);
      setCurrentLang(newLanguage);
      window.dispatchEvent(new Event('languageChange'));
    }
  }, []);
  
  const t = useCallback((key: TranslationKey,
    options?: { defaultValue?: string }
  ) => {
    const translation = getTranslation(key, currentLanguage);
    if (!translation && options?.defaultValue) {
        return options.defaultValue;
    }
    return translation;
  }, [currentLanguage]);

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentLang(getInitialLanguage());
    };

    window.addEventListener('languageChange', handleStorageChange);
    return () => {
      window.removeEventListener('languageChange', handleStorageChange);
    };
  }, []);

  return {
    t,
    currentLanguage,
    changeLanguage,
  };
}
