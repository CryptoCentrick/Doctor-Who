import { NextResponse } from "next/server";

import { devices } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    devices,
    supportedProfiles: ["Heart Rate", "Glucose", "Pulse Oximeter", "Blood Pressure", "Fitness Band"]
  });
}
