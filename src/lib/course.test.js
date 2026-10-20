import { describe, it, expect } from 'vitest'
import {
  getModule,
  getModules,
  getSections,
  lessonTitle,
  localize,
} from './course'
import { getLessonVersion, getLessons } from './lessons'

// The full quiz files, to check the summary against.
const practiceFiles = import.meta.glob('../../content/practice/*.json', {
  eager: true,
  import: 'default',
})

describe('localize', () => {
  it('picks the requested language', () => {
    expect(localize({ en: 'Trees', es: 'Árboles' }, 'es')).toBe('Árboles')
  })

  it('falls back to English when the translation is missing', () => {
    expect(localize({ en: 'Trees' }, 'es')).toBe('Trees')
  })

  it('returns an empty string for missing text', () => {
    expect(localize(undefined, 'en')).toBe('')
  })
})

describe('getModules', () => {
  it('attaches the quiz/exercises to modules that have them', () => {
    const modules = getModules()
    expect(modules).toHaveLength(24)
    expect(getModule('big-o').practice.questions).toBeGreaterThan(0)
    expect(getModule('linked-lists').practice).toBeNull()
  })

  // The summary is built by scripts/content-catalog.js. If it ever drifted
  // from the real files, the course home would show the wrong lessons.
  it('summarizes exactly the lessons and quizzes in content/', () => {
    for (const module of getModules()) {
      const lessons = getLessons(module.slug)
      expect(module.lessons.map((lesson) => lesson.slug)).toEqual(
        lessons.map((lesson) => lesson.slug),
      )
      module.lessons.forEach((summary, index) => {
        expect(summary.minutes).toBe(lessons[index].minutes)
        for (const language of ['en', 'es']) {
          expect(lessonTitle(summary, language)).toBe(
            getLessonVersion(lessons[index], language).title,
          )
        }
      })
    }
    for (const practice of Object.values(practiceFiles)) {
      const { exercises } = practice
      expect(getModule(practice.slug).practice).toEqual({
        questions: practice.questions.length,
        build: exercises.filter((e) => e.category === 'build').length,
        interview: exercises.filter((e) => e.category === 'interview').length,
        exercises: exercises.map(({ slug, title, difficulty, category }) => ({
          slug,
          title,
          difficulty,
          category,
        })),
      })
    }
  })

  it('returns null for an unknown module', () => {
    expect(getModule('nope')).toBeNull()
  })
})

describe('getSections', () => {
  it('groups all 24 modules into 7 sections, in order', () => {
    const sections = getSections()
    expect(sections.map((section) => section.slug)).toEqual([
      'foundations',
      'problem-solving',
      'searching-and-sorting',
      'data-structures',
      'graph-algorithms',
      'dynamic-programming',
      'interview-practice',
    ])
    expect(sections.flatMap((section) => section.modules)).toHaveLength(24)
    expect(sections[0].modules[1].slug).toBe('big-o')
  })
})
