import { useTranslation } from 'react-i18next'
import { saveLanguage } from '../lib/languageStorage'

// The current language ("en" or "es") and a function to change it.
// Changing it updates the UI, remembers the choice and sets <html lang>
// (screen readers use it to pick the right pronunciation).
export function useLanguage() {
  const { i18n } = useTranslation()

  function setLanguage(language) {
    i18n.changeLanguage(language)
    saveLanguage(language)
    document.documentElement.lang = language
  }

  return { language: i18n.resolvedLanguage ?? 'en', setLanguage }
}
