import type { DressingTip } from "@/types/weather";

type TFunc = (key: string, fallback?: string) => string;

export function getDressingTips(
  temp: number,
  feelsLike: number,
  humidity: number,
  windSpeed: number,
  weatherId: number,
  isDaytime: boolean,
  t: TFunc
): DressingTip[] {
  const tips: DressingTip[] = [];

  if (temp <= -10) {
    tips.push({
      category: t("dressing.baseLayer"),
      items: [
        t("dressing.thermalUnderwear"),
        t("dressing.woolSweater"),
        t("dressing.hat"),
        t("dressing.scarf"),
        t("dressing.thickGloves"),
      ],
      icon: "thermometer",
      severity: "danger",
    });
  } else if (temp <= 0) {
    tips.push({
      category: t("dressing.winterWear"),
      items: [
        t("dressing.warmCoat"),
        t("dressing.hat"),
        t("dressing.scarf"),
        t("dressing.gloves"),
        t("dressing.layeredClothing"),
      ],
      icon: "thermometer",
      severity: "warning",
    });
  } else if (temp <= 10) {
    tips.push({
      category: t("dressing.coolWeather"),
      items: [
        t("dressing.jacket"),
        t("dressing.longSleeve"),
        t("dressing.scarfOptional"),
      ],
      icon: "thermometer",
      severity: "info",
    });
  } else if (temp <= 18) {
    tips.push({
      category: t("dressing.mildWeather"),
      items: [
        t("dressing.lightJacket"),
        t("dressing.longPants"),
      ],
      icon: "thermometer",
      severity: "info",
    });
  } else if (temp <= 25) {
    tips.push({
      category: t("dressing.pleasantWeather"),
      items: [
        t("dressing.tshirt"),
        t("dressing.shorts"),
      ],
      icon: "sun",
      severity: "info",
    });
  } else if (temp <= 30) {
    tips.push({
      category: t("dressing.warmWeather"),
      items: [
        t("dressing.lightClothing"),
        t("dressing.shorts"),
        t("dressing.hatCap"),
      ],
      icon: "sun",
      severity: "warning",
    });
  } else {
    tips.push({
      category: t("dressing.veryHot"),
      items: [
        t("dressing.breathableClothing"),
        t("dressing.hatCap"),
        t("dressing.sunglasses"),
        t("dressing.uvProtection"),
      ],
      icon: "sun",
      severity: "danger",
    });
  }

  const diff = feelsLike - temp;
  if (diff < -5) {
    tips.push({
      category: t("dressing.feelsLike"),
      items: [t("dressing.feelsLower")],
      icon: "wind",
      severity: "warning",
    });
  } else if (diff > 5) {
    tips.push({
      category: t("dressing.feelsLike"),
      items: [t("dressing.feelsHigher")],
      icon: "flame",
      severity: "info",
    });
  }

  if (weatherId >= 200 && weatherId < 600) {
    tips.push({
      category: t("dressing.precipitation"),
      items: [
        t("dressing.raincoat"),
        t("dressing.waterproofShoes"),
      ],
      icon: "umbrella",
      severity: weatherId >= 500 && weatherId < 600 && weatherId !== 500 ? "warning" : "info",
    });

    if (weatherId >= 200 && weatherId < 300) {
      tips.push({
        category: t("dressing.thunderstorm"),
        items: [
          t("dressing.avoidOpenAreas"),
          t("dressing.dontStandUnderTrees"),
        ],
        icon: "cloud-lightning",
        severity: "danger",
      });
    }
  }

  if (weatherId >= 600 && weatherId < 700) {
    tips.push({
      category: t("dressing.snow"),
      items: [
        t("dressing.nonslipShoes"),
        t("dressing.warmWaterproofCoat"),
      ],
      icon: "snowflake",
      severity: "warning",
    });
  }

  if (windSpeed > 10) {
    const windTips = [t("dressing.windproofJacket")];
    if (windSpeed > 15) windTips.push(t("dressing.avoidOpenWindy"));
    if (windSpeed > 20) windTips.push(t("dressing.stormWarning"));
    tips.push({
      category: t("dressing.windyWeather"),
      items: windTips,
      icon: "wind",
      severity: windSpeed > 20 ? "danger" : windSpeed > 15 ? "warning" : "info",
    });
  }

  if (isDaytime && temp > 20) {
    tips.push({
      category: t("dressing.sunProtection"),
      items: [
        t("dressing.sunscreen"),
        t("dressing.sunglassesItem"),
        t("dressing.hatItem"),
      ],
      icon: "sun",
      severity: "info",
    });
  }

  return tips;
}
