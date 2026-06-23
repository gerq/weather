"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloudSun, Map as MapIcon, Heart, Home } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

function useNavItems() {
  const { t } = useI18n();
  return [
    { href: "/", label: t("nav.weather"), icon: Home },
    { href: "/map", label: t("nav.map"), icon: MapIcon },
    { href: "/health", label: t("nav.health"), icon: Heart },
  ];
}

export default function Navigation() {
  const pathname = usePathname();
  const navItems = useNavItems();

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-20 flex-col items-center gap-6 py-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-r border-gray-200 dark:border-gray-700 z-40">
        <Link
          href="/"
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
        >
          <CloudSun className="w-7 h-7 text-white" />
        </Link>
        <div className="flex flex-col gap-3 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                title={item.label}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-4 py-1 min-w-0"
            >
              <item.icon
                className={`w-5 h-5 ${
                  pathname === item.href
                    ? "text-blue-500"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />
              <span
                className={`text-[10px] font-medium ${
                  pathname === item.href
                    ? "text-blue-500"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-16" />
    </>
  );
}
