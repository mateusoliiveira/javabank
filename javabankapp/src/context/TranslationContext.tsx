import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { translationSeeder, TranslationKeys } from '../services/seeder.service';

type Locale = 'en' | 'pt';

interface TranslationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof TranslationKeys, variables?: Record<string, string | number>) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('pt');

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const t = (key: keyof TranslationKeys, variables?: Record<string, string | number>): string => {
    const dictionary = translationSeeder[locale];
    let text = dictionary[key] || String(key);

    if (variables) {
      Object.entries(variables).forEach(([varKey, varValue]) => {
        text = text.replace(new RegExp(`{${varKey}}`, 'g'), String(varValue));
      });
    }

    return text;
  };

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  return context;
};
