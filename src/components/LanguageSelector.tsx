"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { type Language } from "@/lib/i18n/translations";
import { Languages } from "lucide-react";

const languages: { code: Language }[] = [
  { code: "hu" },
  { code: "en" },
  { code: "de" },
];

export default function LanguageSelector() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="fixed top-4 right-16 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label={t("common.loading") !== "common.loading" ? "Nyelv választás" : "Language"}
      >
        <Languages className="w-5 h-5 dark:text-white text-slate-700" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 min-w-[140px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                locale === lang.code
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {t(`language.${lang.code}`, lang.code.toUpperCase())}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
