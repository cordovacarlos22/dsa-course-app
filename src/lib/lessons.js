// Reads the lessons in content/lessons/<module-slug>/<NN-lesson-slug>.<lang>.md
// They're bundled with the app as plain text (`?raw`), then parsed here.
import { parseFrontMatter } from './frontMatter'

const lessonFiles = import.meta.glob('../../content/lessons/*/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// "../../content/lessons/big-o/01-what-is-big-o.en.md"
//   → { moduleSlug: "big-o", slug: "01-what-is-big-o", language: "en" }
const LESSON_PATH = /lessons\/([^/]+)\/([^/]+)\.(en|es)\.md$/

// Builds { [moduleSlug]: [lesson, …] }, each list sorted by `order`.
// A lesson has one "version" per language it's written in.
export function buildLessonIndex(files) {
  const lessons = {}

  for (const [path, text] of Object.entries(files)) {
    const match = LESSON_PATH.exec(path)
    if (!match) continue
    const [, moduleSlug, slug, language] = match
    const { data, body } = parseFrontMatter(text)

    lessons[moduleSlug] ??= {}
    lessons[moduleSlug][slug] ??= { moduleSlug, slug, versions: {} }
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

const lessonIndex = buildLessonIndex(lessonFiles)

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
