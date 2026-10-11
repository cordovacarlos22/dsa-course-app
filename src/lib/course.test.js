import { describe, it, expect } from 'vitest'
import { getModule, getModules, getSections, localize } from './course'

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
    expect(getModule('big-o').practice.questions.length).toBeGreaterThan(0)
    expect(getModule('linked-lists').practice).toBeNull()
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
