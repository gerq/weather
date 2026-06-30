import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import Navigation from "@/components/Navigation";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import PWARegistration from "@/components/PWARegistration";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";
import { LanguageProvider } from "@/lib/i18n/context";
import type { Language } from "@/lib/i18n/translations";
import HtmlLangSetter from "@/components/HtmlLangSetter";

export const metadata: Metadata = {
  title: "gWeather",
  description: "Modern időjárás alkalmazás előrejelzésekkel, térképekkel és orvosmeteorológiával",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "gWeather",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f4f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read language from middleware-set header for SSR
  const headersList = await headers();
  const initialLocale = (headersList.get("x-lang") || "hu") as Language;

  return (
    <html lang={initialLocale} className="h-full">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-dvh bg-[var(--background)] text-[var(--foreground)] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <LanguageProvider initialLocale={initialLocale}>
          <HtmlLangSetter />
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <div className="hidden md:block">
            <LanguageSelector />
          </div>
          <Navigation />
          <PWARegistration />
          <PwaInstallPrompt />
          <main className="md:ml-20 pt-14 pb-16 md:pt-0 md:pb-0">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
