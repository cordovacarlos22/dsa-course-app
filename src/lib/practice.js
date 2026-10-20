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
