// Space complexity: doubleArray builds a new array with one box per number,
// so the extra memory grows with n: O(n) space.

export const doubleArray = {
  key: 'doubleArray',
  counter: 'memoryBoxes',
  inputs: [{ numbers: [1, 2, 3] }, { numbers: [1, 2, 3, 4, 5, 6] }],
  items: (input) => input.numbers,
  code: `function doubleArray(numbers) {
  const doubled = []
  for (let i = 0; i < numbers.length; i++) {
    doubled.push(numbers[i] * 2)
  }
  return doubled
}`,
  call: (input) => ['doubleArray', [input.numbers]],
  *run({ numbers }) {
    const doubled = []
    const show = () => '[' + doubled.join(', ') + ']'
    yield {
      line: 2,
      captionKey: 'start',
      params: { n: numbers.length },
      ops: 0,
      vars: [['doubled', show()]],
    }
    for (let i = 0; i < numbers.length; i++) {
      doubled.push(numbers[i] * 2)
      yield {
        line: 4,
        captionKey: 'push',
        params: { value: numbers[i], doubled: numbers[i] * 2 },
        ops: doubled.length,
        vars: [
          ['i', i],
          ['doubled', show()],
        ],
        pointers: [{ index: i, label: 'i' }],
        states: Object.fromEntries(
          Array.from({ length: i + 1 }, (_, k) => [
            k,
            k === i ? 'active' : 'done',
          ]),
        ),
      }
    }
    yield {
      line: 6,
      captionKey: 'end',
      params: { n: numbers.length },
      ops: doubled.length,
      vars: [['doubled', show()]],
      result: doubled,
    }
  },
}
