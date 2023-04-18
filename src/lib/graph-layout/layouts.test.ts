import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';
import {
  circularLayout,
  circularLayoutPartitioned,
  linearLayout,
  productLayout,
} from './layouts';
import { pointOnUnitCircle, squaredDistance } from './geometry';

expect.extend({ toBeDeepCloseTo });

test('circular layout', () => {
  expect(circularLayout(0)).toEqual([]);
  expect(circularLayout(1)).toBeDeepCloseTo([[-1, 0]]);
  expect(circularLayout(2)).toBeDeepCloseTo([
    [-1, 0],
    [1, 0],
  ]);
  expect(circularLayout(3)).toBeDeepCloseTo([
    [-1, 0],
    pointOnUnitCircle((1 / 3) * Math.PI),
    pointOnUnitCircle((-1 / 3) * Math.PI),
  ]);
});

test('partitioned circular layout', () => {
  expect(circularLayoutPartitioned([])).toEqual([]);
  expect(circularLayoutPartitioned([1])).toBeDeepCloseTo([[-1, 0]]);
  expect(circularLayoutPartitioned([3])).toBeDeepCloseTo(circularLayout(3));
  expect(circularLayoutPartitioned([1, 1, 1])).toBeDeepCloseTo(
    circularLayout(3),
  );

  const layout = circularLayoutPartitioned([1, 2, 1]);
  expect(squaredDistance(layout[0], layout[1])).toBeGreaterThan(
    squaredDistance(layout[1], layout[2]),
  );
});
