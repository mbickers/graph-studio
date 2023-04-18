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
  rotateAroundOrigin,
  squaredDistance,
  transformToContainRectangle,
} from './geometry';

export function containLayout(
  positions: Point[],
  container: Rectangle = { lowerLeft: [-1, -1], upperRight: [1, 1] },
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

export function productGridLayout(layout1: Point[], layout2: Point[]) {
  const flippedLayout1 = layout1.map(([x, y]) => [y, x] as Point);
  return flippedLayout1.flatMap((point1) =>
    layout2.map((point2) => add(point1, point2)),
  );
}

export function rotateLayoutAroundOrigin(layout: Point[], angle: number) {
  const normalizedLayout = containLayout(layout);
  return normalizedLayout.map((point) => rotateAroundOrigin(point, angle));
}

export function productKeepFirstShapeLayout(
  layout1: Point[],
  layout2: Point[],
) {
  const layoutRatio = 2;
  const normalizedLayout2 = containLayout(layout2);
  const layout2MaxDimension = 2;
  const layout1ScaleFactor =
    (layoutRatio * layout2MaxDimension) /
    Math.sqrt(minSquaredDistanceBetweenPoints(layout1));

  const layout1IsCircular = layout1.reduce(
    (isCircular, point) => isCircular && squaredDistance(point, [0, 0]) === 1,
    true,
  );

  return layout1.flatMap((point1) => {
    const rotateAngle = layout1IsCircular
      ? Math.PI + Math.atan2(point1[1], point1[0])
      : 0;
    return normalizedLayout2.map((point2) =>
      add(
        multiply(point1, layout1ScaleFactor),
        rotateAroundOrigin(point2, rotateAngle),
      ),
    );
  });
}

export function productLayout(layout1: Point[], layout2: Point[]) {
  const layout1Dimensions = rectangleCenterAndDimensions(
    boundingRectangle(layout1),
  ).dimensions;
  const layout2Dimensions = rectangleCenterAndDimensions(
    boundingRectangle(layout2),
  ).dimensions;

  if (
    layout1Dimensions[0] >= 4 * layout1Dimensions[1] &&
    layout2Dimensions[0] >= 4 * layout2Dimensions[1]
  ) {
    return productGridLayout(layout1, layout2);
  }

  return productKeepFirstShapeLayout(layout1, layout2);
}
