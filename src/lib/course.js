// Reads the course content that lives in the repo (content/ folder).
// It's bundled with the app, so there's nothing to fetch.
import course from '../../content/course.json'
import { getLessons } from './lessons'

// Every content/practice/<module-slug>.json file (the module's quiz + exercises).
const practiceFiles = import.meta.glob('../../content/practice/*.json', {
  eager: true,
  import: 'default',
})

const practiceBySlug = Object.fromEntries(
  Object.values(practiceFiles).map((practice) => [practice.slug, practice]),
)

// Picks the text in the student's language. Content is written in English
// first, so we fall back to English when a translation is missing.
export function localize(text, language) {
  if (!text) return ''
  return text[language] ?? text.en ?? ''
}

export function getCourse() {
  return course
}

// Each module from the outline, plus its lessons and its quiz/exercises when
// they exist. A module with neither is still "coming soon".
export function getModules() {
  return course.modules.map((module) => {
    const lessons = getLessons(module.slug)
    const practice = practiceBySlug[module.slug] ?? null
    return {
      ...module,
      lessons,
      practice,
      isAvailable: lessons.length > 0 || practice !== null,
    }
  })
}

export function getModule(slug) {
  return getModules().find((module) => module.slug === slug) ?? null
}

// The course's sections ("Foundations", "Sorting"…), each with its modules.
export function getSections() {
  const modulesBySlug = Object.fromEntries(
    getModules().map((module) => [module.slug, module]),
  )
  return course.sections.map((section) => ({
    ...section,
    modules: section.modules.map((slug) => modulesBySlug[slug]),
  }))
}
