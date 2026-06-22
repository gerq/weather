"use client";

import { useState, useEffect, useCallback } from "react";
import type { WeatherData, DressingTip, MedicalMeteorologyData } from "@/types/weather";
import { getCompleteWeatherData } from "@/lib/weatherService";
import { getDressingTips } from "@/lib/dressingTips";
import { getMedicalMeteorologyForWeather } from "@/lib/medicalMeteorology";

interface UseWeatherReturn {
  weather: WeatherData | null;
  dressingTips: DressingTip[];
  medicalMeteorology: MedicalMeteorologyData | null;
  loading: boolean;
  error: string | null;
  location: { lat: number; lon: number; name: string } | null;
  setLocation: (lat: number, lon: number, name: string) => void;
  isDaytime: boolean;
  refresh: () => void;
}

export function useWeather(): UseWeatherReturn {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [dressingTips, setDressingTips] = useState<DressingTip[]>([]);
  const [medicalMeteorology, setMedicalMeteorology] = useState<MedicalMeteorologyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocationState] = useState<{ lat: number; lon: number; name: string } | null>(null);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCompleteWeatherData(lat, lon);
      setWeather(data);

      // Öltözködési tippek
      const now = Date.now() / 1000;
      const isDaytime = now > data.current.sunrise && now < data.current.sunset;
      const tips = getDressingTips(
        data.current.temp,
        data.current.feels_like,
        data.current.humidity,
        data.current.wind_speed,
        data.current.weather.id,
        isDaytime
      );
      setDressingTips(tips);

      // Orvosmeteorológia
      const medData = getMedicalMeteorologyForWeather(
        data.current.temp,
        data.current.humidity,
        data.current.pressure,
        data.current.wind_speed,
        data.current.weather.id,
        data.airPollution?.aqi ?? null,
        data.current.uvi
      );
      setMedicalMeteorology(medData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ismeretlen hiba történt");
    } finally {
      setLoading(false);
    }
  }, []);

  const setLocation = useCallback((lat: number, lon: number, name: string) => {
    setLocationState({ lat, lon, name });
    localStorage.setItem("weather-location", JSON.stringify({ lat, lon, name }));
    fetchWeather(lat, lon);
  }, [fetchWeather]);

  const refresh = useCallback(() => {
    if (location) {
      fetchWeather(location.lat, location.lon);
    }
  }, [location, fetchWeather]);

  // Initial location detection
  useEffect(() => {
    const saved = localStorage.getItem("weather-location");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLocationState(parsed);
        fetchWeather(parsed.lat, parsed.lon);
        return;
      } catch {}
    }

    // Geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocationState({ lat: latitude, lon: longitude, name: "Aktuális pozíció" });
          fetchWeather(latitude, longitude);
        },
        () => {
          // Default: Budapest
          const defaultLoc = { lat: 47.4979, lon: 19.0402, name: "Budapest" };
          setLocationState(defaultLoc);
          fetchWeather(defaultLoc.lat, defaultLoc.lon);
        },
        { timeout: 10000 }
      );
    } else {
      const defaultLoc = { lat: 47.4979, lon: 19.0402, name: "Budapest" };
      setLocationState(defaultLoc);
      fetchWeather(defaultLoc.lat, defaultLoc.lon);
    }
  }, [fetchWeather]);

  // Periodikus frissítés 30 percenként
  useEffect(() => {
    if (!location) return;
    const interval = setInterval(() => {
      fetchWeather(location.lat, location.lon);
    }, 30 * 60 * 1000); // 30 perc
    return () => clearInterval(interval);
  }, [location, fetchWeather]);

  const isDaytime = weather
    ? Date.now() / 1000 > weather.current.sunrise && Date.now() / 1000 < weather.current.sunset
    : true;

  return {
    weather,
    dressingTips,
    medicalMeteorology,
    loading,
    error,
    location,
    setLocation,
    isDaytime,
    refresh,
  };
}
