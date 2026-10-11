// Runs before every test file.
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import i18n from '../i18n'

// Script tests (scripts/*.test.js) run in plain Node, where there's no
// browser storage, so only touch localStorage when it exists.
const hasBrowserStorage = typeof localStorage !== 'undefined'

afterEach(() => {
  // Remove what the test rendered, forget the saved language and go back to
  // English, so every test starts like a brand-new visitor.
  cleanup()
  if (hasBrowserStorage) localStorage.clear()
  i18n.changeLanguage('en')
})
