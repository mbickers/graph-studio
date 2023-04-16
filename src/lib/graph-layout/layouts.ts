import { range } from '../utils';
import {
  Point,
  boundingRectangle,
  pointOnUnitCircle,
  transformForRectanglePreservingAspectRatio,
} from './geometry';

export function normalizeLayout(
  positions: Point[],
  newCenter: Point = [0, 0],
  maxDimension = 2,
): Point[] {
  const currentBoundingRectangle = boundingRectangle(positions);
  const transform = transformForRectanglePreservingAspectRatio(
    currentBoundingRectangle,
    newCenter,
    maxDimension,
  );
  return positions.map(transform);
}

export function circularLayout(n: number): Point[] {
  return range(n).map((index) =>
    pointOnUnitCircle((2 * Math.PI * index) / n + Math.PI),
  );
}

export function circularLayoutPartitioned(
  partitionSizes: number[],
  arcRatio = 2,
): Point[] {
  const previousArcsWithinPartitions = partitionSizes.reduce(
    (sizes, size) => [...sizes, sizes.at(-1)! + size],
    [0],
  );
  const vertexArc =
    (2 * Math.PI) /
    (previousArcsWithinPartitions.at(-1)! + arcRatio * partitionSizes.length);

  // Offset angles so that first partition is centered at angle 0
  const angleOffset = (-vertexArc * (partitionSizes[0] - 1)) / 2 + Math.PI;

  return partitionSizes.flatMap((partitionSize, partitionIndex) => {
    const baseAngle =
      angleOffset +
      vertexArc * previousArcsWithinPartitions[partitionIndex] +
      vertexArc * arcRatio * partitionIndex;

    return range(partitionSize).map((vertexIndex) =>
      pointOnUnitCircle(baseAngle + vertexIndex * vertexArc),
    );
  });
}
