export function isDemoModeEnabled() {
  return process.env.DOCTOR_WHO_USE_DEMO_DATA !== "false";
}

export function shouldUseDatabase() {
  return Boolean(process.env.DATABASE_URL?.trim()) && !isDemoModeEnabled();
}
