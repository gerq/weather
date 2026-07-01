"use client";

import { useState } from "react";
import { MapPin, RefreshCw, Loader2 } from "lucide-react";
import type { WeatherData } from "@/types/weather";
import { formatTemp, getWeatherIconUrl, getWeatherDescription, formatTime, getWeatherBgClass } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import SearchBar from "./SearchBar";
import WeatherBackground from "./WeatherBackground";

interface CurrentWeatherProps {
  weather: WeatherData;
  loading: boolean;
  isDaytime: boolean;
  onRefresh: () => void;
  onLocationChange: (lat: number, lon: number, name: string) => void;
}

export default function CurrentWeather({ weather, loading, isDaytime, onRefresh, onLocationChange }: CurrentWeatherProps) {
  const { current, location } = weather;
  const { t, dateFnsLocale } = useI18n();
  const bgClass = getWeatherBgClass(current.weather.id);
  const [showSearch, setShowSearch] = useState(false);

  const handleSelectLocation = (lat: number, lon: number, name: string) => {
    onLocationChange(lat, lon, name);
    setShowSearch(false);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
  };

  return (
    <div className={`relative rounded-3xl p-6 md:p-8 bg-gradient-to-br ${bgClass} text-white shadow-2xl`}>
      {/* Weather-based animated background — clipped corners separately so search dropdown isn't clipped */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <WeatherBackground weatherId={current.weather.id} isDaytime={isDaytime} />
      </div>

      {/* Header */}
      <div className="relative z-10 space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          {!showSearch ? (
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity text-left"
              aria-label={t("search.changeLocation")}
            >
              <MapPin className="w-5 h-5 shrink-0" />
              <h1 className="text-lg font-semibold truncate">{location.name}</h1>
            </button>
          ) : (
            <div className="flex-1 animate-fade-in relative z-[100]">
              <SearchBar onSelectLocation={handleSelectLocation} onClose={handleCloseSearch} />
            </div>
          )}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Main weather info */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-6xl md:text-7xl font-light tracking-tighter">
              {formatTemp(current.temp)}
            </div>
            <p className="text-lg text-white/80 mt-1">
              {t("weather.feelsLike")}: {formatTemp(current.feels_like)}
            </p>
            <p className="text-base text-white/90 mt-2 font-medium">
              {getWeatherDescription(current.weather.description, t)}
            </p>
          </div>
          <img
            src={getWeatherIconUrl(current.weather.icon)}
            alt={current.weather.description}
            className="w-28 h-28 md:w-32 md:h-32 -mr-2 drop-shadow-lg"
          />
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <DetailCard label={t("weather.humidity")} value={`${current.humidity}%`} />
          <DetailCard label={t("weather.wind")} value={`${Math.round(current.wind_speed)} ${t("weather.windUnit")}`} />
          <DetailCard label={t("weather.pressure")} value={`${current.pressure} ${t("weather.pressureUnit")}`} />
          <DetailCard label={t("weather.clouds")} value={`${current.clouds}%`} />
        </div>

        {/* Sun info */}
        <div className="flex items-center justify-center gap-8 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <span>🌅</span>
            <span>{t("weather.sunrise")}: {formatTime(current.sunrise)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🌇</span>
            <span>{t("weather.sunset")}: {formatTime(current.sunset)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
      <p className="text-xs text-white/70 mb-1">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
