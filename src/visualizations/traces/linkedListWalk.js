// Walking a linked list: a pointer called current starts at head and follows
// next until it reaches null. Every node is visited once, so it's O(n).
// The list is drawn with LinkedListDiagram (step.list) instead of boxes.

const INPUTS = [
  { values: ['Ana', 'Ben', 'Cleo'] },
  { values: ['Ana', 'Ben', 'Cleo', 'Dev', 'Eve'] },
  { values: [] },
]

// ['Ana', 'Ben'] → { value: 'Ana', next: { value: 'Ben', next: null } }
// (null for an empty list): the nested objects a real list is made of.
export function chainOf(values) {
  let head = null
  for (let i = values.length - 1; i >= 0; i--) {
    head = { value: values[i], next: head }
  }
  return head
}

// The diagram with current on the node at `index` (null once it walked off
// the end). Nodes before it are done.
function listAt(values, index) {
  const states = {}
  for (let k = 0; k < Math.min(index, values.length); k++) {
    states[values[k]] = 'done'
  }
  if (index < values.length) states[values[index]] = 'active'
  const head = values.length > 0 ? values[0] : null
  const current = index < values.length ? values[index] : null
  return { nodes: values, states, pointers: { head, current } }
}

export const linkedListWalk = {
  key: 'linkedListWalk',
  counter: 'nodes',
  inputs: INPUTS,
  items: () => null,
  code: `function greetLine(head) {
  let current = head
  while (current !== null) {
    console.log('Hi, ' + current.value + '!')
    current = current.next
  }
}`,
  call: (input) => ['greetLine', [chainOf(input.values)]],
  *run({ values }) {
    const output = []
    if (values.length === 0) {
      yield {
        line: 2,
        captionKey: 'startEmpty',
        ops: 0,
        vars: [['current', 'null']],
        list: listAt(values, 0),
        output: [...output],
      }
    } else {
      yield {
        line: 2,
        captionKey: 'start',
        params: { name: values[0] },
        ops: 0,
        vars: [['current', values[0]]],
        list: listAt(values, 0),
        output: [...output],
      }
    }
    for (let i = 0; i < values.length; i++) {
      output.push(`Hi, ${values[i]}!`)
      yield {
        line: 4,
        captionKey: 'greet',
        params: { name: values[i] },
        ops: i + 1,
        vars: [['current', values[i]]],
        list: listAt(values, i),
        output: [...output],
      }
      const isLast = i === values.length - 1
      yield {
        line: 5,
        captionKey: isLast ? 'moveToNull' : 'move',
        params: { name: isLast ? values[i] : values[i + 1] },
        ops: i + 1,
        vars: [['current', isLast ? 'null' : values[i + 1]]],
        list: listAt(values, i + 1),
        output: [...output],
      }
    }
    yield {
      line: 3,
      captionKey: 'stop',
      params: { count: values.length },
      ops: values.length,
      vars: [['current', 'null']],
      list: listAt(values, values.length),
      output: [...output],
    }
  },
}
