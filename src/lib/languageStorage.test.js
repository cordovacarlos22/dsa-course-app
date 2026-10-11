import { afterEach, describe, it, expect, vi } from 'vitest'
import { getSavedLanguage, saveLanguage } from './languageStorage'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('languageStorage', () => {
  it('saves and reads the language', () => {
    expect(getSavedLanguage()).toBeNull()
    saveLanguage('es')
    expect(getSavedLanguage()).toBe('es')
  })

  it('ignores values that are not a supported language', () => {
    localStorage.setItem('language', 'fr')
    expect(getSavedLanguage()).toBeNull()
  })

  it('keeps working when the browser blocks storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(() => saveLanguage('es')).not.toThrow()
    expect(getSavedLanguage()).toBeNull()
  })
})
