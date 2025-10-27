import { create } from 'zustand';

export type Language = 'zh' | 'en';

const LANGUAGE_COOKIE_NAME = 'app_language';

// Helper functions for cookie management
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

const setCookie = (name: string, value: string, days: number = 365) => {
  if (typeof document === 'undefined') {
    return;
  }
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// Get initial language from cookie or default to 'zh'
const getInitialLanguage = (): Language => {
  const savedLanguage = getCookie(LANGUAGE_COOKIE_NAME) as Language | null;
  if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
    return savedLanguage;
  }
  return 'zh';
};

type LanguageStore = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  initializeLanguage: () => void;
};

export const useLanguageStore = create<LanguageStore>((set, get) => {
  return {
    language: 'zh', // Default value, will be initialized on client
    
    setLanguage: (language: Language) => {
      set({ language });
      setCookie(LANGUAGE_COOKIE_NAME, language);
    },
    
    toggleLanguage: () => {
      const currentLanguage = get().language;
      const newLanguage: Language = currentLanguage === 'zh' ? 'en' : 'zh';
      set({ language: newLanguage });
      setCookie(LANGUAGE_COOKIE_NAME, newLanguage);
    },
    
    initializeLanguage: () => {
      const savedLanguage = getInitialLanguage();
      set({ language: savedLanguage });
      setCookie(LANGUAGE_COOKIE_NAME, savedLanguage);
    },
  };
});

