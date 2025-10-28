import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import Spinner from '../components/ui/Spinner';

type Language = 'ar' | 'fr';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  dir: Direction;
  currency: string;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

type Translations = { [key in Language]?: { [key: string]: string } };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [translations, setTranslations] = useState<Translations>({});
  const [loading, setLoading] = useState(true);

  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang || 'ar'; // Default to Arabic
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        // Use relative paths for fetch
        const [arRes, frRes] = await Promise.all([
          fetch('./locales/ar.json'),
          fetch('./locales/fr.json')
        ]);
        if (!arRes.ok || !frRes.ok) {
          throw new Error('Failed to fetch translation files');
        }
        const arJson = await arRes.json();
        const frJson = await frRes.json();
        setTranslations({ ar: arJson, fr: frJson });
      } catch (error) {
        console.error("Failed to load translation files:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTranslations();
  }, []);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
    if (loading || !translations[language]) {
        return key; // Return key as fallback during load
    }
    let translation = translations[language]![key] || key;
    if (options) {
      Object.keys(options).forEach(optKey => {
        translation = translation.replace(`{{${optKey}}}`, String(options[optKey]));
      });
    }
    return translation;
  }, [language, translations, loading]);
  
  const currency = t('currency');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  // Fix: Define the setLanguage function to update state and localStorage
  const setLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark">
        <Spinner />
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, currency }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};