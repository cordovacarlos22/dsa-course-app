import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import GuestRow from './GuestRow'
import { guestList } from './guests'

// O(n): one step per guest. Each time the list doubles, the row of steps
// doubles, and the dots on the chart line up in a straight line.

const SIZES = [4, 8, 16]
const STEPS = [
  ...[1, 2, 3, 4].map((lit) => ({
    captionKey: lit === 4 ? 'four' : 'one',
    n: 4,
    lit,
  })),
  { captionKey: 'eight', n: 8, lit: 8 },
  { captionKey: 'sixteen', n: 16, lit: 16 },
  { captionKey: 'line', n: 16, lit: 16 },
]

const WIDTH = 220
const HEIGHT = 120
const PAD = 22

// Steps vs guests: a dot for every size we have already shown.
function MiniChart({ upTo }) {
  const { t } = useTranslation()
  const shown = SIZES.filter((size) => size <= upTo)
  const x = (n) => PAD + (n / 16) * (WIDTH - PAD * 2)
  const y = (steps) => HEIGHT - PAD - (steps / 16) * (HEIGHT - PAD * 2)
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full max-w-xs"
      role="img"
      aria-label={t('viz.linearBoxes.chartLabel')}
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
      {shown.length > 1 && (
        <line
          x1={x(4)}
          y1={y(4)}
          x2={x(shown.at(-1))}
          y2={y(shown.at(-1))}
          className="stroke-brand"
          strokeWidth="2"
          strokeDasharray="4 3"
        />
      )}
      {shown.map((n) => (
        <g key={n}>
          <circle cx={x(n)} cy={y(n)} r="4" className="fill-brand" />
          <text
            x={x(n)}
            y={HEIGHT - 6}
            textAnchor="middle"
            className="fill-slate-500 text-[9px]"
          >
            {n}
          </text>
        </g>
      ))}
      <text
        x={WIDTH - PAD}
        y={HEIGHT - 6}
        textAnchor="end"
        className="fill-slate-400 text-[9px]"
      >
        n
      </text>
      <text x={4} y={PAD - 6} className="fill-slate-400 text-[9px]">
        {t('viz.linearBoxes.stepsAxis')}
      </text>
    </svg>
  )
}

function LinearBoxes() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.linearBoxes.${step.captionKey}`, {
      n: step.n,
      lit: step.lit,
      guest: guestList(4)[step.lit - 1],
    }),
  }))
  return (
    <StepPlayer
      title={t('viz.linearBoxes.title')}
      steps={steps}
      renderStep={(step) => (
        <div className="space-y-3">
          <GuestRow
            items={guestList(step.n)}
            states={Object.fromEntries(
              Array.from({ length: step.lit }, (_, k) => [
                k,
                k === step.lit - 1 && step.n === 4 && step.lit < 4
                  ? 'active'
                  : 'found',
              ]),
            )}
          />
          <p className="text-sm font-semibold text-brand">
            {t('viz.linearBoxes.count', { n: step.n, count: step.lit })}
          </p>
          <MiniChart upTo={step.lit === step.n ? step.n : 0} />
        </div>
      )}
    />
  )
}

export default LinearBoxes
