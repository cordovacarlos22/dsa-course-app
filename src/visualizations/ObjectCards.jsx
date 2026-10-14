import { BOX_STATE_STYLES, DEFAULT_BOX_STYLE } from './boxStyles'

// An object drawn as cards, one per property: the key on top and its value
// underneath. Unlike GuestRow there are no indexes, because an object has
// no order (and it's a <ul>, not an <ol>, for the same reason).
// - entries: [key, value] pairs, like Object.entries(rsvps)
// - states: { [key]: a state from ./boxStyles.js, like 'found' or 'new' }
function ObjectCards({ entries, states = {} }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {entries.map(([key, value]) => (
        <li
          key={key}
          className={`flex min-w-16 flex-col items-center rounded-lg border-2 px-2 py-1 transition-colors duration-500 ${
            BOX_STATE_STYLES[states[key]] ?? DEFAULT_BOX_STYLE
          }`}
        >
          <span className="text-sm font-bold">{key}</span>
          {/* Values are strings ('yes'); a gap in a huge object has none. */}
          <span className="font-mono text-xs">
            {typeof value === 'string' ? `'${value}'` : '…'}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default ObjectCards
