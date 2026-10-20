// The scenes for the method lessons (push, pop, unshift, shift), drawn by
// LinkedListScenes. Each method has three: what it does (the common case),
// its examples (an empty line, one guest, many guests) and its plan as
// comments. The code itself is played by the traces in ./traces.

// The pointers of a list: head on the first value, tail on the last.
function ends(values) {
  return {
    head: values.length > 0 ? values[0] : null,
    tail: values.length > 0 ? values[values.length - 1] : null,
  }
}

// Props for LinkedListDiagram. head and tail sit on the ends unless
// `pointers` moves them, and length is the number of values unless given.
function line(values, options = {}) {
  return {
    nodes: values,
    states: options.states ?? {},
    pointers: { ...ends(values), ...options.pointers },
    detached: options.detached ?? [],
    length: options.length ?? values.length,
  }
}

const removed = (value, next = null) => ({ value, next, state: 'removed' })
const added = (value, next = null) => ({ value, next, state: 'new' })
const nodeText = (value) => `{ value: '${value}', next: null }`

const THREE = ['Ana', 'Ben', 'Cleo']

export const METHOD_SCENES = {
  push: [
    { captionKey: 'start', code: 'line', list: line(THREE) },
    {
      captionKey: 'call',
      code: "line.push('Dev')",
      list: line([...THREE, 'Dev'], { states: { Dev: 'new' } }),
    },
    {
      captionKey: 'returns',
      code: "line.push('Dev')",
      list: line([...THREE, 'Dev']),
      returned: 'this',
    },
  ],
  pushExamples: [
    { captionKey: 'emptyBefore', code: 'new LinkedList()', list: line([]) },
    {
      captionKey: 'emptyAfter',
      code: "line.push('Ana')",
      list: line(['Ana'], { states: { Ana: 'new' } }),
    },
    {
      captionKey: 'oneBefore',
      code: "new LinkedList('Ana')",
      list: line(['Ana']),
    },
    {
      captionKey: 'oneAfter',
      code: "line.push('Ben')",
      list: line(['Ana', 'Ben'], { states: { Ben: 'new' } }),
    },
    { captionKey: 'manyBefore', code: 'line', list: line(THREE) },
    {
      captionKey: 'manyAfter',
      code: "line.push('Dev')",
      list: line([...THREE, 'Dev'], { states: { Dev: 'new' } }),
    },
  ],
  pushPlan: [
    {
      captionKey: 'makeNode',
      comment: 'push1',
      list: line(THREE, {
        pointers: { newNode: 'Dev' },
        detached: [added('Dev')],
      }),
    },
    {
      captionKey: 'notEmpty',
      comment: 'push2',
      list: line(THREE, {
        pointers: { newNode: 'Dev' },
        detached: [added('Dev')],
      }),
    },
    {
      captionKey: 'link',
      comment: 'push3',
      list: line([...THREE, 'Dev'], {
        states: { Dev: 'new' },
        pointers: { tail: 'Cleo', newNode: 'Dev' },
        length: 3,
      }),
    },
    {
      captionKey: 'moveTail',
      comment: 'push4',
      list: line([...THREE, 'Dev'], {
        states: { Dev: 'new' },
        pointers: { newNode: 'Dev' },
        length: 3,
      }),
    },
    {
      captionKey: 'length',
      comment: 'push5',
      list: line([...THREE, 'Dev']),
      returned: 'this',
    },
    {
      captionKey: 'emptyCase',
      comment: 'push2',
      list: line(['Dev'], { states: { Dev: 'new' }, length: 0 }),
    },
  ],

  pop: [
    { captionKey: 'start', code: 'line', list: line([...THREE, 'Dev']) },
    {
      captionKey: 'call',
      code: 'line.pop()',
      list: line(THREE, { detached: [removed('Dev')] }),
    },
    {
      captionKey: 'returns',
      code: 'line.pop()',
      list: line(THREE),
      returned: nodeText('Dev'),
    },
  ],
  popExamples: [
    { captionKey: 'emptyBefore', code: 'new LinkedList()', list: line([]) },
    {
      captionKey: 'emptyAfter',
      code: 'line.pop()',
      list: line([]),
      returned: 'undefined',
    },
    {
      captionKey: 'oneBefore',
      code: "new LinkedList('Ana')",
      list: line(['Ana']),
    },
    {
      captionKey: 'oneAfter',
      code: 'line.pop()',
      list: line([], { detached: [removed('Ana')] }),
      returned: nodeText('Ana'),
    },
    { captionKey: 'manyBefore', code: 'line', list: line(THREE) },
    {
      captionKey: 'manyAfter',
      code: 'line.pop()',
      list: line(['Ana', 'Ben'], { detached: [removed('Cleo')] }),
      returned: nodeText('Cleo'),
    },
  ],
  popPlan: [
    { captionKey: 'notEmpty', comment: 'pop1', list: line(THREE) },
    {
      captionKey: 'start',
      comment: 'pop2',
      list: line(THREE, { pointers: { temp: 'Ana', pre: 'Ana' } }),
    },
    {
      captionKey: 'walk',
      comment: 'pop3',
      list: line(THREE, {
        states: { Cleo: 'active' },
        pointers: { temp: 'Cleo', pre: 'Ben' },
      }),
    },
    {
      captionKey: 'moveTail',
      comment: 'pop4',
      list: line(['Ana', 'Ben'], {
        pointers: { temp: 'Cleo', pre: 'Ben' },
        detached: [removed('Cleo')],
        length: 3,
      }),
    },
    {
      captionKey: 'length',
      comment: 'pop5',
      list: line(['Ana', 'Ben'], {
        pointers: { temp: 'Cleo', pre: 'Ben' },
        detached: [removed('Cleo')],
      }),
    },
    {
      captionKey: 'oneLeft',
      comment: 'pop6',
      list: line([], { detached: [removed('Ana')] }),
    },
    {
      captionKey: 'returnTemp',
      comment: 'pop7',
      list: line(['Ana', 'Ben']),
      returned: nodeText('Cleo'),
    },
  ],

  unshift: [
    { captionKey: 'start', code: 'line', list: line(THREE) },
    {
      captionKey: 'call',
      code: "line.unshift('Zoe')",
      list: line(['Zoe', ...THREE], { states: { Zoe: 'new' } }),
    },
    {
      captionKey: 'returns',
      code: "line.unshift('Zoe')",
      list: line(['Zoe', ...THREE]),
      returned: 'this',
    },
  ],
  unshiftExamples: [
    { captionKey: 'emptyBefore', code: 'new LinkedList()', list: line([]) },
    {
      captionKey: 'emptyAfter',
      code: "line.unshift('Zoe')",
      list: line(['Zoe'], { states: { Zoe: 'new' } }),
    },
    {
      captionKey: 'oneBefore',
      code: "new LinkedList('Ana')",
      list: line(['Ana']),
    },
    {
      captionKey: 'oneAfter',
      code: "line.unshift('Zoe')",
      list: line(['Zoe', 'Ana'], { states: { Zoe: 'new' } }),
    },
    { captionKey: 'manyBefore', code: 'line', list: line(THREE) },
    {
      captionKey: 'manyAfter',
      code: "line.unshift('Zoe')",
      list: line(['Zoe', ...THREE], { states: { Zoe: 'new' } }),
    },
  ],
  unshiftPlan: [
    {
      captionKey: 'makeNode',
      comment: 'unshift1',
      list: line(THREE, {
        pointers: { newNode: 'Zoe' },
        detached: [added('Zoe')],
      }),
    },
    {
      captionKey: 'notEmpty',
      comment: 'unshift2',
      list: line(THREE, {
        pointers: { newNode: 'Zoe' },
        detached: [added('Zoe')],
      }),
    },
    {
      captionKey: 'link',
      comment: 'unshift3',
      list: line(THREE, {
        pointers: { newNode: 'Zoe' },
        detached: [added('Zoe', 'Ana')],
      }),
    },
    {
      captionKey: 'moveHead',
      comment: 'unshift4',
      list: line(['Zoe', ...THREE], {
        states: { Zoe: 'new' },
        pointers: { newNode: 'Zoe' },
        length: 3,
      }),
    },
    {
      captionKey: 'length',
      comment: 'unshift5',
      list: line(['Zoe', ...THREE]),
      returned: 'this',
    },
    {
      captionKey: 'emptyCase',
      comment: 'unshift2',
      list: line(['Zoe'], { states: { Zoe: 'new' }, length: 0 }),
    },
  ],

  shift: [
    { captionKey: 'start', code: 'line', list: line(THREE) },
    {
      captionKey: 'call',
      code: 'line.shift()',
      list: line(['Ben', 'Cleo'], { detached: [removed('Ana')] }),
    },
    {
      captionKey: 'returns',
      code: 'line.shift()',
      list: line(['Ben', 'Cleo']),
      returned: nodeText('Ana'),
    },
  ],
  shiftExamples: [
    { captionKey: 'emptyBefore', code: 'new LinkedList()', list: line([]) },
    {
      captionKey: 'emptyAfter',
      code: 'line.shift()',
      list: line([]),
      returned: 'undefined',
    },
    {
      captionKey: 'oneBefore',
      code: "new LinkedList('Ana')",
      list: line(['Ana']),
    },
    {
      captionKey: 'oneAfter',
      code: 'line.shift()',
      list: line([], { detached: [removed('Ana')] }),
      returned: nodeText('Ana'),
    },
    { captionKey: 'manyBefore', code: 'line', list: line(THREE) },
    {
      captionKey: 'manyAfter',
      code: 'line.shift()',
      list: line(['Ben', 'Cleo'], { detached: [removed('Ana')] }),
      returned: nodeText('Ana'),
    },
  ],
  shiftPlan: [
    { captionKey: 'notEmpty', comment: 'shift1', list: line(THREE) },
    {
      captionKey: 'temp',
      comment: 'shift2',
      list: line(THREE, { pointers: { temp: 'Ana' } }),
    },
    {
      captionKey: 'moveHead',
      comment: 'shift3',
      list: line(['Ben', 'Cleo'], {
        pointers: { temp: 'Ana' },
        detached: [removed('Ana', 'Ben')],
        length: 3,
      }),
    },
    {
      captionKey: 'cut',
      comment: 'shift4',
      list: line(['Ben', 'Cleo'], {
        pointers: { temp: 'Ana' },
        detached: [removed('Ana')],
        length: 3,
      }),
    },
    {
      captionKey: 'length',
      comment: 'shift5',
      list: line(['Ben', 'Cleo'], {
        pointers: { temp: 'Ana' },
        detached: [removed('Ana')],
      }),
    },
    {
      captionKey: 'oneLeft',
      comment: 'shift6',
      list: line([], {
        pointers: { temp: 'Ana' },
        detached: [removed('Ana')],
      }),
    },
    {
      captionKey: 'returnTemp',
      comment: 'shift7',
      list: line(['Ben', 'Cleo']),
      returned: nodeText('Ana'),
    },
  ],
}
