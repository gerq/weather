"use client";

import type { MedicalMeteorologyData } from "@/types/weather";
import { useI18n } from "@/lib/i18n/context";
import { Brain, Bone, Heart, Wind, Activity, AlertTriangle } from "lucide-react";

interface Props {
  data: MedicalMeteorologyData;
}

const levelColors = {
  alacsony: {
    text: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-900/30",
    dot: "bg-green-500",
  },
  közepes: {
    text: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    dot: "bg-yellow-500",
  },
  magas: {
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
    dot: "bg-red-500",
  },
};

function RiskBadge({ level, t }: { level: "alacsony" | "közepes" | "magas"; t: (key: string, fallback?: string) => string }) {
  const colors = levelColors[level];
  const labelKey = level === "alacsony" ? "medical.riskLow" : level === "közepes" ? "medical.riskMedium" : "medical.riskHigh";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {t(labelKey)}
    </span>
  );
}

function GeneralScore({ score, t }: { score: number; t: (key: string, fallback?: string) => string }) {
  const percentage = (score / 10) * 100;
  const color = score >= 7 ? "text-green-500" : score >= 4 ? "text-yellow-500" : "text-red-500";
  const barColor = score >= 7 ? "bg-green-500" : score >= 4 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="text-center p-6">
      <div className={`text-5xl font-bold ${color} mb-2`}>{score}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">{t("medical.generalFeeling")}</div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function MedicalMeteorologyComponent({ data }: Props) {
  const { t } = useI18n();
  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
        <Activity className="w-4 h-4" />
        {t("medical.title")}
      </h2>

      {/* General score */}
      <GeneralScore score={data.generalFeeling.score} t={t} />
      <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-2">
        {data.generalFeeling.description}
      </p>

      {/* Air quality */}
      <div className="flex items-center justify-center gap-2 mb-5 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
        <Wind className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {t("medical.airQuality")}: {data.airQualityLabel}
        </span>
      </div>

      {/* Risk indicators */}
      <div className="space-y-3">
        <RiskCard
          icon={<Brain className="w-5 h-5" />}
          title={t("medical.headacheRisk")}
          level={data.headacheRisk.level}
          description={data.headacheRisk.description}
          t={t}
        />
        <RiskCard
          icon={<Bone className="w-5 h-5" />}
          title={t("medical.jointPain")}
          level={data.jointPainRisk.level}
          description={data.jointPainRisk.description}
          t={t}
        />
        <RiskCard
          icon={<Heart className="w-5 h-5" />}
          title={t("medical.cardiovascular")}
          level={data.cardiovascularStress.level}
          description={data.cardiovascularStress.description}
          t={t}
        />
        <RiskCard
          icon={<AlertTriangle className="w-5 h-5" />}
          title={t("medical.asthmaRisk")}
          level={data.asthmaRisk.level}
          description={data.asthmaRisk.description}
          t={t}
        />
      </div>

      {/* Recommendation */}
      <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
          <span className="font-semibold">{t("medical.recommendation")}: </span>
          {data.recommendation}
        </p>
      </div>
    </div>
  );
}

function RiskCard({
  icon,
  title,
  level,
  description,
  t,
}: {
  icon: React.ReactNode;
  title: string;
  level: "alacsony" | "közepes" | "magas";
  description: string;
  t: (key: string, fallback?: string) => string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
      <div className="mt-0.5 text-gray-600 dark:text-gray-300">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-medium text-gray-800 dark:text-white">{title}</h3>
          <RiskBadge level={level} t={t} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}


