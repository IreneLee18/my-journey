import { useEffect } from 'react';
import { useLanguageStore } from '@/stores/languageStore';

export type { Language } from '@/stores/languageStore';

export const useLanguage = () => {
  const { language, toggleLanguage, setLanguage, initializeLanguage } = useLanguageStore();

  useEffect(() => {
    // Initialize language from cookie on mount
    initializeLanguage();
  }, [initializeLanguage]);

  return { 
    language, 
    toggleLanguage, 
    setLanguagePreference: setLanguage 
  };
};

