"use client";

import { type DressingTip } from "@/types/weather";
import { useI18n } from "@/lib/i18n/context";
import { Thermometer, Umbrella, Wind, Sun, Snowflake, CloudLightning, Flame, AlertTriangle, Info } from "lucide-react";

interface DressingTipsProps {
  tips: DressingTip[];
}

const iconMap: Record<string, React.ReactNode> = {
  thermometer: <Thermometer className="w-5 h-5" />,
  umbrella: <Umbrella className="w-5 h-5" />,
  wind: <Wind className="w-5 h-5" />,
  sun: <Sun className="w-5 h-5" />,
  snowflake: <Snowflake className="w-5 h-5" />,
  "cloud-lightning": <CloudLightning className="w-5 h-5" />,
  flame: <Flame className="w-5 h-5" />,
};

const severityStyles = {
  info: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20",
  warning: "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20",
  danger: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20",
};

const severityIcon = {
  info: <Info className="w-4 h-4 text-blue-500" />,
  warning: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
  danger: <AlertTriangle className="w-4 h-4 text-red-500" />,
};

export default function DressingTips({ tips }: DressingTipsProps) {
  const { t } = useI18n();
  if (tips.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        {t("dressing.title")}
      </h2>
      <div className="space-y-3">
        {tips.map((tip, i) => (
          <div
            key={i}
            className={`rounded-xl border p-4 ${severityStyles[tip.severity]}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0 text-gray-600 dark:text-gray-300">
                {iconMap[tip.icon] || <Info className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
                    {tip.category}
                  </h3>
                  {severityIcon[tip.severity]}
                </div>
                <ul className="space-y-1">
                  {tip.items.map((item, j) => (
                    <li
                      key={j}
                      className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2"
                    >
                      <span className="text-gray-400 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
