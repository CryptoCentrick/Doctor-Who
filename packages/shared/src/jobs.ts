import type { ReportModuleType } from "./types";

export const REPORT_QUEUE_NAME = "doctor-who-report-generation";
export const REPORT_JOB_NAME = "generate-module-report";

export const REPORT_SCHEDULES = [
  {
    id: "daily-overview",
    pattern: "0 6 * * *",
    modules: ["CARDIOVASCULAR", "SLEEP", "STRESS"] as ReportModuleType[]
  },
  {
    id: "weekly-health-review",
    pattern: "0 7 * * 1",
    modules: ["FITNESS", "METABOLIC", "PREDICTIVE"] as ReportModuleType[]
  },
  {
    id: "monthly-full-suite",
    pattern: "0 8 1 * *",
    modules: [
      "CARDIOVASCULAR",
      "METABOLIC",
      "SLEEP",
      "FITNESS",
      "STRESS",
      "PREDICTIVE"
    ] as ReportModuleType[]
  }
];
