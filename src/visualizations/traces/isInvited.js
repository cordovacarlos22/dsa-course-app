import { guestList } from '../guests'

// Two ways to check the guest list. Both are correct; the first one stops as
// soon as it finds the name, the second one always reads the whole list.

const GUESTS = guestList(6)
const INPUTS = [
  { guests: GUESTS, name: 'Dev' },
  { guests: GUESTS, name: 'Ana' },
  { guests: GUESTS, name: 'Zoe' },
]

function checkVars(guests, name, i) {
  return [
    ['name', `'${name}'`],
    ['i', i],
    ['guests[i]', i < guests.length ? `'${guests[i]}'` : '—'],
  ]
}

// Boxes before i were checked; box i is being checked now.
function checkedStates(i, foundIndex = null) {
  const states = {}
  for (let k = 0; k < i; k++) states[k] = 'done'
  if (foundIndex !== null) states[foundIndex] = 'found'
  return states
}

export const isInvited = {
  key: 'isInvited',
  counter: 'checks',
  inputs: INPUTS,
  code: `function isInvited(guests, name) {
  for (let i = 0; i < guests.length; i++) {
    if (guests[i] === name) return true
  }
  return false
}`,
  call: (input) => ['isInvited', [input.guests, input.name]],
  *run({ guests, name }) {
    let ops = 0
    yield {
      line: 1,
      captionKey: 'start',
      params: { name, count: guests.length },
      ops,
      vars: checkVars(guests, name, 0),
    }
    for (let i = 0; i < guests.length; i++) {
      ops++
      const base = {
        line: 3,
        ops,
        vars: checkVars(guests, name, i),
        pointers: [{ index: i, label: 'i' }],
      }
      if (guests[i] === name) {
        yield {
          ...base,
          captionKey: 'match',
          params: { i, guest: guests[i], name, ops },
          states: checkedStates(i, i),
          result: true,
        }
        return
      }
      yield {
        ...base,
        captionKey: 'noMatch',
        params: { i, guest: guests[i], name },
        states: { ...checkedStates(i), [i]: 'active' },
      }
    }
    yield {
      line: 5,
      captionKey: 'notFound',
      params: { name, ops },
      ops,
      vars: checkVars(guests, name, guests.length),
      states: checkedStates(guests.length),
      result: false,
    }
  },
}

export const isInvitedAll = {
  key: 'isInvitedAll',
  counter: 'checks',
  inputs: INPUTS,
  code: `function isInvitedAll(guests, name) {
  let found = false
  for (let i = 0; i < guests.length; i++) {
    if (guests[i] === name) found = true
  }
  return found
}`,
  call: (input) => ['isInvitedAll', [input.guests, input.name]],
  *run({ guests, name }) {
    let ops = 0
    let found = false
    let foundIndex = null
    const vars = (i) => [...checkVars(guests, name, i), ['found', found]]
    yield {
      line: 2,
      captionKey: 'start',
      params: { name, count: guests.length },
      ops,
      vars: vars(0),
    }
    for (let i = 0; i < guests.length; i++) {
      ops++
      const isMatch = guests[i] === name
      if (isMatch) {
        found = true
        foundIndex = i
      }
      yield {
        line: 4,
        captionKey: isMatch ? 'match' : found ? 'keepReading' : 'noMatch',
        params: { i, guest: guests[i], name },
        ops,
        vars: vars(i),
        pointers: [{ index: i, label: 'i' }],
        states: {
          ...checkedStates(i, foundIndex),
          [i]: isMatch ? 'found' : 'active',
        },
      }
    }
    yield {
      line: 6,
      captionKey: 'end',
      params: { found: String(found), ops },
      ops,
      vars: vars(guests.length),
      states: checkedStates(guests.length, foundIndex),
      result: found,
    }
  },
}
