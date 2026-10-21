// The scenes for the last method lessons: get, set, insert, remove and
// reverse, drawn by LinkedListScenes. Like ./linkedListMethodScenes.js, each
// method has three: what it does, its examples and its plan as comments.
// - returnedNode: the method returns a node still in the line, shown as
//   "Cleo's node" (translated) instead of as code.
// - Reverse draws the nodes where they stand (`nextOf`), because halfway
//   through, some arrows point back and the line has a gap.

const LINE = ['Ana', 'Ben', 'Cleo', 'Dev']

function line(values, options = {}) {
  return {
    nodes: values,
    states: options.states ?? {},
    pointers: {
      head: values.length > 0 ? values[0] : null,
      tail: values.length > 0 ? values[values.length - 1] : null,
      ...options.pointers,
    },
    detached: options.detached ?? [],
    length: options.length ?? values.length,
  }
}

// current on values[index] (get's walk), the nodes before it done.
function walking(values, index, extra = {}) {
  const states = {}
  for (let k = 0; k < index; k++) states[values[k]] = 'done'
  states[values[index]] = 'active'
  return line(values, {
    states,
    pointers: { current: values[index], ...extra },
  })
}

const removed = (value, next = null) => ({ value, next, state: 'removed' })
const added = (value, next = null) => ({ value, next, state: 'new' })
const nodeText = (value) => `{ value: '${value}', next: null }`

// A line drawn where the nodes stand, for reverse.
function fixedLine(nextOf, pointers, states = {}) {
  return {
    nodes: LINE,
    nextOf,
    states,
    pointers,
    leftNull: ['previous'],
    length: LINE.length,
  }
}
const FORWARD = { Ana: 'Ben', Ben: 'Cleo', Cleo: 'Dev', Dev: null }
const BACKWARD = { Ana: null, Ben: 'Ana', Cleo: 'Ben', Dev: 'Cleo' }
const SWAPPED = { head: 'Dev', tail: 'Ana' }

export const INDEX_SCENES = {
  get: [
    { captionKey: 'start', code: 'line', list: line(LINE) },
    {
      captionKey: 'call',
      code: 'line.get(2)',
      list: walking(LINE, 2),
      visited: 3,
    },
    {
      captionKey: 'returns',
      code: 'line.get(2)',
      list: line(LINE, { states: { Cleo: 'found' } }),
      returnedNode: 'Cleo',
    },
  ],
  getExamples: [
    {
      captionKey: 'empty',
      code: 'new LinkedList().get(0)',
      list: line([]),
      returned: 'undefined',
    },
    {
      captionKey: 'one',
      code: "new LinkedList('Ana').get(0)",
      list: line(['Ana'], { states: { Ana: 'found' } }),
      returnedNode: 'Ana',
    },
    {
      captionKey: 'last',
      code: 'line.get(3)',
      list: line(LINE, {
        states: { Ana: 'done', Ben: 'done', Cleo: 'done', Dev: 'found' },
      }),
      returnedNode: 'Dev',
      visited: 4,
    },
    {
      captionKey: 'negative',
      code: 'line.get(-1)',
      list: line(LINE),
      returned: 'undefined',
    },
    {
      captionKey: 'tooBig',
      code: 'line.get(4)',
      list: line(LINE),
      returned: 'undefined',
    },
  ],
  getPlan: [
    { captionKey: 'check', code: 'get(2)', comment: 'get1', list: line(LINE) },
    {
      captionKey: 'start',
      comment: 'get2',
      list: walking(LINE, 0),
      visited: 1,
    },
    {
      captionKey: 'move',
      comment: 'get3',
      commentParams: { index: 1 },
      list: walking(LINE, 1),
      visited: 2,
    },
    {
      captionKey: 'arrive',
      comment: 'get3',
      commentParams: { index: 2 },
      list: walking(LINE, 2),
      visited: 3,
    },
    {
      captionKey: 'return',
      comment: 'get4',
      list: line(LINE, {
        states: { Cleo: 'found' },
        pointers: { current: 'Cleo' },
      }),
      returnedNode: 'Cleo',
    },
  ],

  set: [
    { captionKey: 'start', code: 'line', list: line(LINE) },
    {
      captionKey: 'call',
      code: "line.set(1, 'Benny')",
      list: line(['Ana', 'Benny', 'Cleo', 'Dev'], {
        states: { Benny: 'moved' },
      }),
    },
    {
      captionKey: 'returns',
      code: "line.set(1, 'Benny')",
      list: line(['Ana', 'Benny', 'Cleo', 'Dev']),
      returned: 'true',
    },
  ],
  setExamples: [
    {
      captionKey: 'inRange',
      code: "line.set(3, 'Devon')",
      list: line(['Ana', 'Ben', 'Cleo', 'Devon'], {
        states: { Devon: 'moved' },
      }),
      returned: 'true',
    },
    {
      captionKey: 'outOfRange',
      code: "line.set(9, 'Zoe')",
      list: line(LINE),
      returned: 'false',
    },
    {
      captionKey: 'empty',
      code: "new LinkedList().set(0, 'Ana')",
      list: line([]),
      returned: 'false',
    },
  ],
  setPlan: [
    {
      captionKey: 'get',
      code: "set(1, 'Benny')",
      comment: 'set1',
      list: line(LINE, {
        states: { Ben: 'active' },
        pointers: { target: 'Ben' },
      }),
    },
    {
      captionKey: 'change',
      comment: 'set2',
      list: line(['Ana', 'Benny', 'Cleo', 'Dev'], {
        states: { Benny: 'moved' },
        pointers: { target: 'Benny' },
      }),
      returned: 'true',
    },
    {
      captionKey: 'missing',
      code: "set(9, 'Zoe')",
      comment: 'set3',
      list: line(LINE),
      returned: 'false',
    },
  ],

  insert: [
    { captionKey: 'start', code: 'line', list: line(LINE) },
    {
      captionKey: 'call',
      code: "line.insert(2, 'Eve')",
      list: line(['Ana', 'Ben', 'Eve', 'Cleo', 'Dev'], {
        states: { Eve: 'new' },
      }),
    },
    {
      captionKey: 'returns',
      code: "line.insert(2, 'Eve')",
      list: line(['Ana', 'Ben', 'Eve', 'Cleo', 'Dev']),
      returned: 'true',
    },
  ],
  insertExamples: [
    {
      captionKey: 'front',
      code: "line.insert(0, 'Zoe')",
      list: line(['Zoe', ...LINE], { states: { Zoe: 'new' } }),
      returned: 'true',
    },
    {
      captionKey: 'back',
      code: "line.insert(4, 'Eve')",
      list: line([...LINE, 'Eve'], { states: { Eve: 'new' } }),
      returned: 'true',
    },
    {
      captionKey: 'middle',
      code: "line.insert(2, 'Eve')",
      list: line(['Ana', 'Ben', 'Eve', 'Cleo', 'Dev'], {
        states: { Eve: 'new' },
      }),
      returned: 'true',
    },
    {
      captionKey: 'outOfRange',
      code: "line.insert(7, 'Eve')",
      list: line(LINE),
      returned: 'false',
    },
  ],
  insertPlan: [
    {
      captionKey: 'check',
      code: "insert(2, 'Eve')",
      comment: 'insert1',
      list: line(LINE),
    },
    { captionKey: 'notEnds', comment: 'insert2', list: line(LINE) },
    {
      captionKey: 'makeNode',
      comment: 'insert3',
      list: line(LINE, {
        pointers: { nodeToAdd: 'Eve' },
        detached: [added('Eve')],
      }),
    },
    {
      captionKey: 'findNodeBefore',
      comment: 'insert4',
      list: line(LINE, {
        states: { Ben: 'active' },
        pointers: { nodeBefore: 'Ben', nodeToAdd: 'Eve' },
        detached: [added('Eve')],
      }),
    },
    {
      captionKey: 'linkNew',
      comment: 'insert5',
      list: line(LINE, {
        states: { Ben: 'active' },
        pointers: { nodeBefore: 'Ben', nodeToAdd: 'Eve' },
        detached: [added('Eve', 'Cleo')],
      }),
    },
    {
      captionKey: 'linkBefore',
      comment: 'insert6',
      list: line(['Ana', 'Ben', 'Eve', 'Cleo', 'Dev'], {
        states: { Eve: 'new' },
        pointers: { nodeBefore: 'Ben', nodeToAdd: 'Eve' },
        length: 4,
      }),
    },
    {
      captionKey: 'length',
      comment: 'insert7',
      list: line(['Ana', 'Ben', 'Eve', 'Cleo', 'Dev']),
      returned: 'true',
    },
  ],

  remove: [
    { captionKey: 'start', code: 'line', list: line(LINE) },
    {
      captionKey: 'call',
      code: 'line.remove(2)',
      list: line(['Ana', 'Ben', 'Dev'], { detached: [removed('Cleo')] }),
    },
    {
      captionKey: 'returns',
      code: 'line.remove(2)',
      list: line(['Ana', 'Ben', 'Dev']),
      returned: nodeText('Cleo'),
    },
  ],
  removeExamples: [
    {
      captionKey: 'front',
      code: 'line.remove(0)',
      list: line(['Ben', 'Cleo', 'Dev'], { detached: [removed('Ana')] }),
      returned: nodeText('Ana'),
    },
    {
      captionKey: 'back',
      code: 'line.remove(3)',
      list: line(['Ana', 'Ben', 'Cleo'], { detached: [removed('Dev')] }),
      returned: nodeText('Dev'),
    },
    {
      captionKey: 'middle',
      code: 'line.remove(2)',
      list: line(['Ana', 'Ben', 'Dev'], { detached: [removed('Cleo')] }),
      returned: nodeText('Cleo'),
    },
    {
      captionKey: 'outOfRange',
      code: 'line.remove(4)',
      list: line(LINE),
      returned: 'undefined',
    },
  ],
  removePlan: [
    {
      captionKey: 'check',
      code: 'remove(2)',
      comment: 'remove1',
      list: line(LINE),
    },
    { captionKey: 'notEnds', comment: 'remove2', list: line(LINE) },
    {
      captionKey: 'nodeBefore',
      comment: 'remove3',
      list: line(LINE, {
        states: { Ben: 'active' },
        pointers: { nodeBefore: 'Ben' },
      }),
    },
    {
      captionKey: 'removed',
      comment: 'remove4',
      list: line(LINE, {
        states: { Ben: 'active', Cleo: 'moved' },
        pointers: { nodeBefore: 'Ben', removed: 'Cleo' },
      }),
    },
    {
      captionKey: 'skip',
      comment: 'remove5',
      list: line(['Ana', 'Ben', 'Dev'], {
        states: { Ben: 'active' },
        pointers: { nodeBefore: 'Ben', removed: 'Cleo' },
        detached: [removed('Cleo', 'Dev')],
        length: 4,
      }),
    },
    {
      captionKey: 'cut',
      comment: 'remove6',
      list: line(['Ana', 'Ben', 'Dev'], {
        pointers: { removed: 'Cleo' },
        detached: [removed('Cleo')],
        length: 4,
      }),
    },
    {
      captionKey: 'length',
      comment: 'remove7',
      list: line(['Ana', 'Ben', 'Dev']),
      returned: nodeText('Cleo'),
    },
  ],

  reverse: [
    {
      captionKey: 'start',
      code: 'line',
      list: fixedLine(FORWARD, { head: 'Ana', tail: 'Dev' }),
    },
    {
      captionKey: 'call',
      code: 'line.reverse()',
      list: fixedLine(BACKWARD, SWAPPED),
    },
    {
      captionKey: 'returns',
      code: 'line.reverse()',
      list: line(['Dev', 'Cleo', 'Ben', 'Ana']),
      returned: 'this',
    },
  ],
  reverseExamples: [
    {
      captionKey: 'empty',
      code: 'new LinkedList().reverse()',
      list: line([]),
    },
    {
      captionKey: 'one',
      code: "new LinkedList('Ana').reverse()",
      list: line(['Ana']),
    },
    {
      captionKey: 'twoBefore',
      code: 'line',
      list: line(['Ana', 'Ben']),
    },
    {
      captionKey: 'twoAfter',
      code: 'line.reverse()',
      list: line(['Ben', 'Ana']),
    },
    {
      captionKey: 'many',
      code: 'line.reverse()',
      list: line(['Dev', 'Cleo', 'Ben', 'Ana']),
    },
  ],
  reversePlan: [
    {
      captionKey: 'swap',
      comment: 'reverse1',
      list: fixedLine(FORWARD, { ...SWAPPED, current: 'Ana' }),
    },
    {
      captionKey: 'start',
      comment: 'reverse2',
      list: fixedLine(FORWARD, {
        ...SWAPPED,
        current: 'Ana',
        previous: null,
        nextNode: null,
      }),
    },
    {
      captionKey: 'remember',
      comment: 'reverse3',
      list: fixedLine(
        FORWARD,
        { ...SWAPPED, current: 'Ana', previous: null, nextNode: 'Ben' },
        { Ana: 'active' },
      ),
    },
    {
      captionKey: 'flip',
      comment: 'reverse4',
      list: fixedLine(
        { ...FORWARD, Ana: null },
        { ...SWAPPED, current: 'Ana', previous: null, nextNode: 'Ben' },
        { Ana: 'active' },
      ),
    },
    {
      captionKey: 'step',
      comment: 'reverse5',
      list: fixedLine(
        { ...FORWARD, Ana: null },
        { ...SWAPPED, current: 'Ben', previous: 'Ana', nextNode: 'Ben' },
        { Ana: 'done', Ben: 'active' },
      ),
    },
    {
      captionKey: 'repeat',
      comment: 'reverse6',
      list: fixedLine(BACKWARD, {
        ...SWAPPED,
        current: null,
        previous: 'Dev',
        nextNode: null,
      }),
    },
  ],
}
