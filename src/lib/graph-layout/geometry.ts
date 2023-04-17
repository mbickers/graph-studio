export type Point = [number, number];
export type Rectangle = { lowerLeft: Point; upperRight: Point };

export function pointOnUnitCircle(angle: number): Point {
  return [Math.cos(angle), Math.sin(angle)];
}

export function add([x0, y0]: Point, [x1, y1]: Point): Point {
  return [x0 + x1, y0 + y1];
}

export function subtract([x0, y0]: Point, [x1, y1]: Point): Point {
  return [x0 - x1, y0 - y1];
}

export function multiply([x, y]: Point, t: number): Point {
  return [x * t, y * t];
}

export function lerp(point0: Point, point1: Point, t: number): Point {
  return add(point0, multiply(subtract(point1, point0), t));
}

export function squaredDistance(point0: Point, point1: Point): number {
  const [dx, dy] = subtract(point1, point0);
  return dx * dx + dy * dy;
}

export function rectangleCenterAndDimensions(rectangle: Rectangle) {
  const dimensions = subtract(rectangle.upperRight, rectangle.lowerLeft);
  const center = add(rectangle.lowerLeft, multiply(dimensions, 0.5));
  return {
    center,
    dimensions,
  };
}

export function transformToContainRectangle(
  original: Rectangle,
  container: Rectangle,
) {
  const { dimensions: originalDimensions, center: originalCenter } =
    rectangleCenterAndDimensions(original);
  const { dimensions: containerDimensions, center: containerCenter } =
    rectangleCenterAndDimensions(container);
  const scale = Math.min(
    containerDimensions[0] / originalDimensions[0],
    containerDimensions[1] / originalDimensions[1],
  );

  return (point: Point) => {
    const relativeToCurrentCenter = subtract(point, originalCenter);
    const rescaled = multiply(relativeToCurrentCenter, scale);
    return add(rescaled, containerCenter);
  };
}

export function boundingRectangle(positions: Point[]): Rectangle {
  return positions.reduce(
    ({ lowerLeft: [minX, minY], upperRight: [maxX, maxY] }, [x, y]) => ({
      lowerLeft: [Math.min(minX, x), Math.min(minY, y)],
      upperRight: [Math.max(maxX, x), Math.max(maxY, y)],
    }),
    {
      lowerLeft: [Number.MAX_VALUE, Number.MAX_VALUE],
      upperRight: [Number.MIN_VALUE, Number.MIN_VALUE],
    },
  );
}
