import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'
import { getModule, localize } from '../lib/course'
import { getLessonSteps, getLessonVersion } from '../lib/lessons'
import {
  failedAttempts,
  firstUnpassedStep,
  loadProgress,
  markStepPassed,
  recordFailedAttempt,
  recordViewedSolution,
  saveProgress,
} from '../lib/progress'
import LessonMarkdown from '../components/LessonMarkdown'
import ChoiceCheckpoint from '../components/lesson/ChoiceCheckpoint'
import CodeWorkspace from '../components/lesson/CodeWorkspace'
import NotFoundPage from './NotFoundPage'

// One lesson, played step by step (/learn/:module/:lesson?step=2).
// Each step ends with a checkpoint, and Next stays locked until it passes.
function LessonPage() {
  const { moduleSlug, lessonSlug } = useParams()
  const module = getModule(moduleSlug)
  const lessonIndex =
    module?.lessons.findIndex((lesson) => lesson.slug === lessonSlug) ?? -1

  if (lessonIndex === -1) return <NotFoundPage />

  // `key`: a new lesson starts with fresh state (progress, code, answers).
  return (
    <LessonPlayer
      key={`${moduleSlug}/${lessonSlug}`}
      module={module}
      lessonIndex={lessonIndex}
    />
  )
}

function LessonPlayer({ module, lessonIndex }) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const lesson = module.lessons[lessonIndex]
  const nextLesson = module.lessons[lessonIndex + 1]
  const steps = getLessonSteps(lesson, language)
  const [progress, setProgress] = useState(() =>
    loadProgress(module.slug, lesson.slug),
  )
  // Steps where the student pressed "Show answer" on a question.
  const [shownAnswers, setShownAnswers] = useState([])

  // Without ?step=, the lesson resumes where the student left off. (Kept in
  // state so passing a step doesn't move the student before they press Next.)
  const [resumeStep] = useState(() => firstUnpassedStep(progress, steps.length))

  // The student can open any step up to the first one they haven't passed.
  const furthestStep = firstUnpassedStep(progress, steps.length)
  const requestedStep = Number(searchParams.get('step')) - 1
  const stepIndex =
    Number.isInteger(requestedStep) && requestedStep >= 0
      ? Math.min(requestedStep, furthestStep)
      : resumeStep
  const step = steps[stepIndex]
  const isPassed = progress.passed.includes(stepIndex)
  const isLastStep = stepIndex === steps.length - 1
  const tries = failedAttempts(progress, stepIndex)

  function update(change) {
    setProgress((current) => {
      const next = change(current)
      saveProgress(module.slug, lesson.slug, next)
      return next
    })
  }

  const markPassed = () =>
    update((current) => markStepPassed(current, stepIndex, steps.length))
  const markFailed = () =>
    update((current) => recordFailedAttempt(current, stepIndex))
  const markSolutionViewed = () =>
    update((current) => recordViewedSolution(current, stepIndex))

  function goToStep(index) {
    setSearchParams({ step: String(index + 1) })
    window.scrollTo({ top: 0 })
  }

  function goNext() {
    // A step without a checkpoint passes by reading it.
    if (!step.checkpoint) markPassed()
    if (!isLastStep) goToStep(stepIndex + 1)
  }

  const moduleTitle = localize(module.title, language)
  const isCodeStep = step.checkpoint?.type === 'code'
  const canGoNext = isPassed || !step.checkpoint
  const isLessonDone = progress.completed

  return (
    <article className={isCodeStep ? '' : 'mx-auto max-w-3xl'}>
      <Link
        to={`/learn/${module.slug}`}
        className="text-sm font-medium text-brand hover:underline"
      >
        ← {t('lesson.backToModule', { module: moduleTitle })}
      </Link>
      <p className="mt-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {moduleTitle} · {t('lesson.minutes', { count: lesson.minutes })}
      </p>
      <h1 className="text-2xl font-extrabold sm:text-3xl">
        {getLessonVersion(lesson, language).title}
      </h1>

      <StepProgress
        steps={steps}
        currentIndex={stepIndex}
        furthestStep={furthestStep}
        passed={progress.passed}
        onSelect={goToStep}
      />

      <div className="mt-6">
        {isCodeStep ? (
          <CodeWorkspace
            key={stepIndex}
            step={step}
            isPassed={isPassed}
            failedTries={tries}
            onPassed={markPassed}
            onFailed={markFailed}
            onViewSolution={markSolutionViewed}
          />
        ) : (
          <>
            {step.title && (
              <h2 className="mb-4 text-2xl font-extrabold">{step.title}</h2>
            )}
            <LessonMarkdown markdown={step.body} />
            {step.checkpoint && (
              <ChoiceCheckpoint
                key={stepIndex}
                checkpoint={step.checkpoint}
                isPassed={isPassed}
                failedTries={tries}
                isAnswerShown={shownAnswers.includes(stepIndex)}
                onCorrect={markPassed}
                onWrong={markFailed}
                onShowAnswer={() => {
                  setShownAnswers((shown) => [...shown, stepIndex])
                  markSolutionViewed()
                }}
              />
            )}
          </>
        )}
      </div>

      {isLastStep && isLessonDone && (
        <div
          role="status"
          className="mt-8 rounded-2xl bg-green-50 p-6 text-center text-green-900"
        >
          <p className="text-xl font-extrabold">🎉 {t('lesson.complete')}</p>
          <p className="mt-1">{t('lesson.completeText')}</p>
        </div>
      )}

      <nav
        aria-label={t('lesson.stepNavigation')}
        className="mt-8 flex items-center justify-between gap-4 border-t border-slate-200 pt-6"
      >
        {stepIndex > 0 ? (
          <button
            type="button"
            onClick={() => goToStep(stepIndex - 1)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold hover:border-brand"
          >
            ← {t('lesson.back')}
          </button>
        ) : (
          <span />
        )}

        {!canGoNext && (
          <p className="hidden text-sm text-slate-500 sm:block">
            🔒 {t('lesson.nextLocked')}
          </p>
        )}

        {isLastStep && isLessonDone ? (
          <Link
            to={
              nextLesson
                ? `/learn/${module.slug}/${nextLesson.slug}`
                : `/learn/${module.slug}`
            }
            className="rounded-xl bg-brand px-5 py-2 font-bold text-white"
          >
            {nextLesson
              ? `${t('lesson.next')}: ${getLessonVersion(nextLesson, language).title} →`
              : t('lesson.backToModule', { module: moduleTitle })}
          </Link>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            className="rounded-xl bg-brand px-5 py-2 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isLastStep ? t('lesson.finish') : `${t('lesson.nextStep')} →`}
          </button>
        )}
      </nav>
    </article>
  )
}

// "Step 2 of 5" and one segment per step. Passed and current steps can be
// clicked; the ones after the first unpassed step are locked.
function StepProgress({ steps, currentIndex, furthestStep, passed, onSelect }) {
  const { t } = useTranslation()
  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-slate-600">
        {t('lesson.stepOf', {
          current: currentIndex + 1,
          total: steps.length,
        })}
      </p>
      <ol className="mt-2 flex gap-1.5">
        {steps.map((step, index) => {
          const isLocked = index > furthestStep
          const color =
            index === currentIndex
              ? 'bg-brand'
              : passed.includes(index)
                ? 'bg-green-500'
                : 'bg-slate-200'
          return (
            <li key={index} className="flex-1">
              <button
                type="button"
                onClick={() => onSelect(index)}
                disabled={isLocked}
                aria-current={index === currentIndex ? 'step' : undefined}
                aria-label={t('lesson.goToStep', {
                  number: index + 1,
                  title: step.title ?? '',
                })}
                title={step.title ?? undefined}
                className={`block h-2 w-full rounded-full ${color} disabled:cursor-not-allowed`}
              />
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default LessonPage
