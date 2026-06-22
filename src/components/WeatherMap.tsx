"use client";

import { useState } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { Layers } from "lucide-react";

// Leaflet CSS import - kritikus a térkép megjelenítéséhez!
import "leaflet/dist/leaflet.css";

interface WeatherMapProps {
  lat: number;
  lon: number;
}

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "";

type MapLayer = {
  id: string;
  name: string;
  tileUrl: string;
};

const layers: MapLayer[] = [
  {
    id: "temp_new",
    name: "Hőmérséklet",
    tileUrl: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
  },
  {
    id: "precipitation_new",
    name: "Csapadék",
    tileUrl: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
  },
  {
    id: "clouds_new",
    name: "Felhőzet",
    tileUrl: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
  },
  {
    id: "wind_new",
    name: "Szél",
    tileUrl: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
  },
  {
    id: "pressure_new",
    name: "Légnyomás",
    tileUrl: `https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
  },
];

export default function WeatherMap({ lat, lon }: WeatherMapProps) {
  const [activeLayer, setActiveLayer] = useState(1); // Csapadék alapértelmezett
  const [showLayerPicker, setShowLayerPicker] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden relative">
      {/* Rétegválasztó */}
      <div className="absolute top-4 left-4 z-[1000]">
        <button
          onClick={() => setShowLayerPicker(!showLayerPicker)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-all"
        >
          <Layers className="w-4 h-4" />
          {layers[activeLayer].name}
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
                {layer.name}
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
          {/* Semleges világos alapréteg – jobban kiemeli az időjárás rétegeket */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {/* Időjárás réteg – magasabb opacitással a jobb láthatóságért */}
          {API_KEY && (
            <TileLayer
              key={layers[activeLayer].id}
              url={layers[activeLayer].tileUrl}
              opacity={0.8}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
