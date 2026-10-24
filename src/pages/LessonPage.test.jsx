import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'
import { celebrate } from '../lib/celebrate'
import { saveLanguage } from '../lib/languageStorage'
import { buildChecksIndex, buildLessonIndex } from '../lib/lessons'
import { loadProgress, saveProgress, emptyProgress } from '../lib/progress'
import { checkJavaScript } from '../runners'

vi.mock('../runners', () => ({
  RUN_TIMEOUT_MS: 2000,
  runJavaScript: vi.fn(),
  checkJavaScript: vi.fn(),
}))

// Confetti needs a real canvas, and sounds need Web Audio: the tests only
// check which celebration was asked for.
vi.mock('../lib/celebrate', () => ({ celebrate: vi.fn() }))

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

const LESSON = '/learn/big-o/01-why-big-o'

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

// Passes an explain step the way a student does: write, compare, tick
// every point of the checklist, then Done.
async function explainAndFinish(user) {
  await user.type(
    screen.getByLabelText('Your explanation'),
    'Big O compares code, and a method gives me a plan.',
  )
  await user.click(
    screen.getByRole('button', { name: 'Compare with a model answer' }),
  )
  for (const box of screen.getAllByRole('checkbox')) await user.click(box)
  await user.click(screen.getByRole('button', { name: 'Done' }))
}

beforeEach(() => {
  checkJavaScript.mockReset()
  celebrate.mockReset()
  window.scrollTo = vi.fn() // jsdom doesn't scroll
})

describe('lesson page', () => {
  it('starts at step 1 with Next locked until the checkpoint passes', async () => {
    renderAt(LESSON)

    // The lesson page is loaded on demand, so wait for it to appear.
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Why Big O?' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Step 1 of 5', { selector: 'p' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Big O is a big deal' }),
    ).toBeInTheDocument()
    // Every step has an animation: here, the growth chart.
    expect(screen.getByText('How Big O grows')).toBeInTheDocument()
    expect(nextButton()).toBeDisabled()
    expect(
      screen.getByRole('link', { name: /back to big o/i }),
    ).toHaveAttribute('href', '/learn/big-o')
  })

  it('shows the hint after a wrong answer and unlocks Next when right', async () => {
    const user = userEvent.setup()
    saveProgress('big-o', '01-why-big-o', { ...emptyProgress(), passed: [0] })
    renderAt(LESSON)

    // Resumes at step 2: the isInvited trace and its question.
    expect(
      await screen.findByText('Step 2 of 5', { selector: 'p' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('isInvited: stop as soon as you find the name'),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: '1' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))
    expect(screen.getByText('Not quite. Try again.')).toBeInTheDocument()
    expect(screen.getByText(/Count the boxes from Ana/)).toBeInTheDocument()
    expect(nextButton()).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: '4' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))
    expect(screen.getByText(/Correct!/)).toBeInTheDocument()
    expect(nextButton()).toBeEnabled()
    expect(loadProgress('big-o', '01-why-big-o').passed).toEqual([0, 1])
  })

  it('offers the answer after 3 wrong tries', async () => {
    const user = userEvent.setup()
    saveProgress('big-o', '01-why-big-o', { ...emptyProgress(), passed: [0] })
    renderAt(LESSON)
    await user.click(await screen.findByRole('radio', { name: '1' }))
    for (let i = 0; i < 3; i++) {
      await user.click(screen.getByRole('button', { name: 'Check answer' }))
    }
    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    expect(screen.getByText(/highlighted in green/)).toBeInTheDocument()
    expect(loadProgress('big-o', '01-why-big-o').viewedSolution).toEqual([1])
  })

  it('shows the hint after a failed check and the solution after 3', async () => {
    const user = userEvent.setup()
    checkJavaScript.mockResolvedValue(failedCheck)
    saveProgress('big-o', '01-why-big-o', {
      ...emptyProgress(),
      passed: [0, 1],
    })
    renderAt(LESSON)

    // Resumes at the first step that hasn't passed: a coding step with the
    // Learn, Code and Output panes.
    expect(
      await screen.findByText('Step 3 of 5', { selector: 'p' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Learn' })).toBeInTheDocument()
    // The editor is loaded on demand too.
    const editor = await screen.findByRole('textbox', { name: 'Code editor' })
    expect(editor.value).toContain('function isInvited(guests, name)')
    const check = screen.getByRole('button', { name: '✓ Check' })

    await user.click(check)
    const output = screen.getByRole('region', { name: 'Output' })
    expect(within(output).getByText(/0 of 1 tests passed/)).toBeInTheDocument()
    expect(within(output).getByText(/should return true/)).toBeInTheDocument()
    expect(
      screen.getByText('if (guests[i] === name) return true', {
        selector: 'code',
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Show solution' }),
    ).not.toBeInTheDocument()

    await user.click(check)
    await user.click(check)
    await user.click(screen.getByRole('button', { name: 'Show solution' }))
    expect(
      screen.getByRole('textbox', { name: 'Code editor' }).value,
    ).toContain('if (guests[i] === name) return true')
    expect(loadProgress('big-o', '01-why-big-o')).toMatchObject({
      attempts: { 2: 3 },
      viewedSolution: [2],
    })
    expect(nextButton()).toBeDisabled()

    // The solution still has to pass the check.
    checkJavaScript.mockResolvedValue(passedCheck)
    await user.click(check)
    expect(nextButton()).toBeEnabled()
    await user.click(nextButton())
    expect(
      screen.getByText('Step 4 of 5', { selector: 'p' }),
    ).toBeInTheDocument()
  })

  it('keeps Next locked on an explain step until every point is ticked', async () => {
    const user = userEvent.setup()
    saveProgress('introduction', '01-welcome', {
      ...emptyProgress(),
      passed: [0, 1],
    })
    renderAt('/learn/introduction/01-welcome')
    await screen.findByText('Step 3 of 4', { selector: 'p' })
    expect(nextButton()).toBeDisabled()

    await explainAndFinish(user)

    expect(nextButton()).toBeEnabled()
    expect(celebrate).toHaveBeenCalledWith('step')
    expect(loadProgress('introduction', '01-welcome').passed).toContain(2)
  })

  it('does not let a student skip ahead with the URL', async () => {
    renderAt(`${LESSON}?step=5`)
    expect(
      await screen.findByText('Step 1 of 5', { selector: 'p' }),
    ).toBeInTheDocument()
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
    expect(celebrate).toHaveBeenCalledWith('lesson')
    // The card shows how it went: every check on the first try.
    expect(screen.getByText(/4 checks passed/)).toBeInTheDocument()
    expect(screen.getByText(/4 of 4 on the first try/)).toBeInTheDocument()
    expect(screen.getByText(/perfect lesson/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /next lesson:/i })).toHaveAttribute(
      'href',
      '/learn/introduction/02-how-to-get-the-most-out-of-it',
    )
    expect(loadProgress('introduction', '01-welcome').completed).toBe(true)
  })

  it('is listed on its module page with its progress', () => {
    saveProgress('big-o', '01-why-big-o', {
      ...emptyProgress(),
      passed: [0],
    })
    renderAt('/learn/big-o')
    const link = screen.getByRole('link', { name: /why big o\?/i })
    expect(link).toHaveAttribute('href', LESSON)
    expect(link).toHaveTextContent('In progress')
  })

  it('gives a finished module a trophy on its page', () => {
    const finished = { ...emptyProgress(), passed: [0], completed: true }
    saveProgress('introduction', '01-welcome', finished)
    saveProgress('introduction', '02-how-to-get-the-most-out-of-it', finished)
    saveProgress('introduction', '03-running-code', finished)
    renderAt('/learn/introduction')
    expect(screen.getByText(/module complete/i)).toBeInTheDocument()
  })

  it('shows "page not found" for a lesson that does not exist', async () => {
    renderAt('/learn/big-o/99-nope')
    expect(
      await screen.findByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument()
  })
})

describe('celebrations', () => {
  const WELCOME = '/learn/introduction/01-welcome'

  it('celebrates a passed step with a cheer, but not a wrong answer', async () => {
    const user = userEvent.setup()
    renderAt(WELCOME)
    await screen.findByText('Step 1 of 4', { selector: 'p' })

    await user.click(
      screen.getByRole('radio', { name: 'A computer science degree' }),
    )
    await user.click(screen.getByRole('button', { name: 'Check answer' }))
    expect(celebrate).not.toHaveBeenCalled()

    await user.click(screen.getByRole('radio', { name: /basic javascript/i }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))
    expect(celebrate).toHaveBeenCalledTimes(1)
    expect(celebrate).toHaveBeenCalledWith('step')
    expect(screen.getByText('✓ Correct! Nice!')).toBeInTheDocument()
  })

  it('cheers a streak of steps passed on the first try', async () => {
    const user = userEvent.setup()
    saveProgress('introduction', '01-welcome', {
      ...emptyProgress(),
      passed: [0, 1],
    })
    renderAt(WELCOME)
    await screen.findByText('Step 3 of 4', { selector: 'p' })

    await explainAndFinish(user)
    expect(screen.getByText(/3 in a row on the first try/)).toBeInTheDocument()
  })

  it('does not celebrate a step that passed before', async () => {
    const user = userEvent.setup()
    checkJavaScript.mockResolvedValue(passedCheck)
    saveProgress('introduction', '01-welcome', {
      ...emptyProgress(),
      passed: [0, 1],
    })
    // Step 2 is a coding step the student already passed: checking it
    // again passes, but it's not a new win.
    renderAt(`${WELCOME}?step=2`)
    await screen.findByText('Step 2 of 4', { selector: 'p' })
    await user.click(screen.getByRole('button', { name: '✓ Check' }))
    expect(await screen.findByText(/All tests passed!/)).toBeInTheDocument()
    expect(celebrate).not.toHaveBeenCalled()
  })

  it('celebrates the whole module when its last lesson is finished', async () => {
    const user = userEvent.setup()
    checkJavaScript.mockResolvedValue(passedCheck)
    saveProgress('introduction', '01-welcome', {
      ...emptyProgress(),
      passed: [0, 1, 2, 3],
      completed: true,
    })
    saveProgress('introduction', '02-how-to-get-the-most-out-of-it', {
      ...emptyProgress(),
      passed: [0, 1, 2],
      completed: true,
    })
    saveProgress('introduction', '03-running-code', {
      ...emptyProgress(),
      passed: [0, 1, 2],
    })
    renderAt('/learn/introduction/03-running-code')
    await screen.findByText('Step 4 of 4', { selector: 'p' })

    await user.click(screen.getByRole('button', { name: '✓ Check' }))
    expect(celebrate).toHaveBeenCalledWith('module')
    expect(screen.getByText(/module complete!/i)).toBeInTheDocument()
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

describe('keyboard focus', () => {
  const WELCOME = '/learn/introduction/01-welcome'

  it('moves between the coding tabs with the arrow keys', async () => {
    const user = userEvent.setup()
    saveProgress('introduction', '01-welcome', {
      ...emptyProgress(),
      passed: [0],
    })
    renderAt(`${WELCOME}?step=2`)
    const learn = await screen.findByRole('tab', { name: 'Learn' })
    const code = screen.getByRole('tab', { name: 'Code' })
    const output = screen.getByRole('tab', { name: 'Output' })
    // Only the selected tab is in the Tab order.
    expect(learn).toHaveAttribute('tabindex', '0')
    expect(code).toHaveAttribute('tabindex', '-1')
    // Each tab says which pane it shows.
    expect(
      document.getElementById(code.getAttribute('aria-controls')),
    ).toHaveAttribute('aria-label', 'Code')

    learn.focus()
    await user.keyboard('{ArrowRight}')
    expect(code).toHaveFocus()
    expect(code).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{End}')
    expect(output).toHaveFocus()
    await user.keyboard('{Home}')
    expect(learn).toHaveFocus()
    // From the first tab, ArrowLeft wraps around to the last one.
    await user.keyboard('{ArrowLeft}')
    expect(output).toHaveFocus()
    expect(output).toHaveAttribute('aria-selected', 'true')
  })

  it('moves to the new step’s title after Next and Back', async () => {
    const user = userEvent.setup()
    saveProgress('introduction', '01-welcome', {
      ...emptyProgress(),
      passed: [0, 1, 2],
    })
    renderAt(`${WELCOME}?step=1`)
    const firstTitle = await screen.findByRole('heading', {
      level: 2,
      name: 'Who this course is for',
    })
    // Opening the page doesn't move focus.
    expect(firstTitle).not.toHaveFocus()

    await user.click(nextButton())
    // Step 2 is a coding step: its title is in the Learn pane.
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'How a lesson works',
      }),
    ).toHaveFocus()

    await user.click(nextButton())
    expect(
      await screen.findByRole('heading', { level: 2, name: 'The road ahead' }),
    ).toHaveFocus()

    await user.click(screen.getByRole('button', { name: '← Back' }))
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'How a lesson works',
      }),
    ).toHaveFocus()
  })
})
