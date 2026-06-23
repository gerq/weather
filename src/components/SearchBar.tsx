"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Loader2, MapPin } from "lucide-react";
import { searchCity } from "@/lib/weatherService";
import { useI18n } from "@/lib/i18n/context";
import type { GeocodingResult } from "@/types/weather";

interface SearchBarProps {
  onSelectLocation: (lat: number, lon: number, name: string) => void;
}

export default function SearchBar({ onSelectLocation }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const doSearch = useCallback(async (value: string) => {
    if (value.trim().length < 2) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const cities = await searchCity(value);
      setResults(cities);
      setOpen(cities.length > 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);

    // Debounce: 300ms szünet a gépelés után
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  };

  const handleSelect = (city: GeocodingResult) => {
    const displayName = city.state
      ? `${city.name}, ${city.state}, ${city.country}`
      : `${city.name}, ${city.country}`;
    setQuery(city.name);
    onSelectLocation(city.lat, city.lon, displayName);
    setOpen(false);
  };

  const { t } = useI18n();

  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onSelectLocation(pos.coords.latitude, pos.coords.longitude, t("search.currentPosition"));
          setQuery("");
          setOpen(false);
        },
        () => alert(t("search.geoError")),
        { timeout: 10000 }
      );
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t("search.placeholder")}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white/50 transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 animate-spin" />
          )}
        </div>
        <button
          onClick={handleDetectLocation}
          className="p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all shrink-0"
          title={t("search.detectLocation")}
          aria-label={t("search.detectLocation")}
        >
          <MapPin className="w-5 h-5 text-white" />
        </button>
      </div>

      {open && results.length > 0 && (
        <div
          className="absolute top-full mt-2 w-full rounded-xl bg-white/95 backdrop-blur-md shadow-xl border border-white/30 overflow-hidden z-50"
          role="listbox"
          aria-label={t("search.resultsLabel")}
        >
          {results.map((city, i) => (
            <button
              key={`${city.lat}-${city.lon}-${i}`}
              onClick={() => handleSelect(city)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-0"
              role="option"
              aria-selected={false}
            >
              <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
              <div>
                <p className="font-medium text-gray-800">{city.name}</p>
                <p className="text-sm text-gray-500">
                  {city.state ? `${city.state}, ` : ""}{city.country}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
