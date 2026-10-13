import { lazy, Suspense } from 'react'
import Hero from '../components/landing/Hero'
import HowYouLearn from '../components/landing/HowYouLearn'
import WhatYouLearn from '../components/landing/WhatYouLearn'
import Curriculum from '../components/landing/Curriculum'
import Audience from '../components/landing/Audience'
import Instructor from '../components/landing/Instructor'
import Faq from '../components/landing/Faq'
import FinalCallToAction from '../components/landing/FinalCallToAction'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

// These two sections need the animations, so they're downloaded after the
// rest of the page, which keeps the first load small.
const TryItPreview = lazy(() => import('../components/landing/TryItPreview'))
const AnimationReel = lazy(() => import('../components/landing/AnimationReel'))

// While a section downloads, an empty box of about its height keeps the
// sections below from jumping.
const sectionPlaceholder = <div aria-hidden="true" className="min-h-96" />

// The public home page. Each section lives in src/components/landing/.
function LandingPage() {
  useDocumentTitle()

  return (
    <div className="space-y-20">
      <Hero />
      <Suspense fallback={sectionPlaceholder}>
        <TryItPreview />
      </Suspense>
      <HowYouLearn />
      <Suspense fallback={sectionPlaceholder}>
        <AnimationReel />
      </Suspense>
      <WhatYouLearn />
      <Curriculum />
      <Audience />
      <Instructor />
      <Faq />
      <FinalCallToAction />
    </div>
  )
}

export default LandingPage
