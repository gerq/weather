"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { type Language } from "@/lib/i18n/translations";
import { Languages, X } from "lucide-react";

const languages: { code: Language }[] = [
  { code: "hu" },
  { code: "en" },
  { code: "de" },
];

export default function LanguageSelector({ variant = "default" }: { variant?: "default" | "header" }) {
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

  const handleSelect = (code: Language) => {
    setLocale(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className={variant === "header" ? "relative" : "fixed top-4 right-16 z-50"}>
      <button
        onClick={() => setOpen(!open)}
        className={
          variant === "header"
            ? "p-2 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700 transition-all duration-300"
            : "p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
        }
        aria-label={t("common.loading") !== "common.loading" ? "Nyelv választás" : "Language"}
      >
        <Languages className="w-5 h-5 text-gray-700 dark:text-gray-200" />
      </button>

      {/* Desktop dropdown */}
      {open && variant !== "header" && (
        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 min-w-[140px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
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

      {/* Mobile full-screen overlay */}
      {open && variant === "header" && (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-900 pb-[env(safe-area-inset-bottom)]">
          {/* Top bar with close button */}
          <div className="flex items-center justify-between px-5 pt-[env(safe-area-inset-top)] pb-3">
            <span className="text-lg font-semibold text-white">
              {t("common.loading") !== "common.loading" ? "Nyelv választás" : "Language"}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Bezárás"
            >
              <X className="w-6 h-6 text-white/70" />
            </button>
          </div>

          {/* Language options — full remaining height, click backdrop to close */}
          <div
            className="flex-1 flex flex-col justify-start gap-4 px-6 pt-6"
            onClick={() => setOpen(false)}
          >
            {languages.map((lang) => {
              const flag = lang.code === "hu" ? "🇭🇺" : lang.code === "en" ? "🇬🇧" : "🇩🇪";
              const isActive = locale === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(lang.code);
                  }}
                  className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-left transition-all active:scale-[0.97] shadow-lg ${
                    isActive
                      ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500 font-semibold shadow-blue-500/20"
                      : "bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-sm"
                  }`}
                >
                  <span className="text-3xl">{flag}</span>
                  <span className="text-lg font-medium">{t(`language.${lang.code}`, lang.code.toUpperCase())}</span>
                  {isActive && (
                    <span className="ml-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
