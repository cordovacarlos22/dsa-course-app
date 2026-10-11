import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'

// Draws O(1), O(log n), O(n) and O(n²) on the same chart, one per step,
// so students can see how differently they grow.

const WIDTH = 340
const HEIGHT = 200
const PADDING = 30
// Extra room on the right for the curve labels ("O(log n)").
const LABEL_ROOM = 60
const MAX_N = 20
const MAX_OPERATIONS = 20

const CURVES = [
  {
    label: 'O(1)',
    color: '#16a34a',
    operations: () => 1,
    captionKey: 'constant',
  },
  {
    label: 'O(log n)',
    color: '#0b84d8',
    operations: (n) => Math.log2(n),
    captionKey: 'log',
  },
  {
    label: 'O(n)',
    color: '#f59e0b',
    operations: (n) => n,
    captionKey: 'linear',
  },
  {
    label: 'O(n²)',
    color: '#dc2626',
    operations: (n) => n * n,
    captionKey: 'quadratic',
  },
]

// Converts (n, operations) into SVG coordinates. SVG's y grows downwards,
// so we flip it.
function toPoint(n, operations) {
  const x = PADDING + (n / MAX_N) * (WIDTH - PADDING - LABEL_ROOM)
  const clipped = Math.min(operations, MAX_OPERATIONS)
  const y =
    HEIGHT - PADDING - (clipped / MAX_OPERATIONS) * (HEIGHT - PADDING * 2)
  return `${x.toFixed(1)},${y.toFixed(1)}`
}

function curvePoints(curve) {
  const points = []
  for (let n = 1; n <= MAX_N; n++) {
    points.push(toPoint(n, curve.operations(n)))
    // Stop once the curve leaves the top of the chart.
    if (curve.operations(n) >= MAX_OPERATIONS) break
  }
  return points.join(' ')
}

function Chart({ visibleCount }) {
  const { t } = useTranslation()
  const bottom = HEIGHT - PADDING

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full max-w-md"
      role="img"
      aria-label={CURVES.slice(0, visibleCount)
        .map((curve) => curve.label)
        .join(', ')}
    >
      <line
        x1={PADDING}
        y1={bottom}
        x2={WIDTH - LABEL_ROOM}
        y2={bottom}
        stroke="#94a3b8"
      />
      <line
        x1={PADDING}
        y1={PADDING}
        x2={PADDING}
        y2={bottom}
        stroke="#94a3b8"
      />
      <text
        x={(WIDTH - LABEL_ROOM + PADDING) / 2}
        y={HEIGHT - 6}
        textAnchor="middle"
        fontSize="10"
        fill="#64748b"
      >
        {t('viz.bigOGrowth.axisN')}
      </text>
      <text
        x={10}
        y={HEIGHT / 2}
        fontSize="10"
        fill="#64748b"
        transform={`rotate(-90 10 ${HEIGHT / 2})`}
        textAnchor="middle"
      >
        {t('viz.bigOGrowth.axisOps')}
      </text>

      {CURVES.slice(0, visibleCount).map((curve) => {
        const points = curvePoints(curve)
        const lastPoint = points.split(' ').at(-1).split(',')
        return (
          <g key={curve.label}>
            <polyline
              points={points}
              fill="none"
              stroke={curve.color}
              strokeWidth="2.5"
            />
            <text
              x={Number(lastPoint[0]) + 4}
              y={Number(lastPoint[1]) + 4}
              fontSize="11"
              fontWeight="bold"
              fill={curve.color}
            >
              {curve.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function BigOGrowthChart() {
  const { t } = useTranslation()

  // One step per curve, plus a summary step showing all of them.
  const steps = [
    ...CURVES.map((curve, index) => ({
      visibleCount: index + 1,
      caption: t(`viz.bigOGrowth.${curve.captionKey}`),
    })),
    { visibleCount: CURVES.length, caption: t('viz.bigOGrowth.summary') },
  ]

  return (
    <StepPlayer
      title={t('viz.bigOGrowth.title')}
      steps={steps}
      renderStep={(step) => <Chart visibleCount={step.visibleCount} />}
    />
  )
}

export default BigOGrowthChart
