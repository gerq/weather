import type { DressingTip } from "@/types/weather";

export function getDressingTips(
  temp: number,
  feelsLike: number,
  humidity: number,
  windSpeed: number,
  weatherId: number,
  isDaytime: boolean
): DressingTip[] {
  const tips: DressingTip[] = [];

  // Alap öltözködés hőmérséklet alapján
  if (temp <= -10) {
    tips.push({
      category: "Alapréteg",
      items: ["Termo alsónemű", "Gyapjú pulóver", "Sapka", "Sál", "Vastag kesztyű"],
      icon: "thermometer",
      severity: "danger",
    });
  } else if (temp <= 0) {
    tips.push({
      category: "Téli öltözet",
      items: ["Meleg kabát", "Sapka", "Sál", "Kesztyű", "Réteges öltözködés"],
      icon: "thermometer",
      severity: "warning",
    });
  } else if (temp <= 10) {
    tips.push({
      category: "Hűvös idő",
      items: ["Kabát vagy dzseki", "Hosszú ujjú felső", "Sál (opcionális)"],
      icon: "thermometer",
      severity: "info",
    });
  } else if (temp <= 18) {
    tips.push({
      category: "Enyhe idő",
      items: ["Könnyű kabát vagy pulóver", "Hosszúnadrág"],
      icon: "thermometer",
      severity: "info",
    });
  } else if (temp <= 25) {
    tips.push({
      category: "Kellemes idő",
      items: ["Póló", "Rövidnadrág vagy vékony nadrág"],
      icon: "sun",
      severity: "info",
    });
  } else if (temp <= 30) {
    tips.push({
      category: "Meleg idő",
      items: ["Könnyű, világos ruházat", "Rövidnadrág", "Kalap/sapka"],
      icon: "sun",
      severity: "warning",
    });
  } else {
    tips.push({
      category: "Nagyon meleg",
      items: ["Légáteresztő ruházat", "Kalap", "Napszemüveg", "UV védelem"],
      icon: "sun",
      severity: "danger",
    });
  }

  // Hőérzet (feels like) módosítása
  const diff = feelsLike - temp;
  if (diff < -5) {
    tips.push({
      category: "Hőérzet",
      items: ["A hőérzet alacsonyabb, rétegezz többet!"],
      icon: "wind",
      severity: "warning",
    });
  } else if (diff > 5) {
    tips.push({
      category: "Hőérzet",
      items: ["A hőérzet magasabb, vegyél le egy réteget!"],
      icon: "flame",
      severity: "info",
    });
  }

  // Eső
  if (weatherId >= 200 && weatherId < 600) {
    tips.push({
      category: "Csapadék",
      items: ["Esőkabát vagy esernyő", "Vízálló cipő"],
      icon: "umbrella",
      severity: weatherId >= 500 && weatherId < 600 && weatherId !== 500 ? "warning" : "info",
    });

    if (weatherId >= 200 && weatherId < 300) {
      tips.push({
        category: "Zivatar",
        items: ["Kerüld a nyílt területeket!", "Ne állj fák alá!"],
        icon: "cloud-lightning",
        severity: "danger",
      });
    }
  }

  // Hó
  if (weatherId >= 600 && weatherId < 700) {
    tips.push({
      category: "Hó",
      items: ["Csúszásmentes cipő", "Meleg, vízálló kabát"],
      icon: "snowflake",
      severity: "warning",
    });
  }

  // Szél
  if (windSpeed > 10) {
    const windTips = ["Szélálló kabát"];
    if (windSpeed > 15) windTips.push("Kerüld a nyílt területeket!");
    if (windSpeed > 20) windTips.push("Viharos szél - maradj biztonságos helyen!");
    tips.push({
      category: "Szeles idő",
      items: windTips,
      icon: "wind",
      severity: windSpeed > 20 ? "danger" : windSpeed > 15 ? "warning" : "info",
    });
  }

  // UV védelem
  if (isDaytime && temp > 20) {
    tips.push({
      category: "Napvédelem",
      items: ["Naptej (SPF 30+)", "Napszemüveg", "Kalap"],
      icon: "sun",
      severity: "info",
    });
  }

  return tips;
}
