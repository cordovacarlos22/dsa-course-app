// Practice exercises (Build it and Interview problems): what a student
// solved, the timer setting, and the shape the coding workspace expects.
// Like lesson progress, every storage call is wrapped in try/catch: blocked
// storage only means nothing is remembered after a reload. (Moves to
// Supabase with accounts in stage 8.)

// Minutes for the countdown, by difficulty.
export const COUNTDOWN_MINUTES = { easy: 15, medium: 25, hard: 40 }
export const TIMER_MODES = ['stopwatch', 'countdown', 'off']

const TIMER_KEY = 'timerMode'

function resultKey(moduleSlug, exerciseSlug) {
  return `exercise:${moduleSlug}/${exerciseSlug}`
}

function emptyResult() {
  return { solved: false, bestTimeMs: null, viewedSolution: false }
}

// { solved, bestTimeMs, viewedSolution } for one exercise.
export function loadExerciseResult(moduleSlug, exerciseSlug) {
  try {
    const saved = JSON.parse(
      localStorage.getItem(resultKey(moduleSlug, exerciseSlug)),
    )
    return saved ? { ...emptyResult(), ...saved } : emptyResult()
  } catch {
    return emptyResult()
  }
}

function saveExerciseResult(moduleSlug, exerciseSlug, result) {
  try {
    localStorage.setItem(
      resultKey(moduleSlug, exerciseSlug),
      JSON.stringify(result),
    )
  } catch {
    // Storage is blocked: the result lasts until the page is closed.
  }
  return result
}

// Marks the exercise solved and keeps the fastest time. Returns the result.
export function saveSolved(moduleSlug, exerciseSlug, timeMs) {
  const saved = loadExerciseResult(moduleSlug, exerciseSlug)
  const bestTimeMs =
    saved.bestTimeMs === null ? timeMs : Math.min(saved.bestTimeMs, timeMs)
  return saveExerciseResult(moduleSlug, exerciseSlug, {
    ...saved,
    solved: true,
    bestTimeMs,
  })
}

export function saveViewedSolution(moduleSlug, exerciseSlug) {
  const saved = loadExerciseResult(moduleSlug, exerciseSlug)
  return saveExerciseResult(moduleSlug, exerciseSlug, {
    ...saved,
    viewedSolution: true,
  })
}

// The student's timer choice. The stopwatch is the default: it measures
// without the pressure of a countdown.
export function loadTimerMode() {
  try {
    const saved = localStorage.getItem(TIMER_KEY)
    return TIMER_MODES.includes(saved) ? saved : 'stopwatch'
  } catch {
    return 'stopwatch'
  }
}

export function saveTimerMode(mode) {
  try {
    localStorage.setItem(TIMER_KEY, mode)
  } catch {
    // Storage is blocked: the choice lasts until the page is closed.
  }
}

// 75000 → "1:15", 3_725_000 → "1:02:05"
export function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  if (hours === 0) return `${minutes}:${seconds}`
  return `${hours}:${String(minutes).padStart(2, '0')}:${seconds}`
}

// An exercise in the shape the coding workspace (CodeWorkspace) expects
// from a lesson's coding step. Exercises have no hint of their own, so the
// hint (shown after a failed try) reminds the student of the target Big O.
export function exerciseAsStep(exercise, hint) {
  return {
    title: null,
    body: '',
    checkpoint: {
      task: exercise.description,
      hint,
      starterCode: exercise.starterCode.javascript,
      solution: exercise.solution.javascript,
      kind: exercise.kind ?? 'function',
      functionName: exercise.functionName,
      className: exercise.className,
      tests: exercise.tests,
    },
  }
}
