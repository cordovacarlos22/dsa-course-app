import { useTranslation } from 'react-i18next'
import ModuleCard from '../components/ModuleCard'
import { useLanguage } from '../hooks/useLanguage'
import { getCourse, getParts, localize } from '../lib/course'

// All modules, grouped into the course's parts ("Foundations", "Sorting"…).
function CourseHomePage() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const course = getCourse()

  return (
    <div>
      <h1 className="text-3xl font-extrabold">{t('course.title')}</h1>
      <p className="mt-2 max-w-3xl text-slate-600">
        {localize(course.description, language)}
      </p>

      {getParts().map((part, index) => (
        <section key={part.slug} className="mt-10">
          <h2 className="text-xl font-bold">
            {t('course.partTitle', {
              number: index + 1,
              title: localize(part.title, language),
            })}
          </h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {part.modules.map((module) => (
              <ModuleCard key={module.slug} module={module} />
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}

export default CourseHomePage
