// How a box looks in each state. Shared by GuestRow (arrays) and ObjectCards
// (objects), so a "found" or "re-indexed" box looks the same everywhere.
export const BOX_STATE_STYLES = {
  active: 'border-brand bg-sky-50 ring-2 ring-brand/30', // looking at it now
  done: 'border-slate-300 bg-slate-100 text-slate-500', // already looked at
  found: 'border-green-600 bg-green-50 text-green-900',
  faded: 'border-slate-200 bg-white text-slate-300', // out of the game
  removed: 'border-dashed border-red-300 bg-white text-slate-400 line-through',
  new: 'border-green-600 bg-green-50',
  moved: 'border-accent bg-amber-50',
}

export const DEFAULT_BOX_STYLE = 'border-slate-300 bg-white'
