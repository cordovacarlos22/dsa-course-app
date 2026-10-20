// The course outline (content/course.json) and a summary of each module's
// content: its lessons' titles and minutes, and how many quiz questions and
// exercises it has. The summary is built with the app by
// scripts/content-catalog.js, so the course home doesn't have to download
// every lesson and quiz. The full lessons live in ./lessons.js.
import course from '../../content/course.json'
import catalog from 'virtual:content-catalog'

// Picks the text in the student's language. Content is written in English
// first, so we fall back to English when a translation is missing.
export function localize(text, language) {
  if (!text) return ''
  return text[language] ?? text.en ?? ''
}

export function getCourse() {
  return course
}

// Each module from the outline, plus the summary of its content:
// - lessons: [{ slug, order, minutes, titles: { en, es } }], in order
// - practice: { questions, build, interview } (how many of each), or null
// A module with no lessons and no practice is still "coming soon".
export function getModules() {
  return course.modules.map((module) => {
    const { lessons = [], practice = null } = catalog[module.slug] ?? {}
    return {
      ...module,
      lessons,
      practice,
      isAvailable: lessons.length > 0 || practice !== null,
    }
  })
}

// A lesson's title in the student's language, or English if it isn't
// translated yet.
export function lessonTitle(lesson, language) {
  return lesson.titles[language] ?? lesson.titles.en
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
