import { useTranslation } from 'react-i18next'
import ModuleCard from '../components/ModuleCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useLanguage } from '../hooks/useLanguage'
import { Link } from 'react-router'
import { EXAM_SIZE, getCourse, getSections, localize } from '../lib/course'
import { loadQuizScore } from '../lib/quizScores'

// All modules, grouped into the course's sections ("Foundations", "Sorting"…).
function CourseHomePage() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const course = getCourse()
  useDocumentTitle(t('course.title'))

  return (
    <div>
      <h1 className="text-3xl font-extrabold">{t('course.title')}</h1>
      <p className="mt-2 max-w-3xl text-slate-600">
        {localize(course.description, language)}
      </p>

      {getSections().map((section, index) => (
        <section key={section.slug} className="mt-10">
          <h2 className="text-xl font-bold">
            {t('course.sectionTitle', {
              number: index + 1,
              title: localize(section.title, language),
            })}
          </h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.modules.map((module) => (
              <ModuleCard key={module.slug} module={module} />
            ))}
          </ol>
          <ExamCard section={section} />
        </section>
      ))}
    </div>
  )
}

// The exam at the end of a section, for sections whose modules have quizzes.
function ExamCard({ section }) {
  const { t } = useTranslation()
  let questions = 0
  for (let i = 0; i < section.modules.length; i++) {
    questions += section.modules[i].practice?.questions ?? 0
  }
  if (questions === 0) return null
  const best = loadQuizScore(`exam:${section.slug}`)

  return (
    <Link
      to={`/learn/sections/${section.slug}/exam`}
      className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-brand/30 bg-white p-5 shadow-sm transition hover:border-brand hover:shadow-md"
    >
      <span>
        <span className="block text-lg font-bold">
          <span aria-hidden="true">📝 </span>
          {t('exam.card')}
        </span>
        <span className="mt-1 block text-sm text-slate-600">
          {t('exam.cardDetail', { count: Math.min(EXAM_SIZE, questions) })}
        </span>
      </span>
      <span className="text-sm font-semibold text-brand">
        {best
          ? t('exam.best', { score: best.best, total: best.total })
          : t('exam.take')}
      </span>
    </Link>
  )
}

export default CourseHomePage
