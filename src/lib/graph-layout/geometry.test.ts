import {
  Point,
  boundingRectangle,
  transformForRectanglePreservingAspectRatio,
} from './geometry';

test('transorm rectangle preserving aspect ratio', () => {
  const transform = transformForRectanglePreservingAspectRatio(
    { lowerLeft: [-5, 1], upperRight: [-1, 3] },
    [1, -1],
    2,
  );

  const original = [
    [-5, 1],
    [-1, 3],
    [-5, 3],
    [-3, 2],
  ] as Point[];
  const expectedResult = [
    [0, -1.5],
    [2, -0.5],
    [0, -0.5],
    [1, -1],
  ] as Point[];
  expect(original.map(transform)).toEqual(expectedResult);
});

test('find bounding rectangle', () => {
  expect(
    boundingRectangle([
      [-10, 2],
      [0, -4],
    ]),
  ).toEqual({ lowerLeft: [-10, -4], upperRight: [0, 2] });
});
