"use client";

import type { DailyForecast as DailyForecastType } from "@/types/weather";
import { formatTemp, formatDay, formatDate, getWindDirection, getWeatherIconUrl, getWeatherDescription } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { Droplets, Wind, Umbrella } from "lucide-react";

interface DailyForecastProps {
  daily: DailyForecastType[];
}

export default function DailyForecast({ daily }: DailyForecastProps) {
  const { t, dateFnsLocale } = useI18n();
  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        {t("daily.title")}
      </h2>
      <div className="space-y-1">
        {daily.map((day, i) => (
          <div
            key={day.dt}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            {/* Day name */}
            <div className="w-16 shrink-0">
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {formatDay(day.dt, t, dateFnsLocale)}
              </p>
              <p className="text-xs text-gray-400">{formatDate(day.dt, dateFnsLocale)}</p>
            </div>

            {/* Weather icon */}
            <img
              src={getWeatherIconUrl(day.weather.icon)}
              alt={day.weather.description}
              className="w-10 h-10"
            />

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 flex-1 hidden md:block truncate">
              {getWeatherDescription(day.weather.description, t)}
            </p>

            {/* Extra info */}
            <div className="hidden md:flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                {day.humidity}%
              </span>
              <span className="flex items-center gap-1">
                <Wind className="w-3 h-3" />
                {getWindDirection(day.wind_deg, t)} {Math.round(day.wind_speed)}
              </span>
              {day.pop > 0 && (
                <span className="flex items-center gap-1 text-blue-500">
                  <Umbrella className="w-3 h-3" />
                  {Math.round(day.pop)}%
                </span>
              )}
            </div>

            {/* Temperatures */}
            <div className="flex items-center gap-2 ml-auto shrink-0">
              <span className="text-sm font-semibold text-gray-800 dark:text-white w-10 text-right">
                {formatTemp(day.temp.max)}
              </span>
              <div className="w-16 h-1.5 rounded-full bg-gray-200 dark:bg-gray-600 relative overflow-hidden">
                <div
                  className="absolute top-0 h-full rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400"
                  style={{
                    left: `${((day.temp.min - (-5)) / 40) * 100}%`,
                    right: `${100 - ((day.temp.max - (-5)) / 40) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm text-gray-400 w-10">
                {formatTemp(day.temp.min)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
