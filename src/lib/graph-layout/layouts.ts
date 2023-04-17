import { range } from '../utils';
import {
  Point,
  Rectangle,
  boundingRectangle,
  pointOnUnitCircle,
  transformToContainRectangle,
} from './geometry';

export function containLayout(
  positions: Point[],
  container: Rectangle,
): Point[] {
  const currentBoundingRectangle = boundingRectangle(positions);
  const transform = transformToContainRectangle(
    currentBoundingRectangle,
    container,
  );
  return positions.map(transform);
}

export function circularLayout(n: number): Point[] {
  return range(n).map((index) =>
    pointOnUnitCircle((-2 * Math.PI * index) / n + Math.PI),
  );
}

export function circularLayoutPartitioned(
  partitionSizes: number[],
  arcRatio = 2,
): Point[] {
  if (partitionSizes.length === 1) {
    return circularLayout(partitionSizes[0]);
  }
  const previousArcsWithinPartitions = partitionSizes.reduce(
    (sizes, size) => [...sizes, sizes.at(-1)! + size],
    [0],
  );
  const vertexArc =
    (2 * Math.PI) /
    (previousArcsWithinPartitions.at(-1)! + arcRatio * partitionSizes.length);

  // Offset angles so that first partition is centered at angle 0
  const firstPartitionArc = vertexArc * Math.max(0, partitionSizes[0] - 1);
  const angleOffset = firstPartitionArc / 2 + Math.PI;

  return partitionSizes.flatMap((partitionSize, partitionIndex) => {
    const baseAngle =
      angleOffset -
      vertexArc * previousArcsWithinPartitions[partitionIndex] -
      vertexArc * arcRatio * partitionIndex;

    return range(partitionSize).map((vertexIndex) =>
      pointOnUnitCircle(baseAngle - vertexIndex * vertexArc),
    );
  });
}
