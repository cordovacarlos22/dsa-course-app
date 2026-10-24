import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'
import i18n from '../i18n'
import { celebrate } from '../lib/celebrate'
import { playSound } from '../lib/sounds'
import { loadExerciseResult } from '../lib/exercises'
import { saveLanguage } from '../lib/languageStorage'
import { checkJavaScript } from '../runners'

vi.mock('../runners', () => ({
  RUN_TIMEOUT_MS: 2000,
  runJavaScript: vi.fn(),
  checkJavaScript: vi.fn(),
}))

// Confetti needs a real canvas, and sounds need Web Audio: the tests only
// check which celebration was asked for.
vi.mock('../lib/celebrate', () => ({ celebrate: vi.fn() }))
vi.mock('../lib/sounds', async (importOriginal) => ({
  ...(await importOriginal()),
  playSound: vi.fn(),
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

const COUNTER = '/learn/classes-and-pointers/exercises/counter-class'

const failedCheck = {
  logs: [],
  error: null,
  problem: null,
  passed: false,
  results: [{ ok: false, message: 'Counter.count should be 0' }],
}
const passedCheck = {
  ...failedCheck,
  passed: true,
  results: [{ ok: true, message: 'Counter.count is 0' }],
}

async function renderAt(path, language = 'en') {
  saveLanguage(language)
  await i18n.changeLanguage(language)
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

const checkButton = () => screen.getByRole('button', { name: '✓ Check' })

beforeEach(() => {
  checkJavaScript.mockReset()
  celebrate.mockReset()
})

describe('exercise page', () => {
  it('is linked from the module page', async () => {
    const user = userEvent.setup()
    await renderAt('/learn/classes-and-pointers')
    const buildIt = screen
      .getByRole('heading', { name: 'Build it' })
      .closest('li')
    await user.click(
      within(buildIt).getByRole('link', { name: /Door Counter/ }),
    )

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'The Door Counter',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Build it · Easy/)).toBeInTheDocument()
    // The title is set in an effect, a moment after the heading appears.
    await waitFor(() =>
      expect(document.title).toBe('The Door Counter · DSA in JavaScript'),
    )
    // The description is the task, and the editor starts with the starter code.
    expect(screen.getByText(/Someone at the party door/)).toBeInTheDocument()
    const editor = await screen.findByLabelText('Code editor')
    expect(editor.value).toContain('class Counter')
  })

  it('celebrates a solution, shows the expected Big O and remembers it', async () => {
    const user = userEvent.setup()
    checkJavaScript.mockResolvedValue(passedCheck)
    await renderAt(COUNTER)
    await user.click(await screen.findByRole('button', { name: '✓ Check' }))

    expect(
      await screen.findByText(/^✓ Solved in \d+:\d\d!$/),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'The expected Big O: O(1) time, O(1) space. Does yours match?',
      ),
    ).toBeInTheDocument()
    expect(celebrate).toHaveBeenCalledWith('lesson')
    expect(
      loadExerciseResult('classes-and-pointers', 'counter-class'),
    ).toMatchObject({
      solved: true,
    })
    // The checker got the exercise's own tests.
    expect(checkJavaScript.mock.calls[0][1]).toMatchObject({
      kind: 'class',
      className: 'Counter',
    })
  })

  it('shows the Big O hint after a failed check, and the solution after 3', async () => {
    const user = userEvent.setup()
    checkJavaScript.mockResolvedValue(failedCheck)
    await renderAt(COUNTER)
    await user.click(await screen.findByRole('button', { name: '✓ Check' }))

    expect(
      await screen.findByText(/Aim for O\(1\) time and O\(1\) space/),
    ).toBeInTheDocument()
    expect(playSound).toHaveBeenCalledWith('miss')
    expect(
      screen.queryByRole('button', { name: 'Show solution' }),
    ).not.toBeInTheDocument()
    await user.click(checkButton())
    await user.click(checkButton())
    await user.click(
      await screen.findByRole('button', { name: 'Show solution' }),
    )
    expect(
      loadExerciseResult('classes-and-pointers', 'counter-class')
        .viewedSolution,
    ).toBe(true)
  })

  it('has a stopwatch, a countdown or no timer, and remembers the choice', async () => {
    const user = userEvent.setup()
    const { unmount } = await renderAt(COUNTER)
    expect(
      await screen.findByRole('timer', { name: 'Time spent' }),
    ).toHaveTextContent('0:00')

    const timerSelect = screen.getByRole('combobox', { name: 'Timer' })
    await user.selectOptions(timerSelect, 'countdown')
    // An easy exercise gets 15 minutes.
    expect(screen.getByRole('timer', { name: 'Time left' })).toHaveTextContent(
      /14:5\d|15:00/,
    )
    await user.selectOptions(timerSelect, 'off')
    expect(screen.queryByRole('timer')).not.toBeInTheDocument()

    unmount()
    await renderAt(COUNTER)
    expect(await screen.findByRole('combobox', { name: 'Timer' })).toHaveValue(
      'off',
    )
  })

  it('marks a solved exercise on the module page', async () => {
    localStorage.setItem(
      'exercise:classes-and-pointers/counter-class',
      JSON.stringify({
        solved: true,
        bestTimeMs: 61000,
        viewedSolution: false,
      }),
    )
    await renderAt('/learn/classes-and-pointers')
    expect(
      screen.getByRole('link', { name: /The Door Counter \(Solved\)/ }),
    ).toBeInTheDocument()
  })

  it('speaks Spanish', async () => {
    await renderAt(COUNTER, 'es')
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'El contador de la puerta',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Constrúyelo · Fácil/)).toBeInTheDocument()
  })

  it('shows "page not found" for an unknown exercise', async () => {
    await renderAt('/learn/classes-and-pointers/exercises/nope')
    expect(
      await screen.findByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument()
  })
})
