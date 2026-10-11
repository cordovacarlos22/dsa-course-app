// Remembers the student's language in the browser.
// localStorage can be unavailable (private windows, blocked storage), so every
// read and write is wrapped in try/catch and the app still works without it.

export const SUPPORTED_LANGUAGES = ['en', 'es']
const STORAGE_KEY = 'language'

// Returns "en" or "es", or null when the student hasn't chosen yet.
export function getSavedLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return SUPPORTED_LANGUAGES.includes(saved) ? saved : null
  } catch {
    return null
  }
}

export function saveLanguage(language) {
  try {
    localStorage.setItem(STORAGE_KEY, language)
  } catch {
    // Storage is blocked: the choice just won't be remembered next visit.
  }
}
