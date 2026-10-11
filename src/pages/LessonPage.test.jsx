import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect, vi } from 'vitest'
import App from '../App'
import { saveLanguage } from '../lib/languageStorage'
import { buildLessonIndex } from '../lib/lessons'

vi.mock('../runners', () => ({ RUN_TIMEOUT_MS: 2000, runJavaScript: vi.fn() }))

function renderAt(path) {
  saveLanguage('en')
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('lesson page', () => {
  it('shows the lesson with its animation and runnable code', async () => {
    renderAt('/learn/big-o/01-what-is-big-o')

    // The lesson page is loaded on demand, so wait for it to appear.
    expect(
      await screen.findByRole('heading', { level: 1, name: 'What is Big O?' }),
    ).toBeInTheDocument()
    // The ```viz block became the growth chart animation…
    expect(screen.getByText('How Big O grows')).toBeInTheDocument()
    // …and the ```js-run blocks became editable code boxes.
    expect(
      screen.getAllByRole('textbox', { name: 'Editable JavaScript code' }),
    ).toHaveLength(2)
    expect(
      screen.getByRole('link', { name: /back to big o/i }),
    ).toHaveAttribute('href', '/learn/big-o')
  })

  it('is listed on its module page', () => {
    renderAt('/learn/big-o')
    expect(
      screen.getByRole('link', { name: /what is big o\?/i }),
    ).toHaveAttribute('href', '/learn/big-o/01-what-is-big-o')
  })

  it('shows "page not found" for a lesson that does not exist', async () => {
    renderAt('/learn/big-o/99-nope')
    expect(
      await screen.findByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument()
  })
})

describe('buildLessonIndex', () => {
  const files = {
    '../../content/lessons/big-o/02-second.en.md':
      '---\ntitle: Second\norder: 2\nminutes: 4\n---\nB',
    '../../content/lessons/big-o/01-first.en.md':
      '---\ntitle: First\norder: 1\nminutes: 3\n---\nA',
    '../../content/lessons/big-o/01-first.es.md':
      '---\ntitle: Primero\norder: 1\nminutes: 3\n---\nA (es)',
  }

  it('groups lessons by module, sorted by order, with one version per language', () => {
    const index = buildLessonIndex(files)
    const lessons = index['big-o']
    expect(lessons.map((lesson) => lesson.slug)).toEqual([
      '01-first',
      '02-second',
    ])
    expect(lessons[0].versions.es.title).toBe('Primero')
    expect(lessons[1].versions.es).toBeUndefined()
  })
})
