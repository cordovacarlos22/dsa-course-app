import { describe, it, expect } from 'vitest'
import { traces } from './index'

// Runs the code students see, for real, and returns what it returned and
// printed. If a trace's steps ever disagree with its code, these tests fail.
function runShownCode(trace, input) {
  const [functionName, args] = trace.call(input)
  const printed = []
  const fakeConsole = { log: (...values) => printed.push(values.join(' ')) }
  const fn = new Function('console', `${trace.code}\nreturn ${functionName}`)(
    fakeConsole,
  )
  return { returned: fn(...structuredClone(args)), printed }
}

describe.each(Object.entries(traces))('%s', (name, trace) => {
  it('every line it highlights exists in the code', () => {
    const lineCount = trace.code.split('\n').length
    for (const input of trace.inputs) {
      for (const step of trace.run(input)) {
        expect(step.line).toBeGreaterThanOrEqual(1)
        expect(step.line).toBeLessThanOrEqual(lineCount)
      }
    }
  })

  it('ends with the same result as the real code', () => {
    for (const input of trace.inputs) {
      const steps = Array.from(trace.run(input))
      const last = steps.at(-1)
      const { returned, printed } = runShownCode(trace, input)
      if (printed.length > 0) expect(last.output).toEqual(printed)
      else expect(last.result).toEqual(returned)
    }
  })
})

describe('trace counters', () => {
  it('counts one message per guest for welcomeAll (O(n))', () => {
    for (const input of traces['trace-welcome-all'].inputs) {
      const last = Array.from(traces['trace-welcome-all'].run(input)).at(-1)
      expect(last.ops).toBe(input.guests.length)
    }
  })

  it('counts n × n inner steps for greetEveryone (O(n²))', () => {
    for (const input of traces['trace-greet-everyone'].inputs) {
      const n = input.guests.length
      const last = Array.from(traces['trace-greet-everyone'].run(input)).at(-1)
      expect(last.ops).toBe(n * n)
    }
  })

  it('isInvited stops early but isInvitedAll reads every guest', () => {
    const input = traces['trace-is-invited'].inputs[1] // 'Ana', the first guest
    const early = Array.from(traces['trace-is-invited'].run(input)).at(-1)
    const all = Array.from(traces['trace-is-invited-all'].run(input)).at(-1)
    expect(early.ops).toBe(1)
    expect(all.ops).toBe(input.guests.length)
  })

  it('counts more operations for more guests', () => {
    const trace = traces['trace-count-short-names']
    const totals = trace.inputs.map(
      (input) => Array.from(trace.run(input)).at(-1).ops,
    )
    expect(totals[1]).toBeGreaterThan(totals[0])
    expect(totals[2]).toBeGreaterThan(totals[1])
  })
})
