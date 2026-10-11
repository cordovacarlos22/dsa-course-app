import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'

// Shows why push/pop are O(1) but shift/unshift are O(n): changing the start
// of an array forces every other item to get a new index.

// Each item: its value and what happened to it in this step
// ("new" = just added, "moved" = got a new index, undefined = untouched).
const STEPS = [
  {
    captionKey: 'start',
    items: [{ value: 11 }, { value: 3 }, { value: 23 }, { value: 7 }],
  },
  {
    captionKey: 'push',
    items: [
      { value: 11 },
      { value: 3 },
      { value: 23 },
      { value: 7 },
      { value: 17, change: 'new' },
    ],
  },
  {
    captionKey: 'pop',
    items: [{ value: 11 }, { value: 3 }, { value: 23 }, { value: 7 }],
  },
  {
    captionKey: 'shift',
    items: [
      { value: 3, change: 'moved' },
      { value: 23, change: 'moved' },
      { value: 7, change: 'moved' },
    ],
  },
  {
    captionKey: 'unshift',
    items: [
      { value: 11, change: 'new' },
      { value: 3, change: 'moved' },
      { value: 23, change: 'moved' },
      { value: 7, change: 'moved' },
    ],
  },
]

const CHANGE_STYLES = {
  new: 'border-green-600 bg-green-50',
  moved: 'border-accent bg-amber-50',
}

function ArrayBoxes({ items }) {
  const { t } = useTranslation()
  return (
    <div>
      <ol className="flex gap-2">
        {items.map((item, index) => (
          <li
            key={`${index}-${item.value}`}
            className={`flex w-16 flex-col items-center rounded-lg border-2 py-2 transition-colors duration-500 ${
              CHANGE_STYLES[item.change] ?? 'border-slate-300 bg-white'
            }`}
          >
            <span className="text-lg font-bold">{item.value}</span>
            <span className="text-xs text-slate-500">
              {t('viz.arrayReindex.index', { index })}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 flex gap-4 text-xs text-slate-500">
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
  )
}

function ArrayReindex() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.arrayReindex.${step.captionKey}`),
  }))

  return (
    <StepPlayer
      title={t('viz.arrayReindex.title')}
      steps={steps}
      renderStep={(step) => <ArrayBoxes items={step.items} />}
    />
  )
}

export default ArrayReindex
