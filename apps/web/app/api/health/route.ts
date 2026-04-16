import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "doctor-who-web",
    timestamp: new Date().toISOString()
  });
}
