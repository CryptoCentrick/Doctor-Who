import { addDays, addHours, formatISO, subDays } from "date-fns";

import { generateAllReports } from "./report-engine";
import type {
  ActivitySession,
  Alert,
  BiometricReading,
  ConnectedDevice,
  DemoSnapshot,
  SleepSession,
  UserProfile
} from "./types";

function pseudoWave(index: number, baseline: number, amplitude: number, stretch = 5) {
  return baseline + Math.sin(index / stretch) * amplitude + Math.cos(index / (stretch * 1.7)) * (amplitude / 2);
}

function makeReading(
  userId: string,
  type: BiometricReading["type"],
  value: number,
  unit: string,
  source: BiometricReading["source"],
  recordedAt: string,
  metadata?: Record<string, unknown>
): BiometricReading {
  return {
    id: `${type.toLowerCase()}-${recordedAt}`,
    userId,
    type,
    value: Number(value.toFixed(2)),
    unit,
    source,
    recordedAt,
    metadata
  };
}

export function createDemoSnapshot(): DemoSnapshot {
  const user: UserProfile = {
    id: "user-demo-1",
    email: "alex@doctorwho.app",
    name: "Alex Rivers",
    dateOfBirth: "1991-08-19T00:00:00.000Z",
    gender: "NON_BINARY",
    heightCm: 175,
    weightKg: 74,
    createdAt: new Date().toISOString()
  };

  const readings: BiometricReading[] = [];
  const sleepSessions: SleepSession[] = [];
  const activitySessions: ActivitySession[] = [];

  for (let day = 89; day >= 0; day -= 1) {
    const date = subDays(new Date(), day);
    const noonIso = formatISO(addHours(date, 12));
    const morningIso = formatISO(addHours(date, 7));
    const eveningIso = formatISO(addHours(date, 20));
    const restingHr = pseudoWave(day, 63, 4, 4);
    const hrv = pseudoWave(day, 51, 8, 6);
    const spo2 = pseudoWave(day, 97.4, 0.8, 9);
    const systolic = pseudoWave(day, 118, 7, 8);
    const diastolic = pseudoWave(day, 77, 4, 7);
    const glucose = pseudoWave(day, 98, 12, 5);
    const weight = pseudoWave(day, 74.2, 1.6, 10);
    const bodyFat = pseudoWave(day, 22.3, 1.2, 12);
    const breathing = pseudoWave(day, 15.4, 1.4, 7);
    const stress = pseudoWave(day, 44, 10, 5);
    const steps = pseudoWave(day, 8400, 2400, 3);
    const temperature = pseudoWave(day, 36.7, 0.3, 9);

    readings.push(
      makeReading(user.id, "HEART_RATE", restingHr, "bpm", "PHONE_CAMERA", morningIso),
      makeReading(user.id, "HRV", hrv, "ms", "TAURI_WEBCAM", morningIso),
      makeReading(user.id, "SPO2", spo2, "%", "PHONE_CAMERA", noonIso),
      makeReading(user.id, "BLOOD_PRESSURE", Number(`${Math.round(systolic)}.${Math.round(diastolic)}`), "mmHg", "MANUAL", eveningIso),
      makeReading(user.id, "GLUCOSE", glucose, "mg/dL", day % 3 === 0 ? "IMPORT" : "MANUAL", morningIso),
      makeReading(user.id, "WEIGHT", weight, "kg", "MANUAL", morningIso),
      makeReading(user.id, "BODY_FAT", bodyFat, "%", "MANUAL", morningIso),
      makeReading(user.id, "BREATHING_RATE", breathing, "br/min", "PHONE_MICROPHONE", eveningIso),
      makeReading(user.id, "STRESS_SCORE", stress, "score", "TAURI_USB", eveningIso),
      makeReading(user.id, "STEPS", steps, "steps", "PHONE_ACCELEROMETER", eveningIso),
      makeReading(user.id, "TEMPERATURE", temperature, "celsius", "TAURI_BLUETOOTH", eveningIso)
    );

    const sessionStart = addHours(date, 22);
    const durationHours = 7.2 + Math.sin(day / 4) * 0.8;
    const adjustedEnd = addHours(sessionStart, durationHours);

    sleepSessions.push({
      id: `sleep-${day}`,
      userId: user.id,
      startTime: formatISO(sessionStart),
      endTime: formatISO(adjustedEnd),
      stages: {
        remMinutes: Math.round(92 + Math.sin(day / 6) * 14),
        deepMinutes: Math.round(88 + Math.cos(day / 7) * 17),
        lightMinutes: Math.round(210 + Math.sin(day / 5) * 24),
        awakeMinutes: Math.round(24 + Math.cos(day / 8) * 10)
      },
      apneaEvents: Math.max(0, Math.round(2 + Math.cos(day / 9) * 3)),
      snoreEvents: Math.max(0, Math.round(5 + Math.sin(day / 5) * 4))
    });

    if (day % 2 === 0) {
      activitySessions.push({
        id: `activity-${day}`,
        userId: user.id,
        type: day % 6 === 0 ? "RUN" : day % 5 === 0 ? "STRENGTH" : day % 4 === 0 ? "CYCLING" : "WALK",
        durationMinutes: Math.round(32 + Math.sin(day / 5) * 18 + (day % 6 === 0 ? 20 : 0)),
        caloriesBurned: Math.round(240 + Math.cos(day / 4) * 70 + (day % 6 === 0 ? 180 : 0)),
        avgHeartRate: Math.round(122 + Math.sin(day / 3) * 14 + (day % 6 === 0 ? 24 : 0)),
        startedAt: formatISO(addHours(date, 18)),
        distanceKm: Number((3.2 + Math.sin(day / 4) * 1.8).toFixed(1))
      });
    }
  }

  const alerts: Alert[] = [
    {
      id: "alert-1",
      userId: user.id,
      severity: "warning",
      message: "Resting heart rate rose above baseline for 3 consecutive mornings.",
      metric: "HEART_RATE",
      value: 72,
      createdAt: new Date().toISOString(),
      resolvedAt: null
    },
    {
      id: "alert-2",
      userId: user.id,
      severity: "info",
      message: "Sleep debt exceeded 6 hours this week.",
      metric: "SLEEP_DURATION",
      value: 6.4,
      createdAt: new Date().toISOString(),
      resolvedAt: null
    }
  ];

  const devices: ConnectedDevice[] = [
    {
      id: "device-1",
      userId: user.id,
      deviceType: "Smartwatch",
      deviceName: "PulseBand Horizon",
      connectionMethod: "BLUETOOTH",
      lastSyncedAt: new Date().toISOString()
    },
    {
      id: "device-2",
      userId: user.id,
      deviceType: "Blood Pressure Cuff",
      deviceName: "CardioCheck USB-Cuff",
      connectionMethod: "USB",
      lastSyncedAt: subDays(new Date(), 1).toISOString()
    }
  ];

  const reports = generateAllReports({
    user,
    readings,
    sleepSessions,
    activitySessions,
    alerts
  });

  return {
    user,
    readings,
    sleepSessions,
    activitySessions,
    alerts,
    devices,
    reports
  };
}

export const demoSnapshot = createDemoSnapshot();
