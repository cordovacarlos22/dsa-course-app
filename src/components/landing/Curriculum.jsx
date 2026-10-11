import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../hooks/useLanguage'
import { getModules, getParts, localize } from '../../lib/course'
import LandingSection from './LandingSection'

// The full course outline, part by part. Ready modules link to their page.
function Curriculum() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const parts = getParts()

  return (
    <LandingSection
      id="curriculum"
      title={t('landing.curriculumTitle')}
      subtitle={t('landing.curriculumSubtitle', {
        modules: getModules().length,
        parts: parts.length,
      })}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {parts.map((part, index) => (
          <div
            key={part.slug}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <h3 className="font-bold">
              {t('course.partTitle', {
                number: index + 1,
                title: localize(part.title, language),
              })}
            </h3>
            <ol className="mt-3 space-y-2">
              {part.modules.map((module) => (
                <li
                  key={module.slug}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  {module.isAvailable ? (
                    <Link
                      to={`/learn/${module.slug}`}
                      className="font-medium text-brand hover:underline"
                    >
                      {module.order}. {localize(module.title, language)}
                    </Link>
                  ) : (
                    <span className="text-slate-500">
                      {module.order}. {localize(module.title, language)}
                    </span>
                  )}
                  {!module.isAvailable && (
                    <span className="shrink-0 text-xs text-slate-400">
                      {t('course.comingSoon')}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </LandingSection>
  )
}

export default Curriculum
