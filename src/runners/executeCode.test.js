import { describe, it, expect } from 'vitest'
import { checkCode, executeCode, formatValue } from './executeCode'

describe('executeCode', () => {
  it('captures console.log output', () => {
    const result = executeCode('console.log("hi"); console.log(1 + 1)')
    expect(result).toEqual({
      logs: ['hi', '2'],
      lines: [1, 1],
      error: null,
      errorLine: null,
    })
  })

  it('records the code line that printed each output line', () => {
    const code = [
      "const guests = ['Ana', 'Ben']",
      "console.log('start')",
      'for (let i = 0; i < guests.length; i++) {',
      '  console.info(guests[i])',
      '}',
    ].join('\n')
    const result = executeCode(code)
    expect(result.logs).toEqual(['start', 'Ana', 'Ben'])
    expect(result.lines).toEqual([2, 4, 4])
  })

  it('leaves console.log inside strings and comments alone', () => {
    const result = executeCode(
      'const text = "console.log(1)" // console.log(2)\nconsole.log(text)',
    )
    expect(result.logs).toEqual(['console.log(1)'])
    expect(result.lines).toEqual([2])
  })

  it('gives no line when it cannot tell which line printed', () => {
    const result = executeCode(
      'const say = console.log\nsay(1)\nconsole\n  .log(2)',
    )
    expect(result.logs).toEqual(['1', '2'])
    expect(result.lines).toEqual([null, null])
  })

  it('reports the line where an error was thrown', () => {
    const result = executeCode("console.log('ok')\n\nnull.length")
    expect(result.error).toMatch(/^TypeError/)
    expect(result.errorLine).toBe(3)
  })

  it('prints several values on one line, separated by spaces', () => {
    expect(executeCode('console.log("i:", 3, [1, 2])').logs).toEqual([
      'i: 3 [1,2]',
    ])
  })

  it('reports errors and keeps the output printed before them', () => {
    const result = executeCode('console.log("before"); missingFunction()')
    expect(result.logs).toEqual(['before'])
    expect(result.error).toBe('ReferenceError: missingFunction is not defined')
  })

  it('reports syntax errors', () => {
    const result = executeCode('function (')
    expect(result.error).toMatch(/^SyntaxError/)
    // The browser doesn't say where, so no line rather than a wrong one.
    expect(result.errorLine).toBeNull()
  })
})

describe('formatValue', () => {
  it('formats common values like a console would', () => {
    expect(formatValue('text')).toBe('text')
    expect(formatValue(undefined)).toBe('undefined')
    expect(formatValue(null)).toBe('null')
    expect(formatValue({ value: 11 })).toBe('{"value":11}')
    expect(formatValue(function printNumbers() {})).toBe(
      '[Function printNumbers]',
    )
  })

  it('does not crash on circular objects', () => {
    const node = { value: 1 }
    node.next = node
    expect(formatValue(node)).toBe('[object Object]')
  })
})

describe('checkCode', () => {
  const checkpoint = {
    kind: 'function',
    functionName: 'timesTwo',
    tests: [
      { args: [2], expected: 4 },
      { args: [0], expected: 0 },
    ],
  }

  it('grades the code and keeps what it printed', () => {
    const result = checkCode(
      'console.log("hi"); function timesTwo(n) { return n * 2 }',
      checkpoint,
    )
    expect(result.passed).toBe(true)
    expect(result.logs).toEqual(['hi'])
    expect(result.results).toHaveLength(2)
  })

  it('reports code that does not load as an error', () => {
    const result = checkCode('function timesTwo(n) { return n * }', checkpoint)
    expect(result.passed).toBe(false)
    expect(result.error).toMatch(/^SyntaxError/)
  })
})
