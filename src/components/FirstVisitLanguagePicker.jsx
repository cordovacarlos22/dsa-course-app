import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'
import { getSavedLanguage } from '../lib/languageStorage'

// On the very first visit (no saved language yet) we ask the student which
// language they want. After they pick one, we never show this again.
function FirstVisitLanguagePicker() {
  const { i18n } = useTranslation()
  const { setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(() => getSavedLanguage() === null)

  if (!isOpen) return null

  function choose(language) {
    setLanguage(language)
    setIsOpen(false)
  }

  // Everything here is shown in both languages: we don't know yet which one
  // the student reads.
  const english = i18n.getFixedT('en')
  const spanish = i18n.getFixedT('es')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-picker-title"
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
      >
        <h2 id="language-picker-title" className="text-xl font-bold text-ink">
          Choose your language · Elige tu idioma
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {english('language.pickerSubtitle')}
          <br />
          {spanish('language.pickerSubtitle')}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => choose('en')}
            className="rounded-xl border-2 border-brand px-4 py-3 font-semibold text-brand hover:bg-brand hover:text-white"
          >
            English
          </button>
          <button
            type="button"
            onClick={() => choose('es')}
            className="rounded-xl border-2 border-brand px-4 py-3 font-semibold text-brand hover:bg-brand hover:text-white"
          >
            Español
          </button>
        </div>
      </div>
    </div>
  )
}

export default FirstVisitLanguagePicker
