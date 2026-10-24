import { useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../hooks/useLanguage'
import { localize } from '../../lib/course'
import InlineMarkdown from './InlineMarkdown'

// About a sentence: the least we ask for before showing the model answer, so
// the student tries to explain it first.
const MIN_ANSWER_LENGTH = 20

// "Explain it yourself": the student writes an explanation in their own
// words, then compares it with a model answer and ticks each point their
// answer covers. Ticking them all and pressing Done passes the step. The
// text is never sent or saved: it's the student's own check.
function ExplainCheckpoint({ checkpoint, isPassed, cheer, onPassed }) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const id = useId()
  // Passing makes the page re-render with isPassed true; only a step that was
  // already passed when it opened shows as "passed before".
  const [passedBefore] = useState(isPassed)
  const [answer, setAnswer] = useState('')
  const [isCompared, setIsCompared] = useState(isPassed)
  const [ticked, setTicked] = useState(() =>
    checkpoint.checklist.map(() => isPassed),
  )
  const [isDone, setIsDone] = useState(isPassed)
  // Set when the student presses Compare, so the model answer gets focus
  // then (screen readers read it), but not when a passed step reopens.
  const shouldFocusModel = useRef(false)

  const canCompare = answer.trim().length >= MIN_ANSWER_LENGTH
  const allTicked = ticked.every(Boolean)

  function compare() {
    shouldFocusModel.current = true
    setIsCompared(true)
  }

  function toggle(index) {
    setTicked(ticked.map((value, i) => (i === index ? !value : value)))
  }

  function finish() {
    setIsDone(true)
    onPassed()
  }

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="mt-10 rounded-2xl border-2 border-brand/30 bg-white p-6"
    >
      <h3
        id={`${id}-title`}
        className="text-xs font-semibold tracking-wide text-brand uppercase"
      >
        {t('checkpoint.explain.title')}
      </h3>
      <p className="mt-2 text-lg font-semibold">
        <InlineMarkdown>
          {localize(checkpoint.question, language)}
        </InlineMarkdown>
      </p>

      {!passedBefore && (
        <>
          <label
            htmlFor={`${id}-answer`}
            className="mt-4 block text-sm font-semibold"
          >
            {t('checkpoint.explain.yourAnswer')}
          </label>
          <p id={`${id}-tip`} className="text-sm text-slate-600">
            {t('checkpoint.explain.tip')}
          </p>
          <textarea
            id={`${id}-answer`}
            aria-describedby={`${id}-tip`}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            rows={4}
            className="mt-2 block w-full rounded-xl border border-slate-300 p-3 focus-visible:outline-2 focus-visible:outline-brand"
          />
        </>
      )}

      {!isCompared && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={compare}
            disabled={!canCompare}
            className="rounded-lg bg-brand px-5 py-2 font-bold text-white disabled:opacity-50"
          >
            {t('checkpoint.explain.compare')}
          </button>
          {!canCompare && (
            <span className="text-sm text-slate-600">
              {t('checkpoint.explain.writeFirst')}
            </span>
          )}
        </div>
      )}

      {isCompared && (
        <div
          tabIndex={-1}
          ref={(node) => {
            if (node && shouldFocusModel.current) {
              shouldFocusModel.current = false
              node.focus()
            }
          }}
          className="mt-6 focus-visible:outline-none"
        >
          <h4 className="font-bold">{t('checkpoint.explain.modelAnswer')}</h4>
          <p className="mt-1 rounded-xl bg-slate-50 p-4">
            <InlineMarkdown>
              {localize(checkpoint.modelAnswer, language)}
            </InlineMarkdown>
          </p>

          <fieldset className="mt-4">
            <legend className="font-bold">
              {t('checkpoint.explain.checklist')}
            </legend>
            <div className="mt-2 space-y-2">
              {checkpoint.checklist.map((point, index) => (
                <label
                  key={index}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 px-4 py-3 hover:border-slate-400"
                >
                  <input
                    type="checkbox"
                    checked={ticked[index]}
                    onChange={() => toggle(index)}
                    disabled={isDone}
                    className="mt-1 accent-brand"
                  />
                  <span className="min-w-0">
                    <InlineMarkdown>{localize(point, language)}</InlineMarkdown>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {!isDone && (
            <>
              <p className="mt-3 text-sm text-slate-600">
                {t('checkpoint.explain.missing')}
              </p>
              <button
                type="button"
                onClick={finish}
                disabled={!allTicked}
                className="mt-3 rounded-lg bg-brand px-5 py-2 font-bold text-white disabled:opacity-50"
              >
                {t('checkpoint.explain.done')}
              </button>
            </>
          )}
        </div>
      )}

      <div role="status" className="mt-4 empty:hidden">
        {isDone && !passedBefore && (
          <div className="rounded-xl bg-green-50 p-4 font-bold text-green-900 motion-safe:animate-pop">
            ✓ {t('checkpoint.explain.passed')} {cheer}
          </div>
        )}
        {passedBefore && (
          <p className="text-sm text-slate-600">
            {t('checkpoint.passedBefore')}
          </p>
        )}
      </div>
    </section>
  )
}

export default ExplainCheckpoint
