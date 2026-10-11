import { useTranslation } from 'react-i18next'
import LandingSection from './LandingSection'

function WhatYouLearn() {
  const { t } = useTranslation()
  // returnObjects: these keys hold an array of sentences, not one string.
  const items = t('landing.learnItems', { returnObjects: true })

  return (
    <LandingSection id="what-you-learn" title={t('landing.learnTitle')}>
      <ul className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 rounded-xl bg-white p-4">
            <span aria-hidden="true" className="font-bold text-green-600">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </LandingSection>
  )
}

export default WhatYouLearn
