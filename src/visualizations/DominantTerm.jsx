import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'

// Drop the non-dominant terms: in n² + n, the n part becomes a sliver of the
// total as n grows, so we keep only n².

const SIZES = [2, 10, 100, 1000]
const STEPS = [
  ...SIZES.map((n) => ({ captionKey: 'size', n })),
  { captionKey: 'summary', n: 1000 },
]

function DominantTerm() {
  const { t } = useTranslation()
  // The lessons write big numbers as 1,000,000 in both languages.
  const format = (value) => value.toLocaleString('en-US')
  const steps = STEPS.map((step) => {
    const squared = step.n * step.n
    const share = (step.n / (squared + step.n)) * 100
    return {
      ...step,
      squared,
      share,
      caption: t(`viz.dominantTerm.${step.captionKey}`, {
        n: format(step.n),
        squared: format(squared),
        total: format(squared + step.n),
        share: share < 1 ? share.toFixed(1) : Math.round(share),
      }),
    }
  })
  return (
    <StepPlayer
      title={t('viz.dominantTerm.title')}
      steps={steps}
      renderStep={(step) => (
        <div className="space-y-2">
          <p className="font-mono text-sm">
            n = {format(step.n)} → n² + n = {format(step.squared)} +{' '}
            {format(step.n)}
          </p>
          <div className="flex h-10 w-full overflow-hidden rounded-lg border border-slate-300">
            <div
              className="flex items-center justify-center bg-brand text-xs font-bold text-white transition-all duration-700"
              style={{ width: `${100 - step.share}%` }}
            >
              n²
            </div>
            <div
              className="flex items-center justify-center bg-accent text-xs font-bold transition-all duration-700"
              style={{ width: `${step.share}%`, minWidth: '4px' }}
            >
              {step.share > 8 ? 'n' : ''}
            </div>
          </div>
          <p className="text-sm text-slate-600">
            {t('viz.dominantTerm.share', {
              share:
                step.share < 1 ? step.share.toFixed(1) : Math.round(step.share),
            })}
          </p>
        </div>
      )}
    />
  )
}

export default DominantTerm
