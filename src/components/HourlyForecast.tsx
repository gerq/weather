"use client";

import type { HourlyForecast as HourlyForecastType } from "@/types/weather";
import { formatTemp, formatTime, getWeatherIconUrl } from "@/lib/utils";

interface HourlyForecastProps {
  hourly: HourlyForecastType[];
}

export default function HourlyForecast({ hourly }: HourlyForecastProps) {
  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg h-full flex flex-col">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 shrink-0">
        Órás előrejelzés
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin flex-1 items-center">
        {hourly.map((hour, i) => (
          <div
            key={hour.dt}
            className="flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {i === 0 ? "Most" : formatTime(hour.dt)}
            </span>
            <img
              src={getWeatherIconUrl(hour.weather.icon)}
              alt={hour.weather.description}
              className="w-10 h-10"
            />
            <span className="text-lg font-semibold text-gray-800 dark:text-white">
              {formatTemp(hour.temp)}
            </span>
            {hour.pop > 0 && (
              <span className="text-xs text-blue-500 font-medium">
                {Math.round(hour.pop)}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
