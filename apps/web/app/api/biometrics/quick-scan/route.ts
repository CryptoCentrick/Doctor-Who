import { NextResponse } from "next/server";
import { SENSOR_ESTIMATE_DISCLAIMER } from "@doctor-who/shared";

export async function POST() {
  return NextResponse.json({
    status: "completed",
    disclaimer: SENSOR_ESTIMATE_DISCLAIMER,
    measurements: {
      heartRate: 71,
      spo2Proxy: 98,
      breathingRate: 15,
      posture: "upright",
      activityClassification: "light movement"
    }
  });
}
