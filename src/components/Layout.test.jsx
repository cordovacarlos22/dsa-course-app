import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, it, expect, vi } from 'vitest'
import App from '../App'
import { saveLanguage } from '../lib/languageStorage'
import { goTo } from '../lib/crossSite'

vi.mock('../lib/crossSite', async (importOriginal) => ({
  ...(await importOriginal()),
  goTo: vi.fn(),
}))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
})

function renderAt(path) {
  // A saved language keeps the first-visit picker out of the way.
  saveLanguage('en')
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('Layout on two addresses', () => {
  it('shows the page when the two addresses are not set up', async () => {
    renderAt('/learn')
    expect(await screen.findByRole('main')).toBeInTheDocument()
    expect(goTo).not.toHaveBeenCalled()
  })

  it('sends a course page on the landing address to the course address', () => {
    // jsdom's address (http://localhost:3000) plays the landing page.
    vi.stubEnv('VITE_SITE_ORIGIN', window.location.origin)
    vi.stubEnv('VITE_APP_ORIGIN', 'https://app.charliecodeacademy.com')
    renderAt('/learn/big-o')
    expect(goTo).toHaveBeenCalledWith(
      'https://app.charliecodeacademy.com/learn/big-o?lang=en',
    )
    expect(screen.queryByRole('main')).not.toBeInTheDocument()
  })
})
