import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import GuestRow from './GuestRow'
import ObjectCards from './ObjectCards'
import OperationPanel from './OperationPanel'
import { RSVPS } from './guests'

// Object.keys builds a new array by visiting every property once: n steps
// and n new boxes, so O(n) time and O(n) space. Object.values and
// Object.entries take the same walk.

const ENTRIES = Object.entries(RSVPS)
const KEYS = ENTRIES.map(([key]) => key)

// Object.keys, one key at a time: card i is being copied into box i.
const keySteps = KEYS.map((key, i) => ({
  captionKey: i === 0 ? 'firstKey' : 'nextKey',
  params: { key, count: i + 1 },
  code: 'Object.keys(rsvps)',
  cardStates: Object.fromEntries(
    KEYS.slice(0, i + 1).map((done, k) => [done, k === i ? 'active' : 'done']),
  ),
  result: KEYS.slice(0, i + 1),
  resultStates: { [i]: 'new' },
  work: i + 1,
}))

const allDone = Object.fromEntries(KEYS.map((key) => [key, 'done']))

const STEPS = [
  { captionKey: 'start', code: 'Object.keys(rsvps)', result: [] },
  ...keySteps,
  {
    captionKey: 'keysDone',
    params: { n: KEYS.length },
    code: 'Object.keys(rsvps)',
    cardStates: allDone,
    result: KEYS,
    work: KEYS.length,
  },
  {
    captionKey: 'values',
    code: 'Object.values(rsvps)',
    cardStates: allDone,
    result: ENTRIES.map(([, value]) => `'${value}'`),
    work: KEYS.length,
  },
  {
    captionKey: 'entries',
    code: 'Object.entries(rsvps)',
    cardStates: allDone,
    result: ENTRIES.map(([key, value]) => `['${key}', '${value}']`),
    work: KEYS.length,
  },
  {
    captionKey: 'summary',
    code: 'Object.keys(rsvps)',
    cardStates: allDone,
    result: KEYS,
    work: KEYS.length,
  },
]

function ObjectToArray() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.objectToArray.${step.captionKey}`, step.params),
  }))
  return (
    <StepPlayer
      title={t('viz.objectToArray.title')}
      steps={steps}
      renderStep={(step) => (
        <OperationPanel code={step.code} work={step.work ?? null}>
          <ObjectCards entries={ENTRIES} states={step.cardStates} />
          <p className="pt-1 text-xs font-bold text-slate-500">
            {t('viz.objectToArray.newArray')}
          </p>
          {step.result.length === 0 ? (
            <p className="font-mono text-sm text-slate-500">[ ]</p>
          ) : (
            <GuestRow items={step.result} states={step.resultStates} />
          )}
        </OperationPanel>
      )}
    />
  )
}

export default ObjectToArray
