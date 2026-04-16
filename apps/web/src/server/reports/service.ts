import {
  demoSnapshot,
  flattenReportForSpreadsheet,
  generateAllReports,
  generateModuleReport,
  parseImportedPayload,
  type HealthReport,
  type ReportModuleType
} from "@doctor-who/shared";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

function prismaRecordToReport(record: {
  id: string;
  userId: string;
  moduleType: ReportModuleType;
  generatedAt: Date;
  pdfUrl: string | null;
  data: Prisma.JsonValue;
}): HealthReport {
  return {
    id: record.id,
    userId: record.userId,
    moduleType: record.moduleType,
    generatedAt: record.generatedAt.toISOString(),
    pdfUrl: record.pdfUrl,
    data: record.data as HealthReport["data"]
  };
}

export async function listReports(moduleType?: ReportModuleType) {
  if (!process.env.DATABASE_URL) {
    return moduleType
      ? demoSnapshot.reports.filter((report) => report.moduleType === moduleType)
      : demoSnapshot.reports;
  }

  try {
    const records = await prisma.healthReport.findMany({
      where: moduleType ? { moduleType } : undefined,
      orderBy: {
        generatedAt: "desc"
      }
    });

    return records.length
      ? records.map((record) => prismaRecordToReport(record as typeof record[number]))
      : demoSnapshot.reports;
  } catch {
    return demoSnapshot.reports;
  }
}

export async function getReport(reportId: string) {
  const reports = await listReports();
  return reports.find((report) => report.id === reportId || report.moduleType.toLowerCase() === reportId);
}

export async function generateReports(moduleTypes?: ReportModuleType[]) {
  const targetModules =
    moduleTypes && moduleTypes.length
      ? moduleTypes
      : ([
          "CARDIOVASCULAR",
          "METABOLIC",
          "SLEEP",
          "FITNESS",
          "STRESS",
          "PREDICTIVE"
        ] as ReportModuleType[]);

  const generated = targetModules.map((moduleType) => ({
    id: `${moduleType.toLowerCase()}-${Date.now()}`,
    userId: demoSnapshot.user.id,
    moduleType,
    generatedAt: new Date().toISOString(),
    pdfUrl: `/api/exports/pdf?module=${moduleType.toLowerCase()}`,
    data: generateModuleReport(moduleType, demoSnapshot)
  }));

  if (process.env.DATABASE_URL) {
    try {
      for (const report of generated) {
        await prisma.healthReport.create({
          data: {
            userId: report.userId,
            moduleType: report.moduleType,
            generatedAt: new Date(report.generatedAt),
            score: report.data.score,
            data: report.data,
            pdfUrl: report.pdfUrl
          }
        });
      }
    } catch {
      return generated;
    }
  }

  return generated;
}

export async function getExportableReports(module: string | null) {
  if (!module || module === "all") {
    return listReports();
  }

  const normalized = module.toUpperCase() as ReportModuleType;
  return listReports(normalized);
}

export function getSpreadsheetRows(reports: HealthReport[]) {
  return reports.flatMap((report) => flattenReportForSpreadsheet(report));
}

export function importBiometrics(filename: string, payload: string) {
  return parseImportedPayload(demoSnapshot.user.id, filename, payload);
}

export function createFreshSnapshotReports() {
  return generateAllReports(demoSnapshot);
}
