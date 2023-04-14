import { lex as normalLex, Operator } from './lex';
import { parse, Expression } from './parse';

const lex = (input: string) => {
  const tokens = normalLex(input);
  if (!tokens.ok) {
    throw new Error('lex failed');
  }

  return tokens.value;
};

const name: Expression = { type: 'name', name: 'abc' };
const number: Expression = { type: 'number', value: 1 };
const call = (function_name: string, args: Expression[]) => ({
  type: 'call',
  name: function_name,
  args,
});
const binary = (
  operator: Operator,
  left: Expression,
  right: Expression,
): Expression => ({
  type: 'binaryOperator',
  operator,
  left,
  right,
});
const tuple = (values: Expression[]): Expression => ({ type: 'tuple', values });
const set = (values: Expression[]): Expression => ({ type: 'set', values });

test('parses name', () => {
  expect(parse(lex('abc'))).toEqual({ ok: true, value: name });
});

test('parses call', () => {
  expect(parse(lex('fib()'))).toEqual({ ok: true, value: call('fib', []) });
  expect(parse(lex('fib(1)'))).toEqual({
    ok: true,
    value: call('fib', [number]),
  });
  expect(parse(lex('fib(1, abc)'))).toEqual({
    ok: true,
    value: call('fib', [number, name]),
  });
});

test('parses binary operator', () => {
  expect(parse(lex('abc + 1'))).toEqual({
    ok: true,
    value: binary('+', name, number),
  });
  expect(parse(lex('abc + 1 + {}'))).toEqual({
    ok: true,
    value: binary('+', binary('+', name, number), set([])),
  });
});

test('binary operator precedence', () => {
  const two: Expression = { type: 'number', value: 2 };
  expect(parse(lex('1 * abc - 2'))).toEqual({
    ok: true,
    value: binary('-', binary('*', number, name), two),
  });
  expect(parse(lex('1 + abc * 2'))).toEqual({
    ok: true,
    value: binary('+', number, binary('*', name, two)),
  });
  expect(parse(lex('1 ^ abc \\ 2'))).toEqual({
    ok: true,
    value: binary('\\', binary('^', number, name), two),
  });
});

test('parses parenthesis', () => {
  expect(parse(lex('()'))).toEqual({ ok: true, value: tuple([]) });
  expect(parse(lex('(1)'))).toEqual({ ok: true, value: number });
  expect(parse(lex('(1, (1, abc))'))).toEqual({
    ok: true,
    value: tuple([number, tuple([number, name])]),
  });
});

test('parses number', () => {
  expect(parse(lex('1'))).toEqual({ ok: true, value: number });
});

test('parses set', () => {
  expect(parse(lex('{}'))).toEqual({ ok: true, value: set([]) });
  expect(parse(lex('{abc}'))).toEqual({ ok: true, value: set([name]) });
  expect(parse(lex('{abc, 1}'))).toEqual({
    ok: true,
    value: set([name, number]),
  });
  expect(parse(lex('{abc, {1}}'))).toEqual({
    ok: true,
    value: set([name, set([number])]),
  });
});

test('parsing errors', () => {
  expect(parse(lex('')).ok).toEqual(false);
  expect(parse(lex('abc abc')).ok).toEqual(false);
  expect(parse(lex('abc +')).ok).toEqual(false);
  expect(parse(lex('(}')).ok).toEqual(false);
});

test('parsing bigger expression', () => {
  expect(
    parse(lex('Bipartite(2,3) ^ 2 + ({1, 2}, {(1, 2)}) + (Peterson)')),
  ).toEqual({
    ok: true,
    value: {
      left: {
        left: {
          left: {
            args: [
              { type: 'number', value: 2 },
              { type: 'number', value: 3 },
            ],
            name: 'Bipartite',
            type: 'call',
          },
          operator: '^',
          right: { type: 'number', value: 2 },
          type: 'binaryOperator',
        },
        operator: '+',
        right: {
          type: 'tuple',
          values: [
            {
              type: 'set',
              values: [
                { type: 'number', value: 1 },
                { type: 'number', value: 2 },
              ],
            },
            {
              type: 'set',
              values: [
                {
                  type: 'tuple',
                  values: [
                    { type: 'number', value: 1 },
                    { type: 'number', value: 2 },
                  ],
                },
              ],
            },
          ],
        },
        type: 'binaryOperator',
      },
      operator: '+',
      right: { name: 'Peterson', type: 'name' },
      type: 'binaryOperator',
    },
  });
});
