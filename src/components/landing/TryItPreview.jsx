import { useState } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import LandingSection from './LandingSection'
import ChoiceCheckpoint from '../lesson/ChoiceCheckpoint'
import { visualizations } from '../../visualizations'
import { celebrate } from '../../lib/celebrate'
import { XP_PER_STEP } from '../../lib/xp'
import lessonChecks from '../../../content/lessons/big-o/01-why-big-o.checks.json'

// A real step from Big O lesson 1, so visitors can try the course before
// they start: the guest-list code trace and the question that goes with it.
const Animation = visualizations['trace-is-invited']
const checkpoint = lessonChecks.steps[1]
const LESSON_LINK = '/learn/big-o/01-why-big-o'

function TryItPreview() {
  const { t } = useTranslation()
  const [isPassed, setIsPassed] = useState(false)
  const [failedTries, setFailedTries] = useState(0)
  const [isAnswerShown, setIsAnswerShown] = useState(false)

  function handleCorrect() {
    setIsPassed(true)
    celebrate('step')
  }

  return (
    <LandingSection
      id="try-it"
      title={t('landing.preview.title')}
      subtitle={t('landing.preview.subtitle')}
    >
      {/* The animation and the question keep the outer margins they have in
          a lesson; side by side here, their tops line up without them. */}
      <div className="grid items-start gap-6 lg:grid-cols-[3fr_2fr] [&_figure]:my-0 [&_form]:mt-0">
        <Animation />
        <div>
          <ChoiceCheckpoint
            checkpoint={checkpoint}
            isPassed={isPassed}
            cheer={t('checkpoint.cheers', { returnObjects: true })[0]}
            failedTries={failedTries}
            isAnswerShown={isAnswerShown}
            onCorrect={handleCorrect}
            onWrong={() => setFailedTries((tries) => tries + 1)}
            onShowAnswer={() => setIsAnswerShown(true)}
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {/* Always on the page, so screen readers announce the XP the
                moment it appears. */}
            <p
              role="status"
              className="rounded-full bg-accent px-3 py-1 font-extrabold text-ink empty:hidden motion-safe:animate-pop"
            >
              {isPassed && (
                <>
                  <span aria-hidden="true">⚡</span>{' '}
                  {t('landing.preview.xp', { xp: XP_PER_STEP })}
                </>
              )}
            </p>
            {isPassed && (
              <Link
                to={LESSON_LINK}
                className="rounded-full bg-brand px-6 py-2.5 font-bold text-white hover:brightness-110"
              >
                {t('landing.preview.continue')} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </LandingSection>
  )
}

export default TryItPreview
