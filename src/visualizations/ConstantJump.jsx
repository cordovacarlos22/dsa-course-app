import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import GuestRow from './GuestRow'
import { guestList } from './guests'

// O(1): reading guests[3] jumps straight to that box. It takes one step for
// 6 guests and one step for a million guests.

const SMALL = guestList(6)
// A million guests can't be drawn, so we draw the start, a gap and the end.
const HUGE = ['Ana', 'Ben', '…', '?', '…', '?']
const HUGE_LABELS = ['0', '1', '…', '500000', '…', '999999']

const STEPS = [
  { captionKey: 'start', huge: false, target: null },
  { captionKey: 'jump', huge: false, target: 3 },
  { captionKey: 'length', huge: false, target: null, length: true },
  { captionKey: 'huge', huge: true, target: 3 },
  { captionKey: 'summary', huge: true, target: 3 },
]

function ConstantJump() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.constantJump.${step.captionKey}`),
  }))
  return (
    <StepPlayer
      title={t('viz.constantJump.title')}
      steps={steps}
      renderStep={(step) => (
        <div className="space-y-3">
          <p className="font-mono text-sm">
            {step.length
              ? 'guests.length'
              : step.target === null
                ? 'guests'
                : step.huge
                  ? 'guests[500000]'
                  : 'guests[3]'}
          </p>
          <GuestRow
            items={step.huge ? HUGE : SMALL}
            indexLabels={step.huge ? HUGE_LABELS : null}
            states={step.target === null ? {} : { [step.target]: 'found' }}
            pointers={
              step.target === null ? [] : [{ index: step.target, label: '1' }]
            }
          />
          <p className="text-sm font-semibold text-brand">
            {t('viz.constantJump.steps', {
              count: step.target === null && !step.length ? 0 : 1,
            })}
          </p>
        </div>
      )}
    />
  )
}

export default ConstantJump
