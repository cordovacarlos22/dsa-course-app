import { guestList } from '../guests'

// O(n): one message per guest. Then two loops in a row: 2n messages, which is
// still O(n) once we drop the constant.

const doneUntil = (i) =>
  Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'done']))

export const welcomeAll = {
  key: 'welcomeAll',
  counter: 'messages',
  inputs: [{ guests: guestList(3) }, { guests: guestList(6) }],
  code: `function welcomeAll(guests) {
  for (let i = 0; i < guests.length; i++) {
    console.log('Welcome, ' + guests[i] + '!')
  }
}`,
  call: (input) => ['welcomeAll', [input.guests]],
  *run({ guests }) {
    const output = []
    yield {
      line: 1,
      captionKey: 'start',
      params: { n: guests.length },
      ops: 0,
      vars: [],
      output: [...output],
    }
    for (let i = 0; i < guests.length; i++) {
      output.push('Welcome, ' + guests[i] + '!')
      yield {
        line: 3,
        captionKey: 'print',
        params: { i, guest: guests[i] },
        ops: output.length,
        vars: [
          ['i', i],
          ['guests[i]', `'${guests[i]}'`],
        ],
        pointers: [{ index: i, label: 'i' }],
        states: { ...doneUntil(i), [i]: 'active' },
        output: [...output],
      }
    }
    yield {
      line: 4,
      captionKey: 'end',
      params: { n: guests.length },
      ops: output.length,
      vars: [],
      states: doneUntil(guests.length),
      output: [...output],
      result: output,
    }
  },
}

export const welcomeAndGoodbye = {
  key: 'welcomeAndGoodbye',
  counter: 'messages',
  inputs: [{ guests: guestList(3) }, { guests: guestList(6) }],
  code: `function welcomeAndGoodbye(guests) {
  for (let i = 0; i < guests.length; i++) {
    console.log('Welcome, ' + guests[i] + '!')
  }
  for (let j = 0; j < guests.length; j++) {
    console.log('Goodbye, ' + guests[j] + '!')
  }
}`,
  call: (input) => ['welcomeAndGoodbye', [input.guests]],
  *run({ guests }) {
    const n = guests.length
    const output = []
    yield {
      line: 1,
      captionKey: 'start',
      params: { n },
      ops: 0,
      vars: [],
      output: [],
    }
    for (let i = 0; i < n; i++) {
      output.push('Welcome, ' + guests[i] + '!')
      yield {
        line: 3,
        captionKey: 'welcome',
        params: { guest: guests[i] },
        ops: output.length,
        vars: [['i', i]],
        pointers: [{ index: i, label: 'i' }],
        states: { ...doneUntil(i), [i]: 'active' },
        output: [...output],
      }
    }
    yield {
      line: 5,
      captionKey: 'secondLoop',
      params: { n },
      ops: output.length,
      vars: [],
      states: doneUntil(n),
      output: [...output],
    }
    for (let j = 0; j < n; j++) {
      output.push('Goodbye, ' + guests[j] + '!')
      yield {
        line: 6,
        captionKey: 'goodbye',
        params: { guest: guests[j] },
        ops: output.length,
        vars: [['j', j]],
        pointers: [{ index: j, label: 'j' }],
        states: { ...doneUntil(j), [j]: 'active' },
        output: [...output],
      }
    }
    yield {
      line: 8,
      captionKey: 'end',
      params: { n, total: 2 * n },
      ops: output.length,
      vars: [],
      states: doneUntil(n),
      output: [...output],
      result: output,
    }
  },
}
