import { useTranslation } from 'react-i18next'
import ModuleCard from '../components/ModuleCard'
import { getModules } from '../lib/course'

function CourseHomePage() {
  const { t } = useTranslation()
  const modules = getModules()

  return (
    <div>
      <h1 className="text-3xl font-extrabold">{t('course.title')}</h1>
      <p className="mt-2 text-slate-600">{t('course.subtitle')}</p>
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <ModuleCard key={module.slug} module={module} />
        ))}
      </ol>
    </div>
  )
}

export default CourseHomePage
