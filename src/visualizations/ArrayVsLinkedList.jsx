import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import GuestRow from './GuestRow'
import LinkedListDiagram from './LinkedListDiagram'
import { BOX_STATE_STYLES } from './boxStyles'

// From an array to a linked list: drop the indexes, spread the items out
// in memory, and link each one to the next. Memory is drawn as a row of
// numbered slots, so "side by side" and "anywhere" are easy to see.

const GUESTS = ['Ana', 'Ben', 'Cleo', 'Dev']
const SLOT_COUNT = 12

// The array fills slots 4 to 7, one block. The list's nodes are scattered,
// and each node keeps the number of the slot its next node is in.
const FIRST_ARRAY_SLOT = 4
const ARRAY_SLOTS = { 4: 'Ana', 5: 'Ben', 6: 'Cleo', 7: 'Dev' }
const LIST_SLOTS = {
  2: { value: 'Ana', next: 9 },
  9: { value: 'Ben', next: 5 },
  5: { value: 'Cleo', next: 11 },
  11: { value: 'Dev', next: null },
}

const STEPS = [
  { captionKey: 'array', view: 'array' },
  { captionKey: 'arrayMemory', view: 'arrayMemory' },
  { captionKey: 'noIndexes', view: 'noIndexes' },
  { captionKey: 'listMemory', view: 'listMemory' },
  { captionKey: 'chain', view: 'chain' },
]

function MemorySlot({ number, children, isUsed }) {
  return (
    <li
      className={`flex min-h-14 flex-col rounded-lg border-2 px-1 py-0.5 transition-colors duration-500 ${
        isUsed ? BOX_STATE_STYLES.active : 'border-slate-200 bg-slate-50'
      }`}
    >
      <span className="text-[10px] text-slate-500">{number}</span>
      <span className="text-center text-sm font-bold">{children}</span>
    </li>
  )
}

function Memory({ view }) {
  const { t } = useTranslation()
  const slots = []
  for (let number = 1; number <= SLOT_COUNT; number++) {
    let content = null
    if (view === 'arrayMemory' && ARRAY_SLOTS[number]) {
      content = (
        <>
          {ARRAY_SLOTS[number]}
          <span className="block font-mono text-[10px] font-semibold text-slate-600">
            [{number - FIRST_ARRAY_SLOT}]
          </span>
        </>
      )
    }
    if (view === 'listMemory' && LIST_SLOTS[number]) {
      const node = LIST_SLOTS[number]
      content = (
        <>
          {node.value}
          <span className="block font-mono text-[10px] font-semibold text-slate-600">
            next: {node.next ?? 'null'}
          </span>
        </>
      )
    }
    slots.push(
      <MemorySlot key={number} number={number} isUsed={content !== null}>
        {content}
      </MemorySlot>,
    )
  }
  return (
    <div>
      <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
        {t('viz.arrayVsLinkedList.memory')}
      </p>
      <ol className="mt-1 grid grid-cols-4 gap-1 @md:grid-cols-6">{slots}</ol>
    </div>
  )
}

function View({ view }) {
  if (view === 'array') return <GuestRow items={GUESTS} />
  if (view === 'noIndexes') {
    return (
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {GUESTS.map((guest, index) => (
          <li
            key={guest}
            // A little up and down: no more neat row of numbered boxes.
            className={`flex h-11 min-w-12 items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-2 text-sm font-bold ${
              index % 2 === 1 ? 'mt-4' : ''
            }`}
          >
            {guest}
          </li>
        ))}
      </ul>
    )
  }
  if (view === 'chain') {
    return (
      <LinkedListDiagram
        nodes={GUESTS}
        pointers={{ head: 'Ana', tail: 'Dev' }}
      />
    )
  }
  return <Memory view={view} />
}

function ArrayVsLinkedList() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.arrayVsLinkedList.${step.captionKey}`),
  }))
  return (
    <StepPlayer
      title={t('viz.arrayVsLinkedList.title')}
      steps={steps}
      renderStep={(step) => <View view={step.view} />}
    />
  )
}

export default ArrayVsLinkedList
