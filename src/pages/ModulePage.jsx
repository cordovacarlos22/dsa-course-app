import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'
import { getModule, localize } from '../lib/course'
import { getLessonVersion } from '../lib/lessons'
import { loadProgress } from '../lib/progress'
import NotFoundPage from './NotFoundPage'

// One module: its lessons, then its quiz + exercises (pages in stage 7).
function ModulePage() {
  const { moduleSlug } = useParams()
  const { t } = useTranslation()
  const { language } = useLanguage()
  const module = getModule(moduleSlug)

  if (!module) return <NotFoundPage />

  const { lessons, practice } = module

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

      {!module.isAvailable && (
        <p className="mt-4 text-slate-600">{t('module.notReady')}</p>
      )}

      {module.isAvailable && (
        <>
          <h2 className="mt-10 text-xl font-bold">
            {t('lesson.lessonsTitle')}
          </h2>
          {lessons.length === 0 ? (
            <p className="mt-2 text-slate-600">{t('module.lessonsSoon')}</p>
          ) : (
            <ol className="mt-4 space-y-2">
              {lessons.map((lesson) => {
                const progress = loadProgress(module.slug, lesson.slug)
                const status = progress.completed
                  ? 'completed'
                  : progress.passed.length > 0
                    ? 'inProgress'
                    : null
                return (
                  <li key={lesson.slug}>
                    <Link
                      to={`/learn/${module.slug}/${lesson.slug}`}
                      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-brand"
                    >
                      <span
                        aria-hidden="true"
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          status === 'completed'
                            ? 'bg-green-500 text-white'
                            : 'bg-brand/10 text-brand'
                        }`}
                      >
                        {status === 'completed' ? '✓' : lesson.order}
                      </span>
                      <span className="font-semibold">
                        {getLessonVersion(lesson, language).title}
                      </span>
                      <span className="ml-auto flex items-center gap-3 text-sm text-slate-500">
                        {status && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {t(`lesson.${status}`)}
                          </span>
                        )}
                        <span className="hidden sm:inline">
                          {t('lesson.minutes', { count: lesson.minutes })}
                        </span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          )}
        </>
      )}

      {practice && (
        <>
          <h2 className="mt-10 text-xl font-bold">
            {t('module.practiceTitle')}
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            <PracticeItem
              title={t('module.quiz')}
              detail={t('course.questions', {
                count: practice.questions.length,
              })}
            />
            <PracticeItem
              title={t('module.buildIt')}
              detail={t('course.exercises', {
                count: countByCategory(practice, 'build'),
              })}
            />
            <PracticeItem
              title={t('module.interviewProblems')}
              detail={t('course.exercises', {
                count: countByCategory(practice, 'interview'),
              })}
            />
          </ul>
        </>
      )}
    </div>
  )
}

function countByCategory(practice, category) {
  return practice.exercises.filter((exercise) => exercise.category === category)
    .length
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
