import { Vertex } from '../graph';
import { Point, pointOnUnitCircle } from './geometry';

export function normalizeLayout(
  positions: Map<Vertex, Point>,
): Map<Vertex, Point> {
  const [maxX, minX, maxY, minY] = [...positions].reduce(
    ([maxX_, minX_, maxY_, minY_], [_, [x, y]]) => [
      Math.max(maxX_, x),
      Math.min(minX_, x),
      Math.max(maxY_, y),
      Math.min(minY_, y),
    ],
    [Number.MIN_VALUE, Number.MAX_VALUE, Number.MIN_VALUE, Number.MAX_VALUE],
  );

  const updatedPositions = [...positions].map(
    ([vertex, [x, y]]): [Vertex, Point] => [
      vertex,
      [(x - minX) / (maxX - minX), (y - minY) / (maxY - minY)],
    ],
  );

  return new Map(updatedPositions);
}

export function circularLayout(vertices: Vertex[]): Map<Vertex, Point> {
  const position = (vertex: Vertex, index: number): [Vertex, Point] => [
    vertex,
    pointOnUnitCircle((2 * Math.PI * index) / vertices.length + Math.PI),
  ];

  return normalizeLayout(new Map(vertices.map(position)));
}
