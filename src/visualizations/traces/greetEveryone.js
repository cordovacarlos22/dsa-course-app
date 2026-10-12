import { guestList } from '../guests'

// O(n²): for every guest (i), the inner loop visits every guest again (j).

export const greetEveryone = {
  key: 'greetEveryone',
  counter: 'innerSteps',
  inputs: [{ guests: guestList(3) }, { guests: guestList(4) }],
  code: `function greetEveryone(guests) {
  let greetings = 0
  for (let i = 0; i < guests.length; i++) {
    for (let j = 0; j < guests.length; j++) {
      if (i !== j) greetings = greetings + 1
    }
  }
  return greetings
}`,
  call: (input) => ['greetEveryone', [input.guests]],
  *run({ guests }) {
    const n = guests.length
    let greetings = 0
    let ops = 0
    const vars = (i, j) => [
      ['i', i],
      ['j', j],
      ['greetings', greetings],
    ]
    yield {
      line: 2,
      captionKey: 'start',
      params: { n },
      ops,
      vars: vars('—', '—'),
    }
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        ops++
        const isSelf = i === j
        if (!isSelf) greetings = greetings + 1
        yield {
          line: 5,
          captionKey: isSelf ? 'self' : 'greet',
          params: { a: guests[i], b: guests[j] },
          ops,
          vars: vars(i, j),
          pointers: [
            { index: i, label: 'i' },
            { index: j, label: 'j' },
          ],
          states: { [i]: 'active', [j]: isSelf ? 'active' : 'found' },
        }
      }
    }
    yield {
      line: 7,
      captionKey: 'end',
      params: { n, steps: ops, greetings },
      ops,
      vars: vars(n, n),
      result: greetings,
    }
  },
}
