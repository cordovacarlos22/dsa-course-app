import { useTranslation } from 'react-i18next'
import LandingSection from './LandingSection'

// Public profile links only. Never add a phone number, email or address here:
// this page and the repo are public.
const LINKS = [
  { key: 'github', href: 'https://github.com/cordovacarlos22' },
  { key: 'linkedin', href: 'https://www.linkedin.com/in/carloscordovadev' },
  { key: 'website', href: 'https://carloscordova.dev' },
]

function Instructor() {
  const { t } = useTranslation()
  const bio = t('landing.instructor.bio', { returnObjects: true })

  return (
    <LandingSection id="instructor" title={t('landing.instructor.title')}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-3xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-start sm:p-8">
        <img
          src="/images/carlos-cordova.jpg"
          alt={t('landing.instructor.photoAlt')}
          width="160"
          height="160"
          loading="lazy"
          className="h-36 w-36 shrink-0 rounded-full object-cover ring-4 ring-accent"
        />
        <div>
          <h3 className="text-xl font-extrabold">
            {t('landing.instructor.name')}
          </h3>
          <p className="text-sm font-semibold text-brand">
            {t('landing.instructor.role')}
          </p>
          <div className="mt-4 space-y-3 text-slate-700">
            {bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="mt-5 flex flex-wrap gap-3">
            {LINKS.map(({ key, href }) => (
              <li key={key}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold hover:border-brand hover:text-brand"
                >
                  {t(`landing.instructor.links.${key}`)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </LandingSection>
  )
}

export default Instructor
