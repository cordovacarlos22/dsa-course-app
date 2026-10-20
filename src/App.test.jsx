import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import App from './App'
import { getSavedLanguage, saveLanguage } from './lib/languageStorage'

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

describe('first visit, closing the picker with Escape', () => {
  it('keeps English and does not ask again', () => {
    renderAppAt('/')
    const picker = screen.getByRole('dialog', { name: /choose your language/i })

    // Escape closes a modal dialog without a return value.
    act(() => picker.close())

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(getSavedLanguage()).toBe('en')
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Learn data structures and algorithms in JavaScript, step by step',
      }),
    ).toBeInTheDocument()
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

describe('skip link', () => {
  it('is the first thing the Tab key reaches and jumps to the content', async () => {
    const user = userEvent.setup()
    renderAsReturningStudent('/learn')

    await user.tab()
    const skipLink = screen.getByRole('link', { name: 'Skip to content' })
    expect(skipLink).toHaveFocus()
    expect(skipLink).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
  })
})

describe('tab titles', () => {
  it('names each page in the browser tab', () => {
    const { unmount } = renderAsReturningStudent('/')
    expect(document.title).toBe(
      'DSA in JavaScript · Learn data structures & algorithms step by step',
    )
    unmount()

    renderAsReturningStudent('/learn/big-o')
    expect(document.title).toBe('Big O · DSA in JavaScript')
  })

  it('names a lesson by its title', async () => {
    renderAsReturningStudent('/learn/big-o/01-why-big-o')
    await screen.findByRole('heading', { level: 1, name: 'Why Big O?' })
    expect(document.title).toBe('Why Big O? · DSA in JavaScript')
  })

  it('says when a page does not exist', () => {
    renderAsReturningStudent('/learn/no-such-module')
    expect(document.title).toBe('Page not found · DSA in JavaScript')
  })

  it('follows the language switch', async () => {
    const user = userEvent.setup()
    renderAsReturningStudent('/learn')
    expect(document.title).toBe('Course modules · DSA in JavaScript')

    await user.click(screen.getByRole('button', { name: 'Español' }))
    expect(document.title).toBe('Módulos del curso · DSA en JavaScript')
  })
})

describe('course home', () => {
  it('lists all 24 modules in order, grouped into 7 sections', () => {
    renderAsReturningStudent('/learn')
    expect(
      screen.getByRole('heading', { level: 2, name: 'Section 1: Foundations' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(7)
    const modules = screen
      .getAllByRole('list')
      .flatMap((list) => within(list).getAllByRole('listitem'))
    expect(modules).toHaveLength(24)
    expect(modules[0]).toHaveTextContent('Module 1')
    expect(modules[0]).toHaveTextContent('Introduction')
    expect(modules[22]).toHaveTextContent('Dynamic Programming')
    expect(modules[23]).toHaveTextContent('Array Interview Problems')
  })

  it('teaches classes and pointers right before the first data structure', () => {
    renderAsReturningStudent('/learn')
    const dataStructures = screen
      .getByRole('heading', { level: 2, name: /Data Structures/ })
      .closest('section')
    const modules = within(dataStructures).getAllByRole('listitem')
    expect(modules[0]).toHaveTextContent('Module 12')
    expect(modules[0]).toHaveTextContent('Classes & Pointers')
    expect(modules[1]).toHaveTextContent('Linked Lists')
  })

  it('links modules that have content and marks the rest as coming soon', () => {
    renderAsReturningStudent('/learn')
    const bigO = screen.getByRole('link', { name: /Big O 17 lessons/ })
    expect(bigO).toHaveAttribute('href', '/learn/big-o')
    expect(bigO).toHaveTextContent('17 lessons · 33 questions · 3 exercises')
    const arraysAndObjects = screen.getByRole('link', {
      name: /Big O of Arrays & Objects/,
    })
    expect(arraysAndObjects).toHaveAttribute(
      'href',
      '/learn/arrays-and-objects',
    )
    expect(arraysAndObjects).toHaveTextContent(
      '4 lessons · 15 questions · 3 exercises',
    )
    const approach = screen.getByRole('link', {
      name: /A Problem-Solving Approach/,
    })
    expect(approach).toHaveAttribute('href', '/learn/problem-solving-approach')
    expect(approach).toHaveTextContent('7 lessons · 14 questions · 3 exercises')
    const linkedLists = screen.getByRole('link', {
      name: /Module 13 Linked Lists/,
    })
    expect(linkedLists).toHaveAttribute('href', '/learn/linked-lists')
    expect(linkedLists).toHaveTextContent(
      '4 lessons · 11 questions · 1 exercise',
    )
    expect(
      screen.queryByRole('link', { name: /Doubly Linked Lists/ }),
    ).not.toBeInTheDocument()
    expect(screen.getAllByText('Coming soon')).toHaveLength(18)
  })
})

describe('module page', () => {
  it('shows the module title and what you can practice', () => {
    renderAsReturningStudent('/learn/classes-and-pointers')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Classes & Pointers' }),
    ).toBeInTheDocument()
    expect(screen.getByText('16 questions')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Classes: the blueprint/ }),
    ).toBeInTheDocument()
    // Practice is split into "Build it" and "Interview problems".
    expect(
      screen.getByRole('heading', { name: 'Build it' }).closest('li'),
    ).toHaveTextContent('2 exercises')
    expect(
      screen.getByRole('heading', { name: 'Interview problems' }).closest('li'),
    ).toHaveTextContent('0 exercises')
  })

  it('says a module without content is not ready yet', () => {
    renderAsReturningStudent('/learn/doubly-linked-lists')
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
