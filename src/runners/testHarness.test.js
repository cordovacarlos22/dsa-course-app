import { describe, it, expect } from 'vitest'
import { deepEqual, runCheckpointTests } from './testHarness'

const quietConsole = { log() {}, info() {}, warn() {}, error() {} }

const isEvenCheckpoint = {
  kind: 'function',
  functionName: 'isEven',
  tests: [
    { args: [2], expected: true },
    { args: [3], expected: false },
  ],
}

const counterCheckpoint = {
  kind: 'class',
  className: 'Counter',
  tests: [
    {
      steps: [
        { create: [1] },
        { call: 'increment' },
        { read: 'count', expected: 2 },
      ],
    },
  ],
}

describe('deepEqual', () => {
  it('compares JSON-like values', () => {
    expect(deepEqual([1, { a: 'x' }], [1, { a: 'x' }])).toBe(true)
    expect(deepEqual([1, 2], [2, 1])).toBe(false)
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
    expect(deepEqual(null, {})).toBe(false)
    expect(deepEqual([], {})).toBe(false)
  })
})

describe('runCheckpointTests', () => {
  it('passes a correct function and describes each call', () => {
    const code = 'function isEven(n) { return n % 2 === 0 }'
    const result = runCheckpointTests(code, isEvenCheckpoint, quietConsole)
    expect(result.passed).toBe(true)
    expect(result.results[0]).toEqual({
      ok: true,
      message: 'isEven(2) returned true',
    })
  })

  it('explains what a wrong function returned', () => {
    const code = 'function isEven(n) { return true }'
    const result = runCheckpointTests(code, isEvenCheckpoint, quietConsole)
    expect(result.passed).toBe(false)
    expect(result.results[1]).toEqual({
      ok: false,
      message: 'isEven(3) should return false, but returned true',
    })
  })

  it('reports an error thrown by the student code', () => {
    const code = 'function isEven(n) { return n.oops.bad }'
    const result = runCheckpointTests(code, isEvenCheckpoint, quietConsole)
    expect(result.results[0].message).toMatch(/^TypeError/)
  })

  it('says when the function is missing', () => {
    expect(() =>
      runCheckpointTests('const x = 1', isEvenCheckpoint, quietConsole),
    ).toThrow('Function "isEven" was not found')
  })

  it('checks a class step by step', () => {
    const good =
      'class Counter { constructor(s) { this.count = s } increment() { this.count++ } }'
    expect(
      runCheckpointTests(good, counterCheckpoint, quietConsole).passed,
    ).toBe(true)

    const bad =
      'class Counter { constructor(s) { this.count = s } increment() {} }'
    const result = runCheckpointTests(bad, counterCheckpoint, quietConsole)
    expect(result.results[0]).toEqual({
      ok: false,
      message: 'Counter.count should be 2, but was 1',
    })
  })

  it('gives every test a fresh copy of the arguments', () => {
    const checkpoint = {
      kind: 'function',
      functionName: 'firstAndClear',
      tests: [
        { args: [[1, 2]], expected: 1 },
        { args: [[1, 2]], expected: 1 },
      ],
    }
    const code =
      'const shared = []; function firstAndClear(a) { const f = a[0]; a.length = 0; return f }'
    expect(runCheckpointTests(code, checkpoint, quietConsole).passed).toBe(true)
  })
})
