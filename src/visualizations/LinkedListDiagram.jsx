import { useTranslation } from 'react-i18next'
import { BOX_STATE_STYLES, DEFAULT_BOX_STYLE } from './boxStyles'

// A singly linked list, drawn as a conga line of nodes: each node is a box
// with its value and a small "next" slot, an arrow to the next node, and
// `null` after the last one. Every linked list animation (and code trace)
// draws its list with this, so they all look the same. Boxes shrink in a
// narrow animation, so four guests and null fit on one line on a phone.
//
// - nodes: the values in the chain, from head (values are unique: they're
//   guests' names, so a value also names its node)
// - states: { [value]: a state from ./boxStyles.js }, e.g. { Ben: 'active' }
// - pointers: { [label]: the value it points to, or null }. `head` and
//   `tail` are drawn above the nodes, every other pointer (temp, pre,
//   newNode…) below them.
// - detached: nodes that can't be reached from head, drawn in a row of
//   their own: [{ value, next: a value or null, state }]
// - length: shown under the list when it's a number
// - nullState: a state for the `null` at the end, to point at it
// - nextOf: draws the nodes where they stand instead of following the chain
//   from head: { [value]: the value its next points to, or null }. Each gap
//   then shows ← or →, or nothing when neither node points at the other.
//   Reverse needs it: halfway through, some arrows point back and the line
//   has a gap. Pointers to null sit on the right-hand null, except the ones
//   in `leftNull` (like prev), which sit on the left-hand one.
const TOP_POINTERS = ['head', 'tail']

function labelsFor(pointers, target, onTop) {
  return Object.entries(pointers)
    .filter(
      ([label, value]) =>
        value === target && TOP_POINTERS.includes(label) === onTop,
    )
    .map(([label]) => label)
}

// `compact` keeps the small size on wide screens too: the line drawn where
// the nodes stand (reverse) has an extra null on the left to fit.
function NodeBox({ value, state, compact = false }) {
  return (
    <span
      className={`flex h-9 items-stretch rounded-lg border-2 text-xs font-bold transition-colors duration-500 ${
        compact ? '' : '@sm:h-10 @sm:text-sm'
      } ${BOX_STATE_STYLES[state] ?? DEFAULT_BOX_STYLE}`}
    >
      <span
        className={`flex min-w-7 items-center justify-center px-1 ${
          compact ? '' : '@sm:min-w-8 @sm:px-1.5'
        }`}
      >
        {String(value)}
      </span>
      {/* The "next" slot: the arrow to the next node leaves from here. */}
      <span
        className={`flex w-2 items-center justify-center border-l-2 border-current/20 ${
          compact ? '' : '@sm:w-3'
        }`}
      >
        <span className="size-1.5 rounded-full bg-current opacity-60" />
      </span>
    </span>
  )
}

function Labels({ labels, isTop }) {
  return (
    <span
      className={`h-4 text-[11px] leading-4 font-bold whitespace-nowrap ${
        isTop ? 'text-brand' : 'text-amber-700'
      }`}
    >
      {labels.length > 0 &&
        (isTop ? `${labels.join(' ')} ↓` : `↑ ${labels.join(' ')}`)}
    </span>
  )
}

// One stop in the line: the labels above, the box, the labels below.
function Stop({ pointers, target, children }) {
  return (
    <span className="flex flex-col items-center">
      <Labels labels={labelsFor(pointers, target, true)} isTop />
      {children}
      <Labels labels={labelsFor(pointers, target, false)} isTop={false} />
    </span>
  )
}

const Arrow = () => (
  <span className="text-xs text-slate-500 @sm:px-0.5 @sm:text-base">→</span>
)

function NullMarker({ state }) {
  return (
    <span
      className={`flex h-9 items-center rounded-lg font-mono text-xs font-bold transition-colors duration-500 @sm:h-10 @sm:px-1 ${
        state ? BOX_STATE_STYLES[state] : 'text-slate-500'
      } ${state ? 'border-2' : ''}`}
    >
      null
    </span>
  )
}

// What a screen reader hears instead of the drawing, e.g.
// "Ana → Ben → null. head: Ana, tail: Ben". With nextOf, each node's next
// is read out instead: "Ana → null, Ben → Ana".
function describeList({ nodes, pointers, detached, length, nextOf, t }) {
  const chain = nextOf
    ? nodes.map((value) => `${value} → ${nextOf[value] ?? 'null'}`).join(', ')
    : [...nodes.map(String), 'null'].join(' → ')
  const parts = [chain]
  const named = Object.entries(pointers).map(
    ([label, value]) => `${label}: ${value === null ? 'null' : value}`,
  )
  if (named.length > 0) parts.push(named.join(', '))
  if (detached.length > 0) {
    const loose = detached
      .map((node) => `${node.value} → ${node.next ?? 'null'}`)
      .join(', ')
    parts.push(`${t('viz.linkedList.detached')}: ${loose}`)
  }
  if (typeof length === 'number') parts.push(`length: ${length}`)
  return parts.join('. ')
}

// The arrow between two neighbors in a line drawn where the nodes stand.
function gapBetween(nextOf, left, right) {
  if (nextOf[left] === right) return '→'
  if (nextOf[right] === left) return '←'
  return ''
}

// The pointers that point to null, split between the two null markers.
function nullPointers(pointers, leftNull, onLeft) {
  const picked = {}
  for (const [label, value] of Object.entries(pointers)) {
    if (value === null && leftNull.includes(label) === onLeft) {
      picked[label] = null
    }
  }
  return picked
}

function FixedRow({ nodes, nextOf, states, pointers, leftNull }) {
  const first = nodes[0]
  const last = nodes[nodes.length - 1]
  const leftPointers = nullPointers(pointers, leftNull, true)
  const rightPointers = nullPointers(pointers, leftNull, false)
  const showLeft =
    (nodes.length > 1 && nextOf[first] === null) ||
    Object.keys(leftPointers).length > 0
  const showRight =
    nextOf[last] === null || Object.keys(rightPointers).length > 0
  return (
    <div aria-hidden="true" className="flex flex-wrap items-center gap-y-1">
      {showLeft && (
        <span className="flex items-center">
          <Stop pointers={leftPointers} target={null}>
            <NullMarker />
          </Stop>
          <span className="w-3 text-center text-xs text-slate-500">
            {nodes.length > 1 && nextOf[first] === null ? '←' : ''}
          </span>
        </span>
      )}
      {nodes.map((value, index) => (
        <span key={value} className="flex items-center">
          <Stop pointers={pointers} target={value}>
            <NodeBox value={value} state={states[value]} compact />
          </Stop>
          <span className="w-3 text-center text-xs text-slate-500">
            {index < nodes.length - 1
              ? gapBetween(nextOf, value, nodes[index + 1])
              : nextOf[value] === null
                ? '→'
                : ''}
          </span>
        </span>
      ))}
      {showRight && (
        <Stop pointers={rightPointers} target={null}>
          <NullMarker />
        </Stop>
      )}
    </div>
  )
}

function LinkedListDiagram({
  nodes,
  states = {},
  pointers = {},
  detached = [],
  length = null,
  nullState = null,
  nextOf = null,
  leftNull = [],
}) {
  const { t } = useTranslation()
  return (
    <div
      role="img"
      aria-label={describeList({
        nodes,
        pointers,
        detached,
        length,
        nextOf,
        t,
      })}
      className="space-y-2"
    >
      {nextOf ? (
        <FixedRow
          nodes={nodes}
          nextOf={nextOf}
          states={states}
          pointers={pointers}
          leftNull={leftNull}
        />
      ) : (
        <div aria-hidden="true" className="flex flex-wrap items-center gap-y-1">
          {nodes.map((value) => (
            <span key={value} className="flex items-center">
              <Stop pointers={pointers} target={value}>
                <NodeBox value={value} state={states[value]} />
              </Stop>
              <Arrow />
            </span>
          ))}
          <Stop pointers={pointers} target={null}>
            <NullMarker state={nullState} />
          </Stop>
        </div>
      )}

      {detached.length > 0 && (
        <div
          aria-hidden="true"
          className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-dashed border-slate-300 px-2 py-1"
        >
          <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
            {t('viz.linkedList.detached')}
          </span>
          {detached.map((node) => (
            <span key={node.value} className="flex items-center">
              <Stop pointers={pointers} target={node.value}>
                <NodeBox value={node.value} state={node.state} />
              </Stop>
              <Arrow />
              <span className="font-mono text-xs font-bold text-slate-600">
                {node.next === null ? 'null' : node.next}
              </span>
            </span>
          ))}
        </div>
      )}

      {typeof length === 'number' && (
        <p aria-hidden="true" className="font-mono text-sm">
          <span className="text-slate-500">length: </span>
          <span className="font-bold">{length}</span>
        </p>
      )}
    </div>
  )
}

export default LinkedListDiagram
