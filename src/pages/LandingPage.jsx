import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

const FEATURES = ['lessons', 'practice', 'tutor']

function LandingPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-16">
      <section className="rounded-3xl bg-brand px-6 py-14 text-center text-white sm:px-12">
        <h1 className="mx-auto max-w-2xl text-3xl font-extrabold sm:text-5xl">
          {t('landing.headline')}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
          {t('landing.subheadline')}
        </p>
        <Link
          to="/learn"
          className="mt-8 inline-block rounded-full bg-accent px-8 py-3 font-bold text-ink shadow hover:brightness-105"
        >
          {t('landing.cta')}
        </Link>
      </section>

      <section>
        <h2 className="text-center text-2xl font-bold">
          {t('landing.featuresTitle')}
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <li
              key={feature}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <h3 className="font-bold">
                {t(`landing.features.${feature}.title`)}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {t(`landing.features.${feature}.text`)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default LandingPage
