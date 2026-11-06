export function formatReading({ value, unit, decimals }: { value: number; unit: string; decimals?: number }): string {
  if (!Number.isFinite(value)) {
    return `— ${unit}`;
  }
  const dp = decimals ?? 1;
  return `${value.toFixed(dp)} ${unit}`;
}
