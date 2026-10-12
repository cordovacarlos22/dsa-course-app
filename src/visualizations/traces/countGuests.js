import { guestList } from '../guests'

// Counting every operation of a simple loop: about 5 per guest (5n + 3).
// The lesson compares it with guests.length, which gives the same answer in
// one step whatever the number of guests.

const doneUntil = (i) =>
  Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'done']))

export const countGuests = {
  key: 'countGuests',
  counter: 'operations',
  inputs: [
    { guests: guestList(4) },
    { guests: guestList(8) },
    { guests: guestList(16) },
  ],
  code: `function countGuests(guests) {
  let count = 0
  for (let i = 0; i < guests.length; i++) {
    count = count + 1
  }
  return count
}`,
  call: (input) => ['countGuests', [input.guests]],
  *run({ guests }) {
    const n = guests.length
    let ops = 0
    let count = 0
    const vars = (i) => [
      ['i', i],
      ['count', count],
    ]
    // Short lists are traced line by line; long ones jump to the end so the
    // student can compare the totals.
    const detailed = n <= 4
    ops++ // let count = 0
    yield { line: 2, captionKey: 'init', params: {}, ops, vars: vars('—') }
    ops++ // let i = 0
    if (detailed) {
      yield { line: 3, captionKey: 'startLoop', params: {}, ops, vars: vars(0) }
    }
    for (let i = 0; i < n; i++) {
      const pointers = [{ index: i, label: 'i' }]
      const states = { ...doneUntil(i), [i]: 'active' }
      ops++ // i < guests.length
      if (detailed) {
        yield {
          line: 3,
          captionKey: 'compare',
          params: { i, n },
          ops,
          vars: vars(i),
          pointers,
          states,
        }
      }
      ops += 2 // count + 1, then save it in count
      count = count + 1
      if (detailed) {
        yield {
          line: 4,
          captionKey: 'add',
          params: { count },
          ops,
          vars: vars(i),
          pointers,
          states,
        }
      }
      ops += 2 // i + 1, then save it in i
      if (detailed) {
        yield {
          line: 3,
          captionKey: 'next',
          params: {},
          ops,
          vars: vars(i + 1),
          pointers,
          states: doneUntil(i + 1),
        }
      }
    }
    ops++ // the last i < guests.length, which is false
    if (!detailed) {
      yield {
        line: 3,
        captionKey: 'fastForward',
        params: { n },
        ops,
        vars: vars(n),
        states: doneUntil(n),
      }
    }
    yield {
      line: 6,
      captionKey: 'end',
      params: { n, ops, count },
      ops,
      vars: vars(n),
      states: doneUntil(n),
      result: count,
    }
  },
}
