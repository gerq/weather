"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { translations, detectBrowserLanguage, type Language } from "./translations";
import { hu, enUS, de, type Locale } from "date-fns/locale";

interface I18nContextType {
  locale: Language;
  setLocale: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  dateFnsLocale: Locale;
}

const dateFnsLocales: Record<Language, Locale> = { hu, en: enUS, de };

const I18nContext = createContext<I18nContextType | null>(null);

export function LanguageProvider({ children, initialLocale = "hu" }: { children: ReactNode; initialLocale?: Language }) {
  const [locale, setLocaleState] = useState<Language>(initialLocale);

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language | null;
    const detected = saved || detectBrowserLanguage();
    // Only override if different from the initial (SSR) locale
    if (detected !== initialLocale) {
      setLocaleState(detected);
    }
  }, [initialLocale]);

  const setLocale = useCallback((lang: Language) => {
    setLocaleState(lang);
    localStorage.setItem("lang", lang);
    document.cookie = `lang=${lang};path=/;max-age=${60*60*24*365};samesite=lax`;
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      return translations[locale]?.[key] ?? fallback ?? key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        dateFnsLocale: dateFnsLocales[locale],
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback for when used outside provider (shouldn't happen, but safe)
    return {
      locale: "hu",
      setLocale: () => {},
      t: (key: string, fallback?: string) => fallback ?? key,
      dateFnsLocale: hu,
    };
  }
  return ctx;
}
