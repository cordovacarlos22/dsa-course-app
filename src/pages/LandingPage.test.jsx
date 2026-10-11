import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import App from '../App'
import { saveLanguage } from '../lib/languageStorage'
import i18n from '../i18n'

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

  it('shows the whole curriculum: 6 parts and 18 modules', () => {
    renderLanding()
    const curriculum = section('The curriculum')
    expect(curriculum).toHaveTextContent('18 modules in 6 parts')
    expect(
      within(curriculum).getAllByRole('heading', { level: 3 }),
    ).toHaveLength(6)
    expect(within(curriculum).getAllByRole('listitem')).toHaveLength(18)
    // Ready modules are links; the rest are marked "Coming soon".
    expect(
      within(curriculum).getByRole('link', { name: '2. Big O' }),
    ).toHaveAttribute('href', '/learn/02-big-o')
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
    expect(section('El temario')).toHaveTextContent('18 módulos en 6 partes')
    expect(section('Conoce a tu instructor')).toHaveTextContent(
      'chofer de tráiler e instructor de choferes',
    )
    expect(section('Preguntas frecuentes')).toBeInTheDocument()
  })
})
