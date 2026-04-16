import * as XLSX from "xlsx";
import type { HealthReport } from "@doctor-who/shared";

import { getSpreadsheetRows } from "@/src/server/reports/service";

export function buildWorkbookBuffer(reports: HealthReport[]) {
  const rows = getSpreadsheetRows(reports);
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(workbook, worksheet, "DoctorWho");

  return XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx"
  });
}
