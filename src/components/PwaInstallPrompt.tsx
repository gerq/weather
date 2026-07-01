"use client";

import { useEffect, useMemo, useState } from "react";
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

function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  // Detect Facebook/Messenger/Instagram in-app browsers
  return /FBAN|FBAV|FBIOS|FB_IAB|FB4A|FBBROWSER|Instagram|MESSENGER/i.test(ua);
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
  const [mounted, setMounted] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { t } = useI18n();

  // Mark as mounted after hydration so we can safely render client-only
  // content (like portals to document.body) without causing a mismatch.
  useEffect(() => {
    setMounted(true);
  }, []);

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
    // In-app browsers (Messenger, Facebook, Instagram) can't install PWAs
    // Show instructions instead of calling the library's dialog
    if (isInAppBrowser()) {
      setShowInstructions(true);
      return;
    }
    (document.querySelector("pwa-install") as any)?.showDialog();
  };

  const handleDismiss = () => {
    setDismissed(true);
    safeSetItem("pwa-install-dismissed", "true");
  };

  // Only render the <pwa-install> portal after hydration (mounted=true)
  // to avoid hydration mismatch — the server can't render portals
  // to document.body, so the first client render must also skip it.
  const pwaInstallPortal = useMemo(() => {
    if (!mounted) return null;
    return createPortal(
      <pwa-install
        manifest-url="/manifest.json"
        use-local-storage
        manual-apple="true"
        manual-desktop="true"
        className="fixed bottom-0 right-0 z-[99999]"
      ></pwa-install>,
      document.body
    );
  }, [mounted]);

  // Also prevent rendering the install banner during SSR/hydration,
  // since it uses non-deterministic client-only state (localStorage, matchMedia)
  if (!mounted) {
    return <>{pwaInstallPortal}</>;
  }

  if (isStandalone || dismissed) {
    return <>{pwaInstallPortal}</>;
  }

  return (
    <>
      {pwaInstallPortal}

      {/* Custom install banner */}
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

      {/* Instructions modal for in-app browsers */}
      {showInstructions && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowInstructions(false)}
          />
          {/* Modal */}
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
            {/* Close */}
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <div className="text-center">
              {/* Safari icon */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
                  <path d="M2 12h20" />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("pwaInstall.iosInstructions.title", "Nyisd meg Safariban")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {t("pwaInstall.iosInstructions.description", "Az alkalmazás telepítéséhez nyisd meg ezt az oldalt a Safari böngészőben, majd használd a Megosztás gombot a kezdőképernyőhöz adáshoz.")}
              </p>

              <div className="space-y-3 text-left bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-4">
                <Step number="1" text={t("pwaInstall.iosInstructions.step1", "Nyisd meg Safariban")} />
                <Step number="2" text={t("pwaInstall.iosInstructions.step2", "Koppints a Megosztás ikonra 🫘")} />
                <Step number="3" text={t("pwaInstall.iosInstructions.step3", 'Görgess le és válaszd a "Kezdőképernyőhöz" lehetőséget')} />
                <Step number="4" text={t("pwaInstall.iosInstructions.step4", 'Koppints a "Hozzáadás" gombra')} />
              </div>

              <button
                onClick={() => setShowInstructions(false)}
                className="w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all active:scale-95"
              >
                {t("common.close", "Bezárás")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Step({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0">
        {number}
      </span>
      <p className="text-sm text-gray-600 dark:text-gray-300">{text}</p>
    </div>
  );
}
