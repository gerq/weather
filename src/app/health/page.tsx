"use client";

import { useWeather } from "@/hooks/useWeather";
import MedicalMeteorologyComponent from "@/components/MedicalMeteorologyComponent";
import CurrentWeather from "@/components/CurrentWeather";
import { Heart, Loader2, AlertCircle, Info } from "lucide-react";

export default function HealthPage() {
  const {
    weather,
    medicalMeteorology,
    loading,
    isDaytime,
    location,
    setLocation,
    refresh,
  } = useWeather();

  if (loading && !weather) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="text-gray-500 dark:text-gray-400">
            Orvosmeteorológiai adatok betöltése...
          </p>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Orvosmeteorológia
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Időjárás hatása az egészségre
            </p>
          </div>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <Info className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">
            Az orvosmeteorológiai előrejelzés az aktuális időjárási adatok
            alapján készül. Kérjük, súlyos egészségügyi problémák esetén
            konzultálj orvosoddal!
          </p>
        </div>

        {/* Current weather summary */}
        <div className="animate-fade-in-delay-1">
          <CurrentWeather
            weather={weather}
            loading={loading}
            isDaytime={isDaytime}
            onRefresh={refresh}
            onLocationChange={setLocation}
          />
        </div>

        {/* Medical meteorology */}
        {medicalMeteorology && (
          <div className="animate-fade-in-delay-2">
            <MedicalMeteorologyComponent data={medicalMeteorology} />
          </div>
        )}
      </div>
    </div>
  );
}
