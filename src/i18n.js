// Sets up translations. UI text lives in src/locales/<language>.json.
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import es from './locales/es.json'
import { getSavedLanguage } from './lib/languageStorage'

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es } },
  lng: getSavedLanguage() ?? 'en',
  // Content is written in English first, so English fills any gaps.
  fallbackLng: 'en',
  // React already escapes text, so i18next doesn't need to.
  interpolation: { escapeValue: false },
})

export default i18n
