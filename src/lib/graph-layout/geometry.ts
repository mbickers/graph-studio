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

export function transformForRectanglePreservingAspectRatio(
  original: Rectangle,
  newCenter: Point,
  maxDimension: number,
) {
  // TODO: add some tests
  const currentDimensions = subtract(original.upperRight, original.lowerLeft);
  const currentMaxDimension = Math.max(...currentDimensions);
  const currentCenter = add(
    original.lowerLeft,
    multiply(currentDimensions, 0.5),
  );

  return (point: Point) => {
    const relativeToCurrentCenter = multiply(
      subtract(point, currentCenter),
      (1 / currentMaxDimension) * 2,
    );

    return multiply(add(relativeToCurrentCenter, newCenter), maxDimension / 2);
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
