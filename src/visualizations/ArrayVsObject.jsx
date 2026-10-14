import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import GuestRow from './GuestRow'
import ObjectCards from './ObjectCards'
import OperationPanel from './OperationPanel'
import { RSVPS, guestList } from './guests'

// JavaScript's two free data structures side by side: the guest list (an
// array, ordered) and the answers (an object, labeled by name). The same
// operations cost the same on both, except adding at the start: only the
// array has a start, so only the array re-indexes.

const GUESTS = guestList(5)
const ENTRIES = Object.entries(RSVPS)

// { 0: state, 1: state, … } for the boxes from `from` to `to - 1`.
function boxes(from, to, state) {
  const states = {}
  for (let i = from; i < to; i++) states[i] = state
  return states
}

function cards(entries, state) {
  const states = {}
  for (let i = 0; i < entries.length; i++) states[entries[i][0]] = state
  return states
}

const STEPS = [
  {
    captionKey: 'start',
    array: { code: 'guests', items: GUESTS, states: {}, work: null },
    object: { code: 'rsvps', entries: ENTRIES, states: {}, work: null },
  },
  {
    captionKey: 'access',
    array: {
      code: 'guests[3]',
      items: GUESTS,
      states: { 3: 'found' },
      work: 1,
    },
    object: {
      code: "rsvps['Dev']",
      entries: ENTRIES,
      states: { Dev: 'found' },
      work: 1,
    },
  },
  {
    captionKey: 'addEnd',
    array: {
      code: "guests.push('Fay')",
      items: [...GUESTS, 'Fay'],
      states: { 5: 'new' },
      work: 1,
    },
    object: {
      code: "rsvps['Fay'] = 'yes'",
      entries: [...ENTRIES, ['Fay', 'yes']],
      states: { Fay: 'new' },
      work: 1,
    },
  },
  {
    captionKey: 'addStart',
    array: {
      code: "guests.unshift('Zoe')",
      items: ['Zoe', ...GUESTS],
      states: { 0: 'new', ...boxes(1, GUESTS.length + 1, 'moved') },
      work: GUESTS.length + 1,
    },
    object: {
      code: "rsvps['Zoe'] = 'no'",
      entries: [...ENTRIES, ['Zoe', 'no']],
      states: { Zoe: 'new' },
      work: 1,
    },
  },
  {
    captionKey: 'search',
    array: {
      code: "guests.includes('Gus')",
      items: GUESTS,
      states: boxes(0, GUESTS.length, 'done'),
      work: GUESTS.length,
    },
    object: {
      code: "Object.values(rsvps).includes('late')",
      entries: ENTRIES,
      states: cards(ENTRIES, 'done'),
      work: ENTRIES.length,
    },
  },
  {
    captionKey: 'summary',
    array: { code: 'guests', items: GUESTS, states: {}, work: null },
    object: { code: 'rsvps', entries: ENTRIES, states: {}, work: null },
  },
]

function ArrayVsObject() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.arrayVsObject.${step.captionKey}`),
  }))
  return (
    <StepPlayer
      title={t('viz.arrayVsObject.title')}
      steps={steps}
      renderStep={({ array, object }) => (
        <div className="grid gap-3 @2xl:grid-cols-2">
          <OperationPanel
            title={t('viz.arrayVsObject.array')}
            code={array.code}
            work={array.work}
          >
            <GuestRow items={array.items} states={array.states} />
          </OperationPanel>
          <OperationPanel
            title={t('viz.arrayVsObject.object')}
            code={object.code}
            work={object.work}
          >
            <ObjectCards entries={object.entries} states={object.states} />
          </OperationPanel>
        </div>
      )}
    />
  )
}

export default ArrayVsObject
