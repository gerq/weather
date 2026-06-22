"use client";

import dynamic from "next/dynamic";
import { useWeather } from "@/hooks/useWeather";
import { MapPin, Loader2, Info } from "lucide-react";

// Teljes WeatherMap komponens dinamikus importálása SSR nélkül
const WeatherMap = dynamic(
  () => import("@/components/WeatherMap"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
        <div className="h-[calc(100dvh-14rem)] md:h-[calc(100dvh-12rem)] flex items-center justify-center bg-gray-100 dark:bg-gray-700">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="text-gray-500 dark:text-gray-400">Térkép betöltése...</span>
          </div>
        </div>
      </div>
    ),
  }
);

export default function MapPage() {
  const { weather, loading, location } = useWeather();

  if (loading && !weather) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="text-gray-500 dark:text-gray-400">Térkép betöltése...</p>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const coords = location
    ? { lat: location.lat, lon: location.lon }
    : { lat: 47.4979, lon: 19.0402 };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-4 max-w-5xl mx-auto">
      <div className="animate-fade-in">
        {/* Fejléc */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Időjárás térkép
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {weather.location.name}
            </p>
          </div>
        </div>

        {/* Információs banner */}
        <div className="flex items-start gap-3 p-4 mb-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p>
              Válaszd ki a térkép réteget a bal felső sarokban. Elérhető rétegek:
              hőmérséklet, csapadék, felhőzet, szél és légnyomás.
            </p>
            <p className="mt-1 text-blue-600 dark:text-blue-400">
              💡 Tipp: A térképen használhatod az egeret a nagyításhoz és a
              mozgatáshoz.
            </p>
          </div>
        </div>

        {/* Térkép */}
        <WeatherMap lat={coords.lat} lon={coords.lon} />
      </div>
    </div>
  );
}
