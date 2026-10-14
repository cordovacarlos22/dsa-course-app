import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import ObjectCards from './ObjectCards'
import OperationPanel from './OperationPanel'
import { RSVPS } from './guests'

// The answers object, one operation at a time. With a key, every operation
// touches one card, however many guests there are: O(1). (A missing key
// touches none, and is still one step.) Looking for a value has to touch
// every card: O(n).
// Three scenes, one per lesson step (see ./index.js):
// - access: reading a key
// - write: adding, changing and deleting keys
// - hasKey: hasOwnProperty vs looking for a value

const ENTRIES = Object.entries(RSVPS)
const HUGE = [['Ana', 'yes'], ['Ben', 'no'], ['…'], ['Zoe', 'maybe']]

const allCards = (entries, state) =>
  Object.fromEntries(entries.map(([key]) => [key, state]))

const START = { captionKey: 'start', code: 'rsvps', entries: ENTRIES }

const SCENES = {
  access: [
    START,
    {
      captionKey: 'read',
      code: "rsvps['Dev'] // 'yes'",
      entries: ENTRIES,
      states: { Dev: 'found' },
      work: 1,
    },
    {
      captionKey: 'dot',
      code: "rsvps.Eli // 'no'",
      entries: ENTRIES,
      states: { Eli: 'found' },
      work: 1,
    },
    {
      captionKey: 'missing',
      code: "rsvps['Zoe'] // undefined",
      entries: ENTRIES,
    },
    {
      captionKey: 'huge',
      code: "rsvps['Zoe'] // 'maybe'",
      entries: HUGE,
      states: { Zoe: 'found' },
      work: 1,
    },
    { ...START, captionKey: 'summary' },
  ],
  write: [
    START,
    {
      captionKey: 'add',
      code: "rsvps['Fay'] = 'yes'",
      entries: [...ENTRIES, ['Fay', 'yes']],
      states: { Fay: 'new' },
      work: 1,
    },
    {
      captionKey: 'update',
      code: "rsvps['Ben'] = 'yes'",
      entries: [
        ['Ana', 'yes'],
        ['Ben', 'yes'],
        ['Cleo', 'maybe'],
        ['Dev', 'yes'],
        ['Eli', 'no'],
        ['Fay', 'yes'],
      ],
      states: { Ben: 'found' },
      work: 1,
    },
    {
      captionKey: 'remove',
      code: "delete rsvps['Cleo']",
      entries: [
        ['Ana', 'yes'],
        ['Ben', 'yes'],
        ['Cleo', 'maybe'],
        ['Dev', 'yes'],
        ['Eli', 'no'],
        ['Fay', 'yes'],
      ],
      states: { Cleo: 'removed' },
      work: 1,
    },
    {
      captionKey: 'summary',
      code: 'rsvps',
      entries: [
        ['Ana', 'yes'],
        ['Ben', 'yes'],
        ['Dev', 'yes'],
        ['Eli', 'no'],
        ['Fay', 'yes'],
      ],
    },
  ],
  hasKey: [
    START,
    {
      captionKey: 'has',
      code: "rsvps.hasOwnProperty('Dev') // true",
      entries: ENTRIES,
      states: { Dev: 'found' },
      work: 1,
    },
    {
      captionKey: 'hasNot',
      code: "rsvps.hasOwnProperty('Zoe') // false",
      entries: ENTRIES,
    },
    {
      captionKey: 'value',
      code: "Object.values(rsvps).includes('late') // false",
      entries: ENTRIES,
      states: allCards(ENTRIES, 'done'),
      work: ENTRIES.length,
    },
    { ...START, captionKey: 'summary' },
  ],
}

function ObjectLookup({ scene }) {
  const { t } = useTranslation()
  const steps = SCENES[scene].map((step) => ({
    ...step,
    caption: t(`viz.objectLookup.${scene}.${step.captionKey}`),
  }))
  return (
    <StepPlayer
      title={t(`viz.objectLookup.${scene}.title`)}
      steps={steps}
      renderStep={(step) => (
        <OperationPanel code={step.code} work={step.work ?? null}>
          <ObjectCards entries={step.entries} states={step.states} />
        </OperationPanel>
      )}
    />
  )
}

export default ObjectLookup
