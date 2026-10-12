import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import GuestRow from './GuestRow'

// Inserting or removing in the middle of an array: every item after that spot
// gets a new index, so splice in the middle is O(n), not "O(n/2)".

const STEPS = [
  {
    captionKey: 'start',
    items: ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli'],
    states: {},
  },
  {
    captionKey: 'insert',
    items: ['Ana', 'Zoe', 'Ben', 'Cleo', 'Dev', 'Eli'],
    states: { 1: 'new', 2: 'moved', 3: 'moved', 4: 'moved', 5: 'moved' },
  },
  {
    captionKey: 'remove',
    items: ['Ana', 'Zoe', 'Cleo', 'Dev', 'Eli'],
    states: { 2: 'moved', 3: 'moved', 4: 'moved' },
  },
  {
    captionKey: 'notHalf',
    items: ['Ana', 'Zoe', 'Cleo', 'Dev', 'Eli'],
    states: {},
  },
]

function ArraySplice() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.arraySplice.${step.captionKey}`),
  }))
  return (
    <StepPlayer
      title={t('viz.arraySplice.title')}
      steps={steps}
      renderStep={(step) => (
        <div className="space-y-2">
          <p className="font-mono text-sm">
            {step.captionKey === 'insert'
              ? "guests.splice(1, 0, 'Zoe')"
              : step.captionKey === 'remove'
                ? 'guests.splice(2, 1)'
                : 'guests'}
          </p>
          <GuestRow items={step.items} states={step.states} />
          <p className="flex gap-4 text-xs text-slate-500">
            <span>
              <span className="mr-1 inline-block h-3 w-3 rounded-sm border-2 border-green-600 bg-green-50 align-middle" />
              {t('viz.arrayReindex.legendNew')}
            </span>
            <span>
              <span className="mr-1 inline-block h-3 w-3 rounded-sm border-2 border-accent bg-amber-50 align-middle" />
              {t('viz.arrayReindex.legendMoved')}
            </span>
          </p>
        </div>
      )}
    />
  )
}

export default ArraySplice
