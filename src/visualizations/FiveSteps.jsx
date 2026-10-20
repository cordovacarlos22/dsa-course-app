import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'

// The 5-step method from A Problem-Solving Approach, drawn as a row of
// numbered steps. Two kinds of scenes (see ./index.js):
// - no focus: the map, one step at a time
// - focus: one step, with its checklist revealed item by item
// Every text lives in src/locales/viz.<language>.json under fiveSteps.

const STEP_KEYS = ['understand', 'examples', 'breakDown', 'solve', 'lookBack']

// How many checklist items each step has (viz.fiveSteps.<step>.items.N).
const ITEM_COUNTS = {
  understand: 5,
  examples: 4,
  breakDown: 3,
  solve: 4,
  lookBack: 7,
}

function buildMapSteps() {
  return [
    { captionKey: 'start', shown: 0, current: null },
    ...STEP_KEYS.map((key, index) => ({
      captionKey: key,
      shown: index + 1,
      current: index,
    })),
    { captionKey: 'summary', shown: STEP_KEYS.length, current: null },
  ]
}

function buildFocusSteps(focus) {
  const current = STEP_KEYS.indexOf(focus)
  const steps = [{ captionKey: 'start', revealed: 0 }]
  for (let i = 1; i <= ITEM_COUNTS[focus]; i++) {
    steps.push({ captionKey: `notes.${i - 1}`, revealed: i })
  }
  steps.push({ captionKey: 'summary', revealed: ITEM_COUNTS[focus] })
  return steps.map((step) => ({
    ...step,
    shown: STEP_KEYS.length,
    current,
  }))
}

function chipStyle(index, step) {
  if (index === step.current) return 'border-brand bg-brand text-white'
  if (index < step.shown) return 'border-slate-300 bg-white text-slate-800'
  return 'border-dashed border-slate-200 bg-white text-slate-300'
}

function FiveSteps({ focus = null }) {
  const { t } = useTranslation()
  const prefix = focus ? `viz.fiveSteps.${focus}` : 'viz.fiveSteps.map'
  const steps = (focus ? buildFocusSteps(focus) : buildMapSteps()).map(
    (step) => ({ ...step, caption: t(`${prefix}.${step.captionKey}`) }),
  )
  return (
    <StepPlayer
      title={t(`${prefix}.title`)}
      steps={steps}
      renderStep={(step) => (
        <div className="space-y-3">
          <ol className="grid grid-cols-1 gap-1.5 @md:grid-cols-5">
            {STEP_KEYS.map((key, index) => (
              <li
                key={key}
                aria-current={index === step.current ? 'step' : undefined}
                className={`flex items-center gap-2 rounded-lg border-2 px-2 py-1.5 text-sm font-semibold transition-colors duration-500 @md:flex-col @md:text-center ${chipStyle(index, step)}`}
              >
                <span className="text-lg font-extrabold tabular-nums">
                  {index + 1}
                </span>
                <span>{t(`viz.fiveSteps.names.${key}`)}</span>
              </li>
            ))}
          </ol>
          {focus && (
            <ul className="space-y-1">
              {Array.from({ length: step.revealed }, (_, index) => (
                <li
                  key={index}
                  className={`flex gap-2 rounded-lg px-2 py-1 text-sm transition-colors duration-500 ${
                    index === step.revealed - 1 && step.captionKey !== 'summary'
                      ? 'bg-amber-50 font-semibold'
                      : ''
                  }`}
                >
                  <span aria-hidden="true" className="text-green-700">
                    ✓
                  </span>
                  {t(`viz.fiveSteps.${focus}.items.${index}`)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    />
  )
}

export default FiveSteps
