import { useTranslationContext } from '../context/TranslationContext';
import { TranslationKeys } from '../services/seeder.service';

export const useTranslate = () => {
  const { t, locale, setLocale } = useTranslationContext();

  return {
    t: (key: keyof TranslationKeys, variables?: Record<string, string | number>) => t(key, variables),
    locale,
    setLocale,
  };
};
