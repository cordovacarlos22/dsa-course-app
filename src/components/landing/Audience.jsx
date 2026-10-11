import { useTranslation } from 'react-i18next'
import LandingSection from './LandingSection'

// "Who this course is for" and "What you need", side by side.
function Audience() {
  const { t } = useTranslation()
  const audience = t('landing.audience', { returnObjects: true })
  const requirements = t('landing.requirements', { returnObjects: true })

  return (
    <LandingSection id="who-its-for" title={t('landing.audienceTitle')}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {audience.map((person) => (
          <li
            key={person.title}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <h3 className="font-bold">{person.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{person.text}</p>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-white p-6">
        <h3 className="font-bold">{t('landing.requirementsTitle')}</h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
          {requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      </div>
    </LandingSection>
  )
}

export default Audience
