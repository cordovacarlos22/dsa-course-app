// The full quiz and exercises of each module (content/practice/*.json).
// Only the quiz and exercise pages import this file, so the first page
// doesn't download them: it uses the short summary in ./course.js.
const practiceFiles = import.meta.glob('../../content/practice/*.json', {
  eager: true,
  import: 'default',
})

const practiceBySlug = Object.fromEntries(
  Object.values(practiceFiles).map((practice) => [practice.slug, practice]),
)

export function getPractice(moduleSlug) {
  return practiceBySlug[moduleSlug] ?? null
}

// The questions for one quiz run: in order or shuffled, then the first
// `count` of them (or all).
export function pickQuestions(questions, { order, count }) {
  const list = order === 'random' ? shuffle(questions) : [...questions]
  return count === 'all' ? list : list.slice(0, count)
}

// A shuffled copy (Fisher–Yates: every order is equally likely).
export function shuffle(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const swapped = copy[i]
    copy[i] = copy[j]
    copy[j] = swapped
  }
  return copy
}
