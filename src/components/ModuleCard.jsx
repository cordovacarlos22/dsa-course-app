import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'
import { localize } from '../lib/course'

// One module on the course home. Modules without content yet are shown,
// but greyed out and not clickable.
function ModuleCard({ module }) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const { lessons, section } = module
  const title = localize(module.title, language)

  const header = (
    <>
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {t('course.moduleNumber', { number: module.order })}
      </p>
      <h3 className="mt-1 text-lg font-bold">{title}</h3>
    </>
  )

  if (!module.isAvailable) {
    return (
      <li className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-5 text-slate-500">
        {header}
        <p className="mt-3 text-sm">{t('course.comingSoon')}</p>
      </li>
    )
  }

  const summary = []
  if (lessons.length > 0) {
    summary.push(t('lesson.lessons', { count: lessons.length }))
  }
  if (section) {
    summary.push(t('course.questions', { count: section.questions.length }))
    summary.push(t('course.exercises', { count: section.exercises.length }))
  }

  return (
    <li>
      <Link
        to={`/learn/${module.slug}`}
        className="block h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
      >
        {header}
        <p className="mt-3 text-sm text-slate-600">{summary.join(' · ')}</p>
      </Link>
    </li>
  )
}

export default ModuleCard
