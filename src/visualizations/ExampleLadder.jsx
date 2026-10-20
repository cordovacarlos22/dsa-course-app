import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import ObjectCards from './ObjectCards'

// Examples for charCount, from simple to invalid. The simple ones have an
// obvious answer; the harder ones raise questions to ask before coding.
// The last step shows the answers we decided on: lowercase letters and
// digits only.

const ROWS = [
  { kind: 'simple', input: "'aaa'", output: [['a', 3]] },
  {
    kind: 'simple',
    input: "'banana'",
    output: [
      ['b', 1],
      ['a', 3],
      ['n', 2],
    ],
  },
  {
    kind: 'complex',
    input: "'Hi Ana!'",
    questions: ['spaces', 'case', 'punctuation'],
    decided: [
      ['h', 1],
      ['i', 1],
      ['a', 2],
      ['n', 1],
    ],
  },
  {
    kind: 'complex',
    input: "'Party at 8!'",
    questions: ['digits'],
    decided: [
      ['p', 1],
      ['a', 2],
      ['r', 1],
      ['t', 2],
      ['y', 1],
      ['8', 1],
    ],
  },
  { kind: 'empty', input: "''", questions: ['empty'], decided: [] },
  { kind: 'invalid', input: '42', questions: ['invalid'], decided: null },
]

const STEPS = [
  { captionKey: 'start', rows: 0 },
  ...ROWS.map((row, index) => ({ captionKey: `row${index}`, rows: index + 1 })),
  { captionKey: 'decided', rows: ROWS.length, decided: true },
]

function RowOutput({ row, decided }) {
  const { t } = useTranslation()
  if (row.output) return <ObjectCards entries={row.output} />
  if (decided && row.decided) {
    return row.decided.length === 0 ? (
      <span className="font-mono text-sm">{'{}'}</span>
    ) : (
      <ObjectCards entries={row.decided} />
    )
  }
  if (decided) {
    return (
      <span className="text-sm font-semibold text-slate-600">
        {t('viz.exampleLadder.onlyStrings')}
      </span>
    )
  }
  return (
    <ul className="flex flex-wrap gap-1.5">
      {row.questions.map((question) => (
        <li
          key={question}
          className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-900"
        >
          {t(`viz.exampleLadder.questions.${question}`)}
        </li>
      ))}
    </ul>
  )
}

function ExampleLadder() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.exampleLadder.${step.captionKey}`),
  }))
  return (
    <StepPlayer
      title={t('viz.exampleLadder.title')}
      steps={steps}
      renderStep={(step) => (
        <ol className="min-h-24 space-y-2">
          {ROWS.slice(0, step.rows).map((row, index) => (
            <li
              key={row.input}
              className={`grid gap-1 rounded-xl border p-2 transition-colors duration-500 @lg:grid-cols-[9rem_minmax(0,1fr)] @lg:items-center ${
                index === step.rows - 1 && !step.decided
                  ? 'border-brand ring-2 ring-brand/30'
                  : 'border-slate-200'
              }`}
            >
              <div>
                <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                  {t(`viz.exampleLadder.kinds.${row.kind}`)}
                </p>
                <p className="font-mono text-sm">charCount({row.input})</p>
              </div>
              <RowOutput row={row} decided={step.decided} />
            </li>
          ))}
        </ol>
      )}
    />
  )
}

export default ExampleLadder
