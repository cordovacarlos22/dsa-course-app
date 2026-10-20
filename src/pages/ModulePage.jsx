import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useLanguage } from '../hooks/useLanguage'
import { getModule, lessonTitle, localize } from '../lib/course'
import { isModuleComplete, loadProgress } from '../lib/progress'
import { loadQuizScore } from '../lib/quizScores'
import NotFoundPage from './NotFoundPage'

// One module: its lessons, then its quiz + exercises (pages in stage 7).
function ModulePage() {
  const { moduleSlug } = useParams()
  const { t } = useTranslation()
  const { language } = useLanguage()
  const module = getModule(moduleSlug)
  // Called before the early return: hooks must run on every render.
  useDocumentTitle(
    module ? localize(module.title, language) : t('notFound.title'),
  )

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
      {lessons.length > 0 && isModuleComplete(module.slug, lessons) && (
        <p className="mt-3 inline-block rounded-full bg-accent/20 px-3 py-1 text-sm font-bold">
          🏆 {t('module.completedBadge')}
        </p>
      )}

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
                        {lessonTitle(lesson, language)}
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
            <QuizItem moduleSlug={module.slug} questions={practice.questions} />
            <PracticeItem
              title={t('module.buildIt')}
              detail={t('course.exercises', { count: practice.build })}
            />
            <PracticeItem
              title={t('module.interviewProblems')}
              detail={t('course.exercises', { count: practice.interview })}
            />
          </ul>
        </>
      )}
    </div>
  )
}

// The quiz card links to the quiz, with the best score once there is one.
function QuizItem({ moduleSlug, questions }) {
  const { t } = useTranslation()
  const score = loadQuizScore(moduleSlug)
  return (
    <li>
      <Link
        to={`/learn/${moduleSlug}/quiz`}
        className="block h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand hover:shadow-md"
      >
        <h3 className="font-bold">{t('module.quiz')}</h3>
        <p className="mt-1 text-sm text-slate-600">
          {t('course.questions', { count: questions })}
        </p>
        <p className="mt-3 text-xs font-semibold text-brand uppercase">
          {score
            ? t('module.bestScore', { score: score.best, total: score.total })
            : t('module.takeQuiz')}{' '}
          →
        </p>
      </Link>
    </li>
  )
}

// Exercise pages arrive in the next step of stage 7, so these aren't links
// yet.
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
