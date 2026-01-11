export type XYPoint = { x: number; y: number };

export function buildLinearScale(
  d0: number,
  d1: number,
  r0: number,
  r1: number
) {
  const denom = d1 - d0 || 1;
  const m = (r1 - r0) / denom;
  return (v: number) => r0 + (v - d0) * m;
}

export function buildPoints(
  values: number[],
  x: (i: number) => number,
  y: (v: number) => number
): XYPoint[] {
  return values.map((v, i) => ({ x: x(i), y: y(v) }));
}
