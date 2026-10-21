import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import GuestRow from './GuestRow'
import LinkedListDiagram from './LinkedListDiagram'
import { BOX_STATE_STYLES, DEFAULT_BOX_STYLE } from './boxStyles'
import { INDEX_SCENES } from './linkedListIndexScenes'
import { METHOD_SCENES } from './linkedListMethodScenes'

// The Linked Lists module's animations: the guests' conga line, one scene per
// lesson step. Each frame of a scene can show:
// - code: the line being run
// - comment: a comment after it (or on its own), from
//   linkedList.comments in the captions, so it's translated like the
//   comments in lessons
// - list: props for LinkedListDiagram
// - visited: how many nodes a walk has visited so far
// - array: an array of guests to compare with ({ items, states })
// - methods: the "who makes a node?" table (nodeClass scene)
// - returned: what the method call gives back, as code ('this', 'undefined')
// - returnedNode: the call returns a node still in the line ("Cleo's node")
// The method lessons' scenes live in ./linkedListMethodScenes.js (push, pop,
// unshift, shift) and ./linkedListIndexScenes.js (get, set, insert, remove,
// reverse).
// Captions live in src/locales/viz.<language>.json under linkedList.<scene>.

const LINE = ['Ana', 'Ben', 'Cleo', 'Dev']
const ENDS = { head: 'Ana', tail: 'Dev' }
const WITH_EVE = [...LINE, 'Eve']

// A walk frame: current on `values[index]`, the nodes before it done.
// `comment` (optional) is added after the code, like `// index 2`.
function walkFrame(captionKey, code, values, index, pointers, comment) {
  const states = {}
  for (let k = 0; k < index; k++) states[values[k]] = 'done'
  states[values[index]] = 'active'
  return {
    captionKey,
    params: { name: values[index] },
    code,
    comment,
    commentParams: { index },
    list: {
      nodes: values,
      states,
      pointers: { ...pointers, current: values[index] },
    },
    visited: index + 1,
  }
}

const SCENES = {
  anatomy: [
    { captionKey: 'line', list: { nodes: LINE } },
    { captionKey: 'node', list: { nodes: LINE, states: { Ben: 'active' } } },
    {
      captionKey: 'next',
      list: { nodes: LINE, states: { Ana: 'active', Ben: 'found' } },
    },
    { captionKey: 'head', list: { nodes: LINE, pointers: { head: 'Ana' } } },
    { captionKey: 'tail', list: { nodes: LINE, pointers: ENDS } },
    {
      captionKey: 'null',
      list: { nodes: LINE, pointers: ENDS, nullState: 'found' },
    },
    { captionKey: 'summary', list: { nodes: LINE, pointers: ENDS } },
  ],

  costEnd: [
    { captionKey: 'start', list: { nodes: LINE, pointers: ENDS } },
    {
      captionKey: 'nodeToAdd',
      code: "const nodeToAdd = { value: 'Eve', next: null }",
      list: {
        nodes: LINE,
        pointers: { ...ENDS, nodeToAdd: 'Eve' },
        detached: [{ value: 'Eve', next: null, state: 'new' }],
      },
    },
    {
      captionKey: 'link',
      code: 'tail.next = nodeToAdd',
      list: {
        nodes: WITH_EVE,
        states: { Eve: 'new' },
        pointers: { ...ENDS, nodeToAdd: 'Eve' },
      },
    },
    {
      captionKey: 'moveTail',
      code: 'tail = nodeToAdd',
      list: {
        nodes: WITH_EVE,
        states: { Eve: 'new' },
        pointers: { head: 'Ana', tail: 'Eve', nodeToAdd: 'Eve' },
      },
    },
    {
      captionKey: 'popProblem',
      comment: 'popProblem',
      list: {
        nodes: WITH_EVE,
        states: { Dev: 'moved' },
        pointers: { head: 'Ana', tail: 'Eve' },
      },
    },
    walkFrame('walkStart', 'let current = head', WITH_EVE, 0, {
      head: 'Ana',
      tail: 'Eve',
    }),
    walkFrame('walk', 'current = current.next', WITH_EVE, 1, {
      head: 'Ana',
      tail: 'Eve',
    }),
    walkFrame('walk', 'current = current.next', WITH_EVE, 2, {
      head: 'Ana',
      tail: 'Eve',
    }),
    walkFrame('walkFound', 'current = current.next', WITH_EVE, 3, {
      head: 'Ana',
      tail: 'Eve',
    }),
    {
      captionKey: 'moveTailBack',
      code: 'tail = current',
      list: {
        nodes: WITH_EVE,
        states: { Dev: 'moved' },
        pointers: { head: 'Ana', tail: 'Dev', current: 'Dev' },
      },
      visited: 4,
    },
    {
      captionKey: 'cut',
      code: 'tail.next = null',
      list: {
        nodes: LINE,
        pointers: { head: 'Ana', tail: 'Dev', current: 'Dev' },
        detached: [{ value: 'Eve', next: null, state: 'removed' }],
      },
      visited: 4,
    },
    { captionKey: 'summary', list: { nodes: LINE, pointers: ENDS } },
  ],

  costFront: [
    { captionKey: 'start', list: { nodes: LINE, pointers: ENDS } },
    {
      captionKey: 'nodeToAdd',
      code: "const nodeToAdd = { value: 'Zoe', next: null }",
      list: {
        nodes: LINE,
        pointers: { ...ENDS, nodeToAdd: 'Zoe' },
        detached: [{ value: 'Zoe', next: null, state: 'new' }],
      },
    },
    {
      captionKey: 'link',
      code: 'nodeToAdd.next = head',
      list: {
        nodes: LINE,
        pointers: { ...ENDS, nodeToAdd: 'Zoe' },
        detached: [{ value: 'Zoe', next: 'Ana', state: 'new' }],
      },
    },
    {
      captionKey: 'moveHead',
      code: 'head = nodeToAdd',
      list: {
        nodes: ['Zoe', ...LINE],
        states: { Zoe: 'new' },
        pointers: { head: 'Zoe', tail: 'Dev', nodeToAdd: 'Zoe' },
      },
    },
    {
      captionKey: 'shift',
      code: 'head = head.next',
      list: {
        nodes: LINE,
        states: { Ana: 'moved' },
        pointers: ENDS,
        detached: [{ value: 'Zoe', next: 'Ana', state: 'removed' }],
      },
    },
    { captionKey: 'summary', list: { nodes: LINE, pointers: ENDS } },
  ],

  costMiddle: [
    {
      captionKey: 'start',
      comment: 'insertAt3',
      list: { nodes: LINE, pointers: ENDS },
    },
    walkFrame('walkStart', 'let current = head', LINE, 0, ENDS, 'index'),
    walkFrame('walk', 'current = current.next', LINE, 1, ENDS, 'index'),
    walkFrame('walkFound', 'current = current.next', LINE, 2, ENDS, 'index'),
    {
      captionKey: 'link',
      code: 'nodeToAdd.next = current.next',
      list: {
        nodes: LINE,
        states: { Cleo: 'active' },
        pointers: { ...ENDS, current: 'Cleo', nodeToAdd: 'Eve' },
        detached: [{ value: 'Eve', next: 'Dev', state: 'new' }],
      },
      visited: 3,
    },
    {
      captionKey: 'insert',
      code: 'current.next = nodeToAdd',
      list: {
        nodes: ['Ana', 'Ben', 'Cleo', 'Eve', 'Dev'],
        states: { Eve: 'new' },
        pointers: { ...ENDS, current: 'Cleo', nodeToAdd: 'Eve' },
      },
      visited: 3,
    },
    {
      captionKey: 'removeWalk',
      comment: 'removeAt3',
      list: {
        nodes: ['Ana', 'Ben', 'Cleo', 'Eve', 'Dev'],
        states: { Ana: 'done', Ben: 'done', Cleo: 'active', Eve: 'moved' },
        pointers: { ...ENDS, current: 'Cleo' },
      },
      visited: 3,
    },
    {
      captionKey: 'remove',
      code: 'current.next = current.next.next',
      list: {
        nodes: LINE,
        states: { Cleo: 'active' },
        pointers: { ...ENDS, current: 'Cleo' },
        detached: [{ value: 'Eve', next: 'Dev', state: 'removed' }],
      },
      visited: 3,
    },
    { captionKey: 'summary', list: { nodes: LINE, pointers: ENDS } },
  ],

  costLookup: [
    {
      captionKey: 'start',
      comment: 'findCleo',
      list: { nodes: LINE, pointers: ENDS },
    },
    walkFrame('check', "current.value === 'Cleo'", LINE, 0, ENDS, 'no'),
    walkFrame('check', "current.value === 'Cleo'", LINE, 1, ENDS, 'no'),
    {
      ...walkFrame(
        'foundValue',
        "current.value === 'Cleo'",
        LINE,
        2,
        ENDS,
        'yes',
      ),
      list: {
        nodes: LINE,
        states: { Ana: 'done', Ben: 'done', Cleo: 'found' },
        pointers: { ...ENDS, current: 'Cleo' },
      },
    },
    walkFrame('byIndex', null, LINE, 2, ENDS, 'findIndex2'),
    {
      captionKey: 'array',
      code: 'guests[2]',
      array: { items: LINE, states: { 2: 'found' } },
      visited: 1,
    },
    { captionKey: 'summary', list: { nodes: LINE, pointers: ENDS } },
  ],

  nodeClass: [
    { captionKey: 'create', methods: ['create'] },
    { captionKey: 'push', methods: ['create', 'push'] },
    { captionKey: 'unshift', methods: ['create', 'push', 'unshift'] },
    { captionKey: 'insert', methods: ['create', 'push', 'unshift', 'insert'] },
    {
      captionKey: 'nodeClass',
      code: 'class Node {\n  constructor(value) {\n    this.value = value\n    this.next = null\n  }\n}',
    },
    {
      captionKey: 'firstNode',
      code: "const firstNode = new Node('Ana')",
      list: {
        nodes: [],
        pointers: { firstNode: 'Ana' },
        detached: [{ value: 'Ana', next: null, state: 'new' }],
      },
    },
  ],

  constructorExamples: [
    {
      captionKey: 'one',
      code: "new LinkedList('Ana')",
      list: {
        nodes: ['Ana'],
        pointers: { head: 'Ana', tail: 'Ana' },
        length: 1,
      },
    },
    {
      captionKey: 'empty',
      code: 'new LinkedList()',
      list: { nodes: [], pointers: { head: null, tail: null }, length: 0 },
    },
    {
      captionKey: 'zero',
      code: 'new LinkedList(0)',
      list: { nodes: [0], pointers: { head: 0, tail: 0 }, length: 1 },
    },
    {
      captionKey: 'many',
      code: "new LinkedList('Ana'), then push('Ben')",
      list: {
        nodes: ['Ana', 'Ben'],
        states: { Ben: 'new' },
        pointers: { head: 'Ana', tail: 'Ben' },
        length: 2,
      },
    },
  ],

  constructorPlan: [
    {
      captionKey: 'empty',
      comment: 'planEmpty',
      list: { nodes: [], pointers: { head: null, tail: null }, length: 0 },
    },
    {
      captionKey: 'makeNode',
      comment: 'planMakeNode',
      list: {
        nodes: [],
        pointers: { head: null, tail: null, firstNode: 'Ana' },
        detached: [{ value: 'Ana', next: null, state: 'new' }],
        length: 0,
      },
    },
    {
      captionKey: 'head',
      comment: 'planHead',
      list: {
        nodes: ['Ana'],
        states: { Ana: 'new' },
        pointers: { head: 'Ana', tail: null, firstNode: 'Ana' },
        length: 0,
      },
    },
    {
      captionKey: 'tail',
      comment: 'planTail',
      list: {
        nodes: ['Ana'],
        states: { Ana: 'new' },
        pointers: { head: 'Ana', tail: 'Ana', firstNode: 'Ana' },
        length: 0,
      },
    },
    {
      captionKey: 'length',
      comment: 'planLength',
      list: {
        nodes: ['Ana'],
        pointers: { head: 'Ana', tail: 'Ana' },
        length: 1,
      },
    },
  ],
}

// Method signatures are code, so they aren't translated. (The constructor's
// key is `create`: a key named "constructor" would clash with JavaScript's.)
const NODE_MAKERS = {
  create: 'constructor(value)',
  push: 'push(value)',
  unshift: 'unshift(value)',
  insert: 'insert(index, value)',
}

// The nodeClass scene: four methods, and every one of them makes a node.
function NodeMakers({ highlighted }) {
  const { t } = useTranslation()
  return (
    <ul className="space-y-1.5">
      {Object.entries(NODE_MAKERS).map(([method, signature]) => {
        const isOn = highlighted.includes(method)
        return (
          <li
            key={method}
            className={`flex flex-wrap items-center gap-x-2 rounded-lg border-2 px-2 py-1 text-sm transition-colors duration-500 ${
              isOn ? BOX_STATE_STYLES.active : DEFAULT_BOX_STYLE
            }`}
          >
            <code className="font-bold">{signature}</code>
            <span className="text-slate-600">
              {t(`viz.linkedList.nodeClass.job.${method}`)}
            </span>
            {isOn && (
              <span className="ml-auto rounded bg-green-100 px-1.5 text-xs font-bold text-green-900">
                {t('viz.linkedList.nodeClass.makesNode')}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function commentOf(frame, t) {
  if (!frame.comment) return null
  const text = t(
    `viz.linkedList.comments.${frame.comment}`,
    frame.commentParams,
  )
  return `// ${text}`
}

function Frame({ frame }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-3">
      {(frame.code || frame.comment) && (
        <pre className="font-mono text-sm wrap-break-word whitespace-pre-wrap">
          {[frame.code, commentOf(frame, t)].filter(Boolean).join(' ')}
        </pre>
      )}
      {frame.methods && <NodeMakers highlighted={frame.methods} />}
      {frame.list && <LinkedListDiagram {...frame.list} />}
      {frame.array && (
        <GuestRow items={frame.array.items} states={frame.array.states} />
      )}
      {(frame.returned || frame.returnedNode) && (
        <p className="font-mono text-sm">
          <span className="font-sans text-slate-500">
            {t('viz.linkedList.returns')}{' '}
          </span>
          <span
            className={`font-bold ${frame.returnedNode ? 'font-sans' : ''}`}
          >
            {frame.returnedNode
              ? t('viz.linkedList.nodeOf', { name: frame.returnedNode })
              : frame.returned}
          </span>
        </p>
      )}
      {frame.visited !== undefined && (
        <p className="text-sm font-semibold text-brand">
          {t('viz.linkedList.visited', { count: frame.visited })}
        </p>
      )}
    </div>
  )
}

function LinkedListScenes({ scene }) {
  const { t } = useTranslation()
  const frames = SCENES[scene] ?? METHOD_SCENES[scene] ?? INDEX_SCENES[scene]
  const steps = frames.map((frame) => ({
    ...frame,
    caption: t(`viz.linkedList.${scene}.${frame.captionKey}`, frame.params),
  }))
  return (
    <StepPlayer
      title={t(`viz.linkedList.${scene}.title`)}
      steps={steps}
      renderStep={(frame) => <Frame frame={frame} />}
    />
  )
}

export default LinkedListScenes
