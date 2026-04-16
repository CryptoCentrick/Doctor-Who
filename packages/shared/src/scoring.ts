export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function latest(values: number[]) {
  return values.length ? values[values.length - 1] : 0;
}

export function normalizeScore(value: number, optimalMin: number, optimalMax: number, spread: number) {
  if (value >= optimalMin && value <= optimalMax) {
    return 100;
  }

  const distance =
    value < optimalMin ? optimalMin - value : value - optimalMax;

  return clamp(100 - (distance / spread) * 100, 15, 100);
}

export function percentageChange(previous: number, current: number) {
  if (!previous) {
    return 0;
  }

  return ((current - previous) / previous) * 100;
}
