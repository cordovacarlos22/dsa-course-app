import { useTranslation } from 'react-i18next'
import LandingSection from './LandingSection'

// <details>/<summary> open and close on their own (and work with the
// keyboard), so the FAQ needs no JavaScript.
function Faq() {
  const { t } = useTranslation()
  const questions = t('landing.faq', { returnObjects: true })

  return (
    <LandingSection id="faq" title={t('landing.faqTitle')}>
      <div className="mx-auto max-w-2xl space-y-3">
        {questions.map(({ q, a }) => (
          <details
            key={q}
            className="group rounded-2xl border border-slate-200 bg-white p-5"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
              {q}
              <span
                aria-hidden="true"
                className="text-brand transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-slate-600">{a}</p>
          </details>
        ))}
      </div>
    </LandingSection>
  )
}

export default Faq
