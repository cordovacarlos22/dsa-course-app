import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const PLAY_INTERVAL_MS = 2200

// Plays an animation one step at a time.
// - steps: an array; each step is whatever the animation needs to draw itself,
//   plus a `caption` (the sentence explaining that step).
// - renderStep(step): draws one step.
// Every animation in src/visualizations/ uses this, so they all look and
// behave the same (Previous / Play / Next, keyboard friendly).
function StepPlayer({ title, steps, renderStep }) {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const isFirst = index === 0
  const isLast = index === steps.length - 1

  // While playing, move forward on a timer and stop at the last step.
  useEffect(() => {
    if (!isPlaying) return
    if (isLast) {
      setIsPlaying(false)
      return
    }
    const timer = setTimeout(() => setIndex((i) => i + 1), PLAY_INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [isPlaying, isLast, index])

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

  return (
    <figure className="not-prose my-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <figcaption className="text-sm font-bold">{title}</figcaption>

      <div className="mt-3 overflow-x-auto">{renderStep(step)}</div>

      {/* aria-live: screen readers read each new caption out loud. */}
      <p aria-live="polite" className="mt-3 min-h-12 text-slate-700">
        {step.caption}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={isFirst}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
        >
          ← {t('stepPlayer.previous')}
        </button>
        <button
          type="button"
          onClick={togglePlay}
          className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white"
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
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
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
