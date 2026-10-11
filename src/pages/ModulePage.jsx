import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'
import { getModule, localize } from '../lib/course'
import NotFoundPage from './NotFoundPage'

// One module: its lessons (stage 5) and its quiz + exercises (stage 7).
function ModulePage() {
  const { moduleSlug } = useParams()
  const { t } = useTranslation()
  const { language } = useLanguage()
  const module = getModule(moduleSlug)

  if (!module) return <NotFoundPage />

  const { section } = module

  return (
    <div>
      <Link
        to="/learn"
        className="text-sm font-medium text-brand hover:underline"
      >
        ← {t('module.back')}
      </Link>
      <p className="mt-6 text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {t('course.moduleNumber', { number: module.order })}
      </p>
      <h1 className="text-3xl font-extrabold">
        {localize(module.title, language)}
      </h1>

      {section ? (
        <>
          <p className="mt-4 text-slate-600">{t('module.lessonsSoon')}</p>
          <h2 className="mt-10 text-xl font-bold">
            {t('module.practiceTitle')}
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            <PracticeItem
              title={t('module.quiz')}
              detail={t('course.questions', {
                count: section.questions.length,
              })}
            />
            <PracticeItem
              title={t('module.exercises')}
              detail={t('course.exercises', {
                count: section.exercises.length,
              })}
            />
          </ul>
        </>
      ) : (
        <p className="mt-4 text-slate-600">{t('module.notReady')}</p>
      )}
    </div>
  )
}

// Quiz and exercise pages arrive in stage 7, so these aren't links yet.
function PracticeItem({ title, detail }) {
  const { t } = useTranslation()
  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{detail}</p>
      <p className="mt-3 text-xs font-semibold text-slate-400 uppercase">
        {t('module.availableSoon')}
      </p>
    </li>
  )
}

export default ModulePage
