// The simple countCharacters from "Solve or simplify": no lowercase and no
// letter-or-digit check yet. One pass over the string, so O(n). With
// 'Hi Ana!' it shows what's still missing: 'H' and 'A' are counted apart
// from 'h' and 'a', and the space and '!' are counted too.

const INPUTS = [{ text: 'banana' }, { text: 'Hi Ana!' }]

// The boxes under the code: one per character (a space is drawn as ␣).
function characterBoxes({ text }) {
  const boxes = []
  for (let i = 0; i < text.length; i++) {
    boxes.push(text[i] === ' ' ? '␣' : text[i])
  }
  return boxes
}

// The result object as students would write it: { b: 1, a: 3 }.
// Keys that aren't a letter or digit get quotes: { ' ': 1, '!': 1 }.
export function formatCounts(result) {
  const keys = Object.keys(result)
  if (keys.length === 0) return '{}'
  const parts = []
  for (let i = 0; i < keys.length; i++) {
    const key = /^[a-z0-9]$/i.test(keys[i]) ? keys[i] : `'${keys[i]}'`
    parts.push(`${key}: ${result[keys[i]]}`)
  }
  return `{ ${parts.join(', ')} }`
}

function readUntil(i) {
  const states = {}
  for (let k = 0; k < i; k++) states[k] = 'done'
  states[i] = 'active'
  return states
}

export const countCharacters = {
  key: 'countCharacters',
  counter: 'characters',
  inputs: INPUTS,
  items: characterBoxes,
  code: `function countCharacters(text) {
  const result = {}
  for (let i = 0; i < text.length; i++) {
    const character = text[i]
    if (result[character] > 0) {
      result[character]++
    } else {
      result[character] = 1
    }
  }
  return result
}`,
  call: (input) => ['countCharacters', [input.text]],
  *run({ text }) {
    const result = {}
    yield {
      line: 2,
      captionKey: 'start',
      params: { text, count: text.length },
      ops: 0,
      vars: [['result', formatCounts(result)]],
    }
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const isNew = !(result[char] > 0)
      if (isNew) result[char] = 1
      else result[char]++
      yield {
        line: isNew ? 8 : 6,
        captionKey: isNew ? 'firstTime' : 'again',
        params: { char: `'${char}'`, count: result[char] },
        ops: i + 1,
        vars: [
          ['i', i],
          ['character', `'${char}'`],
          ['result', formatCounts(result)],
        ],
        pointers: [{ index: i, label: 'i' }],
        states: readUntil(i),
      }
    }
    const states = {}
    for (let k = 0; k < text.length; k++) states[k] = 'done'
    yield {
      line: 11,
      captionKey: 'done',
      params: { ops: text.length, keys: Object.keys(result).length },
      ops: text.length,
      vars: [['result', formatCounts(result)]],
      states,
      result: { ...result },
    }
  },
}
