import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useLanguage } from '../hooks/useLanguage'
import { celebrate } from '../lib/celebrate'
import { getModule, localize } from '../lib/course'
import {
  COUNTDOWN_MINUTES,
  TIMER_MODES,
  exerciseAsStep,
  formatDuration,
  loadExerciseResult,
  loadTimerMode,
  saveSolved,
  saveTimerMode,
  saveViewedSolution,
} from '../lib/exercises'
import { getPractice } from '../lib/practice'
import CodeWorkspace from '../components/lesson/CodeWorkspace'
import NotFoundPage from './NotFoundPage'

// One practice exercise (/learn/:module/exercises/:exercise): a Build it or
// an Interview problem. It reuses the lessons' coding workspace (Learn |
// Editor | Output, Run and Check), adds a timer, and remembers what the
// student solved.
function ExercisePage() {
  const { moduleSlug, exerciseSlug } = useParams()
  const { t } = useTranslation()
  const { language } = useLanguage()
  const module = getModule(moduleSlug)
  const exercises = getPractice(moduleSlug)?.exercises ?? []
  const index = exercises.findIndex(
    (exercise) => exercise.slug === exerciseSlug,
  )
  const exercise = module ? exercises[index] : undefined
  // Called before the early return: hooks must run on every render.
  useDocumentTitle(
    exercise ? localize(exercise.title, language) : t('notFound.title'),
  )

  if (!exercise) return <NotFoundPage />

  // `key`: a new exercise starts with fresh state (code, timer, tries).
  return (
    <ExerciseSolver
      key={`${moduleSlug}/${exerciseSlug}`}
      module={module}
      exercise={exercise}
      nextExercise={exercises[index + 1] ?? null}
    />
  )
}

function ExerciseSolver({ module, exercise, nextExercise }) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const [startedAt] = useState(() => Date.now())
  const [now, setNow] = useState(startedAt)
  const [timerMode, setTimerMode] = useState(loadTimerMode)
  const [result, setResult] = useState(() =>
    loadExerciseResult(module.slug, exercise.slug),
  )
  const [failedTries, setFailedTries] = useState(0)
  // How long it took, once solved during this visit.
  const [solvedInMs, setSolvedInMs] = useState(null)

  const isSolvedNow = solvedInMs !== null
  const { time, space } = exercise.expectedComplexity
  const step = useMemo(
    () =>
      exerciseAsStep(exercise, {
        en: t('exercise.hint', { time, space, lng: 'en' }),
        es: t('exercise.hint', { time, space, lng: 'es' }),
      }),
    [exercise, t, time, space],
  )

  // The clock ticks once a second until the exercise is solved.
  useEffect(() => {
    if (isSolvedNow) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [isSolvedNow])

  function handlePassed() {
    const timeMs = Date.now() - startedAt
    setSolvedInMs(timeMs)
    setResult(saveSolved(module.slug, exercise.slug, timeMs))
    celebrate('lesson')
  }

  function changeTimerMode(mode) {
    setTimerMode(mode)
    saveTimerMode(mode)
  }

  const moduleTitle = localize(module.title, language)
  const elapsedMs = isSolvedNow ? solvedInMs : now - startedAt

  return (
    <article>
      <Link
        to={`/learn/${module.slug}`}
        className="text-sm font-medium text-brand hover:underline"
      >
        ← {t('lesson.backToModule', { module: moduleTitle })}
      </Link>
      <p className="mt-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {moduleTitle} · {t(`exercise.category.${exercise.category}`)} ·{' '}
        {t(`exercise.difficulty.${exercise.difficulty}`)}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h1 className="text-xl font-extrabold sm:text-2xl">
          {localize(exercise.title, language)}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {result.solved && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
              ✓ {t('exercise.solved')}
              {result.bestTimeMs !== null &&
                ` · ${t('exercise.bestTime', { time: formatDuration(result.bestTimeMs) })}`}
            </span>
          )}
          <Timer
            mode={timerMode}
            onModeChange={changeTimerMode}
            elapsedMs={elapsedMs}
            limitMs={COUNTDOWN_MINUTES[exercise.difficulty] * 60_000}
          />
        </div>
      </div>

      {isSolvedNow && (
        <div
          role="status"
          className="mt-4 rounded-2xl bg-green-50 p-4 text-green-900 motion-safe:animate-pop"
        >
          <p className="font-bold">
            ✓ {t('exercise.solvedIn', { time: formatDuration(solvedInMs) })}
          </p>
          <p className="mt-1">{t('exercise.complexity', { time, space })}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {nextExercise && (
              <Link
                to={`/learn/${module.slug}/exercises/${nextExercise.slug}`}
                className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:brightness-110"
              >
                {t('exercise.next')}: {localize(nextExercise.title, language)} →
              </Link>
            )}
            <Link
              to={`/learn/${module.slug}`}
              className="rounded-lg border border-green-700/30 px-3 py-1.5 text-sm font-semibold hover:bg-green-100"
            >
              {t('lesson.backToModule', { module: moduleTitle })}
            </Link>
          </div>
        </div>
      )}

      <div className="mt-4">
        <CodeWorkspace
          step={step}
          titleRef={null}
          isPassed={isSolvedNow}
          cheer={t('exercise.cheer')}
          failedTries={failedTries}
          onPassed={handlePassed}
          onFailed={() => setFailedTries((tries) => tries + 1)}
          onViewSolution={() =>
            setResult(saveViewedSolution(module.slug, exercise.slug))
          }
        />
      </div>
    </article>
  )
}

// The clock: a stopwatch, a countdown (it never stops the student, it only
// says when the time is up), or hidden. The time taken is saved either way.
function Timer({ mode, onModeChange, elapsedMs, limitMs }) {
  const { t } = useTranslation()
  const remainingMs = limitMs - elapsedMs
  return (
    <div className="flex items-center gap-2">
      {mode === 'stopwatch' && (
        <span
          role="timer"
          aria-label={t('exercise.timer.elapsed')}
          className="font-mono font-bold tabular-nums"
        >
          ⏱ {formatDuration(elapsedMs)}
        </span>
      )}
      {mode === 'countdown' && (
        <span
          role="timer"
          aria-label={t('exercise.timer.remaining')}
          className={`font-mono font-bold tabular-nums ${remainingMs <= 0 ? 'text-red-700' : ''}`}
        >
          ⏳{' '}
          {remainingMs > 0
            ? formatDuration(remainingMs)
            : t('exercise.timer.timeUp')}
        </span>
      )}
      <label className="flex items-center gap-1 text-slate-600">
        <span className="sr-only">{t('exercise.timer.label')}</span>
        <select
          value={mode}
          onChange={(event) => onModeChange(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
        >
          {TIMER_MODES.map((option) => (
            <option key={option} value={option}>
              {t(`exercise.timer.${option}`)}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default ExercisePage
