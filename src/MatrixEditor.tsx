import React, { ChangeEvent } from 'react';

import { Matrix, Position, dimensions, setValue } from './lib/matrix';
import { range } from './lib/utils';

export type MatrixEditorProps = {
  values: Matrix;
  setValues: (values: Matrix) => void;
};

export function MatrixEditor({ values, setValues }: MatrixEditorProps) {
  const { rows, cols } = dimensions(values);
  const makeOnChange =
    (position: Position) => (changeEvent: ChangeEvent<HTMLInputElement>) => {
      const number = Number(changeEvent.target.value);
      if (Number.isNaN(number)) {
        return;
      }

      setValues(setValue(values, position, number));
    };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols + 1}, 1fr)`,
      }}
    >
      <p>matrix</p>
      {range(cols).map((col) => (
        <p key={`col-header-${col}`}>{col}</p>
      ))}
      {range(rows).map((row) => [
        <p key={`row-header-${row}`}>{row}</p>,
        [
          range(cols).map((col) => (
            <input
              key={`input-${row}-${col}`}
              value={values[row][col]}
              onChange={makeOnChange({ row, col })}
            />
          )),
        ],
      ])}
    </div>
  );
}
