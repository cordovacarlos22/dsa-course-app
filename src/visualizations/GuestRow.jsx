import { BOX_STATE_STYLES, DEFAULT_BOX_STYLE } from './boxStyles'

// A row of boxes, one per item (usually a guest's name), with its index
// underneath. Most Big O animations draw the guest list this way, so they
// all look the same. Boxes wrap onto a new line on small screens.

// - items: the values to draw
// - states: { [index]: a state from ./boxStyles.js, like 'found' or 'moved' }
// - pointers: arrows above boxes, e.g. [{ index: 2, label: 'i' }]
// - indexLabels: what to write under each box (defaults to its index)
function GuestRow({ items, states = {}, pointers = [], indexLabels = null }) {
  return (
    <ol className="flex flex-wrap gap-1.5">
      {items.map((item, index) => (
        <li key={index} className="flex flex-col items-center">
          <span aria-hidden="true" className="h-5 text-xs font-bold text-brand">
            {pointers
              .filter((pointer) => pointer.index === index)
              .map((pointer) => pointer.label)
              .join(' ')}
            {pointers.some((pointer) => pointer.index === index) && ' ↓'}
          </span>
          <span
            className={`flex h-11 min-w-12 items-center justify-center rounded-lg border-2 px-2 text-sm font-bold transition-colors duration-500 ${
              BOX_STATE_STYLES[states[index]] ?? DEFAULT_BOX_STYLE
            }`}
          >
            {String(item)}
          </span>
          <span className="mt-0.5 text-[11px] text-slate-500">
            [{indexLabels ? indexLabels[index] : index}]
          </span>
        </li>
      ))}
    </ol>
  )
}

export default GuestRow
