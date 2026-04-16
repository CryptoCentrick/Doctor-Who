import { NextResponse } from "next/server";

import { listReports } from "@/src/server/reports/service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const moduleParam = searchParams.get("module")?.toUpperCase();
  const reports = await listReports(moduleParam as Parameters<typeof listReports>[0]);

  return NextResponse.json({ reports });
}
