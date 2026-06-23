"use client";

import { useState, useMemo } from "react";
import { MapContainer, TileLayer, ZoomControl, Marker, Popup } from "react-leaflet";
import { Layers } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { getWeatherIconUrl, formatTemp, getWeatherDescription } from "@/lib/utils";
import type { WeatherData } from "@/types/weather";

// Leaflet CSS import
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue with webpack/next.js
// We use our own DivIcon, so no need for default icon fix

interface WeatherMapProps {
  lat: number;
  lon: number;
  weather?: WeatherData | null;
}

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "";

type MapLayer = {
  id: string;
  nameKey: string;
  tileUrl: string;
};

function useLayers(): MapLayer[] {
  const { t } = useI18n();
  return [
    {
      id: "temp_new",
      nameKey: t("mapLayer.temperature"),
      tileUrl: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    },
    {
      id: "precipitation_new",
      nameKey: t("mapLayer.precipitation"),
      tileUrl: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    },
    {
      id: "clouds_new",
      nameKey: t("mapLayer.clouds"),
      tileUrl: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    },
    {
      id: "wind_new",
      nameKey: t("mapLayer.wind"),
      tileUrl: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    },
    {
      id: "pressure_new",
      nameKey: t("mapLayer.pressure"),
      tileUrl: `https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    },
  ];
}

/** Custom marker icon showing weather icon + temperature */
function createWeatherIcon(iconCode: string, temp: string, isDark: boolean): L.DivIcon {
  const bg = isDark ? "rgba(30,41,59,0.9)" : "rgba(255,255,255,0.9)";
  const textColor = isDark ? "#f1f5f9" : "#1e293b";
  const borderColor = isDark ? "rgba(148,163,184,0.4)" : "rgba(148,163,184,0.4)";

  return L.divIcon({
    className: "",
    iconSize: [80, 80],
    iconAnchor: [40, 40],
    html: `
      <div style="
        display: flex; flex-direction: column; align-items: center;
        background: ${bg}; backdrop-filter: blur(8px);
        border: 2px solid ${borderColor};
        border-radius: 16px; padding: 6px 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        transform: translateY(-20px);
      ">
        <img src="${getWeatherIconUrl(iconCode)}" alt=""
          style="width: 48px; height: 48px; margin: -8px 0 -4px 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));" />
        <span style="
          font-size: 14px; font-weight: 700; color: ${textColor};
          line-height: 1.1; text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        ">${temp}</span>
      </div>
    `,
  });
}

export default function WeatherMap({ lat, lon, weather }: WeatherMapProps) {
  const { t } = useI18n();
  const layers = useLayers();
  const [activeLayer, setActiveLayer] = useState(1);
  const [showLayerPicker, setShowLayerPicker] = useState(false);

  // Create a marker icon with the current weather icon + temperature
  const markerIcon = useMemo(() => {
    if (!weather?.current) return null;
    const iconCode = weather.current.weather.icon;
    const tempStr = formatTemp(weather.current.temp);
    return createWeatherIcon(iconCode, tempStr, /* isDark bg? */ false);
  }, [weather?.current?.weather.icon, weather?.current?.temp]);

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden relative">
      {/* Rétegválasztó */}
      <div className="absolute top-4 left-4 z-[1000]">
        <button
          onClick={() => setShowLayerPicker(!showLayerPicker)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-all"
        >
          <Layers className="w-4 h-4" />
          {layers[activeLayer].nameKey}
        </button>
        {showLayerPicker && (
          <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {layers.map((layer, i) => (
              <button
                key={layer.id}
                onClick={() => {
                  setActiveLayer(i);
                  setShowLayerPicker(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  i === activeLayer
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {layer.nameKey}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Térkép */}
      <div className="h-[calc(100dvh-14rem)] md:h-[calc(100dvh-12rem)] w-full">
        <MapContainer
          center={[lat, lon]}
          zoom={8}
          scrollWheelZoom={true}
          zoomControl={false}
          className="w-full h-full"
        >
          <ZoomControl position="bottomright" />

          {/* Sötét alapréteg – maximális kontraszt az időjárás rétegekhez */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Időjárás réteg – teljes opacitással */}
          {API_KEY && (
            <TileLayer
              key={layers[activeLayer].id}
              url={layers[activeLayer].tileUrl}
              opacity={1.0}
            />
          )}

          {/* Aktuális hely marker időjárás ikonnal */}
          {weather?.current && markerIcon && (
            <Marker
              position={[lat, lon]}
              icon={markerIcon}
            >
              <Popup>
                <div className="text-center min-w-[120px]">
                  <p className="font-semibold text-sm">{weather.location.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {getWeatherDescription(weather.current.weather.description, t)}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-lg font-bold">{formatTemp(weather.current.temp)}</span>
                    <span className="text-xs text-gray-400">
                      {t("weather.humidity")}: {weather.current.humidity}%
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
