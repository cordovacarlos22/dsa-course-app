import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import { buildBinarySearchSteps } from './binarySearchSteps'

// Walks through a real binary search, so the animation can never disagree
// with the algorithm: each check throws away half of what's left.

const VALUES = [2, 4, 6, 8, 10, 12, 14, 16]
const TARGET = 14

function SearchRow({ step }) {
  return (
    <ol className="flex gap-1.5">
      {VALUES.map((value, index) => {
        const isOutOfRange = index < step.low || index > step.high
        const isMiddle = index === step.middle
        const isFound = isMiddle && step.captionKey === 'found'
        let style = 'border-slate-300 bg-white'
        if (isOutOfRange) style = 'border-slate-200 bg-slate-100 text-slate-300'
        if (isMiddle) style = 'border-brand bg-sky-50'
        if (isFound) style = 'border-green-600 bg-green-50'
        return (
          <li
            key={value}
            className={`flex h-12 w-11 items-center justify-center rounded-lg border-2 font-bold transition-colors duration-500 ${style}`}
          >
            {value}
          </li>
        )
      })}
    </ol>
  )
}

function BinarySearchHalving() {
  const { t } = useTranslation()
  const steps = buildBinarySearchSteps(VALUES, TARGET).map((step) => ({
    ...step,
    caption: t(`viz.binarySearch.${step.captionKey}`, {
      target: TARGET,
      count: VALUES.length,
      middle: step.middle === null ? '' : VALUES[step.middle],
      checks: step.checks,
    }),
  }))

  return (
    <StepPlayer
      title={t('viz.binarySearch.title')}
      steps={steps}
      renderStep={(step) => <SearchRow step={step} />}
    />
  )
}

export default BinarySearchHalving
