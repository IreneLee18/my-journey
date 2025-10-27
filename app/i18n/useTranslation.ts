import { useLanguageStore } from '@/stores/languageStore';
import { translations } from './translations';
import type { TranslationKey } from './translations';

export const useTranslation = () => {
  const language = useLanguageStore((state) => {
    return state.language;
  });

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return { t, language };
};

