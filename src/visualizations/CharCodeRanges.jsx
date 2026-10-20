import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'

// Every character has a number, its character code: 'a'.charCodeAt(0) is 97.
// Digits, capital letters and lowercase letters each sit in one block of
// numbers, so "is it a letter or a digit?" is three range checks. The line
// shows codes 32 (a space) to 126 ('~').

const LOWEST = 32
const HIGHEST = 126

const RANGES = [
  { label: '0–9', from: 48, to: 57 },
  { label: 'A–Z', from: 65, to: 90 },
  { label: 'a–z', from: 97, to: 122 },
]

// The characters the animation tests, in order. '[' and '`' sit right next
// to a range, which is where off-by-one mistakes happen.
const CHARACTERS = ['a', 'Z', '7', ' ', '!', '[', '`']

function isInARange(code) {
  return RANGES.some((range) => code >= range.from && code <= range.to)
}

const percentOf = (code) => ((code - LOWEST) / (HIGHEST - LOWEST)) * 100

const STEPS = [
  { captionKey: 'start', char: null },
  ...CHARACTERS.map((char) => ({ captionKey: 'test', char })),
  { captionKey: 'summary', char: null },
]

// How a character is written in the code and in captions: ' ' for a space.
const shown = (char) => `'${char}'`

function CharCodeRanges() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => {
    if (step.char === null) {
      return { ...step, caption: t(`viz.charCodeRanges.${step.captionKey}`) }
    }
    const code = step.char.charCodeAt(0)
    const isValid = isInARange(code)
    return {
      ...step,
      code,
      isValid,
      caption: t(`viz.charCodeRanges.${isValid ? 'inside' : 'outside'}`, {
        char: shown(step.char),
        code,
      }),
    }
  })
  return (
    <StepPlayer
      title={t('viz.charCodeRanges.title')}
      steps={steps}
      renderStep={(step) => (
        <div className="space-y-3">
          <p className="min-h-6 font-mono text-sm">
            {step.char !== null &&
              `${shown(step.char)}.charCodeAt(0) → ${step.code} → ${step.isValid}`}
          </p>
          <div aria-hidden="true" className="relative h-20 px-1">
            <div className="absolute inset-x-1 top-7 h-6 rounded bg-slate-100" />
            {RANGES.map((range) => (
              <div
                key={range.label}
                className="absolute top-7 flex h-6 items-center justify-center rounded bg-green-200 text-[11px] font-bold text-green-900"
                style={{
                  left: `${percentOf(range.from)}%`,
                  width: `${percentOf(range.to) - percentOf(range.from)}%`,
                }}
              >
                {range.label}
              </div>
            ))}
            {RANGES.map((range) => (
              <span
                key={`${range.label}-edges`}
                className="absolute top-14 text-[10px] text-slate-500"
                style={{ left: `${percentOf(range.from)}%` }}
              >
                {range.from}
              </span>
            ))}
            {step.char !== null && (
              <span
                className={`absolute top-0 -translate-x-1/2 text-xs font-bold transition-all duration-500 ${
                  step.isValid ? 'text-green-700' : 'text-red-700'
                }`}
                style={{ left: `${percentOf(step.code)}%` }}
              >
                {step.code} ↓
              </span>
            )}
          </div>
        </div>
      )}
    />
  )
}

export default CharCodeRanges
