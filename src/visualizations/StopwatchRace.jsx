import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'

// The same code timed on two computers: the times change from machine to
// machine (and from run to run), but the number of steps never does.
// The times are made-up examples of what a real run can look like.

const STEPS = [
  { captionKey: 'start', guests: 6, laptop: null, phone: null },
  { captionKey: 'firstRun', guests: 6, laptop: 0.4, phone: 2.1 },
  { captionKey: 'secondRun', guests: 6, laptop: 0.7, phone: 1.6 },
  { captionKey: 'moreGuests', guests: 12, laptop: 0.9, phone: 3.8 },
  { captionKey: 'summary', guests: 12, laptop: 0.9, phone: 3.8 },
]

function Machine({ icon, label, ms, steps }) {
  const { t } = useTranslation()
  return (
    <div className="flex-1 rounded-xl border border-slate-200 p-3">
      <p className="text-sm font-semibold">
        <span aria-hidden="true">{icon}</span> {label}
      </p>
      <p className="mt-2 text-2xl font-extrabold tabular-nums">
        ⏱ {ms === null ? '—' : `${ms} ms`}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        {t('viz.stopwatchRace.steps', { count: ms === null ? 0 : steps })}
      </p>
      <div className="mt-1 flex flex-wrap gap-1">
        {Array.from({ length: ms === null ? 0 : steps }, (_, index) => (
          <span key={index} className="h-3 w-3 rounded-sm bg-brand" />
        ))}
      </div>
    </div>
  )
}

function StopwatchRace() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.stopwatchRace.${step.captionKey}`, { n: step.guests }),
  }))
  return (
    <StepPlayer
      title={t('viz.stopwatchRace.title')}
      steps={steps}
      renderStep={(step) => (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Machine
            icon="💻"
            label={t('viz.stopwatchRace.laptop')}
            ms={step.laptop}
            steps={step.guests}
          />
          <Machine
            icon="📱"
            label={t('viz.stopwatchRace.phone')}
            ms={step.phone}
            steps={step.guests}
          />
        </div>
      )}
    />
  )
}

export default StopwatchRace
