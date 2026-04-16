import { NextResponse } from "next/server";

import { importBiometrics } from "@/src/server/reports/service";

export async function POST(request: Request) {
  const body = (await request.json()) as { filename: string; payload: string };
  const result = importBiometrics(body.filename, body.payload);

  return NextResponse.json({
    ...result,
    message: `${result.readings.length} readings parsed from ${result.sourceLabel}.`
  });
}
