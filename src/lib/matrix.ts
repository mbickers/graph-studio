import { range } from './utils';

export type Matrix = number[][];
export type Position = { row: number; col: number };

export function dimensions(matrix: Matrix): { rows: number; cols: number } {
  const rows = matrix.length;
  const cols = rows === 0 ? 0 : matrix[0].length;

  return { rows, cols };
}

export function zeros(rows: number, cols: number): Matrix {
  return range(rows).map(() => range(cols).map(() => 0));
}

export function iota(rows: number, cols: number): Matrix {
  return range(rows).map((row) => range(cols).map((col) => row * cols + col));
}

function map(matrix: Matrix, f: (value: number, position: Position) => number) {
  return matrix.map((row_values, row) =>
    row_values.map((value, col) => f(value, { row, col })),
  );
}

export function setValue(
  matrix: Matrix,
  { row, col }: Position,
  newValue: number,
) {
  return map(matrix, (currentValue, { row: currentRow, col: currentCol }) =>
    row === currentRow && col === currentCol ? newValue : currentValue,
  );
}
