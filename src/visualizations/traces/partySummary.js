import { guestList } from '../guests'

// Rules of thumb: each line gets a cost badge. Simple lines are O(1); a loop
// costs (how many times it runs) × (the work inside).

export const partySummary = {
  key: 'partySummary',
  counter: null,
  inputs: [{ guests: guestList(5) }],
  code: `function partySummary(guests) {
  const first = guests[0]
  const chairs = guests.length + 2
  let longNames = 0
  for (let i = 0; i < guests.length; i++) {
    if (guests[i].length > 3) longNames = longNames + 1
  }
  return [first, chairs, longNames]
}`,
  call: (input) => ['partySummary', [input.guests]],
  *run({ guests }) {
    const first = guests[0]
    const chairs = guests.length + 2
    let longNames = 0
    for (let i = 0; i < guests.length; i++) {
      if (guests[i].length > 3) longNames = longNames + 1
    }
    const costs = {}
    const step = (line, captionKey, cost, extra = {}) => {
      if (cost) costs[line] = cost
      return {
        line,
        captionKey,
        params: {},
        costs: { ...costs },
        vars: [],
        ...extra,
      }
    }
    yield step(2, 'index', 'O(1)', {
      pointers: [{ index: 0, label: '[0]' }],
      states: { 0: 'found' },
    })
    yield step(3, 'math', 'O(1)')
    yield step(4, 'assign', 'O(1)')
    yield step(6, 'inside', 'O(1)')
    yield step(5, 'loop', '× n')
    yield step(8, 'total', 'O(1)', { result: [first, chairs, longNames] })
  },
}
