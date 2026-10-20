// Remembers each module's best quiz score, in this browser, under
// "quiz:<module>" as { best, total }. (Moves to Supabase with accounts in
// stage 8.) Like lesson progress, every storage call is wrapped in try/catch:
// blocked storage only means the score isn't remembered after a reload.

function storageKey(moduleSlug) {
  return `quiz:${moduleSlug}`
}

// { best, total }, or null when the quiz hasn't been finished yet.
export function loadQuizScore(moduleSlug) {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(moduleSlug)))
    return Number.isInteger(saved?.best) && Number.isInteger(saved?.total)
      ? saved
      : null
  } catch {
    return null
  }
}

// Saves a finished quiz and returns the best score so far. A lower score
// never replaces a higher one.
export function saveQuizScore(moduleSlug, score, total) {
  const saved = loadQuizScore(moduleSlug)
  const best = saved && saved.best >= score ? saved : { best: score, total }
  try {
    localStorage.setItem(storageKey(moduleSlug), JSON.stringify(best))
  } catch {
    // Storage is blocked: the score lasts until the page is closed.
  }
  return best
}
