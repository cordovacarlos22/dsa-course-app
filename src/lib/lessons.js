// Reads the lessons in content/lessons/<module-slug>/<NN-lesson-slug>.<lang>.md
// They're bundled with the app as plain text (`?raw`), then parsed here.
// A lesson can have checkpoints next to it: <NN-lesson-slug>.checks.json
// (one per step; see scripts/content-schema.js).
import { parseFrontMatter } from './frontMatter'
import { splitSteps } from './steps'

const lessonFiles = import.meta.glob('../../content/lessons/*/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// "../../content/lessons/big-o/01-what-is-big-o.en.md"
//   → { moduleSlug: "big-o", slug: "01-what-is-big-o", language: "en" }
const LESSON_PATH = /lessons\/([^/]+)\/([^/]+)\.(en|es)\.md$/

const checksFiles = import.meta.glob('../../content/lessons/*/*.checks.json', {
  import: 'default',
  eager: true,
})
const CHECKS_PATH = /lessons\/([^/]+)\/([^/]+)\.checks\.json$/

// { "big-o/01-what-is-big-o": [checkpoint, …] }
export function buildChecksIndex(files) {
  const checks = {}
  for (const [path, data] of Object.entries(files)) {
    const match = CHECKS_PATH.exec(path)
    if (match) checks[`${match[1]}/${match[2]}`] = data.steps
  }
  return checks
}

// Builds { [moduleSlug]: [lesson, …] }, each list sorted by `order`.
// A lesson has one "version" per language it's written in.
// `checks` is the result of buildChecksIndex; lessons without checkpoints get
// `checkpoints: []`.
export function buildLessonIndex(files, checks = {}) {
  const lessons = {}

  for (const [path, text] of Object.entries(files)) {
    const match = LESSON_PATH.exec(path)
    if (!match) continue
    const [, moduleSlug, slug, language] = match
    const { data, body } = parseFrontMatter(text)

    lessons[moduleSlug] ??= {}
    lessons[moduleSlug][slug] ??= {
      moduleSlug,
      slug,
      versions: {},
      checkpoints: checks[`${moduleSlug}/${slug}`] ?? [],
    }
    const lesson = lessons[moduleSlug][slug]
    lesson.versions[language] = { title: data.title, body }
    // English is written first, so its order/minutes are the reference.
    if (language === 'en' || lesson.order === undefined) {
      lesson.order = data.order
      lesson.minutes = data.minutes
    }
  }

  return Object.fromEntries(
    Object.entries(lessons).map(([moduleSlug, bySlug]) => [
      moduleSlug,
      Object.values(bySlug).sort((a, b) => a.order - b.order),
    ]),
  )
}

const lessonIndex = buildLessonIndex(lessonFiles, buildChecksIndex(checksFiles))

export function getLessons(moduleSlug) {
  return lessonIndex[moduleSlug] ?? []
}

export function getLesson(moduleSlug, slug) {
  return getLessons(moduleSlug).find((lesson) => lesson.slug === slug) ?? null
}

// The lesson in the student's language, or English if it isn't translated yet.
export function getLessonVersion(lesson, language) {
  return lesson.versions[language] ?? lesson.versions.en
}

// The lesson's steps in one language: [{ title, body, checkpoint }].
// `checkpoint` is null when the lesson has no checkpoints yet (Next is then
// always open). The validator makes sure the counts match when it has them.
export function getLessonSteps(lesson, language) {
  const { body } = getLessonVersion(lesson, language)
  return splitSteps(body).map((step, index) => ({
    ...step,
    checkpoint: lesson.checkpoints[index] ?? null,
  }))
}
