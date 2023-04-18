import { range } from '../utils';
import {
  Point,
  Rectangle,
  add,
  boundingRectangle,
  minSquaredDistanceBetweenPoints,
  multiply,
  pointOnUnitCircle,
  rectangleCenterAndDimensions,
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

export function linearLayout(n: number): Point[] {
  return range(n).map((index) => [index, 0] as Point);
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

export function orientLayoutAroundOrigin(
  layout: Point[],
  direction: 'horizontal' | 'vertical',
): Point[] {
  const {
    dimensions: [width, height],
  } = rectangleCenterAndDimensions(boundingRectangle(layout));
  const shouldFlip =
    direction === 'horizontal' ? height > width : width > height;
  if (shouldFlip) {
    return layout.map(([x, y]) => [y, x]);
  }
  return layout;
}

export function productLayout(layout1: Point[], layout2: Point[]) {
  const layoutRatio = 2;
  const layout2MaxDimension = Math.max(
    ...rectangleCenterAndDimensions(boundingRectangle(layout2)).dimensions,
  );
  const layout1ScaleFactor =
    (layoutRatio * layout2MaxDimension) /
    Math.sqrt(minSquaredDistanceBetweenPoints(layout1));

  return layout1.flatMap((point1) =>
    layout2.map((point2) => add(multiply(point1, layout1ScaleFactor), point2)),
  );
  // // Naive grid approach (works for line * line)
  // const orientedLayout1 = orientLayoutAroundOrigin(layout1, 'vertical');
  // const orientedLayout2 = orientLayoutAroundOrigin(layout2, 'horizontal');
  // return orientedLayout1.flatMap((point1) =>
  //   orientedLayout2.map((point2) => add(point1, point2)),
  // );
}
