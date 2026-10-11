import { useTranslation } from 'react-i18next'
import LandingSection from './LandingSection'

// `comingSoon` marks features that aren't built yet, so we never over-promise.
const FEATURES = [
  { key: 'animations', icon: '▶' },
  { key: 'code', icon: '{ }' },
  { key: 'practice', icon: '✓' },
  { key: 'tutor', icon: '✦', comingSoon: true },
]

function HowYouLearn() {
  const { t } = useTranslation()

  return (
    <LandingSection
      id="how-you-learn"
      title={t('landing.howTitle')}
      subtitle={t('landing.howSubtitle')}
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ key, icon, comingSoon }) => (
          <li
            key={key}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 font-mono text-sm font-bold text-brand"
            >
              {icon}
            </span>
            <h3 className="mt-4 font-bold">
              {t(`landing.features.${key}.title`)}
              {comingSoon && (
                <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 align-middle text-xs font-semibold text-amber-800">
                  {t('landing.comingSoon')}
                </span>
              )}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {t(`landing.features.${key}.text`)}
            </p>
          </li>
        ))}
      </ul>
    </LandingSection>
  )
}

export default HowYouLearn
