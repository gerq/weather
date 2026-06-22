import { format, fromUnixTime, isToday, isTomorrow } from "date-fns";
import { hu } from "date-fns/locale";

export function getWindDirection(deg: number): string {
  const directions = ["É", "ÉK", "K", "DK", "D", "DNy", "Ny", "ÉNy"];
  return directions[Math.round(deg / 45) % 8];
}

export function formatTemp(temp: number): string {
  return `${Math.round(temp)}°`;
}

export function formatTime(unixTimestamp: number): string {
  return format(fromUnixTime(unixTimestamp), "HH:mm");
}

export function formatDay(unixTimestamp: number): string {
  const date = fromUnixTime(unixTimestamp);
  if (isToday(date)) return "Ma";
  if (isTomorrow(date)) return "Holnap";
  return format(date, "EEEE", { locale: hu });
}

export function formatDate(unixTimestamp: number): string {
  return format(fromUnixTime(unixTimestamp), "MMM d.", { locale: hu });
}

export function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export function getWeatherDescription(description: string): string {
  // OpenWeatherMap leírások magyarítása
  const translations: Record<string, string> = {
    "clear sky": "Derült ég",
    "few clouds": "Kevés felhő",
    "scattered clouds": "Szórt felhőzet",
    "broken clouds": "Részben felhős",
    "overcast clouds": "Borult",
    "light rain": "Könnyű eső",
    "moderate rain": "Mérsékelt eső",
    "heavy intensity rain": "Heves eső",
    "very heavy rain": "Nagyon heves eső",
    "extreme rain": "Extrém eső",
    "freezing rain": "Ónos eső",
    "light snow": "Könnyű hó",
    snow: "Hó",
    "heavy snow": "Erős havazás",
    sleet: "Havas eső",
    "light shower rain": "Könnyű zápor",
    "shower rain": "Zápor",
    "heavy intensity shower rain": "Heves zápor",
    "thunderstorm": "Zivatar",
    "thunderstorm with light rain": "Zivatar könnyű esővel",
    "thunderstorm with heavy rain": "Zivatar heves esővel",
    mist: "Köd",
    fog: "Köd",
    haze: "Párás",
    smoke: "Füstös",
    dust: "Poros",
    sand: "Homokos",
    "light intensity drizzle": "Könnyű szitálás",
    drizzle: "Szitálás",
    "heavy intensity drizzle": "Erős szitálás",
  };
  return translations[description.toLowerCase()] || description;
}

export function getWeatherBgClass(weatherId: number): string {
  // Visszaad egy gradient osztályt az időjárás ID alapján
  if (weatherId >= 200 && weatherId < 300) return "from-purple-900 via-indigo-800 to-blue-900"; // Zivatar
  if (weatherId >= 300 && weatherId < 400) return "from-blue-700 via-blue-600 to-gray-600"; // Szitálás
  if (weatherId >= 500 && weatherId < 600) return "from-blue-800 via-gray-700 to-gray-800"; // Eső
  if (weatherId >= 600 && weatherId < 700) return "from-blue-100 via-gray-200 to-white dark:from-gray-700 dark:via-gray-600 dark:to-blue-200"; // Hó
  if (weatherId >= 700 && weatherId < 800) return "from-gray-500 via-gray-400 to-gray-600"; // Köd
  if (weatherId === 800) return "from-blue-500 via-blue-400 to-blue-300 dark:from-blue-700 dark:via-blue-600 dark:to-blue-500"; // Derült
  if (weatherId === 801) return "from-blue-400 via-blue-300 to-blue-200 dark:from-blue-700 dark:via-blue-600 dark:to-gray-600"; // Kevés felhő
  return "from-blue-500 via-blue-400 to-gray-400 dark:from-gray-700 dark:via-gray-600 dark:to-gray-500"; // Felhős
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

export function aqiToLabel(aqi: number): string {
  const labels = ["", "Jó", "Megfelelő", "Mérsékelt", "Rossz", "Nagyon rossz"];
  return labels[aqi] || "Ismeretlen";
}

export function aqiToColor(aqi: number): string {
  const colors = ["", "text-green-500", "text-yellow-500", "text-orange-500", "text-red-500", "text-purple-800"];
  return colors[aqi] || "text-gray-500";
}

export function aqiToBg(aqi: number): string {
  const colors = ["", "bg-green-500", "bg-yellow-500", "bg-orange-500", "bg-red-500", "bg-purple-800"];
  return colors[aqi] || "bg-gray-500";
}
