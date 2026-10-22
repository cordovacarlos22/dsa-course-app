// The LinkedList constructor, line by line: it starts empty, and when it gets
// a value it makes the first node and points head and tail at it. Three
// inputs: a guest's name, nothing (an empty list) and 0 (a real value that
// looks "empty", the classic trap).

const INPUTS = [
  { label: "new LinkedList('Ana')", value: 'Ana' },
  { label: 'new LinkedList()', value: undefined },
  { label: 'new LinkedList(0)', value: 0 },
]

const show = (value) =>
  value === undefined
    ? 'undefined'
    : typeof value === 'string'
      ? `'${value}'`
      : String(value)

export const linkedListConstructor = {
  key: 'linkedListConstructor',
  counter: null,
  inputs: INPUTS,
  items: () => null,
  construct: true,
  code: `class Node {
  constructor(value) {
    this.value = value
    this.next = null
  }
}

class LinkedList {
  constructor(value) {
    this.head = null
    this.tail = null
    this.length = 0
    if (value !== undefined) {
      const firstNode = new Node(value)
      this.head = firstNode
      this.tail = this.head
      this.length = 1
    }
  }
}`,
  call: (input) => [
    'LinkedList',
    input.value === undefined ? [] : [input.value],
  ],
  *run({ value }) {
    const valueVar = ['value', show(value)]
    yield {
      line: 10,
      captionKey: 'head',
      vars: [valueVar],
      list: { nodes: [], pointers: { head: null } },
    }
    yield {
      line: 11,
      captionKey: 'tail',
      vars: [valueVar],
      list: { nodes: [], pointers: { head: null, tail: null } },
    }
    const empty = { nodes: [], pointers: { head: null, tail: null }, length: 0 }
    yield { line: 12, captionKey: 'length', vars: [valueVar], list: empty }

    if (value === undefined) {
      yield {
        line: 13,
        captionKey: 'noValue',
        vars: [valueVar],
        list: empty,
      }
      yield {
        line: 19,
        captionKey: 'emptyDone',
        vars: [valueVar],
        list: empty,
        result: { head: null, tail: null, length: 0 },
      }
      return
    }

    const params = { value: show(value) }
    yield {
      line: 13,
      captionKey: value === 0 ? 'zero' : 'hasValue',
      params,
      vars: [valueVar],
      list: empty,
    }
    yield {
      line: 3,
      captionKey: 'nodeValue',
      params,
      vars: [valueVar],
      list: empty,
    }
    const loose = [{ value, next: null, state: 'new' }]
    yield {
      line: 4,
      captionKey: 'nodeNext',
      params,
      vars: [valueVar],
      list: {
        ...empty,
        pointers: { head: null, tail: null, firstNode: value },
        detached: loose,
      },
    }
    yield {
      line: 15,
      captionKey: 'pointHead',
      params,
      vars: [valueVar],
      list: {
        nodes: [value],
        states: { [value]: 'new' },
        pointers: { head: value, tail: null, firstNode: value },
        length: 0,
      },
    }
    yield {
      line: 16,
      captionKey: 'pointTail',
      params,
      vars: [valueVar],
      list: {
        nodes: [value],
        states: { [value]: 'new' },
        pointers: { head: value, tail: value, firstNode: value },
        length: 0,
      },
    }
    const node = { value, next: null }
    yield {
      line: 17,
      captionKey: 'done',
      params,
      vars: [valueVar],
      list: {
        nodes: [value],
        pointers: { head: value, tail: value },
        length: 1,
      },
      result: { head: node, tail: node, length: 1 },
    }
  },
}
