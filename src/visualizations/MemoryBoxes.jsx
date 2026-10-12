import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import { guestList } from './guests'

// Space complexity: counting the guests needs one box of memory, whatever the
// list size (O(1) space). Making a name tag for every guest needs one new box
// per guest (O(n) space).

const STEPS = [
  { captionKey: 'counter', n: 3, tags: false },
  { captionKey: 'counterBig', n: 6, tags: false },
  { captionKey: 'tags', n: 3, tags: true },
  { captionKey: 'tagsBig', n: 6, tags: true },
  { captionKey: 'summary', n: 6, tags: true },
]

function MemoryBoxes() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.memoryBoxes.${step.captionKey}`, { n: step.n }),
  }))
  return (
    <StepPlayer
      title={t('viz.memoryBoxes.title')}
      steps={steps}
      renderStep={(step) => (
        <div className="space-y-3">
          <p className="font-mono text-sm">
            {step.tags ? 'makeNameTags(guests)' : 'countGuests(guests)'} · n ={' '}
            {step.n}
          </p>
          <div className="rounded-xl border-2 border-dashed border-slate-300 p-3">
            <p className="mb-2 text-xs font-semibold text-slate-500 uppercase">
              {t('viz.memoryBoxes.memory')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {step.tags ? (
                guestList(step.n).map((guest) => (
                  <span
                    key={guest}
                    className="rounded-lg border-2 border-green-600 bg-green-50 px-2 py-1.5 text-xs font-bold"
                  >
                    🏷 {guest}
                  </span>
                ))
              ) : (
                <span className="rounded-lg border-2 border-brand bg-sky-50 px-2 py-1.5 font-mono text-xs font-bold">
                  count = {step.n}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm font-semibold text-brand">
            {t('viz.memoryBoxes.boxes', { count: step.tags ? step.n : 1 })}
          </p>
        </div>
      )}
    />
  )
}

export default MemoryBoxes
