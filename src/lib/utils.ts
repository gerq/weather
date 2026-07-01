import { format, fromUnixTime, isToday, isTomorrow } from "date-fns";
import type { Locale } from "date-fns";

export function getWindDirection(deg: number, t: (key: string, fallback?: string) => string): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const key = directions[Math.round(deg / 45) % 8];
  return t(`wind.${key}`, key);
}

export function formatTemp(temp: number): string {
  return `${Math.round(temp)}°`;
}

export function formatTime(unixTimestamp: number): string {
  return format(fromUnixTime(unixTimestamp), "HH:mm");
}

export function formatDay(unixTimestamp: number, t: (key: string, fallback?: string) => string, locale?: Locale): string {
  const date = fromUnixTime(unixTimestamp);
  if (isToday(date)) return t("common.today", "Today");
  if (isTomorrow(date)) return t("common.tomorrow", "Tomorrow");
  return format(date, "EEEE", { locale });
}

export function formatDate(unixTimestamp: number, locale?: Locale): string {
  return format(fromUnixTime(unixTimestamp), "MMM d.", { locale });
}

export function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
export function getWeatherIconUrlForPullToRefresh(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

const weatherTranslationKeys: Record<string, string> = {
  "clear sky": `weather.clearSky`,
  "few clouds": `weather.fewClouds`,
  "scattered clouds": `weather.scatteredClouds`,
  "broken clouds": `weather.brokenClouds`,
  "overcast clouds": `weather.overcastClouds`,
  "light rain": `weather.lightRain`,
  "moderate rain": `weather.moderateRain`,
  "heavy intensity rain": `weather.heavyRain`,
  "very heavy rain": `weather.veryHeavyRain`,
  "extreme rain": `weather.extremeRain`,
  "freezing rain": `weather.freezingRain`,
  "light snow": `weather.lightSnow`,
  snow: `weather.snow`,
  "heavy snow": `weather.heavySnow`,
  sleet: `weather.sleet`,
  "light shower rain": `weather.lightShower`,
  "shower rain": `weather.shower`,
  "heavy intensity shower rain": `weather.heavyShower`,
  thunderstorm: `weather.thunderstorm`,
  "thunderstorm with light rain": `weather.thunderstormLightRain`,
  "thunderstorm with heavy rain": `weather.thunderstormHeavyRain`,
  mist: `weather.mist`,
  fog: `weather.fog`,
  haze: `weather.haze`,
  smoke: `weather.smoke`,
  dust: `weather.dust`,
  sand: `weather.sand`,
  "light intensity drizzle": `weather.lightDrizzle`,
  drizzle: `weather.drizzle`,
  "heavy intensity drizzle": `weather.heavyDrizzle`,
};

export function getWeatherDescription(
  description: string,
  t: (key: string, fallback?: string) => string
): string {
  const key = weatherTranslationKeys[description.toLowerCase()];
  if (key) return t(key, description);
  return description;
}

export function getWeatherBgClass(weatherId: number): string {
  if (weatherId >= 200 && weatherId < 300) return "from-purple-900 via-indigo-800 to-blue-900";
  if (weatherId >= 300 && weatherId < 400) return "from-blue-700 via-blue-600 to-gray-600";
  if (weatherId >= 500 && weatherId < 600) return "from-blue-800 via-gray-700 to-gray-800";
  if (weatherId >= 600 && weatherId < 700) return "from-blue-100 via-gray-200 to-white dark:from-gray-700 dark:via-gray-600 dark:to-blue-200";
  if (weatherId >= 700 && weatherId < 800) return "from-gray-500 via-gray-400 to-gray-600";
  if (weatherId === 800) return "from-blue-500 via-blue-400 to-blue-300 dark:from-blue-700 dark:via-blue-600 dark:to-blue-500";
  if (weatherId === 801) return "from-blue-400 via-blue-300 to-blue-200 dark:from-blue-700 dark:via-blue-600 dark:to-gray-600";
  return "from-blue-500 via-blue-400 to-gray-400 dark:from-gray-700 dark:via-gray-600 dark:to-gray-500";
}

export function getHourlyIcon(weatherId: number): string {
  if (weatherId >= 200 && weatherId < 300) return "cloud-lightning";
  if (weatherId >= 300 && weatherId < 400) return "cloud-drizzle";
  if (weatherId >= 500 && weatherId < 600) return "cloud-rain";
  if (weatherId >= 600 && weatherId < 700) return "cloud-snow";
  if (weatherId >= 700 && weatherId < 800) return "cloud-fog";
  if (weatherId === 800) return "sun";
  if (weatherId === 801) return "cloud-sun";
  return "cloud";
}

export function aqiToLabel(aqi: number, t: (key: string, fallback?: string) => string): string {
  const keys = ["", "aqi.excellent", "aqi.good", "aqi.moderate", "aqi.poor", "aqi.veryPoor"];
  const key = keys[aqi];
  if (key) return t(key);
  return t("aqi.unknown", "Unknown");
}

export function aqiToColor(aqi: number): string {
  const colors = ["", "text-green-500", "text-yellow-500", "text-orange-500", "text-red-500", "text-purple-800"];
  return colors[aqi] || "text-gray-500";
}

export function aqiToBg(aqi: number): string {
  const colors = ["", "bg-green-500", "bg-yellow-500", "bg-orange-500", "bg-red-500", "bg-purple-800"];
  return colors[aqi] || "bg-gray-500";
}
