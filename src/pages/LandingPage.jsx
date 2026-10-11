import Hero from '../components/landing/Hero'
import HowYouLearn from '../components/landing/HowYouLearn'
import WhatYouLearn from '../components/landing/WhatYouLearn'
import Curriculum from '../components/landing/Curriculum'
import Audience from '../components/landing/Audience'
import Instructor from '../components/landing/Instructor'
import Faq from '../components/landing/Faq'
import FinalCallToAction from '../components/landing/FinalCallToAction'

// The public home page. Each section lives in src/components/landing/.
function LandingPage() {
  return (
    <div className="space-y-20">
      <Hero />
      <HowYouLearn />
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
