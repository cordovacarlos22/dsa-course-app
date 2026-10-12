// Adding up every number from 1 to n, two ways (the classic example of two
// correct solutions with very different growth):
// - with a loop: about 5 operations per number, so it grows with n;
// - with the formula n * (n + 1) / 2: always 3 operations, whatever n is.

const numbersUpTo = (n) => Array.from({ length: n }, (_, k) => k + 1)
const doneUntil = (count) =>
  Object.fromEntries(Array.from({ length: count }, (_, k) => [k, 'done']))

export const sumLoop = {
  key: 'sumLoop',
  counter: 'operations',
  inputs: [{ n: 3 }, { n: 6 }, { n: 10 }],
  items: (input) => numbersUpTo(input.n),
  code: `function sumUpTo(n) {
  let total = 0
  for (let i = 1; i <= n; i++) {
    total = total + i
  }
  return total
}`,
  call: (input) => ['sumUpTo', [input.n]],
  *run({ n }) {
    let ops = 0
    let total = 0
    const vars = (i) => [
      ['n', n],
      ['i', i],
      ['total', total],
    ]
    // Small inputs are traced line by line; bigger ones jump to the end so
    // the student can compare the totals.
    const detailed = n <= 6
    ops++ // let total = 0
    yield { line: 2, captionKey: 'init', params: {}, ops, vars: vars('—') }
    ops++ // let i = 1
    if (detailed) {
      yield { line: 3, captionKey: 'startLoop', params: {}, ops, vars: vars(1) }
    }
    for (let i = 1; i <= n; i++) {
      const pointers = [{ index: i - 1, label: 'i' }]
      const states = { ...doneUntil(i - 1), [i - 1]: 'active' }
      ops++ // i <= n
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
      ops += 2 // total + i, then save it in total
      total = total + i
      if (detailed) {
        yield {
          line: 4,
          captionKey: 'add',
          params: { i, total },
          ops,
          vars: vars(i),
          pointers,
          states,
        }
      }
      ops += 2 // i + 1, then save it in i
    }
    if (!detailed) {
      yield {
        line: 3,
        captionKey: 'fastForward',
        params: { n },
        ops,
        vars: vars(n + 1),
        states: doneUntil(n),
      }
    }
    yield {
      line: 6,
      captionKey: 'end',
      params: { n, total, ops },
      ops,
      vars: vars(n + 1),
      states: doneUntil(n),
      result: total,
    }
  },
}

export const sumFormula = {
  key: 'sumFormula',
  counter: 'operations',
  inputs: [{ n: 3 }, { n: 100 }, { n: 1000000 }],
  items: () => null,
  code: `function sumUpToFormula(n) {
  return n * (n + 1) / 2
}`,
  call: (input) => ['sumUpToFormula', [input.n]],
  *run({ n }) {
    const format = (value) => value.toLocaleString('en-US')
    const plusOne = n + 1
    const product = n * plusOne
    const result = product / 2
    yield {
      line: 1,
      captionKey: 'start',
      params: { n: format(n) },
      ops: 0,
      vars: [['n', format(n)]],
    }
    yield {
      line: 2,
      captionKey: 'plusOne',
      params: { n: format(n), value: format(plusOne) },
      ops: 1,
      vars: [
        ['n', format(n)],
        ['n + 1', format(plusOne)],
      ],
    }
    yield {
      line: 2,
      captionKey: 'times',
      params: { value: format(product) },
      ops: 2,
      vars: [
        ['n', format(n)],
        ['n * (n + 1)', format(product)],
      ],
    }
    yield {
      line: 2,
      captionKey: 'divide',
      params: { value: format(result) },
      ops: 3,
      vars: [
        ['n', format(n)],
        ['result', format(result)],
      ],
    }
    yield {
      line: 2,
      captionKey: 'end',
      params: { n: format(n), value: format(result) },
      ops: 3,
      vars: [
        ['n', format(n)],
        ['result', format(result)],
      ],
      result,
    }
  },
}
