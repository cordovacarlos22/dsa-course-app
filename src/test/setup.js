// Runs before every test file.
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import i18n from '../i18n'

// Script tests (scripts/*.test.js) run in plain Node, where there's no
// browser storage, so only touch localStorage when it exists.
const hasBrowserStorage = typeof localStorage !== 'undefined'

// jsdom has <dialog> but not its methods. These stand-ins open and close it
// like a browser does (a browser also makes the page behind a modal inert).
if (
  typeof HTMLDialogElement !== 'undefined' &&
  !HTMLDialogElement.prototype.showModal
) {
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function (returnValue) {
    if (!this.open) return
    if (returnValue !== undefined) this.returnValue = returnValue
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
}

afterEach(() => {
  // Remove what the test rendered, forget the saved language and go back to
  // English, so every test starts like a brand-new visitor.
  cleanup()
  if (hasBrowserStorage) localStorage.clear()
  i18n.changeLanguage('en')
})
