import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

function FinalCallToAction() {
  const { t } = useTranslation()

  return (
    <section className="rounded-3xl bg-ink px-6 py-12 text-center text-white">
      <h2 className="text-2xl font-extrabold sm:text-3xl">
        {t('landing.finalTitle')}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-white/80">
        {t('landing.finalText')}
      </p>
      <Link
        to="/learn/introduction"
        className="mt-8 inline-block rounded-full bg-accent px-8 py-3 font-bold text-ink hover:brightness-105"
      >
        {t('landing.cta')}
      </Link>
    </section>
  )
}

export default FinalCallToAction
