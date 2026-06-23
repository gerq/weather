import { NextResponse, type NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["hu", "en", "de"];

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Preferred languages from browser (Accept-Language header)
  const acceptLang = request.headers.get("accept-language") || "";
  const preferred = acceptLang
    .split(",")
    .map((l) => l.split(";")[0].trim().slice(0, 2).toLowerCase())
    .find((l) => SUPPORTED_LOCALES.includes(l));

  // Cookie from previous visit
  const cookie = request.cookies.get("lang")?.value;

  const lang = cookie || preferred || "hu";

  // Set the lang cookie if not set (or different from detected)
  if (cookie !== lang) {
    response.cookies.set("lang", lang, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });
  }

  // Add a response header so client components can read the initial locale
  response.headers.set("x-lang", lang);

  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/).*)",
};
