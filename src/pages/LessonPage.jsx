import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'
import { getModule, localize } from '../lib/course'
import { getLessonVersion } from '../lib/lessons'
import LessonMarkdown from '../components/LessonMarkdown'
import NotFoundPage from './NotFoundPage'

// One lesson: its text, animations and runnable code, plus links to the
// previous and next lessons of the module.
function LessonPage() {
  const { moduleSlug, lessonSlug } = useParams()
  const { t } = useTranslation()
  const { language } = useLanguage()
  const module = getModule(moduleSlug)
  const lessonIndex =
    module?.lessons.findIndex((lesson) => lesson.slug === lessonSlug) ?? -1

  if (lessonIndex === -1) return <NotFoundPage />

  const lesson = module.lessons[lessonIndex]
  const previousLesson = module.lessons[lessonIndex - 1]
  const nextLesson = module.lessons[lessonIndex + 1]
  const version = getLessonVersion(lesson, language)
  const moduleTitle = localize(module.title, language)

  return (
    // `key` resets the page (e.g. runnable code) when moving between lessons.
    <article key={lesson.slug} className="mx-auto max-w-3xl">
      <Link
        to={`/learn/${module.slug}`}
        className="text-sm font-medium text-brand hover:underline"
      >
        ← {t('lesson.backToModule', { module: moduleTitle })}
      </Link>
      <p className="mt-6 text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {moduleTitle} · {t('lesson.minutes', { count: lesson.minutes })}
      </p>
      <h1 className="mb-8 text-3xl font-extrabold sm:text-4xl">
        {version.title}
      </h1>

      <LessonMarkdown markdown={version.body} />

      <nav className="mt-12 flex justify-between gap-4 border-t border-slate-200 pt-6">
        {previousLesson ? (
          <LessonLink
            module={module}
            lesson={previousLesson}
            label={`← ${t('lesson.previous')}`}
          />
        ) : (
          <span />
        )}
        {nextLesson && (
          <LessonLink
            module={module}
            lesson={nextLesson}
            label={`${t('lesson.next')} →`}
            alignRight
          />
        )}
      </nav>
    </article>
  )
}

function LessonLink({ module, lesson, label, alignRight = false }) {
  const { language } = useLanguage()
  return (
    <Link
      to={`/learn/${module.slug}/${lesson.slug}`}
      className={`rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-brand ${
        alignRight ? 'text-right' : ''
      }`}
    >
      <span className="block text-xs text-slate-500">{label}</span>
      <span className="font-semibold">
        {getLessonVersion(lesson, language).title}
      </span>
    </Link>
  )
}

export default LessonPage
