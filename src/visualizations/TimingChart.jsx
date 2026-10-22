import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'

// Visualizing time complexity: time sumOneTo with a loop and with the formula
// for bigger and bigger n, and plot the results. The loop's times line up in
// a straight line; the formula's stay flat near zero. The times are example
// values of what a real run can look like (they change on every computer).

const SIZES = [200, 400, 600, 800, 1000] // millions
const LOOP_SECONDS = [0.26, 0.49, 0.77, 0.98, 1.24]
const FORMULA_SECONDS = [0.0001, 0, 0.0001, 0.0001, 0]

const WIDTH = 320
const HEIGHT = 190
const PAD = 34
const x = (millions) => PAD + (millions / 1000) * (WIDTH - PAD * 1.5)
const y = (seconds) => HEIGHT - PAD - (seconds / 1.4) * (HEIGHT - PAD * 2)

const STEPS = [
  { captionKey: 'start', loop: 0, formula: 0 },
  { captionKey: 'firstPoint', loop: 1, formula: 0 },
  { captionKey: 'loopLine', loop: 5, formula: 0 },
  { captionKey: 'formula', loop: 5, formula: 5 },
  { captionKey: 'noise', loop: 5, formula: 5 },
  { captionKey: 'summary', loop: 5, formula: 5 },
]

function Points({ count, seconds, className }) {
  const shown = SIZES.slice(0, count)
  if (shown.length === 0) return null
  const path = shown
    .map((size, k) => `${k === 0 ? 'M' : 'L'}${x(size)},${y(seconds[k])}`)
    .join(' ')
  return (
    <g>
      {shown.length > 1 && (
        <path d={path} fill="none" strokeWidth="2" className={className} />
      )}
      {shown.map((size, k) => (
        <circle
          key={size}
          cx={x(size)}
          cy={y(seconds[k])}
          r="4"
          className={className.replace('stroke', 'fill')}
        />
      ))}
    </g>
  )
}

function TimingChart() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.timingChart.${step.captionKey}`),
  }))
  return (
    <StepPlayer
      title={t('viz.timingChart.title')}
      steps={steps}
      renderStep={(step) => (
        <div>
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full max-w-md"
            role="img"
            aria-label={t('viz.timingChart.title')}
          >
            <line
              x1={PAD}
              y1={HEIGHT - PAD}
              x2={WIDTH - 8}
              y2={HEIGHT - PAD}
              className="stroke-slate-300"
            />
            <line
              x1={PAD}
              y1={10}
              x2={PAD}
              y2={HEIGHT - PAD}
              className="stroke-slate-300"
            />
            {SIZES.map((size) => (
              <text
                key={size}
                x={x(size)}
                y={HEIGHT - PAD + 14}
                textAnchor="middle"
                className="fill-slate-500 text-[9px]"
              >
                {size === 1000 ? '1B' : `${size}M`}
              </text>
            ))}
            {[0.5, 1].map((seconds) => (
              <text
                key={seconds}
                x={PAD - 6}
                y={y(seconds) + 3}
                textAnchor="end"
                className="fill-slate-500 text-[9px]"
              >
                {seconds}s
              </text>
            ))}
            <text
              x={WIDTH - 8}
              y={HEIGHT - 6}
              textAnchor="end"
              className="fill-slate-500 text-[9px]"
            >
              n
            </text>
            <Points
              count={step.loop}
              seconds={LOOP_SECONDS}
              className="stroke-brand"
            />
            <Points
              count={step.formula}
              seconds={FORMULA_SECONDS}
              className="stroke-green-600"
            />
          </svg>
          <p className="mt-1 flex flex-wrap gap-4 text-xs text-slate-600">
            <span>
              <span className="mr-1 inline-block h-2 w-4 rounded bg-brand align-middle" />
              {t('viz.timingChart.loopLegend')}
            </span>
            <span>
              <span className="mr-1 inline-block h-2 w-4 rounded bg-green-600 align-middle" />
              {t('viz.timingChart.formulaLegend')}
            </span>
          </p>
        </div>
      )}
    />
  )
}

export default TimingChart
