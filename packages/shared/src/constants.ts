import type { DashboardCardDefinition, ReportModuleType } from "./types";

export const MEDICAL_DISCLAIMER =
  "This app is not a medical device. Reports are for informational and wellness purposes only. Consult a qualified healthcare professional for medical advice.";

export const SENSOR_ESTIMATE_DISCLAIMER =
  "Camera and microphone based measurements are estimates only and should not be treated as diagnostic values.";

export const REPORT_MODULES: DashboardCardDefinition[] = [
  {
    moduleType: "CARDIOVASCULAR",
    title: "Cardiovascular & Vitals",
    description: "Heart rate, HRV, blood pressure, oxygen saturation, and risk context.",
    accent: "#00d3a7"
  },
  {
    moduleType: "METABOLIC",
    title: "Metabolic & Body Composition",
    description: "BMI, body fat, glucose, calorie balance, and metabolic trends.",
    accent: "#ffb347"
  },
  {
    moduleType: "SLEEP",
    title: "Sleep Health",
    description: "Sleep debt, stage balance, circadian consistency, and overnight events.",
    accent: "#7aa2ff"
  },
  {
    moduleType: "FITNESS",
    title: "Fitness & Recovery",
    description: "VO2 max estimates, activity volume, and recovery readiness.",
    accent: "#45e56b"
  },
  {
    moduleType: "STRESS",
    title: "Stress & Mental Wellness",
    description: "Stress load, breathing irregularity, focus patterns, and break prompts.",
    accent: "#ff8c69"
  },
  {
    moduleType: "PREDICTIVE",
    title: "Predictive & Longitudinal",
    description: "Trend forecasts, biological age, anomaly flags, and risk stratification.",
    accent: "#f767ff"
  }
];

export const REPORT_MODULE_LABELS: Record<ReportModuleType, string> = REPORT_MODULES.reduce(
  (acc, moduleDefinition) => {
    acc[moduleDefinition.moduleType] = moduleDefinition.title;
    return acc;
  },
  {} as Record<ReportModuleType, string>
);

export function getScoreBand(score: number) {
  if (score <= 40) {
    return {
      label: "Needs attention",
      className: "bg-red-500/15 text-red-300 border-red-500/30",
      hex: "#ef4444"
    };
  }

  if (score <= 70) {
    return {
      label: "Watch closely",
      className: "bg-yellow-500/15 text-yellow-200 border-yellow-500/30",
      hex: "#eab308"
    };
  }

  return {
    label: "On track",
    className: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
    hex: "#22c55e"
  };
}
