// Remembers how far a student got in each lesson, in this browser.
// (Moves to Supabase with accounts in stage 8.) Like the saved language,
// every storage call is wrapped in try/catch: blocked storage only means
// progress isn't remembered after a reload.
//
// One entry per lesson, under "progress:<module>/<lesson>":
// {
//   passed: [0, 1],          // steps whose checkpoint passed
//   attempts: { "2": 3 },    // failed tries per step
//   viewedSolution: [2],     // steps where the answer was revealed
//   completed: true          // every step passed
// }

export function emptyProgress() {
  return { passed: [], attempts: {}, viewedSolution: [], completed: false }
}

function storageKey(moduleSlug, lessonSlug) {
  return `progress:${moduleSlug}/${lessonSlug}`
}

export function loadProgress(moduleSlug, lessonSlug) {
  try {
    const saved = JSON.parse(
      localStorage.getItem(storageKey(moduleSlug, lessonSlug)),
    )
    return saved ? { ...emptyProgress(), ...saved } : emptyProgress()
  } catch {
    return emptyProgress()
  }
}

export function saveProgress(moduleSlug, lessonSlug, progress) {
  try {
    localStorage.setItem(
      storageKey(moduleSlug, lessonSlug),
      JSON.stringify(progress),
    )
  } catch {
    // Storage is blocked: progress lasts until the page is closed.
  }
}

// The functions below return a new progress object and never change the old
// one, so they work directly with React state.

export function markStepPassed(progress, stepIndex, stepCount) {
  const passed = progress.passed.includes(stepIndex)
    ? progress.passed
    : [...progress.passed, stepIndex].sort((a, b) => a - b)
  return { ...progress, passed, completed: passed.length >= stepCount }
}

export function recordFailedAttempt(progress, stepIndex) {
  const attempts = {
    ...progress.attempts,
    [stepIndex]: (progress.attempts[stepIndex] ?? 0) + 1,
  }
  return { ...progress, attempts }
}

export function recordViewedSolution(progress, stepIndex) {
  if (progress.viewedSolution.includes(stepIndex)) return progress
  return {
    ...progress,
    viewedSolution: [...progress.viewedSolution, stepIndex],
  }
}

// After this many failed tries on one step, the solution can be revealed.
export const TRIES_BEFORE_SOLUTION = 3

export function failedAttempts(progress, stepIndex) {
  return progress.attempts[stepIndex] ?? 0
}

// The first step the student hasn't passed yet: where to resume a lesson.
export function firstUnpassedStep(progress, stepCount) {
  for (let index = 0; index < stepCount; index++) {
    if (!progress.passed.includes(index)) return index
  }
  return stepCount - 1
}

// Passed "on the first try": no wrong tries and no revealed answer.
function passedOnFirstTry(progress, stepIndex) {
  return (
    progress.passed.includes(stepIndex) &&
    failedAttempts(progress, stepIndex) === 0 &&
    !progress.viewedSolution.includes(stepIndex)
  )
}

// How many of the lesson's steps passed on the first try.
export function countFirstTry(progress, stepCount) {
  let count = 0
  for (let index = 0; index < stepCount; index++) {
    if (passedOnFirstTry(progress, index)) count++
  }
  return count
}

// How many steps in a row, ending at stepIndex, passed on the first try.
export function firstTryStreak(progress, stepIndex) {
  let streak = 0
  for (let index = stepIndex; index >= 0; index--) {
    if (!passedOnFirstTry(progress, index)) break
    streak++
  }
  return streak
}

// True when every one of these lessons (of one module) is complete.
export function isModuleComplete(moduleSlug, lessons) {
  return lessons.every(
    (lesson) => loadProgress(moduleSlug, lesson.slug).completed,
  )
}
