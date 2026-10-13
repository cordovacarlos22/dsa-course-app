import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, it, expect, vi } from 'vitest'
import App from '../App'
import { saveLanguage } from '../lib/languageStorage'
import { celebrate } from '../lib/celebrate'
import i18n from '../i18n'

// jsdom can't draw confetti or play sounds.
vi.mock('../lib/celebrate', () => ({ celebrate: vi.fn() }))

afterEach(() => {
  celebrate.mockReset()
  vi.unstubAllGlobals()
})

function renderLanding(language = 'en') {
  // Like a returning student: the language was saved and is already active.
  saveLanguage(language)
  i18n.changeLanguage(language)
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

function section(name) {
  return screen.getByRole('region', { name })
}

describe('landing page', () => {
  it('opens with the headline, the beta badge and two calls to action', () => {
    renderLanding()
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Learn data structures and algorithms in JavaScript, step by step',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Free during the beta')).toBeInTheDocument()
    expect(
      screen.getAllByRole('link', { name: 'Start learning' })[0],
    ).toHaveAttribute('href', '/learn')
    expect(
      screen.getByRole('link', { name: 'See the curriculum' }),
    ).toHaveAttribute('href', '#curriculum')
  })

  it('has every section', () => {
    renderLanding()
    for (const name of [
      "How you'll learn",
      "What you'll learn",
      'The curriculum',
      'Who this course is for',
      'Meet your instructor',
      'Frequently asked questions',
    ]) {
      expect(section(name)).toBeInTheDocument()
    }
  })

  it('marks the AI tutor as coming soon', () => {
    renderLanding()
    const tutorCard = within(section("How you'll learn"))
      .getByRole('heading', { name: /AI tutor/ })
      .closest('li')
    expect(tutorCard).toHaveTextContent('Coming soon')
  })

  it('shows the whole curriculum: 7 sections and 24 modules', () => {
    renderLanding()
    const curriculum = section('The curriculum')
    expect(curriculum).toHaveTextContent('24 modules in 7 sections')
    expect(
      within(curriculum).getAllByRole('heading', { level: 3 }),
    ).toHaveLength(7)
    expect(within(curriculum).getAllByRole('listitem')).toHaveLength(24)
    // Ready modules are links; the rest are marked "Coming soon".
    expect(
      within(curriculum).getByRole('link', { name: '2. Big O' }),
    ).toHaveAttribute('href', '/learn/big-o')
    expect(
      within(curriculum).queryByRole('link', { name: /Linked Lists/ }),
    ).not.toBeInTheDocument()
  })

  it('introduces the instructor with public links only', () => {
    renderLanding()
    const instructor = section('Meet your instructor')
    expect(
      within(instructor).getByRole('img', {
        name: 'Carlos Cordova, the course instructor',
      }),
    ).toHaveAttribute('src', '/images/carlos-cordova.jpg')
    expect(instructor).toHaveTextContent('truck driver and driver trainer')

    const links = within(instructor).getAllByRole('link')
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      'https://github.com/cordovacarlos22',
      'https://www.linkedin.com/in/carloscordovadev',
      'https://carloscordova.dev',
    ])
    links.forEach((link) =>
      expect(link).toHaveAttribute('rel', 'noopener noreferrer'),
    )
  })

  it('never shows an email address or a phone number', () => {
    renderLanding()
    const text = document.body.textContent
    expect(text).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/)
    expect(text).not.toMatch(/\d{3}[-.\s]\d{3}[-.\s]\d{4}/)
  })

  it('answers the FAQ when a question is opened', async () => {
    const user = userEvent.setup()
    renderLanding()
    await user.click(screen.getByText('Is it free?'))
    expect(
      screen.getByText('Yes. The whole course is free during the beta.'),
    ).toBeVisible()
  })

  it('is fully translated to Spanish', () => {
    renderLanding('es')
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Aprende estructuras de datos y algoritmos en JavaScript, paso a paso',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Gratis durante la beta')).toBeInTheDocument()
    expect(section('El temario')).toHaveTextContent('24 módulos en 7 secciones')
    expect(section('Conoce a tu instructor')).toHaveTextContent(
      'chofer de tráiler e instructor de choferes',
    )
    expect(section('Preguntas frecuentes')).toBeInTheDocument()
  })
})

describe('trying the course on the landing page', () => {
  // The preview and the reel load after the rest of the page.
  async function findSection(name) {
    return screen.findByRole('region', { name })
  }

  it('lets visitors answer a real lesson question and earn XP', async () => {
    const user = userEvent.setup()
    renderLanding()
    const preview = within(await findSection('Try a step right now'))

    // The guest-list code trace from Big O lesson 1.
    expect(preview.getByRole('figure')).toHaveTextContent('isInvited')

    await user.click(preview.getByRole('radio', { name: '6' }))
    await user.click(preview.getByRole('button', { name: 'Check answer' }))
    expect(preview.getByText('Not quite. Try again.')).toBeInTheDocument()
    expect(celebrate).not.toHaveBeenCalled()

    await user.click(preview.getByRole('radio', { name: '4' }))
    await user.click(preview.getByRole('button', { name: 'Check answer' }))
    expect(preview.getByText('✓ Correct! Nice!')).toBeInTheDocument()
    expect(celebrate).toHaveBeenCalledWith('step')
    // In a live region, so screen readers announce it too.
    expect(
      preview
        .getAllByRole('status')
        .some((region) => region.textContent.includes('+10 XP')),
    ).toBe(true)
    expect(
      preview.getByRole('link', { name: 'Finish this lesson →' }),
    ).toHaveAttribute('href', '/learn/big-o/01-why-big-o')
  })

  it('shows three animations that play on their own', async () => {
    renderLanding()
    const reel = within(await findSection('Watch the ideas move'))
    expect(reel.getAllByRole('figure')).toHaveLength(3)
    expect(reel.getAllByRole('button', { name: 'Pause' })).toHaveLength(3)
  })

  it("doesn't play them on devices that ask for less motion", async () => {
    vi.stubGlobal('matchMedia', (query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
    }))
    renderLanding()
    const reel = within(await findSection('Watch the ideas move'))
    expect(reel.getAllByRole('button', { name: 'Play' })).toHaveLength(3)
  })

  it('is translated to Spanish', async () => {
    renderLanding('es')
    expect(await findSection('Prueba un paso ahora mismo')).toBeInTheDocument()
    expect(
      await findSection('Mira cómo se mueven las ideas'),
    ).toBeInTheDocument()
  })
})
