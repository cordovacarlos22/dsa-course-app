// get, set, insert, remove and reverse, played line by line on a small list
// model, like the traces in ./linkedListMethods.js. Methods that call other
// methods (set calls get; insert calls get, push and unshift; remove calls
// get, shift and pop) list them in `uses`, so traces.test.js can put them
// in the same class when it runs the code for real.

import { diagramOf, listOf, realList, resultOf } from './linkedListMethods'

const LINE = ['Ana', 'Ben', 'Cleo', 'Dev']

// The node at `index` in the model (no range check: callers check first).
function nodeAt(list, index) {
  let temp = list.head
  for (let i = 0; i < index; i++) temp = temp.next
  return temp
}

// The nodes before `node`, as 'done' states for a walk.
function walkStates(list, node, state = 'active') {
  const states = {}
  for (let temp = list.head; temp !== node; temp = temp.next) {
    states[temp.value] = 'done'
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
  let temp = this.head
  for (let i = 0; i < index; i++) {
    temp = temp.next
  }
  return temp
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
    let temp = list.head
    yield {
      line: 5,
      captionKey: 'start',
      params: { name: temp.value },
      ops: 1,
      vars: [['index', index]],
      list: diagramOf(list, { temp }, walkStates(list, temp)),
    }
    for (let i = 0; i < index; i++) {
      temp = temp.next
      yield {
        line: 7,
        captionKey: 'move',
        params: { name: temp.value, at: i + 1 },
        ops: i + 2,
        vars: [
          ['index', index],
          ['i', i],
        ],
        list: diagramOf(list, { temp }, walkStates(list, temp)),
      }
    }
    yield {
      line: 9,
      captionKey: 'return',
      params: { name: temp.value, index, count: index + 1 },
      ops: index + 1,
      vars: [['index', index]],
      list: diagramOf(list, { temp }, walkStates(list, temp, 'found')),
      result: resultOf(list, temp),
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
  const temp = this.get(index)
  if (temp) {
    temp.value = value
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
    const temp = nodeAt(list, index)
    const old = temp.value
    yield {
      line: 2,
      captionKey: 'gotNode',
      params: { index, name: old },
      vars,
      list: diagramOf(list, { temp }, { [old]: 'active' }),
    }
    yield {
      line: 3,
      captionKey: 'isNode',
      params: { name: old },
      vars,
      list: diagramOf(list, { temp }, { [old]: 'active' }),
    }
    temp.value = value
    yield {
      line: 4,
      captionKey: 'change',
      params: { old, value },
      vars,
      list: diagramOf(list, { temp }, { [value]: 'moved' }),
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
  const newNode = new Node(value)
  const temp = this.get(index - 1)
  newNode.next = temp.next
  temp.next = newNode
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
      const newNode = { value, next: null }
      list.tail.next = newNode
      list.tail = newNode
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
    const newNode = { value, next: null }
    yield {
      line: 13,
      captionKey: 'newNode',
      params,
      vars,
      list: diagramOf(list, { newNode }, isNew),
    }
    const temp = nodeAt(list, index - 1)
    const before = { ...params, name: temp.value, before: index - 1 }
    yield {
      line: 14,
      captionKey: 'before',
      params: before,
      vars,
      list: diagramOf(
        list,
        { temp, newNode },
        { ...isNew, [temp.value]: 'active' },
      ),
    }
    newNode.next = temp.next
    yield {
      line: 15,
      captionKey: 'linkNew',
      params: { ...before, next: temp.next.value },
      vars,
      list: diagramOf(
        list,
        { temp, newNode },
        { ...isNew, [temp.value]: 'active' },
      ),
    }
    temp.next = newNode
    yield {
      line: 16,
      captionKey: 'linkBefore',
      params: before,
      vars,
      list: diagramOf(list, { temp, newNode }, isNew),
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
  const before = this.get(index - 1)
  const temp = before.next
  before.next = temp.next
  temp.next = null
  this.length--
  return temp
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
      const temp = list.head
      list.head = temp.next
      temp.next = null
      list.length--
      if (list.length === 0) list.tail = null
      yield {
        line: 6,
        captionKey: 'shift',
        params: { name: temp.value },
        vars,
        list: diagramOf(list, { temp }, { [temp.value]: 'removed' }),
        result: resultOf(list, temp),
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
      const temp = list.tail
      const pre = nodeAt(list, index - 1)
      list.tail = pre
      pre.next = null
      list.length--
      yield {
        line: 9,
        captionKey: 'pop',
        params: { name: temp.value },
        vars,
        list: diagramOf(list, { temp }, { [temp.value]: 'removed' }),
        result: resultOf(list, temp),
      }
      return
    }
    yield { line: 8, captionKey: 'middle', params, vars, list: diagramOf(list) }
    const before = nodeAt(list, index - 1)
    yield {
      line: 11,
      captionKey: 'before',
      params: { name: before.value, before: index - 1 },
      vars,
      list: diagramOf(list, { before }, { [before.value]: 'active' }),
    }
    const temp = before.next
    const names = {
      name: temp.value,
      before: before.value,
      next: temp.next.value,
    }
    yield {
      line: 12,
      captionKey: 'temp',
      params: names,
      vars,
      list: diagramOf(
        list,
        { before, temp },
        { [before.value]: 'active', [temp.value]: 'moved' },
      ),
    }
    before.next = temp.next
    const gone = { [temp.value]: 'removed' }
    yield {
      line: 13,
      captionKey: 'skip',
      params: names,
      vars,
      list: diagramOf(list, { before, temp }, gone),
    }
    temp.next = null
    yield {
      line: 14,
      captionKey: 'cut',
      params: names,
      vars,
      list: diagramOf(list, { temp }, gone),
    }
    list.length--
    yield {
      line: 15,
      captionKey: 'length',
      params: { length: list.length },
      vars,
      list: diagramOf(list, { temp }, gone),
    }
    yield {
      line: 16,
      captionKey: 'return',
      params: names,
      vars,
      list: diagramOf(list, { temp }, gone),
      result: resultOf(list, temp),
    }
  },
}

// Reverse draws every node where it started (nextOf), with head, tail,
// temp, prev and next on top of them.
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
    leftNull: ['prev'],
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
  let temp = this.head
  this.head = this.tail
  this.tail = temp
  let prev = null
  let next = null
  for (let i = 0; i < this.length; i++) {
    next = temp.next
    temp.next = prev
    prev = temp
    temp = next
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
    let temp = list.head
    let prev = null
    let next = null
    const draw = (states = {}) =>
      reverseDiagram(nodes, list, { temp, prev, next }, states)
    yield {
      line: 2,
      captionKey: values.length === 0 ? 'tempEmpty' : 'temp',
      params: { name: name(temp) },
      list: reverseDiagram(nodes, list, { temp }),
    }
    const isEmpty = values.length === 0
    list.head = list.tail
    yield {
      line: 3,
      captionKey: isEmpty ? 'headEmpty' : 'head',
      params: { name: name(list.head) },
      list: reverseDiagram(nodes, list, { temp }),
    }
    list.tail = temp
    yield {
      line: 4,
      captionKey: isEmpty ? 'tailEmpty' : 'tail',
      params: { name: name(list.tail) },
      list: reverseDiagram(nodes, list, { temp }),
    }
    yield { line: 6, captionKey: 'vars', list: draw() }
    for (let i = 0; i < values.length; i++) {
      next = temp.next
      yield {
        line: 8,
        captionKey: next ? 'remember' : 'rememberLast',
        params: { name: temp.value, next: name(next) },
        list: draw({ [temp.value]: 'active' }),
      }
      temp.next = prev
      yield {
        line: 9,
        captionKey: prev ? 'flip' : 'flipFirst',
        params: { name: temp.value, prev: name(prev) },
        list: draw({ [temp.value]: 'moved' }),
      }
      prev = temp
      temp = next
      yield {
        line: 11,
        captionKey: temp ? 'step' : 'stepLast',
        params: { prev: prev.value, temp: name(temp) },
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
