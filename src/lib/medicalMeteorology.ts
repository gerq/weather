import type { MedicalMeteorologyData } from "@/types/weather";

type TFunc = (key: string, fallback?: string) => string;

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

export function computeMedicalMeteorology(
  input: WeatherInput,
  t: TFunc
): MedicalMeteorologyData {
  const { temp, humidity, pressure, windSpeed, weatherId, aqi, uvi, season } = input;

  // General well-being score (1-10)
  let generalScore = 7;

  if (temp > 30 || temp < -5) generalScore -= 2;
  else if (temp > 25 || temp < 0) generalScore -= 1;
  else if (temp >= 18 && temp <= 22) generalScore += 1;

  if (humidity > 80) generalScore -= 1;
  else if (humidity < 30) generalScore -= 1;

  if (pressure < 1000 || pressure > 1025) generalScore -= 1;

  if (weatherId >= 200 && weatherId < 300) generalScore -= 2;

  if (aqi && aqi > 3) generalScore -= aqi - 2;

  generalScore = Math.max(1, Math.min(10, generalScore));

  // Headache risk
  let headacheScore = 0;
  if (pressure < 1005 || pressure > 1020) headacheScore += 2;
  if (humidity > 75) headacheScore += 1;
  if (weatherId >= 200 && weatherId < 300) headacheScore += 2;
  if (windSpeed > 15) headacheScore += 1;
  if (season === "spring" || season === "autumn") headacheScore += 1;

  // Joint pain risk
  let jointScore = 0;
  if (pressure < 1005) jointScore += 2;
  if (humidity > 75) jointScore += 2;
  if (temp < 5) jointScore += 1;
  if (weatherId >= 500 && weatherId < 600) jointScore += 1;

  // Cardiovascular stress
  let cardioScore = 0;
  if (temp > 30 || temp < -5) cardioScore += 2;
  if (temp > 25 || temp < 0) cardioScore += 1;
  if (humidity > 80) cardioScore += 1;
  if (weatherId >= 200 && weatherId < 300) cardioScore += 1;

  // Asthma risk
  let asthmaScore = 0;
  if (aqi && aqi > 2) asthmaScore += aqi - 1;
  if (humidity > 80) asthmaScore += 1;
  if (windSpeed > 10) asthmaScore += 1;
  if (season === "spring") asthmaScore += 1;
  if (weatherId >= 700 && weatherId < 800) asthmaScore += 1;

  // Air quality label
  let airQualityLabel: string;
  let recommendation: string;

  if (aqi === null || aqi === 0) {
    airQualityLabel = t("aqi.noData");
  } else {
    const aqiKeys = ["", "aqi.excellent", "aqi.good", "aqi.moderate", "aqi.poor", "aqi.hazardous"];
    airQualityLabel = t(aqiKeys[aqi] || "aqi.unknown");
  }

  // General recommendation
  if (generalScore <= 3) {
    recommendation = t("medical.recommendationBad");
  } else if (generalScore <= 5) {
    recommendation = t("medical.recommendationPoor");
  } else if (generalScore >= 8) {
    recommendation = t("medical.recommendationGood");
  } else {
    recommendation = t("medical.recommendationModerate");
  }

  if (weatherId >= 200 && weatherId < 300 || (pressure < 1005 && weatherId >= 500 && weatherId < 600)) {
    recommendation += t("medical.frontWarning");
  }

  if (uvi > 5) {
    recommendation += t("medical.uvWarning");
  }

  // General feeling labels
  let generalLabel: string;
  let generalDescription: string;
  if (generalScore >= 8) {
    generalLabel = t("medical.excellent");
    generalDescription = t("medical.generalExcellentDesc");
  } else if (generalScore >= 6) {
    generalLabel = t("medical.good");
    generalDescription = t("medical.generalGoodDesc");
  } else if (generalScore >= 4) {
    generalLabel = t("medical.moderate");
    generalDescription = t("medical.generalModerateDesc");
  } else {
    generalLabel = t("medical.bad");
    generalDescription = t("medical.generalBadDesc");
  }

  return {
    generalFeeling: {
      score: generalScore,
      label: generalLabel,
      description: generalDescription,
    },
    headacheRisk: {
      level: getLevel(headacheScore),
      description: headacheScore >= 5
        ? t("medical.headacheHighDesc")
        : headacheScore >= 3
        ? t("medical.headacheMediumDesc")
        : t("medical.headacheLowDesc"),
    },
    jointPainRisk: {
      level: getLevel(jointScore),
      description: jointScore >= 5
        ? t("medical.jointHighDesc")
        : jointScore >= 3
        ? t("medical.jointMediumDesc")
        : t("medical.jointLowDesc"),
    },
    cardiovascularStress: {
      level: getLevel(cardioScore),
      description: cardioScore >= 4
        ? t("medical.cardioHighDesc")
        : cardioScore >= 2
        ? t("medical.cardioMediumDesc")
        : t("medical.cardioLowDesc"),
    },
    asthmaRisk: {
      level: getLevel(asthmaScore),
      description: asthmaScore >= 5
        ? t("medical.asthmaHighDesc")
        : asthmaScore >= 3
        ? t("medical.asthmaMediumDesc")
        : t("medical.asthmaLowDesc"),
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
  uvi: number,
  t: TFunc
): MedicalMeteorologyData {
  const season = getSeason();
  return computeMedicalMeteorology(
    { temp, humidity, pressure, windSpeed, weatherId, aqi, uvi, season },
    t
  );
}
