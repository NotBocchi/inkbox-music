export function clampNumber(
  value: number,
  minimum: number,
  maximum: number,
  fallback = minimum,
): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(maximum, Math.max(minimum, value));
}
