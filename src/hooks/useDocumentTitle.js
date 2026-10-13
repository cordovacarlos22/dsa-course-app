import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// Sets the browser tab's title in the student's language:
// "Big O · DSA in JavaScript". Without a page name (the landing page), the
// tab shows the app's full title. Screen readers read the title when a new
// page opens, and it's what students see in their tabs and history.
export function useDocumentTitle(page) {
  const { t } = useTranslation()
  const title = page ? t('app.pageTitle', { page }) : t('app.title')

  useEffect(() => {
    document.title = title
  }, [title])
}
