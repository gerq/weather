export interface WeatherCurrent {
  dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  clouds: number;
  visibility: number;
  uvi: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
  sunrise: number;
  sunset: number;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  pop: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

export interface DailyForecast {
  dt: number;
  temp: {
    min: number;
    max: number;
    morn: number;
    day: number;
    eve: number;
    night: number;
  };
  feels_like: {
    day: number;
    night: number;
  };
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  pop: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
  sunrise: number;
  sunset: number;
}

export interface AirPollution {
  aqi: number; // 1-5
  components: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
}

export interface WeatherData {
  current: WeatherCurrent;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  airPollution: AirPollution | null;
  location: {
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
  };
}

export interface GeocodingResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export type TemperatureUnit = "celsius" | "fahrenheit";

export interface DressingTip {
  category: string;
  items: string[];
  icon: string;
  severity: "info" | "warning" | "danger";
}

export interface MedicalMeteorologyData {
  generalFeeling: {
    score: number; // 1-10
    label: string;
    description: string;
  };
  headacheRisk: {
    level: "alacsony" | "közepes" | "magas";
    description: string;
  };
  jointPainRisk: {
    level: "alacsony" | "közepes" | "magas";
    description: string;
  };
  cardiovascularStress: {
    level: "alacsony" | "közepes" | "magas";
    description: string;
  };
  asthmaRisk: {
    level: "alacsony" | "közepes" | "magas";
    description: string;
  };
  airQualityLabel: string;
  recommendation: string;
}
