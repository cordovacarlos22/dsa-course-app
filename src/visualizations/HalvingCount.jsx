import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'

// A logarithm counts halvings: 16 → 8 → 4 → 2 → 1 is 4 halvings, so
// log₂(16) = 4. Each step throws away half of what's left.

const TOTAL = 16
const STEPS = [
  { captionKey: 'start', left: 16, halvings: 0 },
  { captionKey: 'half', left: 8, halvings: 1 },
  { captionKey: 'half', left: 4, halvings: 2 },
  { captionKey: 'half', left: 2, halvings: 3 },
  { captionKey: 'one', left: 1, halvings: 4 },
  { captionKey: 'big', left: 1, halvings: 4 },
]

function HalvingCount() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.halvingCount.${step.captionKey}`, {
      left: step.left,
      halvings: step.halvings,
    }),
  }))
  return (
    <StepPlayer
      title={t('viz.halvingCount.title')}
      steps={steps}
      renderStep={(step) => (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: TOTAL }, (_, index) => (
              <span
                key={index}
                className={`h-8 w-8 rounded-md border-2 transition-colors duration-500 ${
                  index < step.left
                    ? 'border-brand bg-sky-100'
                    : 'border-slate-200 bg-slate-50'
                }`}
              />
            ))}
          </div>
          <p className="text-sm font-semibold text-brand">
            {t('viz.halvingCount.counter', {
              left: step.left,
              count: step.halvings,
            })}
          </p>
        </div>
      )}
    />
  )
}

export default HalvingCount
