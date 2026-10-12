import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function NotFoundPage() {
  const { t } = useTranslation()
  useDocumentTitle(t('notFound.title'))

  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-extrabold">{t('notFound.title')}</h1>
      <p className="mt-2 text-slate-600">{t('notFound.text')}</p>
      <Link
        to="/learn"
        className="mt-6 inline-block font-semibold text-brand hover:underline"
      >
        {t('notFound.backHome')}
      </Link>
    </div>
  )
}

export default NotFoundPage
