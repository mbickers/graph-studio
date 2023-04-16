import { circularLayout } from './layouts';

test('trivial circular layout', () => {
  expect(circularLayout(0)).toEqual([]);
  expect(circularLayout(1)).toEqual([[-1, 0]]);
  expect(circularLayout(2)).toEqual([
    [-1, 0],
    [1, 0],
  ]);
});
