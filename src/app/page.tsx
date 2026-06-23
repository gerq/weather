"use client";

import { useWeather } from "@/hooks/useWeather";
import CurrentWeather from "@/components/CurrentWeather";
import HourlyForecast from "@/components/HourlyForecast";
import DailyForecast from "@/components/DailyForecast";
import DressingTips from "@/components/DressingTips";
import { useI18n } from "@/lib/i18n/context";
import { Loader2, AlertCircle, CloudSun } from "lucide-react";

export default function Home() {
  const {
    weather,
    dressingTips,
    loading,
    error,
    location,
    setLocation,
    isDaytime,
    refresh,
  } = useWeather();
  const { t } = useI18n();

  if (loading && !weather) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <CloudSun className="w-16 h-16 text-blue-400 animate-pulse mx-auto" />
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">
            {t("weather.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {t("common.error")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {t("weather.error.apiKey")}
          </p>
          <button
            onClick={refresh}
            className="px-6 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium"
          >
            {t("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="min-h-screen">
      {/* Hero section with current weather */}
      <div className="p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <CurrentWeather
            weather={weather}
            loading={loading}
            isDaytime={isDaytime}
            onRefresh={refresh}
            onLocationChange={setLocation}
          />
        </div>

        {/* Hourly + Dressing tips row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 animate-fade-in-delay-1 h-full">
            <HourlyForecast hourly={weather.hourly} />
          </div>
          <div className="animate-fade-in-delay-1">
            <DressingTips tips={dressingTips} />
          </div>
        </div>

        {/* Daily forecast */}
        <div className="animate-fade-in-delay-2">
          <DailyForecast daily={weather.daily} />
        </div>
      </div>
    </div>
  );
}
