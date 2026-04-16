import { NextResponse } from "next/server";

import { buildWorkbookBuffer } from "@/src/server/export/xlsx";
import { getExportableReports } from "@/src/server/reports/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reports = await getExportableReports(searchParams.get("module"));
  const buffer = buildWorkbookBuffer(reports);
  const filename = searchParams.get("module") === "all" || !searchParams.get("module")
    ? "doctor-who-full-suite.xlsx"
    : `doctor-who-${searchParams.get("module")}.xlsx`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`
    }
  });
}
