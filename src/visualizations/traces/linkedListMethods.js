// The LinkedList methods from the method lessons, played line by line:
// push, pop, unshift and shift. Each trace runs the method on a small model
// of the list (plain { value, next } nodes), and every step draws that model
// with LinkedListDiagram, so the picture always matches what the code did.
// (The diagram shows length, so it isn't repeated in the variables.)
//
// `method: true`: the code is one method of LinkedList. traces.test.js puts
// it inside a LinkedList class (with Node) and checks it with play().

import { chainOf } from './linkedListWalk'

// A list model: head, tail and length, like a real LinkedList.
export function listOf(values) {
  const head = chainOf(values)
  let tail = head
  while (tail !== null && tail.next !== null) tail = tail.next
  return { head, tail, length: values.length }
}

// Draws the model. `extra` are pointers like current and nodeToAdd (label →
// node or null). Nodes that can't be reached from head but that something
// still points to are drawn as "not in the line".
export function diagramOf(list, extra = {}, states = {}) {
  const nodes = []
  const inLine = new Set()
  for (let node = list.head; node !== null; node = node.next) {
    nodes.push(node.value)
    inLine.add(node)
  }
  const pointers = {
    head: list.head ? list.head.value : null,
    tail: list.tail ? list.tail.value : null,
  }
  const loose = []
  for (const [label, node] of Object.entries(extra)) {
    pointers[label] = node ? node.value : null
  }
  for (const node of [list.tail, ...Object.values(extra)]) {
    if (node && !inLine.has(node) && !loose.includes(node)) loose.push(node)
  }
  const detached = loose.map((node) => ({
    value: node.value,
    next: node.next ? node.next.value : null,
    state: states[node.value],
  }))
  return { nodes, states, pointers, detached, length: list.length }
}

// What the method left behind, as plain data the test can compare.
export function resultOf(list, returned) {
  const copy = (value) =>
    value === undefined ? undefined : JSON.parse(JSON.stringify(value))
  return {
    head: copy(list.head),
    tail: copy(list.tail),
    length: list.length,
    returned: returned === list ? 'this' : copy(returned),
  }
}

// For the test: a real LinkedList holding `values`, then the method call.
export function realList(LinkedList, values) {
  const list = new LinkedList()
  const model = listOf(values)
  list.head = model.head
  list.tail = model.tail
  list.length = model.length
  return list
}

const quoted = (value) => `'${value}'`

const ADD_INPUTS = (value) => [
  { values: ['Ana', 'Ben', 'Cleo'], value },
  { values: ['Ana'], value },
  { values: [], value },
]
const REMOVE_INPUTS = [
  { values: ['Ana', 'Ben', 'Cleo', 'Dev'] },
  { values: ['Ana'] },
  { values: [] },
]

export const linkedListPush = {
  key: 'linkedListPush',
  counter: null,
  inputs: ADD_INPUTS('Dev'),
  items: () => null,
  method: true,
  code: `push(value) {
  const nodeToAdd = new Node(value)
  if (!this.head) {
    this.head = nodeToAdd
    this.tail = nodeToAdd
  } else {
    this.tail.next = nodeToAdd
    this.tail = nodeToAdd
  }
  this.length++
  return this
}`,
  play: (LinkedList, { values, value }) => {
    const list = realList(LinkedList, values)
    return resultOf(list, list.push(value))
  },
  *run({ values, value }) {
    const list = listOf(values)
    const nodeToAdd = { value, next: null }
    const isNew = { [value]: 'new' }
    const vars = () => [['value', quoted(value)]]
    const params = {
      value,
      tail: list.tail ? list.tail.value : null,
      length: list.length + 1,
    }
    yield {
      line: 2,
      captionKey: 'nodeToAdd',
      params,
      vars: vars(),
      list: diagramOf(list, { nodeToAdd }, isNew),
    }
    if (!list.head) {
      yield {
        line: 3,
        captionKey: 'empty',
        params,
        vars: vars(),
        list: diagramOf(list, { nodeToAdd }, isNew),
      }
      list.head = nodeToAdd
      yield {
        line: 4,
        captionKey: 'emptyHead',
        params,
        vars: vars(),
        list: diagramOf(list, { nodeToAdd }, isNew),
      }
      list.tail = nodeToAdd
      yield {
        line: 5,
        captionKey: 'emptyTail',
        params,
        vars: vars(),
        list: diagramOf(list, { nodeToAdd }, isNew),
      }
    } else {
      yield {
        line: 3,
        captionKey: 'notEmpty',
        params: { ...params, head: list.head.value },
        vars: vars(),
        list: diagramOf(list, { nodeToAdd }, isNew),
      }
      list.tail.next = nodeToAdd
      yield {
        line: 7,
        captionKey: 'link',
        params,
        vars: vars(),
        list: diagramOf(list, { nodeToAdd }, isNew),
      }
      list.tail = nodeToAdd
      yield {
        line: 8,
        captionKey: 'moveTail',
        params,
        vars: vars(),
        list: diagramOf(list, { nodeToAdd }, isNew),
      }
    }
    list.length++
    yield {
      line: 10,
      captionKey: 'length',
      params,
      vars: vars(),
      list: diagramOf(list, {}, isNew),
    }
    yield {
      line: 11,
      captionKey: 'return',
      params,
      vars: vars(),
      list: diagramOf(list),
      result: resultOf(list, list),
    }
  },
}

export const linkedListUnshift = {
  key: 'linkedListUnshift',
  counter: null,
  inputs: ADD_INPUTS('Zoe'),
  items: () => null,
  method: true,
  code: `unshift(value) {
  const nodeToAdd = new Node(value)
  if (!this.head) {
    this.head = nodeToAdd
    this.tail = nodeToAdd
  } else {
    nodeToAdd.next = this.head
    this.head = nodeToAdd
  }
  this.length++
  return this
}`,
  play: (LinkedList, { values, value }) => {
    const list = realList(LinkedList, values)
    return resultOf(list, list.unshift(value))
  },
  *run({ values, value }) {
    const list = listOf(values)
    const nodeToAdd = { value, next: null }
    const isNew = { [value]: 'new' }
    const vars = () => [['value', quoted(value)]]
    const params = {
      value,
      head: list.head ? list.head.value : null,
      length: list.length + 1,
    }
    yield {
      line: 2,
      captionKey: 'nodeToAdd',
      params,
      vars: vars(),
      list: diagramOf(list, { nodeToAdd }, isNew),
    }
    if (!list.head) {
      yield {
        line: 3,
        captionKey: 'empty',
        params,
        vars: vars(),
        list: diagramOf(list, { nodeToAdd }, isNew),
      }
      list.head = nodeToAdd
      yield {
        line: 4,
        captionKey: 'emptyHead',
        params,
        vars: vars(),
        list: diagramOf(list, { nodeToAdd }, isNew),
      }
      list.tail = nodeToAdd
      yield {
        line: 5,
        captionKey: 'emptyTail',
        params,
        vars: vars(),
        list: diagramOf(list, { nodeToAdd }, isNew),
      }
    } else {
      yield {
        line: 3,
        captionKey: 'notEmpty',
        params,
        vars: vars(),
        list: diagramOf(list, { nodeToAdd }, isNew),
      }
      nodeToAdd.next = list.head
      yield {
        line: 7,
        captionKey: 'link',
        params,
        vars: vars(),
        list: diagramOf(list, { nodeToAdd }, isNew),
      }
      list.head = nodeToAdd
      yield {
        line: 8,
        captionKey: 'moveHead',
        params,
        vars: vars(),
        list: diagramOf(list, { nodeToAdd }, isNew),
      }
    }
    list.length++
    yield {
      line: 10,
      captionKey: 'length',
      params,
      vars: vars(),
      list: diagramOf(list, {}, isNew),
    }
    yield {
      line: 11,
      captionKey: 'return',
      params,
      vars: vars(),
      list: diagramOf(list),
      result: resultOf(list, list),
    }
  },
}

export const linkedListPop = {
  key: 'linkedListPop',
  counter: 'nodes',
  inputs: REMOVE_INPUTS,
  items: () => null,
  method: true,
  code: `pop() {
  if (!this.head) {
    return undefined
  }
  let current = this.head
  let previous = this.head
  while (current.next !== null) {
    previous = current
    current = current.next
  }
  this.tail = previous
  this.tail.next = null
  this.length--
  if (this.length === 0) {
    this.head = null
    this.tail = null
  }
  return current
}`,
  play: (LinkedList, { values }) => {
    const list = realList(LinkedList, values)
    return resultOf(list, list.pop())
  },
  *run({ values }) {
    const list = listOf(values)
    const vars = (current, previous) => [
      ['current', current ? current.value : '-'],
      ['previous', previous ? previous.value : '-'],
    ]
    if (!list.head) {
      yield {
        line: 2,
        captionKey: 'empty',
        ops: 0,
        vars: vars(null, null),
        list: diagramOf(list),
      }
      yield {
        line: 3,
        captionKey: 'returnUndefined',
        ops: 0,
        vars: vars(null, null),
        list: diagramOf(list),
        result: resultOf(list, undefined),
      }
      return
    }
    yield {
      line: 2,
      captionKey: 'notEmpty',
      params: { name: list.head.value },
      ops: 0,
      vars: vars(null, null),
      list: diagramOf(list),
    }
    let current = list.head
    let previous = list.head
    let visited = 1
    const walking = () => {
      const states = {}
      for (let node = list.head; node !== current; node = node.next) {
        states[node.value] = 'done'
      }
      states[current.value] = 'active'
      return diagramOf(list, { current, previous }, states)
    }
    yield {
      line: 6,
      captionKey: 'start',
      params: { name: current.value },
      ops: visited,
      vars: vars(current, previous),
      list: walking(),
    }
    while (current.next !== null) {
      previous = current
      yield {
        line: 8,
        captionKey: 'movePre',
        params: { name: current.value, next: current.next.value },
        ops: visited,
        vars: vars(current, previous),
        list: walking(),
      }
      current = current.next
      visited++
      yield {
        line: 9,
        captionKey: 'moveTemp',
        params: { name: current.value },
        ops: visited,
        vars: vars(current, previous),
        list: walking(),
      }
    }
    yield {
      line: 7,
      captionKey: values.length === 1 ? 'loopSkipped' : 'loopEnds',
      params: { name: current.value, previous: previous.value },
      ops: visited,
      vars: vars(current, previous),
      list: walking(),
    }
    const gone = { [current.value]: 'removed' }
    list.tail = previous
    yield {
      line: 11,
      captionKey: values.length === 1 ? 'tailSame' : 'moveTail',
      params: { name: previous.value },
      ops: visited,
      vars: vars(current, previous),
      list: diagramOf(list, { current, previous }),
    }
    list.tail.next = null
    yield {
      line: 12,
      captionKey: values.length === 1 ? 'cutNothing' : 'cut',
      params: { name: current.value },
      ops: visited,
      vars: vars(current, previous),
      list: diagramOf(list, { current }, values.length === 1 ? {} : gone),
    }
    list.length--
    yield {
      line: 13,
      captionKey: 'length',
      params: { length: list.length },
      ops: visited,
      vars: vars(current, previous),
      list: diagramOf(list, { current }, values.length === 1 ? {} : gone),
    }
    if (list.length === 0) {
      yield {
        line: 14,
        captionKey: 'nowEmpty',
        ops: visited,
        vars: vars(current, previous),
        list: diagramOf(list, { current }),
      }
      list.head = null
      yield {
        line: 15,
        captionKey: 'headNull',
        ops: visited,
        vars: vars(current, previous),
        list: diagramOf(list, { current }, gone),
      }
      list.tail = null
      yield {
        line: 16,
        captionKey: 'tailNull',
        ops: visited,
        vars: vars(current, previous),
        list: diagramOf(list, { current }, gone),
      }
    } else {
      yield {
        line: 14,
        captionKey: 'notZero',
        params: { length: list.length },
        ops: visited,
        vars: vars(current, previous),
        list: diagramOf(list, { current }, gone),
      }
    }
    yield {
      line: 18,
      captionKey: 'return',
      params: { name: current.value, count: visited },
      ops: visited,
      vars: vars(current, previous),
      list: diagramOf(list, { current }, gone),
      result: resultOf(list, current),
    }
  },
}

export const linkedListShift = {
  key: 'linkedListShift',
  counter: null,
  inputs: REMOVE_INPUTS,
  items: () => null,
  method: true,
  code: `shift() {
  if (!this.head) {
    return undefined
  }
  let oldHead = this.head
  this.head = this.head.next
  oldHead.next = null
  this.length--
  if (this.length === 0) {
    this.tail = null
  }
  return oldHead
}`,
  play: (LinkedList, { values }) => {
    const list = realList(LinkedList, values)
    return resultOf(list, list.shift())
  },
  *run({ values }) {
    const list = listOf(values)
    const vars = (oldHead) => [['oldHead', oldHead ? oldHead.value : '-']]
    if (!list.head) {
      yield {
        line: 2,
        captionKey: 'empty',
        vars: vars(null),
        list: diagramOf(list),
      }
      yield {
        line: 3,
        captionKey: 'returnUndefined',
        vars: vars(null),
        list: diagramOf(list),
        result: resultOf(list, undefined),
      }
      return
    }
    yield {
      line: 2,
      captionKey: 'notEmpty',
      params: { name: list.head.value },
      vars: vars(null),
      list: diagramOf(list),
    }
    const oldHead = list.head
    const gone = { [oldHead.value]: 'removed' }
    yield {
      line: 5,
      captionKey: 'oldHead',
      params: { name: oldHead.value },
      vars: vars(oldHead),
      list: diagramOf(list, { oldHead }, { [oldHead.value]: 'active' }),
    }
    list.head = list.head.next
    yield {
      line: 6,
      captionKey: list.head ? 'moveHead' : 'headNull',
      params: { name: oldHead.value, next: list.head ? list.head.value : null },
      vars: vars(oldHead),
      list: diagramOf(list, { oldHead }, gone),
    }
    oldHead.next = null
    yield {
      line: 7,
      captionKey: values.length === 1 ? 'cutNothing' : 'cut',
      params: { name: oldHead.value },
      vars: vars(oldHead),
      list: diagramOf(list, { oldHead }, gone),
    }
    list.length--
    yield {
      line: 8,
      captionKey: 'length',
      params: { length: list.length },
      vars: vars(oldHead),
      list: diagramOf(list, { oldHead }, gone),
    }
    if (list.length === 0) {
      list.tail = null
      yield {
        line: 10,
        captionKey: 'tailNull',
        params: { name: oldHead.value },
        vars: vars(oldHead),
        list: diagramOf(list, { oldHead }, gone),
      }
    } else {
      yield {
        line: 9,
        captionKey: 'notZero',
        params: { length: list.length },
        vars: vars(oldHead),
        list: diagramOf(list, { oldHead }, gone),
      }
    }
    yield {
      line: 12,
      captionKey: 'return',
      params: { name: oldHead.value },
      vars: vars(oldHead),
      list: diagramOf(list, { oldHead }, gone),
      result: resultOf(list, oldHead),
    }
  },
}
