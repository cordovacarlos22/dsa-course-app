// Space complexity: doubleOrders builds a new array with one box per order,
// so the extra memory grows with n: O(n) space.

export const doubleOrders = {
  key: 'doubleOrders',
  counter: 'memoryBoxes',
  inputs: [{ orders: [1, 2, 3] }, { orders: [1, 2, 3, 4, 5, 6] }],
  items: (input) => input.orders,
  code: `function doubleOrders(orders) {
  const doubled = []
  for (let i = 0; i < orders.length; i++) {
    doubled.push(orders[i] * 2)
  }
  return doubled
}`,
  call: (input) => ['doubleOrders', [input.orders]],
  *run({ orders }) {
    const doubled = []
    const show = () => '[' + doubled.join(', ') + ']'
    yield {
      line: 2,
      captionKey: 'start',
      params: { n: orders.length },
      ops: 0,
      vars: [['doubled', show()]],
    }
    for (let i = 0; i < orders.length; i++) {
      doubled.push(orders[i] * 2)
      yield {
        line: 4,
        captionKey: 'push',
        params: { value: orders[i], doubled: orders[i] * 2 },
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
      params: { n: orders.length },
      ops: doubled.length,
      vars: [['doubled', show()]],
      result: doubled,
    }
  },
}
