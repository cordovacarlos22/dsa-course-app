import { RSVPS } from '../guests'

// Looking for a *value* in an object: with no key to jump to, the loop has
// to read the answers one by one. O(n), like searching an unsorted array.

const INPUTS = [
  { rsvps: RSVPS, answer: 'maybe' },
  { rsvps: RSVPS, answer: 'late' },
]

// The boxes under the code: one per guest, with their answer.
function answerBoxes({ rsvps }) {
  const names = Object.keys(rsvps)
  const boxes = []
  for (let i = 0; i < names.length; i++) {
    boxes.push(`${names[i]}: ${rsvps[names[i]]}`)
  }
  return boxes
}

function checkedUntil(i, foundIndex = null) {
  const states = {}
  for (let k = 0; k < i; k++) states[k] = 'done'
  if (foundIndex !== null) states[foundIndex] = 'found'
  return states
}

export const hasAnswer = {
  key: 'hasAnswer',
  counter: 'checks',
  inputs: INPUTS,
  items: answerBoxes,
  code: `function hasAnswer(rsvps, answer) {
  const names = Object.keys(rsvps)
  for (let i = 0; i < names.length; i++) {
    if (rsvps[names[i]] === answer) return true
  }
  return false
}`,
  call: (input) => ['hasAnswer', [input.rsvps, input.answer]],
  *run({ rsvps, answer }) {
    const names = Object.keys(rsvps)
    let ops = 0
    const vars = (i) => [
      ['answer', `'${answer}'`],
      ['i', i],
      ['names[i]', i < names.length ? `'${names[i]}'` : '—'],
    ]
    yield {
      line: 2,
      captionKey: 'start',
      params: { answer, count: names.length },
      ops,
      vars: vars(0),
    }
    for (let i = 0; i < names.length; i++) {
      ops++
      const name = names[i]
      const base = {
        line: 4,
        ops,
        vars: vars(i),
        pointers: [{ index: i, label: 'i' }],
      }
      if (rsvps[name] === answer) {
        yield {
          ...base,
          captionKey: 'match',
          params: { name, answer, ops },
          states: checkedUntil(i, i),
          result: true,
        }
        return
      }
      yield {
        ...base,
        captionKey: 'noMatch',
        params: { name, value: rsvps[name], answer },
        states: { ...checkedUntil(i), [i]: 'active' },
      }
    }
    yield {
      line: 6,
      captionKey: 'notFound',
      params: { answer, ops },
      ops,
      vars: vars(names.length),
      states: checkedUntil(names.length),
      result: false,
    }
  },
}
