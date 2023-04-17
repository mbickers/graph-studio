import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';
import {
  Point,
  boundingRectangle,
  transformToContainRectangle,
} from './geometry';

expect.extend({ toBeDeepCloseTo });

test('transorm rectangle preserving aspect ratio', () => {
  const transform = transformToContainRectangle(
    { lowerLeft: [-5, 1], upperRight: [-1, 3] },
    { lowerLeft: [0, -2], upperRight: [2, 0] },
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
  expect(original.map(transform)).toBeDeepCloseTo(expectedResult);
});

test('find bounding rectangle', () => {
  expect(
    boundingRectangle([
      [-10, 2],
      [0, -4],
    ]),
  ).toBeDeepCloseTo({ lowerLeft: [-10, -4], upperRight: [0, 2] });
});
