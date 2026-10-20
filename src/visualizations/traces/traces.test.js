import { describe, it, expect } from 'vitest'
import { traces } from './index'

// A method trace shows one LinkedList method, so it runs inside a class
// with Node, a constructor that starts empty and the methods it uses.
function loadLinkedList(trace, fakeConsole) {
  const methods = [...(trace.uses ?? []).map((name) => traces[name].code)]
  return new Function(
    'console',
    `class Node {
  constructor(value) {
    this.value = value
    this.next = null
  }
}
class LinkedList {
  constructor() {
    this.head = null
    this.tail = null
    this.length = 0
  }
${methods.join('\n')}
${trace.code}
}
return LinkedList`,
  )(fakeConsole)
}

// Runs the code students see, for real, and returns what it returned and
// printed. If a trace's steps ever disagree with its code, these tests fail.
function runShownCode(trace, input) {
  const printed = []
  const fakeConsole = { log: (...values) => printed.push(values.join(' ')) }
  if (trace.method) {
    const LinkedList = loadLinkedList(trace, fakeConsole)
    return { returned: trace.play(LinkedList, structuredClone(input)), printed }
  }
  const [functionName, args] = trace.call(input)
  const fn = new Function('console', `${trace.code}\nreturn ${functionName}`)(
    fakeConsole,
  )
  const copies = structuredClone(args)
  const returned = trace.construct ? new fn(...copies) : fn(...copies)
  return { returned, printed }
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
  it('reads every character once for charCount (O(n))', () => {
    const trace = traces['trace-char-count']
    for (const input of trace.inputs) {
      const last = Array.from(trace.run(input)).at(-1)
      expect(last.ops).toBe(input.text.length)
    }
  })

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

  it('counts 5n + 3 operations for countGuests', () => {
    const trace = traces['trace-count-guests']
    for (const input of trace.inputs) {
      const last = Array.from(trace.run(input)).at(-1)
      expect(last.ops).toBe(5 * input.guests.length + 3)
    }
  })

  it('never gives more than 5 gifts, however long the list (O(1))', () => {
    const trace = traces['trace-give-gifts']
    const gifts = trace.inputs.map(
      (input) => Array.from(trace.run(input)).at(-1).ops,
    )
    expect(gifts).toEqual([3, 5, 5])
  })

  it('counts 5n + 2 operations for sumUpTo with a loop, and 3 for the formula', () => {
    for (const input of traces['trace-sum-loop'].inputs) {
      const last = Array.from(traces['trace-sum-loop'].run(input)).at(-1)
      expect(last.ops).toBe(5 * input.n + 2)
    }
    for (const input of traces['trace-sum-formula'].inputs) {
      const last = Array.from(traces['trace-sum-formula'].run(input)).at(-1)
      expect(last.ops).toBe(3)
    }
  })

  it('prints n lines for printNumbers and n × n for printPairs', () => {
    for (const input of traces['trace-print-numbers'].inputs) {
      expect(
        Array.from(traces['trace-print-numbers'].run(input)).at(-1).ops,
      ).toBe(input.n)
    }
    for (const input of traces['trace-print-pairs'].inputs) {
      expect(
        Array.from(traces['trace-print-pairs'].run(input)).at(-1).ops,
      ).toBe(input.n * input.n)
    }
  })

  it('creates one new box of memory per number in doubleArray', () => {
    for (const input of traces['trace-double-array'].inputs) {
      expect(
        Array.from(traces['trace-double-array'].run(input)).at(-1).ops,
      ).toBe(input.numbers.length)
    }
  })

  it('hasAnswer stops at the first match, and checks every guest when nobody matches', () => {
    const trace = traces['trace-has-answer']
    const [maybe, late] = trace.inputs.map(
      (input) => Array.from(trace.run(input)).at(-1).ops,
    )
    expect(maybe).toBe(3) // Cleo, the third guest
    expect(late).toBe(Object.keys(trace.inputs[1].rsvps).length)
  })

  it('visits every node once when walking a linked list (O(n))', () => {
    const trace = traces['trace-ll-walk']
    for (const input of trace.inputs) {
      const last = Array.from(trace.run(input)).at(-1)
      expect(last.ops).toBe(input.values.length)
      expect(last.list.pointers.temp).toBe(null)
    }
  })

  it('starts the linked list empty when the constructor gets no value', () => {
    const trace = traces['trace-ll-constructor']
    const [named, missing, zero] = trace.inputs.map(
      (input) => Array.from(trace.run(input)).at(-1).result,
    )
    expect(named.length).toBe(1)
    expect(missing).toEqual({ head: null, tail: null, length: 0 })
    expect(zero.head.value).toBe(0)
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
