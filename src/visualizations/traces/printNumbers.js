// Printing 0 to n - 1: give the function n and the loop runs n times, so it
// prints n lines. Then a loop inside a loop: n × n lines.

const zeroTo = (n) => Array.from({ length: n }, (_, k) => k)
const doneUntil = (count) =>
  Object.fromEntries(Array.from({ length: count }, (_, k) => [k, 'done']))

export const printNumbers = {
  key: 'printNumbers',
  counter: 'lines',
  inputs: [{ n: 3 }, { n: 10 }],
  items: (input) => zeroTo(input.n),
  code: `function printNumbers(n) {
  for (let i = 0; i < n; i++) {
    console.log(i)
  }
}`,
  call: (input) => ['printNumbers', [input.n]],
  *run({ n }) {
    const output = []
    yield {
      line: 1,
      captionKey: 'start',
      params: { n },
      ops: 0,
      vars: [['n', n]],
      output: [],
    }
    for (let i = 0; i < n; i++) {
      output.push(String(i))
      yield {
        line: 3,
        captionKey: 'print',
        params: { i },
        ops: output.length,
        vars: [
          ['n', n],
          ['i', i],
        ],
        pointers: [{ index: i, label: 'i' }],
        states: { ...doneUntil(i), [i]: 'active' },
        output: [...output],
      }
    }
    yield {
      line: 5,
      captionKey: 'end',
      params: { n },
      ops: output.length,
      vars: [['n', n]],
      states: doneUntil(n),
      output: [...output],
      result: output,
    }
  },
}

export const printPairs = {
  key: 'printPairs',
  counter: 'lines',
  inputs: [{ n: 2 }, { n: 3 }, { n: 4 }],
  items: (input) => zeroTo(input.n),
  code: `function printPairs(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      console.log(i, j)
    }
  }
}`,
  call: (input) => ['printPairs', [input.n]],
  *run({ n }) {
    const output = []
    yield {
      line: 1,
      captionKey: 'start',
      params: { n },
      ops: 0,
      vars: [['n', n]],
      output: [],
    }
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        output.push(i + ' ' + j)
        yield {
          line: 4,
          captionKey: 'print',
          params: { i, j },
          ops: output.length,
          vars: [
            ['i', i],
            ['j', j],
          ],
          pointers: [
            { index: i, label: 'i' },
            { index: j, label: 'j' },
          ],
          states: { [i]: 'active', [j]: 'found' },
          output: [...output],
        }
      }
    }
    yield {
      line: 7,
      captionKey: 'end',
      params: { n, lines: n * n },
      ops: output.length,
      vars: [['n', n]],
      output: [...output],
      result: output,
    }
  },
}
