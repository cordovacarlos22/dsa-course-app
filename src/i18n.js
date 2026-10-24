// Sets up translations. UI text lives in src/locales/<language>.json.
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import es from './locales/es.json'
import { getSavedLanguage, saveLinkedLanguage } from './lib/languageStorage'

// A link from the landing page to the course carries the student's language
// (?lang=es). Save it, then take it out of the address bar, so a bookmark or
// a shared link doesn't reset the language on every visit. (Script tests load
// this file in plain Node, where there's no window.)
if (typeof window !== 'undefined') {
  const url = new URL(window.location.href)
  if (url.searchParams.has('lang')) {
    saveLinkedLanguage(url.search)
    url.searchParams.delete('lang')
    window.history.replaceState(window.history.state, '', url)
  }
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es } },
  lng: getSavedLanguage() ?? 'en',
  // Content is written in English first, so English fills any gaps.
  fallbackLng: 'en',
  // React already escapes text, so i18next doesn't need to.
  interpolation: { escapeValue: false },
})

export default i18n
