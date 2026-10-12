import { guestList } from '../guests'

// A loop with a limit: only the first 5 guests get a gift. However long the
// list is, the loop never runs more than 5 times, so it's O(1).

const LIMIT = 5

export const giveGifts = {
  key: 'giveGifts',
  counter: 'gifts',
  inputs: [
    { guests: guestList(3) },
    { guests: guestList(8) },
    { guests: guestList(20) },
  ],
  code: `function giveGifts(guests) {
  const gifts = []
  for (let i = 0; i < guests.length && i < 5; i++) {
    gifts.push('Gift for ' + guests[i])
  }
  return gifts
}`,
  call: (input) => ['giveGifts', [input.guests]],
  *run({ guests }) {
    const n = guests.length
    const gifts = []
    const states = () => Object.fromEntries(gifts.map((_, k) => [k, 'found']))
    yield {
      line: 2,
      captionKey: 'start',
      params: { n },
      ops: 0,
      vars: [['i', '—']],
    }
    let i = 0
    for (; i < n && i < LIMIT; i++) {
      gifts.push('Gift for ' + guests[i])
      yield {
        line: 4,
        captionKey: 'give',
        params: { i, guest: guests[i] },
        ops: gifts.length,
        vars: [['i', i]],
        pointers: [{ index: i, label: 'i' }],
        states: states(),
      }
    }
    // Why the loop stopped: the list ran out, or the limit of 5 was reached.
    const left = n - i
    const fadedRest = Object.fromEntries(
      Array.from({ length: left }, (_, k) => [i + k, 'faded']),
    )
    yield {
      line: 3,
      captionKey: left > 0 ? 'limit' : 'noMoreGuests',
      params: { i, left },
      ops: gifts.length,
      vars: [['i', i]],
      states: { ...states(), ...fadedRest },
    }
    yield {
      line: 6,
      captionKey: 'end',
      params: { gifts: gifts.length, n },
      ops: gifts.length,
      vars: [['i', i]],
      states: { ...states(), ...fadedRest },
      result: gifts,
    }
  },
}
