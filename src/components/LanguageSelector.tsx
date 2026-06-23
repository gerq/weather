"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { type Language } from "@/lib/i18n/translations";
import { Languages, X, Check } from "lucide-react";

const languages: { code: Language; country: string }[] = [
  { code: "hu", country: "hu" },
  { code: "en", country: "gb" },
  { code: "de", country: "de" },
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
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-50">
          <div className="py-2 grid grid-cols-1" role="menu">
            {languages.map((lang) => {
              const isActive = locale === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                  role="menuitem"
                >
                  <span className={`fi fi-${lang.country} shrink-0`} />
                  <span>{t(`language.${lang.code}`, lang.code.toUpperCase())}</span>
                  {isActive && (
                    <span className="ml-auto">
                      <Check className="w-4 h-4 text-blue-500" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile full-screen overlay */}
      {open && variant === "header" && (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-900 pb-[env(safe-area-inset-bottom)]">
          {/* Top bar with close button */}
          <div className="flex items-center justify-between px-4 pt-[env(safe-area-inset-top)] py-3">
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
            className="flex-1 flex flex-col justify-center gap-5 px-6 bg-gray-900 py-4"
            onClick={() => setOpen(false)}
          >
            {languages.map((lang) => {
              const isActive = locale === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(lang.code);
                  }}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all active:scale-[0.98] shadow-sm ${
                    isActive
                      ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/50 shadow-blue-500/10 font-semibold"
                      : "bg-white/20 dark:bg-white/20 text-white font-medium hover:bg-white/30"
                  }`}
                >
                  <span className={`fi fi-${lang.country} shrink-0 w-[26px] h-[26px]`} />
                  <span className="text-base">{t(`language.${lang.code}`, lang.code.toUpperCase())}</span>
                  {isActive && (
                    <span className="ml-auto">
                      <Check className="w-5 h-5 text-blue-500" />
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
