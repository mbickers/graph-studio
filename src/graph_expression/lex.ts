export type Punctuation = '(' | ')' | '{' | '}' | ','
export type Operator = '+' | '-' | '\\' | '*' | '^'
//TODO: add token location
export type Token =
  { type: 'punctuation', value: Punctuation } |
  { type: 'number', value: number } |
  { type: 'name', value: string } |
  { type: 'operator', value: Operator }
export type Result<T, E> = { ok: true, value: T } | { ok: false, error: E }


function takeWhile(predicate: (char: string) => boolean, string: string): [string, string] {
  for (let index = 0; index < string.length; index++) {
    if (!predicate(string[index])) {
      return [string.substring(0, index), string.substring(index)]
    }
  }

  return [string, '']
}

function isWhitespace(c: string) {
  return /\s/.test(c)
}

function isDigit(c: string) {
  return /\d/.test(c)
}

function isAlpha(c: string) {
  return /[A-Za-z]/.test(c)
}

function isOperator(c: string): c is Operator {
  return '+-\\*^'.includes(c)
}

function isPunctuation(c: string): c is Punctuation {
  return '(){},'.includes(c)
}

function takeToken(string: string): Result<[Token, string], string> {
  if (!string) {
    return { ok: false, error: 'Cannot take token from empty string' }
  }

  if (isDigit(string[0])) {
    const [digits, rest] = takeWhile(isDigit, string)
    return { ok: true, value: [{ type: 'number', value: Number(digits) }, rest]}
  } else if (isAlpha(string[0])) {
    const [name, rest] = takeWhile(isAlpha, string)
    return { ok: true, value: [{ type: 'name', value: name }, rest]}
  } else if (isOperator(string[0])) {
    const [operator, rest] = [string[0], string.substring(1)]
    return { ok: true, value: [{ type: 'operator', value: operator }, rest]}
  } else if (isPunctuation(string[0])) {
    const [punctuation, rest] = [string[0], string.substring(1)]
    return { ok: true, value: [{ type: 'punctuation', value: punctuation }, rest]}
  }

  return { ok: false, error: `Unknown character ${string[0]}` }
}

export function lex(string: string): Result<Token[], string> {
  const stripped = takeWhile(isWhitespace, string)[1]
  if (!stripped) {
    return { ok: true, value: [] }
  }

  const takeResult = takeToken(stripped)
  if (!takeResult.ok) {
    return { ok: false, error: takeResult.error }
  }

  const [token, rest] = takeResult.value
  const restResult = lex(rest)
  if (!restResult.ok) {
    return { ok: false, error: restResult.error }
  }

  return { ok: true, value: [token, ...restResult.value] }
}