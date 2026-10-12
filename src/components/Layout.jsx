import { Link, NavLink, Outlet, useMatch } from 'react-router'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import SoundToggle from './SoundToggle'
import FirstVisitLanguagePicker from './FirstVisitLanguagePicker'

// The frame around every page: header, the page itself, footer.
function Layout() {
  const { t } = useTranslation()
  // Lessons get the full width for the 3-pane coding workspace.
  const isLesson = useMatch('/learn/:moduleSlug/:lessonSlug')
  const width = isLesson ? 'max-w-screen-2xl' : 'max-w-5xl'

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      {/* Hidden until the first Tab: lets keyboard users jump past the
          header straight to the page's content. */}
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-brand px-4 py-2 font-bold text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50"
      >
        {t('nav.skipToContent')}
      </a>
      <header className="border-b border-slate-200 bg-white">
        <div
          className={`mx-auto flex ${width} items-center justify-between gap-4 px-4 py-3`}
        >
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="rounded-md bg-accent px-1.5 py-0.5 text-sm text-ink">
              JS
            </span>
            {/* On the smallest phones (320 px) only the JS logo shows, so the
                header buttons fit. Screen readers still read the name. */}
            <span className="max-[359px]:sr-only">{t('app.name')}</span>
          </Link>
          <nav
            aria-label={t('nav.mainNavigation')}
            className="flex items-center gap-4"
          >
            <NavLink
              to="/learn"
              className={({ isActive }) =>
                `font-medium hover:text-brand ${isActive ? 'text-brand' : 'text-slate-700'}`
              }
            >
              {t('nav.learn')}
            </NavLink>
            <SoundToggle />
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <main
        id="main-content"
        className={`mx-auto w-full ${width} flex-1 px-4 py-8`}
      >
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        {t('app.footer')}
      </footer>

      <FirstVisitLanguagePicker />
    </div>
  )
}

export default Layout
