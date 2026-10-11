// Reads the course content that lives in the repo (content/ folder).
// It's bundled with the app, so there's nothing to fetch.
import course from '../../content/course.json'
import { getLessons } from './lessons'

// Every content/sections/<module-slug>.json file (quiz + exercises).
const sectionFiles = import.meta.glob('../../content/sections/*.json', {
  eager: true,
  import: 'default',
})

const sectionsBySlug = Object.fromEntries(
  Object.values(sectionFiles).map((section) => [section.slug, section]),
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
    const section = sectionsBySlug[module.slug] ?? null
    return {
      ...module,
      lessons,
      section,
      isAvailable: lessons.length > 0 || section !== null,
    }
  })
}

export function getModule(slug) {
  return getModules().find((module) => module.slug === slug) ?? null
}
