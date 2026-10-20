import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useLanguage } from '../hooks/useLanguage'
import { celebrate } from '../lib/celebrate'
import { getModule, lessonTitle, localize } from '../lib/course'
import { getLesson, getLessonSteps, getLessonVersion } from '../lib/lessons'
import {
  countFirstTry,
  failedAttempts,
  firstTryStreak,
  firstUnpassedStep,
  isModuleComplete,
  loadProgress,
  markStepPassed,
  recordFailedAttempt,
  recordViewedSolution,
  saveProgress,
} from '../lib/progress'
import LessonMarkdown from '../components/LessonMarkdown'
import ChoiceCheckpoint from '../components/lesson/ChoiceCheckpoint'
import CodeWorkspace from '../components/lesson/CodeWorkspace'
import LessonComplete from '../components/lesson/LessonComplete'
import NotFoundPage from './NotFoundPage'

// From this many first-try steps in a row, the cheer becomes "🔥 3 in a row".
const STREAK_TO_CHEER = 3

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
  // module.lessons is the short summary (titles, minutes); the full lesson,
  // with its text and checkpoints, comes from lib/lessons.
  const lesson = getLesson(module.slug, module.lessons[lessonIndex].slug)
  const nextLesson = module.lessons[lessonIndex + 1]
  useDocumentTitle(getLessonVersion(lesson, language).title)
  const steps = getLessonSteps(lesson, language)
  const [progress, setProgress] = useState(() =>
    loadProgress(module.slug, lesson.slug),
  )
  // Steps where the student pressed "Show answer" on a question.
  const [shownAnswers, setShownAnswers] = useState([])
  // The step that just passed (and was celebrated) during this visit.
  const [celebratedStep, setCelebratedStep] = useState(null)

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

  // After Back, Next or a progress segment, keyboard focus moves to the new
  // step's title: screen readers read it, and Tab continues from there.
  // (Not on the first visit: the page has only just opened.)
  const stepTitleRef = useRef(null)
  const lessonTitleRef = useRef(null)
  const shownStepRef = useRef(stepIndex)
  useEffect(() => {
    if (shownStepRef.current === stepIndex) return
    shownStepRef.current = stepIndex
    const title = stepTitleRef.current ?? lessonTitleRef.current
    title?.focus({ preventScroll: true })
  }, [stepIndex])

  function update(change) {
    setProgress((current) => {
      const next = change(current)
      saveProgress(module.slug, lesson.slug, next)
      return next
    })
  }

  // The first time a step passes, celebrate it: a small burst for a step,
  // more for the lesson's last step, the most when that finishes the module.
  // (Here in the event handler: React may run state updaters twice.)
  function celebratePass() {
    const finishesLesson =
      !progress.completed &&
      markStepPassed(progress, stepIndex, steps.length).completed
    const otherLessons = module.lessons.filter(
      (other) => other.slug !== lesson.slug,
    )
    const finishesModule =
      finishesLesson && isModuleComplete(module.slug, otherLessons)
    celebrate(finishesModule ? 'module' : finishesLesson ? 'lesson' : 'step')
    setCelebratedStep(stepIndex)
  }

  const markPassed = () => {
    if (!isPassed) celebratePass()
    update((current) => markStepPassed(current, stepIndex, steps.length))
  }
  const markFailed = () =>
    update((current) => recordFailedAttempt(current, stepIndex))
  const markSolutionViewed = () =>
    update((current) => recordViewedSolution(current, stepIndex))

  function goToStep(index) {
    setCelebratedStep(null)
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
  const cheer = cheerFor(t, progress, stepIndex)
  // Next (or "Next lesson") bounces once when the step just passed.
  const nudge = celebratedStep === stepIndex ? 'motion-safe:animate-nudge' : ''

  return (
    <article className={isCodeStep ? '' : 'mx-auto max-w-3xl'}>
      <Link
        to={`/learn/${module.slug}`}
        className="text-sm font-medium text-brand hover:underline"
      >
        ← {t('lesson.backToModule', { module: moduleTitle })}
      </Link>
      {/* Coding steps get a smaller header, so the workspace gets more room. */}
      <p
        className={`${isCodeStep ? 'mt-2' : 'mt-4'} text-xs font-semibold tracking-wide text-slate-500 uppercase`}
      >
        {moduleTitle} · {t('lesson.minutes', { count: lesson.minutes })}
      </p>
      <h1
        ref={lessonTitleRef}
        tabIndex={-1}
        className={`font-extrabold ${isCodeStep ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}`}
      >
        {getLessonVersion(lesson, language).title}
      </h1>

      <StepProgress
        steps={steps}
        currentIndex={stepIndex}
        furthestStep={furthestStep}
        passed={progress.passed}
        celebratedStep={celebratedStep}
        onSelect={goToStep}
      />

      <div className={isCodeStep ? 'mt-4' : 'mt-6'}>
        {isCodeStep ? (
          <CodeWorkspace
            key={stepIndex}
            step={step}
            titleRef={stepTitleRef}
            isPassed={isPassed}
            cheer={cheer}
            failedTries={tries}
            onPassed={markPassed}
            onFailed={markFailed}
            onViewSolution={markSolutionViewed}
          />
        ) : (
          <>
            {step.title && (
              <h2
                ref={stepTitleRef}
                tabIndex={-1}
                className="mb-4 text-2xl font-extrabold"
              >
                {step.title}
              </h2>
            )}
            <LessonMarkdown markdown={step.body} />
            {step.checkpoint && (
              <ChoiceCheckpoint
                key={stepIndex}
                checkpoint={step.checkpoint}
                isPassed={isPassed}
                cheer={cheer}
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
        <LessonComplete
          checkCount={steps.length}
          firstTryCount={countFirstTry(progress, steps.length)}
          isModuleDone={isModuleComplete(module.slug, module.lessons)}
          moduleTitle={moduleTitle}
        />
      )}

      <nav
        aria-label={t('lesson.stepNavigation')}
        // Sticky: Back and Next stay on screen while the student reads.
        className="sticky bottom-0 z-10 mt-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-slate-200 bg-surface/95 py-3 backdrop-blur"
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

        {/* On phones the note gets its own line above Back and Next. */}
        {!canGoNext && (
          <p className="order-first w-full text-center text-xs text-slate-500 sm:order-none sm:w-auto sm:text-sm">
            <span aria-hidden="true">🔒</span> {t('lesson.nextLocked')}
          </p>
        )}

        {isLastStep && isLessonDone ? (
          <Link
            to={
              nextLesson
                ? `/learn/${module.slug}/${nextLesson.slug}`
                : `/learn/${module.slug}`
            }
            className={`rounded-xl bg-brand px-5 py-2 font-bold text-white ${nudge}`}
          >
            {nextLesson
              ? `${t('lesson.next')}: ${lessonTitle(nextLesson, language)} →`
              : t('lesson.backToModule', { module: moduleTitle })}
          </Link>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            className={`rounded-xl bg-brand px-5 py-2 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300 ${nudge}`}
          >
            {isLastStep ? t('lesson.finish') : `${t('lesson.nextStep')} →`}
          </button>
        )}
      </nav>
    </article>
  )
}

// A cheer for a passed step: "🔥 3 in a row on the first try!" during a
// streak, otherwise one of a few phrases, picked by step so it changes.
function cheerFor(t, progress, stepIndex) {
  const streak = firstTryStreak(progress, stepIndex)
  if (streak >= STREAK_TO_CHEER) {
    return t('checkpoint.streak', { count: streak })
  }
  const cheers = t('checkpoint.cheers', { returnObjects: true })
  return cheers[stepIndex % cheers.length]
}

// "Step 2 of 5" and one segment per step. Passed and current steps can be
// clicked; the ones after the first unpassed step are locked. A passed step
// turns green (the current one keeps a ring), and pops when it just passed.
function StepProgress({
  steps,
  currentIndex,
  furthestStep,
  passed,
  celebratedStep,
  onSelect,
}) {
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
          const color = passed.includes(index)
            ? 'bg-green-500'
            : index === currentIndex
              ? 'bg-brand'
              : 'bg-slate-200'
          const ring =
            index === currentIndex ? 'ring-2 ring-brand/40 ring-offset-1' : ''
          const pop = index === celebratedStep ? 'motion-safe:animate-pop' : ''
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
                className={`block h-2 w-full rounded-full transition-colors duration-500 ${color} ${ring} ${pop} disabled:cursor-not-allowed`}
              />
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default LessonPage
