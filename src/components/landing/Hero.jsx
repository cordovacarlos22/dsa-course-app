import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

function Hero() {
  const { t } = useTranslation()

  return (
    <section className="rounded-3xl bg-brand px-6 py-14 text-center text-white sm:px-12">
      <p className="inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-semibold">
        {t('landing.badge')}
      </p>
      <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold sm:text-5xl">
        {t('landing.headline')}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
        {t('landing.subheadline')}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/learn"
          className="rounded-full bg-accent px-8 py-3 font-bold text-ink shadow hover:brightness-105"
        >
          {t('landing.cta')}
        </Link>
        {/* A plain anchor: it scrolls to the curriculum on this same page. */}
        <a
          href="#curriculum"
          className="rounded-full border-2 border-white/70 px-8 py-3 font-bold text-white hover:bg-white/10"
        >
          {t('landing.ctaSecondary')}
        </a>
      </div>
    </section>
  )
}

export default Hero
