"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "@khmyznikov/pwa-install";
import { useI18n } from "@/lib/i18n/context";
import { Download } from "lucide-react";

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Silently fail — e.g. Safari private browsing
  }
}

export default function PwaInstallPrompt() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already in standalone mode (app installed)
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    setDismissed(safeGetItem("pwa-install-dismissed") === "true");
  }, []);

  // Listen for the pwa-install web component's availability event
  // PLUS a platform-independent iOS fallback
  useEffect(() => {
    if (isStandalone || dismissed) return;

    const handleAvailable = () => {
      setIsAvailable(true);
    };

    const handleSuccess = () => {
      setIsStandalone(true);
      safeSetItem("pwa-install-dismissed", "true");
    };

    document.addEventListener("pwa-install-available-event", handleAvailable);
    document.addEventListener("pwa-install-success-event", handleSuccess);

    // Platform-independent fallback timers
    const eventTimer = setTimeout(() => {
      const el = document.querySelector("pwa-install") as any;
      if (el?.isInstallAvailable) {
        setIsAvailable(true);
        return;
      }
      // If no event after 3s AND on iOS (no beforeinstallprompt),
      // assume installable — all sites can be added to home screen
      if (isIOS()) {
        setIsAvailable(true);
      }
    }, 3000);

    // iOS first-show after 1s for a snappy feel
    const iosTimer = setTimeout(() => {
      if (isIOS()) {
        setIsAvailable(true);
      }
    }, 1000);

    return () => {
      document.removeEventListener("pwa-install-available-event", handleAvailable);
      document.removeEventListener("pwa-install-success-event", handleSuccess);
      clearTimeout(eventTimer);
      clearTimeout(iosTimer);
    };
  }, [isStandalone, dismissed]);

  const handleInstallClick = () => {
    (document.querySelector("pwa-install") as any)?.showDialog();
  };

  const handleDismiss = () => {
    setDismissed(true);
    safeSetItem("pwa-install-dismissed", "true");
  };

  // Portal mindig renderelődjön, hogy a <pwa-install> a DOM-ban legyen
  // amint a komponens felcsatlakozott — így az eseményei azonnal elsülhetnek
  const pwaInstallPortal = typeof document !== "undefined"
    ? createPortal(
        <pwa-install
          manifest-url="/manifest.json"
          use-local-storage
          manual-apple="true"
          manual-desktop="true"
          className="fixed bottom-0 right-0 z-[99999]"
        ></pwa-install>,
        document.body
      )
    : null;

  if (isStandalone || dismissed) {
    return <>{pwaInstallPortal}</>;
  }

  return (
    <>
      {pwaInstallPortal}

      {isAvailable && (
        <div className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-[9999] animate-slide-up">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <div className="flex items-start gap-3">
              {/* App icon */}
              <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden shadow-md">
                <img
                  src="/icons/icon-192x192.png"
                  alt="gWeather"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                  {t("pwaInstall.title", "Telepítsd az alkalmazást")}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                  {t("pwaInstall.description", "Gyorsabb hozzáférés, offline használat, jobb élmény.")}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleInstallClick}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                {t("pwaInstall.install", "Telepítés")}
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                {t("common.cancel", "Mégse")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
