import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'

// Drop the constants: n, 2n and 3n are all straight lines (only steeper),
// while n² bends upward. Big O cares about the shape, not the steepness.

const WIDTH = 300
const HEIGHT = 170
const PAD = 26
const MAX_N = 10
const MAX_OPS = 30

const LINES = {
  n: { color: 'stroke-brand', label: 'n', ops: (n) => n },
  twoN: { color: 'stroke-green-600', label: '2n', ops: (n) => 2 * n },
  threeN: { color: 'stroke-amber-500', label: '3n', ops: (n) => 3 * n },
  nSquared: { color: 'stroke-red-500', label: 'n²', ops: (n) => n * n },
}

const STEPS = [
  { captionKey: 'n', lines: ['n'] },
  { captionKey: 'twoN', lines: ['n', 'twoN'] },
  { captionKey: 'threeN', lines: ['n', 'twoN', 'threeN'] },
  { captionKey: 'nSquared', lines: ['n', 'twoN', 'threeN', 'nSquared'] },
  { captionKey: 'summary', lines: ['n', 'twoN', 'threeN', 'nSquared'] },
]

const x = (n) => PAD + (n / MAX_N) * (WIDTH - PAD * 2)
const y = (ops) =>
  HEIGHT - PAD - (Math.min(ops, MAX_OPS) / MAX_OPS) * (HEIGHT - PAD * 2)

function pathFor(ops) {
  const points = []
  for (let n = 0; n <= MAX_N; n += 0.25) {
    if (ops(n) > MAX_OPS) break
    points.push(`${x(n).toFixed(1)},${y(ops(n)).toFixed(1)}`)
  }
  return `M${points.join(' L')}`
}

function SameShape() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.sameShape.${step.captionKey}`),
  }))
  return (
    <StepPlayer
      title={t('viz.sameShape.title')}
      steps={steps}
      renderStep={(step) => (
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full max-w-md"
          role="img"
          aria-label={t('viz.sameShape.title')}
        >
          <line
            x1={PAD}
            y1={HEIGHT - PAD}
            x2={WIDTH - PAD}
            y2={HEIGHT - PAD}
            className="stroke-slate-300"
          />
          <line
            x1={PAD}
            y1={PAD}
            x2={PAD}
            y2={HEIGHT - PAD}
            className="stroke-slate-300"
          />
          <text
            x={WIDTH - PAD}
            y={HEIGHT - 8}
            textAnchor="end"
            className="fill-slate-500 text-[10px]"
          >
            n
          </text>
          <text x={4} y={PAD - 8} className="fill-slate-500 text-[10px]">
            {t('viz.sameShape.axisOps')}
          </text>
          {step.lines.map((key) => {
            const line = LINES[key]
            const path = pathFor(line.ops)
            const lastPoint = path
              .split(' L')
              .at(-1)
              .replace('M', '')
              .split(',')
            return (
              <g key={key}>
                <path
                  d={path}
                  fill="none"
                  strokeWidth="2.5"
                  className={line.color}
                />
                <text
                  x={Number(lastPoint[0]) + 4}
                  y={Number(lastPoint[1]) + 3}
                  className="fill-slate-700 text-[11px] font-bold"
                >
                  {line.label}
                </text>
              </g>
            )
          })}
        </svg>
      )}
    />
  )
}

export default SameShape
