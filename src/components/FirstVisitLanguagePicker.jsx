import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'
import { getSavedLanguage } from '../lib/languageStorage'

// On the very first visit (no saved language yet) we ask the student which
// language they want. After they pick one, we never show this again.
function FirstVisitLanguagePicker() {
  const { i18n } = useTranslation()
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(() => getSavedLanguage() === null)
  const dialogRef = useRef(null)

  // showModal() moves keyboard focus into the dialog and makes the page
  // behind it unreachable (also for screen readers) until it closes.
  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen && dialog && !dialog.open) dialog.showModal()
  }, [isOpen])

  if (!isOpen) return null

  // The buttons close the dialog with their language as its returnValue.
  // Escape closes it with none: the student keeps the current language.
  function handleClose() {
    setLanguage(dialogRef.current.returnValue || language)
    setIsOpen(false)
  }

  // Everything here is shown in both languages: we don't know yet which one
  // the student reads.
  const english = i18n.getFixedT('en')
  const spanish = i18n.getFixedT('es')
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="language-picker-title"
      onClose={handleClose}
      // The backdrop color is written out (ink at 60%) because older
      // browsers don't pass CSS variables like --color-ink to ::backdrop.
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl backdrop:bg-[rgb(15_23_42/0.6)]"
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
          onClick={() => dialogRef.current.close('en')}
          className="rounded-xl border-2 border-brand px-4 py-3 font-semibold text-brand hover:bg-brand hover:text-white"
        >
          English
        </button>
        <button
          type="button"
          onClick={() => dialogRef.current.close('es')}
          className="rounded-xl border-2 border-brand px-4 py-3 font-semibold text-brand hover:bg-brand hover:text-white"
        >
          Español
        </button>
      </div>
    </dialog>
  )
}

export default FirstVisitLanguagePicker
