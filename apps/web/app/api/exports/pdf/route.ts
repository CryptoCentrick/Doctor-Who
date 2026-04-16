import { NextResponse } from "next/server";

import { renderReportsPdf } from "@/src/server/pdf/report-pdf";
import { getExportableReports } from "@/src/server/reports/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reports = await getExportableReports(searchParams.get("module"));
  const buffer = await renderReportsPdf(reports);
  const filename = searchParams.get("module") === "all" || !searchParams.get("module")
    ? "doctor-who-full-suite.pdf"
    : `doctor-who-${searchParams.get("module")}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`
    }
  });
}
