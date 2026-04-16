import type { HealthReport } from "./types";

export function flattenReportForSpreadsheet(report: HealthReport) {
  return report.data.summary.map((metric) => ({
    module: report.moduleType,
    generatedAt: report.generatedAt,
    metric: metric.label,
    value: metric.value,
    tone: metric.tone ?? "neutral",
    helper: metric.helper ?? ""
  }));
}
