import { NextResponse } from "next/server";
import type { ReportModuleType } from "@doctor-who/shared";

import { generateReports } from "@/src/server/reports/service";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { modules?: ReportModuleType[] };
  const reports = await generateReports(body.modules);

  return NextResponse.json({
    reports,
    message: "Reports generated successfully."
  });
}
