"use client";

import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

export default function ThemeToggle({ variant = "default" }: { variant?: "default" | "header" }) {
  const [dark, setDark] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className={
        variant === "header"
          ? "p-2 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700 transition-all duration-300"
          : "fixed top-4 right-4 z-50 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
      }
      aria-label={dark ? t("theme.switchToLight") : t("theme.switchToDark")}
    >
      {dark ? (
        <Sun className="w-5 h-5 text-yellow-300" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
      )}
    </button>
  );
}
