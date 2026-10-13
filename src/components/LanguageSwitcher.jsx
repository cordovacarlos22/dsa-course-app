import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'
import { SUPPORTED_LANGUAGES } from '../lib/languageStorage'

// Small EN | ES toggle for the header.
function LanguageSwitcher() {
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguage()

  return (
    <div
      role="group"
      aria-label={t('language.switcherLabel')}
      className="flex rounded-full border border-slate-300 p-0.5 text-sm"
    >
      {SUPPORTED_LANGUAGES.map((code) => {
        const isActive = code === language
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLanguage(code)}
            aria-pressed={isActive}
            aria-label={t(`language.${code}`)}
            // after:-inset-y-2.5: a taller tap area (about 46 px) with no visual
            // change. Vertical only, so EN and ES don't overlap.
            className={`relative rounded-full px-3 py-1 font-semibold uppercase transition-colors after:absolute after:inset-x-0 after:-inset-y-2.5 ${
              isActive ? 'bg-brand text-white' : 'text-slate-600 hover:text-ink'
            }`}
          >
            {code}
          </button>
        )
      })}
    </div>
  )
}

export default LanguageSwitcher
