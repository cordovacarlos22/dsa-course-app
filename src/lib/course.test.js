import { describe, it, expect } from 'vitest'
import { getModule, getModules, getParts, localize } from './course'

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
    expect(modules).toHaveLength(17)
    expect(getModule('02-big-o').section.questions.length).toBeGreaterThan(0)
    expect(getModule('04-listas-enlazadas').section).toBeNull()
  })

  it('returns null for an unknown module', () => {
    expect(getModule('nope')).toBeNull()
  })
})

describe('getParts', () => {
  it('groups all 17 modules into 5 parts, in order', () => {
    const parts = getParts()
    expect(parts.map((part) => part.slug)).toEqual([
      'foundations',
      'data-structures',
      'recursion-and-trees',
      'sorting',
      'dynamic-programming',
    ])
    expect(parts.flatMap((part) => part.modules)).toHaveLength(17)
    expect(parts[0].modules[1].slug).toBe('02-big-o')
  })
})
