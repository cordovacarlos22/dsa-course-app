import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../hooks/useLanguage'
import { localize } from '../../lib/course'
import { TRIES_BEFORE_SOLUTION } from '../../lib/progress'
import InlineMarkdown from './InlineMarkdown'

// A multiple-choice question at the end of a step.
// A wrong answer shows the hint; after a few wrong tries the right answer
// can be revealed (the student still selects it to pass).
function ChoiceCheckpoint({
  checkpoint,
  isPassed,
  failedTries,
  isAnswerShown,
  onCorrect,
  onWrong,
  onShowAnswer,
}) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const [selected, setSelected] = useState(isPassed ? checkpoint.answer : null)
  // What the last "Check" said: null, 'correct' or 'wrong'.
  const [verdict, setVerdict] = useState(isPassed ? 'correct' : null)

  function check(event) {
    event.preventDefault()
    if (selected === null) return
    if (selected === checkpoint.answer) {
      setVerdict('correct')
      onCorrect()
    } else {
      setVerdict('wrong')
      onWrong()
    }
  }

  const canShowAnswer =
    !isPassed && !isAnswerShown && failedTries >= TRIES_BEFORE_SOLUTION

  return (
    <form
      onSubmit={check}
      className="mt-10 rounded-2xl border-2 border-brand/30 bg-white p-6"
    >
      <fieldset>
        <legend className="text-xs font-semibold tracking-wide text-brand uppercase">
          {t('checkpoint.title')}
        </legend>
        <p className="mt-2 text-lg font-semibold">
          <InlineMarkdown>
            {localize(checkpoint.question, language)}
          </InlineMarkdown>
        </p>
        <div className="mt-4 space-y-2">
          {checkpoint.options.map((option, index) => {
            const isRightAndShown = isAnswerShown && index === checkpoint.answer
            return (
              <label
                key={index}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 ${
                  selected === index
                    ? 'border-brand bg-brand/5'
                    : 'border-slate-200 hover:border-slate-400'
                } ${isRightAndShown ? 'ring-2 ring-green-500' : ''}`}
              >
                <input
                  type="radio"
                  name="choice"
                  checked={selected === index}
                  onChange={() => {
                    setSelected(index)
                    if (verdict === 'wrong') setVerdict(null)
                  }}
                  disabled={verdict === 'correct'}
                  className="accent-brand"
                />
                <InlineMarkdown>{localize(option, language)}</InlineMarkdown>
              </label>
            )
          })}
        </div>
      </fieldset>

      {verdict !== 'correct' && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={selected === null}
            className="rounded-lg bg-brand px-5 py-2 font-bold text-white disabled:opacity-50"
          >
            {t('checkpoint.checkAnswer')}
          </button>
          {canShowAnswer && (
            <button
              type="button"
              onClick={onShowAnswer}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 underline hover:text-ink"
            >
              {t('checkpoint.showAnswer')}
            </button>
          )}
        </div>
      )}

      <div role="status" className="mt-4 empty:hidden">
        {verdict === 'correct' && (
          <div className="rounded-xl bg-green-50 p-4 text-green-900">
            <p className="font-bold">✓ {t('checkpoint.correct')}</p>
            <p className="mt-1">
              <InlineMarkdown>
                {localize(checkpoint.explanation, language)}
              </InlineMarkdown>
            </p>
          </div>
        )}
        {verdict === 'wrong' && (
          <div className="rounded-xl bg-amber-50 p-4 text-amber-900">
            <p className="font-bold">{t('checkpoint.wrong')}</p>
            <p className="mt-1">
              <span className="font-semibold">{t('checkpoint.hint')}:</span>{' '}
              <InlineMarkdown>
                {localize(checkpoint.hint, language)}
              </InlineMarkdown>
            </p>
          </div>
        )}
        {isAnswerShown && verdict !== 'correct' && (
          <p className="mt-2 text-sm text-slate-600">
            {t('checkpoint.answerShown')}
          </p>
        )}
      </div>
    </form>
  )
}

export default ChoiceCheckpoint
