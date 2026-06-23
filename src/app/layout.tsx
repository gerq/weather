import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import PWARegistration from "@/components/PWARegistration";
import { LanguageProvider } from "@/lib/i18n/context";
import type { Language } from "@/lib/i18n/translations";
import HtmlLangSetter from "@/components/HtmlLangSetter";

export const metadata: Metadata = {
  title: "Időjárás - Weather App",
  description: "Modern időjárás alkalmazás előrejelzésekkel, térképekkel és orvosmeteorológiával",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Időjárás",
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
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <LanguageProvider initialLocale={initialLocale}>
          <HtmlLangSetter />
          <ThemeToggle />
          <LanguageSelector />
          <Navigation />
          <PWARegistration />
          <main className="md:ml-20 pb-0">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
