import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AutoPlayContext } from '../visualizations/autoPlay'
import { prefersReducedMotion } from '../lib/prefersReducedMotion'

const PLAY_INTERVAL_MS = 2200

// Plays an animation one step at a time.
// - steps: an array; each step is whatever the animation needs to draw itself,
//   plus a `caption` (the sentence explaining that step).
// - renderStep(step): draws one step.
// Every animation in src/visualizations/ uses this, so they all look and
// behave the same (Previous / Play / Next, keyboard friendly).
// - toolbar: optional controls shown under the title (e.g. an input picker).
function StepPlayer({ title, steps, renderStep, toolbar = null }) {
  const { t } = useTranslation()
  // On the landing page's reel the animation plays on its own and loops,
  // unless the device asks for less motion.
  const autoPlay = useContext(AutoPlayContext)
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(
    () => autoPlay && !prefersReducedMotion(),
  )

  const isFirst = index === 0
  const isLast = index === steps.length - 1

  // While playing, move forward on a timer and stop when it reaches the last
  // step (or start over, when it plays on its own).
  useEffect(() => {
    if (!isPlaying) return
    const timer = setTimeout(() => {
      const nextIndex = (index + 1) % steps.length
      setIndex(nextIndex)
      if (nextIndex === steps.length - 1 && !autoPlay) setIsPlaying(false)
    }, PLAY_INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [isPlaying, index, autoPlay, steps.length])

  function togglePlay() {
    // Pressing Play on the last step starts again from the beginning.
    if (isLast) setIndex(0)
    setIsPlaying((playing) => !playing)
  }

  function goTo(newIndex) {
    setIsPlaying(false)
    setIndex(newIndex)
  }

  const step = steps[index]

  // @container: animations size their layout to this box, not to the screen,
  // so they also fit inside a narrow pane (like the coding step's Learn pane).
  return (
    <figure className="@container not-prose my-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <figcaption className="text-sm font-bold">{title}</figcaption>
      {toolbar}

      <div className="mt-3 overflow-x-auto">{renderStep(step)}</div>

      {/* aria-live: screen readers read each new caption out loud, but not
          while the animation plays on its own (it would never stop talking). */}
      <p
        aria-live={autoPlay && isPlaying ? 'off' : 'polite'}
        className="mt-3 min-h-12 text-slate-700"
      >
        {step.caption}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={isFirst}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          ← {t('stepPlayer.previous')}
        </button>
        <button
          type="button"
          onClick={togglePlay}
          className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:brightness-110"
        >
          {isPlaying
            ? t('stepPlayer.pause')
            : isLast
              ? t('stepPlayer.restart')
              : t('stepPlayer.play')}
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={isLast}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          {t('stepPlayer.next')} →
        </button>
        <span className="ml-auto text-xs text-slate-500">
          {t('stepPlayer.stepOf', { current: index + 1, total: steps.length })}
        </span>
      </div>
    </figure>
  )
}

export default StepPlayer
