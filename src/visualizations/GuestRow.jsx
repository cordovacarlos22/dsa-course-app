// A row of boxes, one per item (usually a guest's name), with its index
// underneath. Most Big O animations draw the guest list this way, so they
// all look the same. Boxes wrap onto a new line on small screens.

// How a box looks in each state.
const STATE_STYLES = {
  active: 'border-brand bg-sky-50 ring-2 ring-brand/30', // looking at it now
  done: 'border-slate-300 bg-slate-100 text-slate-500', // already looked at
  found: 'border-green-600 bg-green-50 text-green-900',
  faded: 'border-slate-200 bg-white text-slate-300', // out of the game
  new: 'border-green-600 bg-green-50',
  moved: 'border-accent bg-amber-50',
}

// - items: the values to draw
// - states: { [index]: 'active' | 'done' | 'found' | 'faded' | 'new' | 'moved' }
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
              STATE_STYLES[states[index]] ?? 'border-slate-300 bg-white'
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
