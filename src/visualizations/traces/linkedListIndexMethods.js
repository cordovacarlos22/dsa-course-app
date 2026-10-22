// get, set, insert, remove and reverse, played line by line on a small list
// model, like the traces in ./linkedListMethods.js. Methods that call other
// methods (set calls get; insert calls get, push and unshift; remove calls
// get, shift and pop) list them in `uses`, so traces.test.js can put them
// in the same class when it runs the code for real.

import { diagramOf, listOf, realList, resultOf } from './linkedListMethods'

const LINE = ['Ana', 'Ben', 'Cleo', 'Dev']

// The node at `index` in the model (no range check: callers check first).
function nodeAt(list, index) {
  let current = list.head
  for (let i = 0; i < index; i++) current = current.next
  return current
}

// The nodes before `node`, as 'done' states for a walk.
function walkStates(list, node, state = 'active') {
  const states = {}
  for (let current = list.head; current !== node; current = current.next) {
    states[current.value] = 'done'
  }
  states[node.value] = state
  return states
}

export const linkedListGet = {
  key: 'linkedListGet',
  counter: 'nodes',
  inputs: [
    { label: 'get(2)', values: LINE, index: 2 },
    { label: 'get(0)', values: LINE, index: 0 },
    { label: 'get(4)', values: LINE, index: 4 },
  ],
  items: () => null,
  method: true,
  code: `get(index) {
  if (index < 0 || index >= this.length) {
    return undefined
  }
  let current = this.head
  for (let i = 0; i < index; i++) {
    current = current.next
  }
  return current
}`,
  play: (LinkedList, { values, index }) => {
    const list = realList(LinkedList, values)
    return resultOf(list, list.get(index))
  },
  *run({ values, index }) {
    const list = listOf(values)
    const params = { index, last: list.length - 1, length: list.length }
    if (index < 0 || index >= list.length) {
      yield {
        line: 2,
        captionKey: 'outOfRange',
        params,
        ops: 0,
        vars: [['index', index]],
        list: diagramOf(list),
      }
      yield {
        line: 3,
        captionKey: 'returnUndefined',
        params,
        ops: 0,
        vars: [['index', index]],
        list: diagramOf(list),
        result: resultOf(list, undefined),
      }
      return
    }
    yield {
      line: 2,
      captionKey: 'inRange',
      params,
      ops: 0,
      vars: [['index', index]],
      list: diagramOf(list),
    }
    let current = list.head
    yield {
      line: 5,
      captionKey: 'start',
      params: { name: current.value },
      ops: 1,
      vars: [['index', index]],
      list: diagramOf(list, { current }, walkStates(list, current)),
    }
    for (let i = 0; i < index; i++) {
      current = current.next
      yield {
        line: 7,
        captionKey: 'move',
        params: { name: current.value, at: i + 1 },
        ops: i + 2,
        vars: [
          ['index', index],
          ['i', i],
        ],
        list: diagramOf(list, { current }, walkStates(list, current)),
      }
    }
    yield {
      line: 9,
      captionKey: 'return',
      params: { name: current.value, index, count: index + 1 },
      ops: index + 1,
      vars: [['index', index]],
      list: diagramOf(list, { current }, walkStates(list, current, 'found')),
      result: resultOf(list, current),
    }
  },
}

export const linkedListSet = {
  key: 'linkedListSet',
  counter: null,
  inputs: [
    { label: "set(1, 'Benny')", values: LINE, index: 1, value: 'Benny' },
    { label: "set(9, 'Zoe')", values: LINE, index: 9, value: 'Zoe' },
  ],
  items: () => null,
  method: true,
  uses: ['trace-ll-get'],
  code: `set(index, value) {
  const target = this.get(index)
  if (target) {
    target.value = value
    return true
  }
  return false
}`,
  play: (LinkedList, { values, index, value }) => {
    const list = realList(LinkedList, values)
    return resultOf(list, list.set(index, value))
  },
  *run({ values, index, value }) {
    const list = listOf(values)
    const vars = [
      ['index', index],
      ['value', `'${value}'`],
    ]
    if (index < 0 || index >= list.length) {
      yield {
        line: 2,
        captionKey: 'gotUndefined',
        params: { index },
        vars,
        list: diagramOf(list),
      }
      yield {
        line: 3,
        captionKey: 'notNode',
        vars,
        list: diagramOf(list),
      }
      yield {
        line: 7,
        captionKey: 'returnFalse',
        vars,
        list: diagramOf(list),
        result: resultOf(list, false),
      }
      return
    }
    const target = nodeAt(list, index)
    const old = target.value
    yield {
      line: 2,
      captionKey: 'gotNode',
      params: { index, name: old },
      vars,
      list: diagramOf(list, { target }, { [old]: 'active' }),
    }
    yield {
      line: 3,
      captionKey: 'isNode',
      params: { name: old },
      vars,
      list: diagramOf(list, { target }, { [old]: 'active' }),
    }
    target.value = value
    yield {
      line: 4,
      captionKey: 'change',
      params: { old, value },
      vars,
      list: diagramOf(list, { target }, { [value]: 'moved' }),
    }
    yield {
      line: 5,
      captionKey: 'returnTrue',
      vars,
      list: diagramOf(list),
      result: resultOf(list, true),
    }
  },
}

export const linkedListInsert = {
  key: 'linkedListInsert',
  counter: null,
  inputs: [
    { label: "insert(2, 'Eve')", values: LINE, index: 2, value: 'Eve' },
    { label: "insert(0, 'Zoe')", values: LINE, index: 0, value: 'Zoe' },
    { label: "insert(7, 'Eve')", values: LINE, index: 7, value: 'Eve' },
  ],
  items: () => null,
  method: true,
  uses: ['trace-ll-get', 'trace-ll-push', 'trace-ll-unshift'],
  code: `insert(index, value) {
  if (index < 0 || index > this.length) {
    return false
  }
  if (index === 0) {
    this.unshift(value)
    return true
  }
  if (index === this.length) {
    this.push(value)
    return true
  }
  const nodeToAdd = new Node(value)
  const nodeBefore = this.get(index - 1)
  nodeToAdd.next = nodeBefore.next
  nodeBefore.next = nodeToAdd
  this.length++
  return true
}`,
  play: (LinkedList, { values, index, value }) => {
    const list = realList(LinkedList, values)
    return resultOf(list, list.insert(index, value))
  },
  *run({ values, index, value }) {
    const list = listOf(values)
    const vars = [
      ['index', index],
      ['value', `'${value}'`],
    ]
    const params = { index, value, length: list.length }
    if (index < 0 || index > list.length) {
      yield {
        line: 2,
        captionKey: 'outOfRange',
        params,
        vars,
        list: diagramOf(list),
      }
      yield {
        line: 3,
        captionKey: 'returnFalse',
        params,
        vars,
        list: diagramOf(list),
        result: resultOf(list, false),
      }
      return
    }
    yield {
      line: 2,
      captionKey: 'inRange',
      params,
      vars,
      list: diagramOf(list),
    }
    const isNew = { [value]: 'new' }
    if (index === 0) {
      yield {
        line: 5,
        captionKey: 'isZero',
        params,
        vars,
        list: diagramOf(list),
      }
      list.head = { value, next: list.head }
      if (list.tail === null) list.tail = list.head
      list.length++
      yield {
        line: 6,
        captionKey: 'unshift',
        params,
        vars,
        list: diagramOf(list, {}, isNew),
      }
      yield {
        line: 7,
        captionKey: 'returnTrue',
        params,
        vars,
        list: diagramOf(list),
        result: resultOf(list, true),
      }
      return
    }
    if (index === list.length) {
      yield {
        line: 9,
        captionKey: 'isEnd',
        params,
        vars,
        list: diagramOf(list),
      }
      const nodeToAdd = { value, next: null }
      list.tail.next = nodeToAdd
      list.tail = nodeToAdd
      list.length++
      yield {
        line: 10,
        captionKey: 'push',
        params,
        vars,
        list: diagramOf(list, {}, isNew),
      }
      yield {
        line: 11,
        captionKey: 'returnTrue',
        params,
        vars,
        list: diagramOf(list),
        result: resultOf(list, true),
      }
      return
    }
    yield { line: 9, captionKey: 'middle', params, vars, list: diagramOf(list) }
    const nodeToAdd = { value, next: null }
    yield {
      line: 13,
      captionKey: 'nodeToAdd',
      params,
      vars,
      list: diagramOf(list, { nodeToAdd }, isNew),
    }
    const nodeBefore = nodeAt(list, index - 1)
    const beforeParams = {
      ...params,
      name: nodeBefore.value,
      beforeIndex: index - 1,
    }
    yield {
      line: 14,
      captionKey: 'findNodeBefore',
      params: beforeParams,
      vars,
      list: diagramOf(
        list,
        { nodeBefore, nodeToAdd },
        { ...isNew, [nodeBefore.value]: 'active' },
      ),
    }
    nodeToAdd.next = nodeBefore.next
    yield {
      line: 15,
      captionKey: 'linkNew',
      params: { ...beforeParams, next: nodeBefore.next.value },
      vars,
      list: diagramOf(
        list,
        { nodeBefore, nodeToAdd },
        { ...isNew, [nodeBefore.value]: 'active' },
      ),
    }
    nodeBefore.next = nodeToAdd
    yield {
      line: 16,
      captionKey: 'linkBefore',
      params: beforeParams,
      vars,
      list: diagramOf(list, { nodeBefore, nodeToAdd }, isNew),
    }
    list.length++
    yield {
      line: 17,
      captionKey: 'length',
      params: { length: list.length },
      vars,
      list: diagramOf(list, {}, isNew),
    }
    yield {
      line: 18,
      captionKey: 'returnTrue',
      params,
      vars,
      list: diagramOf(list),
      result: resultOf(list, true),
    }
  },
}

export const linkedListRemove = {
  key: 'linkedListRemove',
  counter: null,
  inputs: [
    { label: 'remove(2)', values: LINE, index: 2 },
    { label: 'remove(0)', values: LINE, index: 0 },
    { label: 'remove(9)', values: LINE, index: 9 },
  ],
  items: () => null,
  method: true,
  uses: ['trace-ll-get', 'trace-ll-shift', 'trace-ll-pop'],
  code: `remove(index) {
  if (index < 0 || index >= this.length) {
    return undefined
  }
  if (index === 0) {
    return this.shift()
  }
  if (index === this.length - 1) {
    return this.pop()
  }
  const nodeBefore = this.get(index - 1)
  const removed = nodeBefore.next
  nodeBefore.next = removed.next
  removed.next = null
  this.length--
  return removed
}`,
  play: (LinkedList, { values, index }) => {
    const list = realList(LinkedList, values)
    return resultOf(list, list.remove(index))
  },
  *run({ values, index }) {
    const list = listOf(values)
    const vars = [['index', index]]
    const params = { index, last: list.length - 1, length: list.length }
    if (index < 0 || index >= list.length) {
      yield {
        line: 2,
        captionKey: 'outOfRange',
        params,
        vars,
        list: diagramOf(list),
      }
      yield {
        line: 3,
        captionKey: 'returnUndefined',
        params,
        vars,
        list: diagramOf(list),
        result: resultOf(list, undefined),
      }
      return
    }
    yield {
      line: 2,
      captionKey: 'inRange',
      params,
      vars,
      list: diagramOf(list),
    }
    if (index === 0) {
      yield {
        line: 5,
        captionKey: 'isZero',
        params,
        vars,
        list: diagramOf(list),
      }
      const removed = list.head
      list.head = removed.next
      removed.next = null
      list.length--
      if (list.length === 0) list.tail = null
      yield {
        line: 6,
        captionKey: 'shift',
        params: { name: removed.value },
        vars,
        list: diagramOf(list, { removed }, { [removed.value]: 'removed' }),
        result: resultOf(list, removed),
      }
      return
    }
    if (index === list.length - 1) {
      yield {
        line: 8,
        captionKey: 'isLast',
        params,
        vars,
        list: diagramOf(list),
      }
      const removed = list.tail
      const previous = nodeAt(list, index - 1)
      list.tail = previous
      previous.next = null
      list.length--
      yield {
        line: 9,
        captionKey: 'pop',
        params: { name: removed.value },
        vars,
        list: diagramOf(list, { removed }, { [removed.value]: 'removed' }),
        result: resultOf(list, removed),
      }
      return
    }
    yield { line: 8, captionKey: 'middle', params, vars, list: diagramOf(list) }
    const nodeBefore = nodeAt(list, index - 1)
    yield {
      line: 11,
      captionKey: 'nodeBefore',
      params: { name: nodeBefore.value, nodeBefore: index - 1 },
      vars,
      list: diagramOf(list, { nodeBefore }, { [nodeBefore.value]: 'active' }),
    }
    const removed = nodeBefore.next
    const names = {
      name: removed.value,
      nodeBefore: nodeBefore.value,
      next: removed.next.value,
    }
    yield {
      line: 12,
      captionKey: 'removed',
      params: names,
      vars,
      list: diagramOf(
        list,
        { nodeBefore, removed },
        { [nodeBefore.value]: 'active', [removed.value]: 'moved' },
      ),
    }
    nodeBefore.next = removed.next
    const gone = { [removed.value]: 'removed' }
    yield {
      line: 13,
      captionKey: 'skip',
      params: names,
      vars,
      list: diagramOf(list, { nodeBefore, removed }, gone),
    }
    removed.next = null
    yield {
      line: 14,
      captionKey: 'cut',
      params: names,
      vars,
      list: diagramOf(list, { removed }, gone),
    }
    list.length--
    yield {
      line: 15,
      captionKey: 'length',
      params: { length: list.length },
      vars,
      list: diagramOf(list, { removed }, gone),
    }
    yield {
      line: 16,
      captionKey: 'return',
      params: names,
      vars,
      list: diagramOf(list, { removed }, gone),
      result: resultOf(list, removed),
    }
  },
}

// Reverse draws every node where it started (nextOf), with head, tail,
// current, previous and nextNode on top of them.
function reverseDiagram(nodes, list, pointers, states = {}) {
  const nextOf = {}
  for (let i = 0; i < nodes.length; i++) {
    nextOf[nodes[i].value] = nodes[i].next ? nodes[i].next.value : null
  }
  const named = {
    head: list.head ? list.head.value : null,
    tail: list.tail ? list.tail.value : null,
  }
  for (const [label, node] of Object.entries(pointers)) {
    named[label] = node ? node.value : null
  }
  return {
    nodes: nodes.map((node) => node.value),
    nextOf,
    states,
    pointers: named,
    leftNull: ['previous'],
    length: list.length,
  }
}

export const linkedListReverse = {
  key: 'linkedListReverse',
  counter: null,
  inputs: [
    { values: ['Ana', 'Ben', 'Cleo', 'Dev'] },
    { values: ['Ana'] },
    { values: [] },
  ],
  items: () => null,
  method: true,
  code: `reverse() {
  let current = this.head
  this.head = this.tail
  this.tail = current
  let previous = null
  let nextNode = null
  for (let i = 0; i < this.length; i++) {
    nextNode = current.next
    current.next = previous
    previous = current
    current = nextNode
  }
  return this
}`,
  play: (LinkedList, { values }) => {
    const list = realList(LinkedList, values)
    return resultOf(list, list.reverse())
  },
  *run({ values }) {
    const list = listOf(values)
    const nodes = []
    for (let node = list.head; node !== null; node = node.next) nodes.push(node)
    const name = (node) => (node ? node.value : null)
    let current = list.head
    let previous = null
    let nextNode = null
    const draw = (states = {}) =>
      reverseDiagram(nodes, list, { current, previous, nextNode }, states)
    yield {
      line: 2,
      captionKey: values.length === 0 ? 'tempEmpty' : 'current',
      params: { name: name(current) },
      list: reverseDiagram(nodes, list, { current }),
    }
    const isEmpty = values.length === 0
    list.head = list.tail
    yield {
      line: 3,
      captionKey: isEmpty ? 'headEmpty' : 'head',
      params: { name: name(list.head) },
      list: reverseDiagram(nodes, list, { current }),
    }
    list.tail = current
    yield {
      line: 4,
      captionKey: isEmpty ? 'tailEmpty' : 'tail',
      params: { name: name(list.tail) },
      list: reverseDiagram(nodes, list, { current }),
    }
    yield { line: 6, captionKey: 'vars', list: draw() }
    for (let i = 0; i < values.length; i++) {
      nextNode = current.next
      yield {
        line: 8,
        captionKey: nextNode ? 'remember' : 'rememberLast',
        params: { name: current.value, next: name(nextNode) },
        list: draw({ [current.value]: 'active' }),
      }
      current.next = previous
      yield {
        line: 9,
        captionKey: previous ? 'flip' : 'flipFirst',
        params: { name: current.value, previous: name(previous) },
        list: draw({ [current.value]: 'moved' }),
      }
      previous = current
      current = nextNode
      yield {
        line: 11,
        captionKey: current ? 'step' : 'stepLast',
        params: { previous: previous.value, current: name(current) },
        list: draw(),
      }
    }
    yield {
      line: 13,
      captionKey: isEmpty ? 'returnEmpty' : 'return',
      params: { count: values.length },
      list: draw(),
      result: resultOf(list, list),
    }
  },
}
