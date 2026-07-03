import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import pt from "./pt.js";
import en from "./en.js";

const translations = { pt, en } as const;
type Lang = keyof typeof translations;

interface LangContextType {
  language: Lang;
  setLanguage: (lang: Lang) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Lang>(() => {
    const stored = localStorage.getItem("solaris-lang");
    if (stored === "pt" || stored === "en") return stored;
    return "pt";
  });

  useEffect(() => {
    localStorage.setItem("solaris-lang", language);
  }, [language]);

  const setLanguage = (lang: Lang) => setLanguageState(lang);

  const t = (key: string): string => {
    const dict = translations[language] as Record<string, string>;
    if (key in dict) return dict[key] as string;
    console.warn(`[i18n] Missing key "${key}" for "${language}"`);
    return key;
  };

  return (
    <LangContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
