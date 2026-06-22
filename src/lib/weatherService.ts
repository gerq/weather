import type { WeatherData, WeatherCurrent, HourlyForecast, DailyForecast, AirPollution, GeocodingResult } from "@/types/weather";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "";
const BASE_URL = "https://api.openweathermap.org";
const UNITS = "metric";
const LANG = "hu";

async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API hiba: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherCurrent> {
  const data = await fetchApi<any>(
    `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`
  );

  return {
    dt: data.dt,
    temp: data.main.temp,
    feels_like: data.main.feels_like,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    wind_speed: data.wind.speed,
    wind_deg: data.wind.deg,
    wind_gust: data.wind.gust,
    clouds: data.clouds.all,
    visibility: data.visibility,
    uvi: 0, // OpenWeatherMap ingyenes verziója nem ad UV-t
    weather: {
      id: data.weather[0].id,
      main: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    },
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
  };
}

export async function getForecast(lat: number, lon: number): Promise<{ hourly: HourlyForecast[]; daily: DailyForecast[] }> {
  const data = await fetchApi<any>(
    `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`
  );

  // Csoportosítás napok szerint
  const dailyMap = new Map<string, any[]>();

  const hourly: HourlyForecast[] = data.list.slice(0, 8).map((item: any) => ({
    dt: item.dt,
    temp: item.main.temp,
    feels_like: item.main.feels_like,
    humidity: item.main.humidity,
    wind_speed: item.wind.speed,
    wind_deg: item.wind.deg,
    pop: (item.pop || 0) * 100,
    weather: {
      id: item.weather[0].id,
      main: item.weather[0].main,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    },
  }));

  // Napi előrejelzés számítása a 3 órás adatokból
  data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyMap.has(date)) {
      dailyMap.set(date, []);
    }
    dailyMap.get(date)!.push(item);
  });

  const daily: DailyForecast[] = [];
  dailyMap.forEach((items, _date) => {
    const temps = items.map((i: any) => i.main.temp);
    const first = items[0];
    daily.push({
      dt: first.dt,
      temp: {
        min: Math.min(...temps),
        max: Math.max(...temps),
        morn: items[Math.min(3, items.length - 1)]?.main.temp || first.main.temp,
        day: items[Math.min(4, items.length - 1)]?.main.temp || first.main.temp,
        eve: items[Math.min(6, items.length - 1)]?.main.temp || first.main.temp,
        night: first.main.temp,
      },
      feels_like: {
        day: first.main.feels_like,
        night: items[items.length - 1]?.main.feels_like || first.main.feels_like,
      },
      humidity: Math.round(items.reduce((a: number, i: any) => a + i.main.humidity, 0) / items.length),
      wind_speed: Math.round(Math.max(...items.map((i: any) => i.wind.speed))),
      wind_deg: first.wind.deg,
      pop: Math.round(Math.max(...items.map((i: any) => i.pop || 0)) * 100),
      weather: first.weather[0],
      sunrise: first.sys?.sunrise || 0,
      sunset: first.sys?.sunset || 0,
    });
  });

  return { hourly, daily: daily.slice(0, 7) };
}

export async function getAirPollution(lat: number, lon: number): Promise<AirPollution | null> {
  try {
    const data = await fetchApi<any>(
      `${BASE_URL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    const item = data.list[0];
    return {
      aqi: item.main.aqi,
      components: item.components,
    };
  } catch {
    return null;
  }
}

export async function searchCity(query: string): Promise<GeocodingResult[]> {
  const data = await fetchApi<any[]>(
    `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  );

  return data.map((item: any) => ({
    name: item.local_names?.hu || item.name,
    lat: item.lat,
    lon: item.lon,
    country: item.country,
    state: item.state,
  }));
}

export async function getCityName(lat: number, lon: number): Promise<{ name: string; country: string; state?: string }> {
  const data = await fetchApi<any[]>(
    `${BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
  );

  if (data.length > 0) {
    return {
      name: data[0].local_names?.hu || data[0].name,
      country: data[0].country,
      state: data[0].state,
    };
  }
  return { name: "Ismeretlen", country: "" };
}

export async function getCompleteWeatherData(lat: number, lon: number): Promise<WeatherData> {
  const [current, forecastData, airPollution, location] = await Promise.all([
    getCurrentWeather(lat, lon),
    getForecast(lat, lon),
    getAirPollution(lat, lon),
    getCityName(lat, lon),
  ]);

  // Próbáljuk meg az UV indexet Open-Meteo-ból (ingyenes, nincs API kulcs)
  try {
    const uvData = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=uv_index&timezone=auto`
    );
    if (uvData.ok) {
      const uvJson = await uvData.json();
      if (uvJson.current?.uv_index !== undefined) {
        current.uvi = uvJson.current.uv_index;
      }
    }
  } catch {
    // UV index elérhetetlen, marad 0
  }

  return {
    current,
    hourly: forecastData.hourly,
    daily: forecastData.daily,
    airPollution,
    location: {
      ...location,
      lat,
      lon,
    },
  };
}

export function getMapTileUrl(layer: string): string {
  return `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${API_KEY}`;
}
