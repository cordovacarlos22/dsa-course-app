import { describe, it, expect } from 'vitest'
import { executeCode, formatValue } from './executeCode'

describe('executeCode', () => {
  it('captures console.log output', () => {
    const result = executeCode('console.log("hi"); console.log(1 + 1)')
    expect(result).toEqual({ logs: ['hi', '2'], error: null })
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
    expect(executeCode('function (').error).toMatch(/^SyntaxError/)
  })
})

describe('formatValue', () => {
  it('formats common values like a console would', () => {
    expect(formatValue('text')).toBe('text')
    expect(formatValue(undefined)).toBe('undefined')
    expect(formatValue(null)).toBe('null')
    expect(formatValue({ value: 11 })).toBe('{"value":11}')
    expect(formatValue(function logItems() {})).toBe('[Function logItems]')
  })

  it('does not crash on circular objects', () => {
    const node = { value: 1 }
    node.next = node
    expect(formatValue(node)).toBe('[object Object]')
  })
})
