import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import App from './App'
import { saveLanguage } from './lib/languageStorage'

// Renders the whole app at a given URL, like a student opening that page.
function renderAppAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

// Most tests act like a returning student who already picked English,
// so the first-visit picker doesn't get in the way.
function renderAsReturningStudent(path) {
  saveLanguage('en')
  return renderAppAt(path)
}

describe('first visit', () => {
  it('asks for a language and remembers the choice', async () => {
    const user = userEvent.setup()
    const { unmount } = renderAppAt('/')

    const picker = screen.getByRole('dialog', { name: /choose your language/i })
    await user.click(within(picker).getByRole('button', { name: 'Español' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Aprende estructuras de datos y algoritmos en JavaScript, paso a paso',
      }),
    ).toBeInTheDocument()

    // Coming back later: no picker, still in Spanish.
    unmount()
    renderAppAt('/')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Curso' })).toBeInTheDocument()
  })
})

describe('language switcher', () => {
  it('switches the interface between English and Spanish', async () => {
    const user = userEvent.setup()
    renderAsReturningStudent('/learn')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Course modules' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Español' }))

    expect(
      screen.getByRole('heading', { level: 1, name: 'Módulos del curso' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Español' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(document.documentElement.lang).toBe('es')
  })
})

describe('course home', () => {
  it('lists all 17 modules in order, grouped into 5 parts', () => {
    renderAsReturningStudent('/learn')
    expect(
      screen.getByRole('heading', { level: 2, name: 'Part 1: Foundations' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(5)
    const modules = screen
      .getAllByRole('list')
      .flatMap((list) => within(list).getAllByRole('listitem'))
    expect(modules).toHaveLength(17)
    expect(modules[0]).toHaveTextContent('Module 1')
    expect(modules[0]).toHaveTextContent('Introduction')
    expect(modules[16]).toHaveTextContent('Dynamic Programming')
  })

  it('links modules that have content and marks the rest as coming soon', () => {
    renderAsReturningStudent('/learn')
    expect(screen.getByRole('link', { name: /Big O/ })).toHaveAttribute(
      'href',
      '/learn/02-big-o',
    )
    expect(screen.getByRole('link', { name: /Big O/ })).toHaveTextContent(
      '1 lesson · 19 questions · 3 exercises',
    )
    expect(
      screen.queryByRole('link', { name: /Linked Lists/ }),
    ).not.toBeInTheDocument()
    expect(screen.getAllByText('Coming soon')).toHaveLength(14)
  })
})

describe('module page', () => {
  it('shows the module title and what you can practice', () => {
    renderAsReturningStudent('/learn/03-clases-punteros')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Classes & Pointers' }),
    ).toBeInTheDocument()
    expect(screen.getByText('12 questions')).toBeInTheDocument()
    expect(screen.getByText('1 exercise')).toBeInTheDocument()
  })

  it('says a module without content is not ready yet', () => {
    renderAsReturningStudent('/learn/04-listas-enlazadas')
    expect(
      screen.getByText("This module isn't ready yet. Check back soon!"),
    ).toBeInTheDocument()
  })

  it('shows "page not found" for a module that does not exist', () => {
    renderAsReturningStudent('/learn/99-nope')
    expect(
      screen.getByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument()
  })
})
