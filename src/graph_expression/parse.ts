// Developed while referencing https://lisperator.net/pltut/parser/the-parser by Mihai Bazon.
import { Operator, Punctuation, Result, Token } from "./lex"

export type Expression =
  { type: 'name', name : string } |
  { type: 'call', name : string, args: Expression[] } |
  { type: 'binaryOperator', operator: Operator, left: Expression, right: Expression } |
  { type: 'number', value : number } |
  { type: 'tuple', values : Expression[] } |
  { type: 'set', values : Expression[] } 

export function parse(tokens: Token[]): Result<Expression, string> {
  const mutableTokens = [...tokens]
  const peek = () => mutableTokens.at(0)
  const take = () => mutableTokens.shift()

  const precedence = {
    '+': 1, '-': 1, '\\': 1, '*': 2, '/': 2, '^': 3
  }

  const isPunctuation = (punctuation: Punctuation): boolean => {
    const next = peek()
    return next?.type === 'punctuation' && next.value === punctuation
  }

  const takeDelimited = (start: Punctuation, delimiter: Punctuation, end: Punctuation): Result<Expression[], string> => {
    if (!isPunctuation(start)) {
      return { ok: false, error: `expected ${start}` }
    }
    take()

    if (isPunctuation(end)) {
      take()
      return { ok: true, value: [] }
    }

    const expressions: Expression[] = []
    while (true) {
      const expression = takeExpession()
      if (!expression.ok) {
        return expression
      }
      expressions.push(expression.value)

      if (isPunctuation(end)) {
        take()
        return { ok: true, value: expressions }
      } else if (isPunctuation(delimiter)) {
        take()
      } else {
        return { ok: false, error: 'unexpected token' }
      }
    }
  }

  const takeAtom = (): Result<Expression, string> => {
    const next = peek()
    if (!next) {
      return { ok: false, error: 'expected expression' }
    }
    if (next.type === 'name') {
      take()
      const name = next.value

      if (isPunctuation('(')) {
        const args = takeDelimited('(', ',', ')')
        if (!args.ok) {
          return args
        }
        return { ok: true, value: { type: 'call', name, args: args.value } }
      }

      return { ok: true, value: { type: 'name', name } }
    } else if (isPunctuation('(')) {
      const inside = takeDelimited('(', ',', ')')
      if (!inside.ok) {
        return inside
      }

      if (inside.value.length === 1) {
        return {ok: true, value: inside.value[0] }
      }

      return { ok: true, value: { type: 'tuple', values: inside.value }}
    } else if (isPunctuation('{')) {
      const inside = takeDelimited('{', ',', '}')
      if (!inside.ok) {
        return inside
      }

      return { ok: true, value: { type: 'set', values: inside.value }}
    } else if (next.type === 'number') {
      take()
      return { ok: true, value: { type: 'number', value: next.value } }
    }

    return { ok: false, error: 'unrecognized token to take atom' }
  }

  const tryWrapWithBinaryAbovePrecedence = (left: Expression, currentPrecedence: number): Result<Expression, string> => {
    const next = peek()
    if (next?.type === 'operator' && precedence[next.value] > currentPrecedence) {
      take()
      const rightFirstAtom = takeAtom()
      if (!rightFirstAtom.ok) {
        return rightFirstAtom
      }
      const right = tryWrapWithBinaryAbovePrecedence(rightFirstAtom.value, precedence[next.value])
      if (!right.ok) {
        return right
      }

      return tryWrapWithBinaryAbovePrecedence({
        type: 'binaryOperator',
        operator: next.value,
        left,
        right: right.value
      }, currentPrecedence)
    }

    return { ok: true, value: left }
  }

  const takeExpession = (): Result<Expression, string> => {
    const firstAtom = takeAtom()
    if (!firstAtom.ok) {
      return firstAtom
    }
    return tryWrapWithBinaryAbovePrecedence(firstAtom.value, 0)
  }

  const expression = takeExpession()
  if (expression.ok && peek()) {
    return { ok: false, error: 'unexpected token' }
  }

  return expression
}