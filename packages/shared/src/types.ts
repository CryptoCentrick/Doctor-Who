export type Gender = "FEMALE" | "MALE" | "NON_BINARY" | "PREFER_NOT_TO_SAY";

export type BiometricType =
  | "HEART_RATE"
  | "HRV"
  | "SPO2"
  | "BLOOD_PRESSURE"
  | "GLUCOSE"
  | "STEPS"
  | "SLEEP_DURATION"
  | "SLEEP_STAGE"
  | "WEIGHT"
  | "BODY_FAT"
  | "BREATHING_RATE"
  | "STRESS_SCORE"
  | "TEMPERATURE";

export type ReadingSource =
  | "PHONE_ACCELEROMETER"
  | "PHONE_CAMERA"
  | "PHONE_MICROPHONE"
  | "PHONE_GPS"
  | "PHONE_ORIENTATION"
  | "TAURI_WEBCAM"
  | "TAURI_BLUETOOTH"
  | "TAURI_USB"
  | "MANUAL"
  | "IMPORT";

export type ReportModuleType =
  | "CARDIOVASCULAR"
  | "METABOLIC"
  | "SLEEP"
  | "FITNESS"
  | "STRESS"
  | "PREDICTIVE";

export type AlertSeverity = "info" | "warning" | "critical";
export type TrendDirection = "up" | "down" | "steady";
export type ConnectionMethod = "BLUETOOTH" | "USB" | "SERIAL" | "CLOUD_IMPORT";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  dateOfBirth: string;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  createdAt: string;
}

export interface BiometricReading {
  id: string;
  userId: string;
  type: BiometricType;
  value: number;
  unit: string;
  source: ReadingSource;
  recordedAt: string;
  metadata?: Record<string, unknown>;
}

export interface SleepSession {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  stages: {
    remMinutes: number;
    deepMinutes: number;
    lightMinutes: number;
    awakeMinutes: number;
  };
  apneaEvents: number;
  snoreEvents: number;
}

export interface ActivitySession {
  id: string;
  userId: string;
  type: "RUN" | "WALK" | "CYCLING" | "STRENGTH" | "YOGA" | "MOBILITY";
  durationMinutes: number;
  caloriesBurned: number;
  avgHeartRate: number;
  startedAt: string;
  distanceKm?: number;
  metadata?: Record<string, unknown>;
}

export interface Alert {
  id: string;
  userId: string;
  severity: AlertSeverity;
  message: string;
  metric: string;
  value: number;
  createdAt: string;
  resolvedAt?: string | null;
}

export interface ConnectedDevice {
  id: string;
  userId: string;
  deviceType: string;
  deviceName: string;
  connectionMethod: ConnectionMethod;
  lastSyncedAt: string;
}

export interface ReportMetric {
  label: string;
  value: string;
  tone?: "positive" | "neutral" | "warning" | "critical";
  helper?: string;
}

export interface ReportInsight {
  title: string;
  description: string;
  severity: AlertSeverity;
}

export interface ReportChart {
  id: string;
  title: string;
  type: "line" | "area" | "bar" | "pie" | "heatmap";
  data: Array<Record<string, string | number>>;
  keys: string[];
  helper?: string;
}

export interface ModuleReportData {
  moduleType: ReportModuleType;
  headline: string;
  score: number;
  summary: ReportMetric[];
  charts: ReportChart[];
  insights: ReportInsight[];
  recommendations: string[];
  disclaimer: string;
}

export interface HealthReport {
  id: string;
  userId: string;
  moduleType: ReportModuleType;
  generatedAt: string;
  pdfUrl?: string | null;
  data: ModuleReportData;
}

export interface DemoSnapshot {
  user: UserProfile;
  readings: BiometricReading[];
  sleepSessions: SleepSession[];
  activitySessions: ActivitySession[];
  alerts: Alert[];
  devices: ConnectedDevice[];
  reports: HealthReport[];
}

export interface DashboardCardDefinition {
  moduleType: ReportModuleType;
  title: string;
  description: string;
  accent: string;
}
