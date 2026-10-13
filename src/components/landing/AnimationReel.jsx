import { useTranslation } from 'react-i18next'
import LandingSection from './LandingSection'
import { visualizations } from '../../visualizations'
import { AutoPlayContext } from '../../visualizations/autoPlay'

// Three animations from later Big O lessons. They play on their own (not on
// devices that ask for less motion), and visitors can pause any of them.
const Wide = visualizations['search-cases']
const Small = [
  visualizations['nested-grid'],
  visualizations['binary-search-halving'],
]

function AnimationReel() {
  const { t } = useTranslation()

  return (
    <LandingSection
      id="animations"
      title={t('landing.reel.title')}
      subtitle={t('landing.reel.subtitle')}
    >
      <AutoPlayContext value>
        {/* One wide animation on top, two side by side under it (cards in a
            row share a height); one column on phones. */}
        <div className="grid gap-6 lg:grid-cols-2 [&_figure]:my-0 [&_figure]:h-full">
          <div className="lg:col-span-2">
            <Wide />
          </div>
          {Small.map((Animation, index) => (
            <div key={index}>
              <Animation />
            </div>
          ))}
        </div>
      </AutoPlayContext>
    </LandingSection>
  )
}

export default AnimationReel
