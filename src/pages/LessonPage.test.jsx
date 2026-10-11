import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'
import { saveLanguage } from '../lib/languageStorage'
import { buildChecksIndex, buildLessonIndex } from '../lib/lessons'
import { loadProgress, saveProgress, emptyProgress } from '../lib/progress'
import { checkJavaScript } from '../runners'

vi.mock('../runners', () => ({
  RUN_TIMEOUT_MS: 2000,
  runJavaScript: vi.fn(),
  checkJavaScript: vi.fn(),
}))

// CodeMirror needs a real browser layout; a textarea is enough for tests.
vi.mock('../components/lesson/CodeEditor', () => ({
  default: ({ value, onChange, label }) => (
    <textarea
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}))

const LESSON = '/learn/big-o/01-what-is-big-o'

const failedCheck = {
  logs: [],
  error: null,
  problem: null,
  passed: false,
  results: [
    { ok: false, message: 'isInvited(["Ana"], "Ana") should return true' },
  ],
}
const passedCheck = {
  ...failedCheck,
  passed: true,
  results: [{ ok: true, message: 'isInvited(["Ana"], "Ana") returned true' }],
}

function renderAt(path) {
  saveLanguage('en')
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

// The step's Next button (animations have their own Next buttons).
const nextButton = () =>
  within(screen.getByRole('navigation', { name: 'Steps' })).getByRole(
    'button',
    { name: /^next/i },
  )

beforeEach(() => {
  checkJavaScript.mockReset()
  window.scrollTo = vi.fn() // jsdom doesn't scroll
})

describe('lesson page', () => {
  it('starts at step 1 with Next locked until the checkpoint passes', async () => {
    renderAt(LESSON)

    // The lesson page is loaded on demand, so wait for it to appear.
    expect(
      await screen.findByRole('heading', { level: 1, name: 'What is Big O?' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Two ways to check a guest list' }),
    ).toBeInTheDocument()
    // Step 1 is a coding step: Learn, Code and Output panes.
    expect(screen.getByRole('region', { name: 'Learn' })).toBeInTheDocument()
    // The editor is loaded on demand too.
    const editor = await screen.findByRole('textbox', { name: 'Code editor' })
    expect(editor.value).toContain('function isInvited(guests, name)')
    expect(nextButton()).toBeDisabled()
    expect(
      screen.getByRole('link', { name: /back to big o/i }),
    ).toHaveAttribute('href', '/learn/big-o')
  })

  it('shows the hint after a failed check and the solution after 3', async () => {
    const user = userEvent.setup()
    checkJavaScript.mockResolvedValue(failedCheck)
    renderAt(LESSON)
    const check = await screen.findByRole('button', { name: '✓ Check' })

    await user.click(check)
    const output = screen.getByRole('region', { name: 'Output' })
    expect(within(output).getByText(/0 of 1 tests passed/)).toBeInTheDocument()
    expect(within(output).getByText(/should return true/)).toBeInTheDocument()
    expect(
      screen.getByText('for...of', { selector: 'code' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Show solution' }),
    ).not.toBeInTheDocument()

    await user.click(check)
    await user.click(check)
    await user.click(screen.getByRole('button', { name: 'Show solution' }))
    expect(
      screen.getByRole('textbox', { name: 'Code editor' }).value,
    ).toContain('return false')
    expect(loadProgress('big-o', '01-what-is-big-o')).toMatchObject({
      attempts: { 0: 3 },
      viewedSolution: [0],
    })
    expect(nextButton()).toBeDisabled()

    // The solution still has to pass the check.
    checkJavaScript.mockResolvedValue(passedCheck)
    await user.click(check)
    expect(nextButton()).toBeEnabled()
    await user.click(nextButton())
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument()
  })

  it('shows the hint after a wrong answer and unlocks Next when right', async () => {
    const user = userEvent.setup()
    saveProgress('big-o', '01-what-is-big-o', {
      ...emptyProgress(),
      passed: [0, 1],
    })
    renderAt(LESSON)

    // Resumes at the first step that hasn't passed: the growth chart.
    expect(await screen.findByText('Step 3 of 4')).toBeInTheDocument()
    expect(screen.getByText('How Big O grows')).toBeInTheDocument()
    expect(nextButton()).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: 'It stays the same' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))
    expect(screen.getByText('Not quite. Try again.')).toBeInTheDocument()
    expect(screen.getByText(/one check per guest/)).toBeInTheDocument()
    expect(nextButton()).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: 'It doubles' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))
    expect(screen.getByText(/Correct!/)).toBeInTheDocument()
    expect(nextButton()).toBeEnabled()
    expect(loadProgress('big-o', '01-what-is-big-o').passed).toEqual([0, 1, 2])
  })

  it('offers the answer after 3 wrong tries', async () => {
    const user = userEvent.setup()
    saveProgress('big-o', '01-what-is-big-o', {
      ...emptyProgress(),
      passed: [0, 1],
    })
    renderAt(LESSON)
    await user.click(
      await screen.findByRole('radio', { name: 'It stays the same' }),
    )
    for (let i = 0; i < 3; i++) {
      await user.click(screen.getByRole('button', { name: 'Check answer' }))
    }
    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    expect(screen.getByText(/highlighted in green/)).toBeInTheDocument()
    expect(loadProgress('big-o', '01-what-is-big-o').viewedSolution).toEqual([
      2,
    ])
  })

  it('does not let a student skip ahead with the URL', async () => {
    renderAt(`${LESSON}?step=4`)
    expect(await screen.findByText('Step 1 of 4')).toBeInTheDocument()
  })

  it('completes the lesson when the last checkpoint passes', async () => {
    const user = userEvent.setup()
    saveProgress('introduction', '01-welcome', {
      ...emptyProgress(),
      passed: [0, 1, 2],
    })
    renderAt('/learn/introduction/01-welcome')

    expect(await screen.findByText('Step 4 of 4')).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: /small, clear steps/i }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))

    expect(screen.getByText(/lesson complete/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /next lesson:/i })).toHaveAttribute(
      'href',
      '/learn/introduction/02-how-to-get-the-most-out-of-it',
    )
    expect(loadProgress('introduction', '01-welcome').completed).toBe(true)
  })

  it('is listed on its module page with its progress', () => {
    saveProgress('big-o', '01-what-is-big-o', {
      ...emptyProgress(),
      passed: [0],
    })
    renderAt('/learn/big-o')
    const link = screen.getByRole('link', { name: /what is big o\?/i })
    expect(link).toHaveAttribute('href', LESSON)
    expect(link).toHaveTextContent('In progress')
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

  it('attaches each lesson its checkpoints', () => {
    const checks = buildChecksIndex({
      '../../content/lessons/big-o/01-first.checks.json': {
        steps: [{ type: 'choice' }],
      },
    })
    const lessons = buildLessonIndex(files, checks)['big-o']
    expect(lessons[0].checkpoints).toEqual([{ type: 'choice' }])
    expect(lessons[1].checkpoints).toEqual([])
  })
})
