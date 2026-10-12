import { guestList } from '../guests'

// Counting operations: every highlighted line adds 1 to the counter, so
// students see the total grow with the number of guests (about 3 per guest).

export const countShortNames = {
  key: 'countShortNames',
  counter: 'operations',
  inputs: [
    { guests: guestList(4) },
    { guests: guestList(8) },
    { guests: guestList(16) },
  ],
  code: `function countShortNames(guests) {
  let count = 0
  for (let i = 0; i < guests.length; i++) {
    if (guests[i].length <= 3) {
      count = count + 1
    }
  }
  return count
}`,
  call: (input) => ['countShortNames', [input.guests]],
  *run({ guests }) {
    let ops = 0
    let count = 0
    const n = guests.length
    const vars = (i) => [
      ['i', i],
      ['guests[i]', i < n ? `'${guests[i]}'` : '—'],
      ['count', count],
    ]
    const done = (i) =>
      Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'done']))
    // Short lists are traced line by line; long ones jump to the end so the
    // student can compare totals without clicking 50 times.
    const detailed = n <= 4
    ops++
    yield { line: 2, captionKey: 'init', params: {}, ops, vars: vars(0) }
    for (let i = 0; i < n; i++) {
      const pointers = [{ index: i, label: 'i' }]
      const states = { ...done(i), [i]: 'active' }
      ops++ // i < guests.length
      if (detailed)
        yield {
          line: 3,
          captionKey: 'loopCheck',
          params: { i, n },
          ops,
          vars: vars(i),
          pointers,
          states,
        }
      ops++ // the if
      const isShort = guests[i].length <= 3
      if (detailed)
        yield {
          line: 4,
          captionKey: isShort ? 'isShort' : 'isLong',
          params: { guest: guests[i], length: guests[i].length },
          ops,
          vars: vars(i),
          pointers,
          states,
        }
      if (isShort) {
        ops++
        count = count + 1
        if (detailed)
          yield {
            line: 5,
            captionKey: 'addOne',
            params: { count },
            ops,
            vars: vars(i),
            pointers,
            states,
          }
      }
      ops++ // i++
    }
    ops++ // the last i < guests.length check, which fails
    if (!detailed) {
      yield {
        line: 3,
        captionKey: 'fastForward',
        params: { n },
        ops,
        vars: vars(n),
        states: done(n),
      }
    }
    ops++
    yield {
      line: 7,
      captionKey: 'end',
      params: { count, ops, n },
      ops,
      vars: vars(n),
      states: done(n),
      result: count,
    }
  },
}
