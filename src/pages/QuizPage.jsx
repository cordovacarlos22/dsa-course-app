import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useLanguage } from '../hooks/useLanguage'
import { celebrate } from '../lib/celebrate'
import { getModule, localize } from '../lib/course'
import { getPractice } from '../lib/practice'
import { saveQuizScore } from '../lib/quizScores'
import { playSound } from '../lib/sounds'
import InlineMarkdown from '../components/lesson/InlineMarkdown'
import NotFoundPage from './NotFoundPage'

// From this share of right answers, the result says "Great work".
const GREAT_SCORE = 0.7

// A module's quiz (/learn/:module/quiz), one question at a time. Each
// question gets one answer: Check shows if it was right, with the
// explanation, and the score card at the end lists the ones to review.
function QuizPage() {
  const { moduleSlug } = useParams()
  const { t } = useTranslation()
  const { language } = useLanguage()
  const module = getModule(moduleSlug)
  const practice = getPractice(moduleSlug)
  const hasQuiz = module && practice?.questions.length > 0
  // Called before the early return: hooks must run on every render.
  useDocumentTitle(
    hasQuiz
      ? t('quiz.title', { module: localize(module.title, language) })
      : t('notFound.title'),
  )

  if (!hasQuiz) return <NotFoundPage />

  // `key`: "Try again" and a new module both start with fresh state.
  return (
    <QuizPlayer
      key={moduleSlug}
      module={module}
      questions={practice.questions}
    />
  )
}

function QuizPlayer({ module, questions }) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const [index, setIndex] = useState(0) // the question on screen
  // The option chosen for each question that was checked, in order.
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null) // { score, best } at the end
  const headingRef = useRef(null)
  // What was on screen last time, to notice when it changes.
  const shownRef = useRef({ index, isDone: false })

  const question = questions[index]
  const isChecked = answers.length > index
  const isLast = index === questions.length - 1
  const moduleTitle = localize(module.title, language)

  // A new question (or the score card) moves the focus to its heading, so
  // screen readers read it and Tab continues from there. Not when the page
  // first opens.
  useEffect(() => {
    const isDone = result !== null
    const shown = shownRef.current
    if (shown.index === index && shown.isDone === isDone) return
    shownRef.current = { index, isDone }
    headingRef.current?.focus()
  }, [index, result])

  function check(event) {
    event.preventDefault()
    if (selected === null || isChecked) return
    setAnswers([...answers, selected])
    if (selected === question.correctIndex) celebrate('step')
    else playSound('miss')
  }

  function next() {
    if (!isLast) {
      setIndex(index + 1)
      setSelected(null)
      return
    }
    const score = answers.filter(
      (answer, i) => answer === questions[i].correctIndex,
    ).length
    const best = saveQuizScore(module.slug, score, questions.length)
    celebrate(score === questions.length ? 'module' : 'lesson')
    setResult({ score, best })
  }

  function tryAgain() {
    setIndex(0)
    setAnswers([])
    setSelected(null)
    setResult(null)
  }

  const header = (
    <>
      <Link
        to={`/learn/${module.slug}`}
        className="text-sm font-medium text-brand hover:underline"
      >
        ← {t('lesson.backToModule', { module: moduleTitle })}
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">
        {t('quiz.title', { module: moduleTitle })}
      </h1>
    </>
  )

  if (result) {
    return (
      <article className="mx-auto max-w-3xl">
        {header}
        <QuizResult
          questions={questions}
          answers={answers}
          result={result}
          headingRef={headingRef}
          onTryAgain={tryAgain}
          moduleSlug={module.slug}
          moduleTitle={moduleTitle}
        />
      </article>
    )
  }

  const isRight = isChecked && answers[index] === question.correctIndex

  return (
    <article className="mx-auto max-w-3xl">
      {header}
      <QuizProgress current={index + 1} total={questions.length} />

      <form
        onSubmit={check}
        className="mt-6 rounded-2xl border-2 border-brand/30 bg-white p-6"
      >
        <fieldset className="min-w-0">
          <legend
            ref={headingRef}
            tabIndex={-1}
            className="text-xs font-semibold tracking-wide text-brand uppercase"
          >
            {t('quiz.questionOf', {
              current: index + 1,
              total: questions.length,
            })}
          </legend>
          <p className="mt-2 text-lg font-semibold">
            <InlineMarkdown>
              {localize(question.prompt, language)}
            </InlineMarkdown>
          </p>
          {question.code && (
            <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-900 p-4 text-[13px] leading-6 text-slate-100">
              <code>{question.code}</code>
            </pre>
          )}
          <div className="mt-4 space-y-2">
            {question.options.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 ${optionStyle(
                  { optionIndex, selected, isChecked, question },
                )}`}
              >
                <input
                  type="radio"
                  name="answer"
                  checked={selected === optionIndex}
                  onChange={() => setSelected(optionIndex)}
                  disabled={isChecked}
                  className="accent-brand"
                />
                {/* One span, so text and `code` wrap together. */}
                <span className="min-w-0">
                  <InlineMarkdown>{localize(option, language)}</InlineMarkdown>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div role="status" className="mt-4 empty:hidden">
          {isChecked && (
            <div
              className={`rounded-xl p-4 ${isRight ? 'bg-green-50 text-green-900' : 'bg-amber-50 text-amber-900'}`}
            >
              <p className="font-bold">
                {isRight ? `✓ ${t('quiz.correct')}` : t('quiz.wrong')}
              </p>
              <p className="mt-1">
                <InlineMarkdown>
                  {localize(question.explanation, language)}
                </InlineMarkdown>
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {isChecked ? (
            <button
              type="button"
              onClick={next}
              className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:brightness-110"
            >
              {isLast ? t('quiz.seeScore') : `${t('quiz.next')} →`}
            </button>
          ) : (
            <button
              type="submit"
              disabled={selected === null}
              className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100"
            >
              {t('checkpoint.checkAnswer')}
            </button>
          )}
        </div>
      </form>
    </article>
  )
}

// After Check: the right option turns green, and a wrong pick turns red.
function optionStyle({ optionIndex, selected, isChecked, question }) {
  if (isChecked && optionIndex === question.correctIndex) {
    return 'border-green-600 bg-green-50'
  }
  if (isChecked && optionIndex === selected) return 'border-red-400 bg-red-50'
  if (selected === optionIndex) return 'border-brand bg-brand/5'
  return 'border-slate-200 hover:border-slate-400'
}

function QuizProgress({ current, total }) {
  const { t } = useTranslation()
  return (
    <div
      role="progressbar"
      aria-label={t('quiz.progress')}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200"
    >
      <div
        className="h-full rounded-full bg-brand transition-all duration-500"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  )
}

function QuizResult({
  questions,
  answers,
  result,
  headingRef,
  onTryAgain,
  moduleSlug,
  moduleTitle,
}) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const { score, best } = result
  const total = questions.length
  const message =
    score === total
      ? t('quiz.perfect')
      : score / total >= GREAT_SCORE
        ? t('quiz.great')
        : t('quiz.keepGoing')
  const missed = questions
    .map((question, i) => ({ question, answer: answers[i] }))
    .filter(({ question, answer }) => answer !== question.correctIndex)

  return (
    <section className="mt-6">
      <div className="rounded-2xl border-2 border-brand/30 bg-white p-6 text-center motion-safe:animate-pop">
        <h2 ref={headingRef} tabIndex={-1} className="text-xl font-extrabold">
          {score === total ? '🏆 ' : ''}
          {t('quiz.complete')}
        </h2>
        <p className="mt-2 text-4xl font-extrabold text-brand tabular-nums">
          {t('quiz.score', { score, total })}
        </p>
        <p className="mt-2 text-slate-700">{message}</p>
        <p className="mt-1 text-sm text-slate-500">
          {t('quiz.best', { score: best.best, total: best.total })}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={onTryAgain}
            className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:brightness-110"
          >
            {t('quiz.tryAgain')}
          </button>
          <Link
            to={`/learn/${moduleSlug}`}
            className="rounded-lg border border-slate-300 px-4 py-2 font-semibold hover:bg-slate-50"
          >
            {t('lesson.backToModule', { module: moduleTitle })}
          </Link>
        </div>
      </div>

      {missed.length > 0 && (
        <>
          <h3 className="mt-8 text-lg font-bold">{t('quiz.review')}</h3>
          <ol className="mt-3 space-y-3">
            {missed.map(({ question, answer }) => (
              <li
                key={question.id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <p className="font-semibold">
                  <InlineMarkdown>
                    {localize(question.prompt, language)}
                  </InlineMarkdown>
                </p>
                <p className="mt-2 text-sm text-red-800">
                  {t('quiz.yourAnswer')}:{' '}
                  <InlineMarkdown>
                    {localize(question.options[answer], language)}
                  </InlineMarkdown>
                </p>
                <p className="mt-1 text-sm text-green-800">
                  {t('quiz.rightAnswer')}:{' '}
                  <InlineMarkdown>
                    {localize(
                      question.options[question.correctIndex],
                      language,
                    )}
                  </InlineMarkdown>
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  <InlineMarkdown>
                    {localize(question.explanation, language)}
                  </InlineMarkdown>
                </p>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  )
}

export default QuizPage
