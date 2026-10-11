import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import GuestRow from './GuestRow'
import { guestList } from './guests'

// The same search does different amounts of work depending on where the name
// is: best case (Ω), average case (Θ) and worst case (O).

const GUESTS = guestList(8)

// Checks the list from the start, like isInvited, and colors the boxes.
function searchFor(name) {
  const states = {}
  let checks = 0
  for (let i = 0; i < GUESTS.length; i++) {
    checks++
    if (GUESTS[i] === name) {
      states[i] = 'found'
      return { states, checks }
    }
    states[i] = 'done'
  }
  return { states, checks }
}

const STEPS = [
  { captionKey: 'start', name: null, letter: null },
  { captionKey: 'best', name: 'Ana', letter: 'Ω' },
  { captionKey: 'average', name: 'Dev', letter: 'Θ' },
  { captionKey: 'worst', name: 'Zoe', letter: 'O' },
  { captionKey: 'summary', name: 'Zoe', letter: 'O' },
].map((step) => ({ ...step, ...(step.name ? searchFor(step.name) : {}) }))

function SearchCases() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.searchCases.${step.captionKey}`, {
      name: step.name,
      checks: step.checks,
      n: GUESTS.length,
    }),
  }))
  return (
    <StepPlayer
      title={t('viz.searchCases.title')}
      steps={steps}
      renderStep={(step) => (
        <div className="space-y-3">
          <p className="flex flex-wrap items-center gap-3 text-sm">
            <span>
              {t('viz.searchCases.looking')}{' '}
              <strong>{step.name ? `'${step.name}'` : '—'}</strong>
            </span>
            {step.letter && (
              <span className="rounded-full bg-brand px-3 py-0.5 font-bold text-white">
                {step.letter} ·{' '}
                {t('viz.searchCases.checks', { count: step.checks })}
              </span>
            )}
          </p>
          <GuestRow items={GUESTS} states={step.states} />
        </div>
      )}
    />
  )
}

export default SearchCases
