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
    accent: "#4FAFA8"
  },
  {
    moduleType: "METABOLIC",
    title: "Metabolic & Body Composition",
    description: "BMI, body fat, glucose, calorie balance, and metabolic trends.",
    accent: "#E59A8D"
  },
  {
    moduleType: "SLEEP",
    title: "Sleep Health",
    description: "Sleep debt, stage balance, circadian consistency, and overnight events.",
    accent: "#79B8B2"
  },
  {
    moduleType: "FITNESS",
    title: "Fitness & Recovery",
    description: "VO2 max estimates, activity volume, and recovery readiness.",
    accent: "#58A89C"
  },
  {
    moduleType: "STRESS",
    title: "Stress & Mental Wellness",
    description: "Stress load, breathing irregularity, focus patterns, and break prompts.",
    accent: "#EAA596"
  },
  {
    moduleType: "PREDICTIVE",
    title: "Predictive & Longitudinal",
    description: "Trend forecasts, biological age, anomaly flags, and risk stratification.",
    accent: "#73AFA9"
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
      className: "border-[rgba(224,137,120,0.35)] bg-[rgba(224,137,120,0.14)] text-[rgb(154,79,64)] dark:text-[rgb(247,203,194)]",
      hex: "#E08978"
    };
  }

  if (score <= 70) {
    return {
      label: "Watch closely",
      className: "border-[rgba(128,179,173,0.3)] bg-[rgba(128,179,173,0.14)] text-[rgb(71,104,100)] dark:text-[rgb(188,220,216)]",
      hex: "#80B3AD"
    };
  }

  return {
    label: "On track",
    className: "border-[rgba(79,175,168,0.35)] bg-[rgba(79,175,168,0.16)] text-[rgb(44,108,103)] dark:text-[rgb(198,236,232)]",
    hex: "#4FAFA8"
  };
}
