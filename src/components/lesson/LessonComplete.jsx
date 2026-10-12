import { useTranslation } from 'react-i18next'

// The card at the end of a finished lesson: how it went, plus a trophy when
// this lesson was the last one the module needed.
function LessonComplete({
  checkCount,
  firstTryCount,
  isModuleDone,
  moduleTitle,
}) {
  const { t } = useTranslation()
  const isPerfect = firstTryCount === checkCount

  return (
    <div
      role="status"
      className="mt-8 rounded-2xl bg-green-50 p-6 text-center text-green-900 motion-safe:animate-pop"
    >
      <p className="text-xl font-extrabold">🎉 {t('lesson.complete')}</p>
      <p className="mt-1">{t('lesson.completeText')}</p>
      <ul className="mt-4 flex flex-wrap justify-center gap-2 text-sm font-semibold">
        <li className="rounded-full bg-white px-3 py-1">
          ✓ {t('lesson.checksPassed', { count: checkCount })}
        </li>
        <li className="rounded-full bg-white px-3 py-1">
          🎯 {t('lesson.firstTry', { count: firstTryCount, total: checkCount })}
        </li>
      </ul>
      {isPerfect && <p className="mt-3 font-bold">⭐ {t('lesson.perfect')}</p>}

      {isModuleDone && (
        <div className="mt-5 rounded-xl bg-accent/20 p-4 text-ink">
          <p className="text-lg font-extrabold">🏆 {t('module.complete')}</p>
          <p className="mt-1">
            {t('module.completeText', { module: moduleTitle })}
          </p>
        </div>
      )}
    </div>
  )
}

export default LessonComplete
