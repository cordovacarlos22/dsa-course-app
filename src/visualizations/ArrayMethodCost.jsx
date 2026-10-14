import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import GuestRow from './GuestRow'
import OperationPanel from './OperationPanel'
import { guestList } from './guests'

// "How many boxes does it touch?" for the built-in array methods.
// Two scenes, one per lesson step (see ./index.js):
// - copies: concat, slice and splice (they copy or move items)
// - loops: forEach, map, filter and reduce (they visit every item once)

const SIX = guestList(6)
const MORE = ['Gus', 'Hana', 'Ivan']
const FIVE = guestList(5)

// { from: state, …, to - 1: state }
function boxes(from, to, state) {
  const states = {}
  for (let i = from; i < to; i++) states[i] = state
  return states
}

const SCENES = {
  copies: [
    { captionKey: 'start', code: 'guests', rows: [{ items: SIX }] },
    {
      captionKey: 'concat',
      code: 'guests.concat(more)',
      rows: [
        { label: 'guests', items: SIX, states: boxes(0, 6, 'done') },
        { label: 'more', items: MORE, states: boxes(0, 3, 'done') },
      ],
      result: { items: [...SIX, ...MORE], states: boxes(0, 9, 'new') },
      work: 9,
    },
    {
      captionKey: 'slice',
      code: 'guests.slice(1, 4)',
      rows: [{ items: SIX, states: boxes(1, 4, 'done') }],
      result: { items: SIX.slice(1, 4), states: boxes(0, 3, 'new') },
      work: 3,
    },
    {
      captionKey: 'sliceAll',
      code: 'guests.slice()',
      rows: [{ items: SIX, states: boxes(0, 6, 'done') }],
      result: { items: SIX, states: boxes(0, 6, 'new') },
      work: 6,
    },
    {
      captionKey: 'spliceMiddle',
      code: "guests.splice(2, 0, 'Zoe')",
      rows: [
        {
          items: [...SIX.slice(0, 2), 'Zoe', ...SIX.slice(2)],
          states: { 2: 'new', ...boxes(3, 7, 'moved') },
        },
      ],
      work: 5,
    },
    {
      captionKey: 'spliceStart',
      code: "guests.splice(0, 0, 'Zoe')",
      rows: [
        {
          items: ['Zoe', ...SIX],
          states: { 0: 'new', ...boxes(1, 7, 'moved') },
        },
      ],
      work: 7,
    },
    { captionKey: 'summary', code: 'guests', rows: [{ items: SIX }] },
  ],
  loops: [
    { captionKey: 'start', code: 'guests', rows: [{ items: FIVE }] },
    {
      captionKey: 'forEach',
      code: 'guests.forEach((name) => console.log(name))',
      rows: [{ items: FIVE, states: boxes(0, 5, 'done') }],
      work: 5,
    },
    {
      captionKey: 'map',
      code: 'guests.map((name) => name.toUpperCase())',
      rows: [{ items: FIVE, states: boxes(0, 5, 'done') }],
      result: {
        items: FIVE.map((name) => name.toUpperCase()),
        states: boxes(0, 5, 'new'),
      },
      work: 5,
    },
    {
      captionKey: 'filter',
      code: 'guests.filter((name) => name.length === 3)',
      rows: [{ items: FIVE, states: boxes(0, 5, 'done') }],
      result: {
        items: FIVE.filter((name) => name.length === 3),
        states: boxes(0, 4, 'new'),
      },
      work: 5,
    },
    {
      captionKey: 'reduce',
      code: 'guests.reduce((total, name) => total + name.length, 0)',
      rows: [{ items: FIVE, states: boxes(0, 5, 'done') }],
      value: FIVE.reduce((total, name) => total + name.length, 0),
      work: 5,
    },
    { captionKey: 'summary', code: 'guests', rows: [{ items: FIVE }] },
  ],
}

function ArrayMethodCost({ scene }) {
  const { t } = useTranslation()
  const steps = SCENES[scene].map((step) => ({
    ...step,
    caption: t(`viz.arrayMethodCost.${scene}.${step.captionKey}`, {
      value: step.value,
    }),
  }))
  return (
    <StepPlayer
      title={t(`viz.arrayMethodCost.${scene}.title`)}
      steps={steps}
      renderStep={(step) => (
        <OperationPanel code={step.code} work={step.work ?? null}>
          {step.rows.map((row, index) => (
            <div key={index}>
              {row.label && (
                <p className="font-mono text-xs text-slate-500">{row.label}</p>
              )}
              <GuestRow items={row.items} states={row.states} />
            </div>
          ))}
          {step.result && (
            <div>
              <p className="text-xs font-bold text-slate-500">
                {t('viz.arrayMethodCost.newArray')}
              </p>
              <GuestRow items={step.result.items} states={step.result.states} />
            </div>
          )}
          {step.value !== undefined && (
            <p className="font-mono text-lg font-bold">→ {step.value}</p>
          )}
        </OperationPanel>
      )}
    />
  )
}

export default ArrayMethodCost
