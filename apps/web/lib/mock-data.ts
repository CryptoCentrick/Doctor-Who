import { REPORT_MODULES, demoSnapshot, getScoreBand } from "@doctor-who/shared";

export const currentUser = demoSnapshot.user;
export const reports = demoSnapshot.reports;
export const alerts = demoSnapshot.alerts;
export const devices = demoSnapshot.devices;
export const readings = demoSnapshot.readings;
export const sleepSessions = demoSnapshot.sleepSessions;
export const activitySessions = demoSnapshot.activitySessions;
export const dashboardCards = REPORT_MODULES.map((moduleDefinition) => {
  const report = reports.find((item) => item.moduleType === moduleDefinition.moduleType)!;
  return {
    ...moduleDefinition,
    report,
    scoreBand: getScoreBand(report.data.score)
  };
});

export function getReportById(reportId: string) {
  return reports.find((report) => report.id === reportId || report.moduleType.toLowerCase() === reportId);
}
