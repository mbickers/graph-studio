import { lex } from "./lex"

test('ignores white space', () => {
  const abc = {type: 'name', value: 'abc'}
  expect(lex(' abc\nabc\tabc\n\t abc ')).toEqual({ok: true, value: [abc, abc, abc, abc]})
})

test('rejects unknown characters', () => {
  expect(lex('?').ok).toEqual(false)
  expect(lex('a @ b').ok).toEqual(false)
  expect(lex('123.4').ok).toEqual(false)
})

test('parses numbers', () => {
  expect(lex('1234')).toEqual({ ok:true, value: [ {type: 'number', value: 1234}]})
})

test('parses operators', () => {
  const operators = '+\\^-*'
  const expectedTokens = [...operators].map(value => ({ type: 'operator', value }))
  expect(lex(operators)).toEqual({ ok: true, value: expectedTokens })
})

test('parses punctuation', () => {
  const punctuation = '({)},'
  const expectedTokens = [...punctuation].map(value => ({ type: 'punctuation', value }))
  expect(lex(punctuation)).toEqual({ ok: true, value: expectedTokens })
})

test('parses larger inputs', () => {
  const result = lex('Bipartite(2,3) ^ 2 + ({1, 2}, {(1, 2)}) + Peterson')
  expect(result).toEqual(
    { "ok": true, "value": [{ "type": "name", "value": "Bipartite" }, { "type": "punctuation", "value": "(" }, { "type": "number", "value": 2 }, { "type": "punctuation", "value": "," }, { "type": "number", "value": 3 }, { "type": "punctuation", "value": ")" }, { "type": "operator", "value": "^" }, { "type": "number", "value": 2 }, { "type": "operator", "value": "+" }, { "type": "punctuation", "value": "(" }, { "type": "punctuation", "value": "{" }, { "type": "number", "value": 1 }, { "type": "punctuation", "value": "," }, { "type": "number", "value": 2 }, { "type": "punctuation", "value": "}" }, { "type": "punctuation", "value": "," }, { "type": "punctuation", "value": "{" }, { "type": "punctuation", "value": "(" }, { "type": "number", "value": 1 }, { "type": "punctuation", "value": "," }, { "type": "number", "value": 2 }, { "type": "punctuation", "value": ")" }, { "type": "punctuation", "value": "}" }, { "type": "punctuation", "value": ")" }, { "type": "operator", "value": "+" }, { "type": "name", "value": "Peterson" }] }
  )
})