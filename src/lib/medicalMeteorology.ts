import type { MedicalMeteorologyData } from "@/types/weather";

interface WeatherInput {
  temp: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  weatherId: number;
  aqi: number | null;
  uvi: number;
  season: "spring" | "summer" | "autumn" | "winter";
}

function getSeason(): "spring" | "summer" | "autumn" | "winter" {
  const month = new Date().getMonth();
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

function getLevel(score: number): "alacsony" | "közepes" | "magas" {
  if (score <= 3) return "alacsony";
  if (score <= 6) return "közepes";
  return "magas";
}

export function computeMedicalMeteorology(input: WeatherInput): MedicalMeteorologyData {
  const { temp, humidity, pressure, windSpeed, weatherId, aqi, uvi, season } = input;

  // Általános közérzet score (1-10)
  let generalScore = 7;

  // Hőmérséklet hatása
  if (temp > 30 || temp < -5) generalScore -= 2;
  else if (temp > 25 || temp < 0) generalScore -= 1;
  else if (temp >= 18 && temp <= 22) generalScore += 1;

  // Páratartalom hatása
  if (humidity > 80) generalScore -= 1;
  else if (humidity < 30) generalScore -= 1;

  // Légnyomás változás hatása
  if (pressure < 1000 || pressure > 1025) generalScore -= 1;

  // Zivatar hatása
  if (weatherId >= 200 && weatherId < 300) generalScore -= 2;

  // Levegőminőség
  if (aqi && aqi > 3) generalScore -= aqi - 2;

  generalScore = Math.max(1, Math.min(10, generalScore));

  // Fejfájás kockázata
  let headacheScore = 0;
  if (pressure < 1005 || pressure > 1020) headacheScore += 2;
  if (humidity > 75) headacheScore += 1;
  if (weatherId >= 200 && weatherId < 300) headacheScore += 2; // Frontérzékenység
  if (windSpeed > 15) headacheScore += 1;
  if (season === "spring" || season === "autumn") headacheScore += 1; // Váltakozó időjárás

  // Ízületi fájdalom kockázata
  let jointScore = 0;
  if (pressure < 1005) jointScore += 2; // Alacsony nyomás -> ízületi fájdalom
  if (humidity > 75) jointScore += 2; // Magas páratartalom
  if (temp < 5) jointScore += 1;
  if (weatherId >= 500 && weatherId < 600) jointScore += 1; // Esős idő

  // Szív-érrendszeri terhelés
  let cardioScore = 0;
  if (temp > 30 || temp < -5) cardioScore += 2;
  if (temp > 25 || temp < 0) cardioScore += 1;
  if (humidity > 80) cardioScore += 1;
  if (weatherId >= 200 && weatherId < 300) cardioScore += 1;

  // Asztma kockázata
  let asthmaScore = 0;
  if (aqi && aqi > 2) asthmaScore += aqi - 1;
  if (humidity > 80) asthmaScore += 1;
  if (windSpeed > 10) asthmaScore += 1; // Pollen terjedés
  if (season === "spring") asthmaScore += 1; // Pollenszezon
  if (weatherId >= 700 && weatherId < 800) asthmaScore += 1; // Köd/pára

  // Levegőminőség label
  let airQualityLabel: string;
  let recommendation: string;

  if (aqi === null || aqi === 0) {
    airQualityLabel = "Nincs adat";
  } else {
    const aqiLabels = ["", "Kiváló", "Jó", "Mérsékelt", "Rossz", "Veszélyes"];
    airQualityLabel = aqiLabels[aqi] || "Ismeretlen";
  }

  // Általános ajánlás
  if (generalScore <= 3) {
    recommendation = "Az időjárás ma különösen megterhelő lehet. Pihenj sokat, fogyassz sok folyadékot, és kerüld a megerőltetést.";
  } else if (generalScore <= 5) {
    recommendation = "Az időjárás hatással lehet a közérzetedre. Figyelj a tüneteidre, és védekezz megfelelően.";
  } else if (generalScore >= 8) {
    recommendation = "Kiváló időjárás! Élvezd a friss levegőt, és tölts minél több időt a szabadban.";
  } else {
    recommendation = "Az időjárás mérsékelten hat a közérzetedre. A megszokott tevékenységeidet végezheted.";
  }

  // Frontérzékenységi figyelmeztetés
  if (weatherId >= 200 && weatherId < 300 || (pressure < 1005 && weatherId >= 500 && weatherId < 600)) {
    recommendation += " Frontérzékenyek fokozott tünetekre számíthatnak!";
  }

  // UV figyelmeztetés
  if (uvi > 5) {
    recommendation += " UV sugárzás: használj naptejet és viselj napszemüveget!";
  }

  return {
    generalFeeling: {
      score: generalScore,
      label: generalScore >= 8 ? "Kiváló" : generalScore >= 6 ? "Jó" : generalScore >= 4 ? "Mérsékelt" : "Rossz",
      description: generalScore >= 8
        ? "Az időjárási körülmények ideálisak."
        : generalScore >= 6
        ? "Az időjárás kedvező a legtöbb ember számára."
        : generalScore >= 4
        ? "Az időjárás megterhelő lehet az érzékenyebb szervezetűeknek."
        : "Az időjárás komoly megterhelést jelenthet a szervezetnek.",
    },
    headacheRisk: {
      level: getLevel(headacheScore),
      description: headacheScore >= 5
        ? "Frontérzékenyeknél erős fejfájás várható. Kerüld a koffeint és a stresszt."
        : headacheScore >= 3
        ? "Mérsékelt fejfájás kockázat. Figyelj a folyadékbevitelre."
        : "Alacsony a fejfájás kockázata.",
    },
    jointPainRisk: {
      level: getLevel(jointScore),
      description: jointScore >= 5
        ? "Ízületi fájdalmak felerősödhetnek. Melegítsd be az ízületeidet!"
        : jointScore >= 3
        ? "Enyhe ízületi panaszok előfordulhatnak."
        : "Alacsony az ízületi fájdalom kockázata.",
    },
    cardiovascularStress: {
      level: getLevel(cardioScore),
      description: cardioScore >= 4
        ? "Szívbetegek fokozott óvatosságra! Kerüld a hőingadozást és a megerőltetést."
        : cardioScore >= 2
        ? "Enyhe keringési terhelés. Figyelj a folyadékpótlásra."
        : "Alacsony a szív-érrendszeri terhelés.",
    },
    asthmaRisk: {
      level: getLevel(asthmaScore),
      description: asthmaScore >= 5
        ? "Asztmásoknak fokozott óvatosság! Lehetőleg zárt térben tartózkodj."
        : asthmaScore >= 3
        ? "Légzőszervi panaszok előfordulhatnak. Vidd magaddal az inhalátort!"
        : "Alacsony az asztma kockázata.",
    },
    airQualityLabel,
    recommendation,
  };
}

export function getMedicalMeteorologyForWeather(
  temp: number,
  humidity: number,
  pressure: number,
  windSpeed: number,
  weatherId: number,
  aqi: number | null,
  uvi: number
): MedicalMeteorologyData {
  // Az évszak automatikus meghatározása
  const season = getSeason();

  // Légnyomás átváltása (OpenWeatherMap hPa-ban adja)
  return computeMedicalMeteorology({
    temp,
    humidity,
    pressure,
    windSpeed,
    weatherId,
    aqi,
    uvi,
    season,
  });
}
