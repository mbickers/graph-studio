export type Point = [number, number];

export function pointOnUnitCircle(angle: number): Point {
  return [Math.cos(angle), Math.sin(angle)];
}

export function lerp([x0, y0]: Point, [x1, y1]: Point, t: number) {
  return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
}
