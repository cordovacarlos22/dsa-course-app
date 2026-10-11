import { Link, NavLink, Outlet } from 'react-router'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import FirstVisitLanguagePicker from './FirstVisitLanguagePicker'

// The frame around every page: header, the page itself, footer.
function Layout() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="rounded-md bg-accent px-1.5 py-0.5 text-sm text-ink">
              JS
            </span>
            {t('app.name')}
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
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
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
