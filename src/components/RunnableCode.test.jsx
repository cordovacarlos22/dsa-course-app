import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, it, expect, vi } from 'vitest'
import RunnableCode from './RunnableCode'
import { runJavaScript } from '../runners'
import { executeCode } from '../runners/executeCode'

// jsdom has no Web Workers, so the test runs the code directly instead.
vi.mock('../runners', () => ({
  RUN_TIMEOUT_MS: 2000,
  runJavaScript: vi.fn(async (code) => ({
    ...executeCode(code),
    problem: null,
  })),
}))

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

// Presses Run and waits for the (mocked) runner to answer.
async function pressRun(name = /run/i) {
  await act(async () => screen.getByRole('button', { name }).click())
}

function output() {
  return screen.getByRole('status', { name: 'Output' })
}

function codeLines() {
  return within(
    screen.getByRole('list', { name: 'The code that ran, line by line' }),
  ).getAllByRole('listitem')
}

const TWO_GUESTS = "console.log('Ana')\nlet done = true\nconsole.log('Ben')"

describe('RunnableCode', () => {
  it('replays the output one line at a time, highlighting the line that printed it', async () => {
    vi.useFakeTimers()
    render(<RunnableCode initialCode={TWO_GUESTS} />)

    await pressRun()
    expect(runJavaScript).toHaveBeenCalledWith(TWO_GUESTS)
    // The code now shows read-only, and nothing is printed yet.
    expect(codeLines()).toHaveLength(3)
    expect(output()).not.toHaveTextContent('Ana')

    act(() => vi.advanceTimersByTime(800))
    expect(within(output()).getByText('Ana')).toBeInTheDocument()
    expect(within(output()).getByText('line 1')).toBeInTheDocument()
    expect(codeLines()[0]).toHaveAttribute('aria-current', 'true')
    expect(output()).not.toHaveTextContent('Ben')

    act(() => vi.advanceTimersByTime(800))
    expect(within(output()).getByText('Ben')).toBeInTheDocument()
    expect(within(output()).getByText('line 3')).toBeInTheDocument()
    expect(codeLines()[2]).toHaveAttribute('aria-current', 'true')
    expect(codeLines()[0]).not.toHaveAttribute('aria-current')
  })

  it('steps one line, shows all, replays, and goes back to editing', async () => {
    vi.useFakeTimers()
    render(<RunnableCode initialCode={TWO_GUESTS} />)
    await pressRun()

    act(() => screen.getByRole('button', { name: /step/i }).click())
    expect(output()).toHaveTextContent('Ana')
    expect(output()).not.toHaveTextContent('Ben')
    // Stepping stops the replay: time passing shows nothing more.
    act(() => vi.advanceTimersByTime(5000))
    expect(output()).not.toHaveTextContent('Ben')

    act(() => screen.getByRole('button', { name: 'Show all' }).click())
    expect(output()).toHaveTextContent('Ben')
    expect(screen.getByRole('button', { name: 'Show all' })).toBeDisabled()

    act(() => screen.getByRole('button', { name: /replay/i }).click())
    expect(output()).not.toHaveTextContent('Ana')

    act(() => screen.getByRole('button', { name: /edit/i }).click())
    expect(screen.getByRole('textbox')).toHaveValue(TWO_GUESTS)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('shows everything at once when the device asks for less motion', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    render(<RunnableCode initialCode={TWO_GUESTS} />)

    await pressRun()

    expect(within(output()).getByText('Ana')).toBeInTheDocument()
    expect(within(output()).getByText('Ben')).toBeInTheDocument()
    expect(within(output()).getByText('line 3')).toBeInTheDocument()
  })

  it('shows long output all at once, with a note', async () => {
    render(
      <RunnableCode
        initialCode={'for (let i = 0; i < 61; i++) {\n  console.log(i)\n}'}
      />,
    )

    await pressRun()

    expect(output()).toHaveTextContent(
      '61 lines of output, so they all show at once.',
    )
    expect(within(output()).getByText('60')).toBeInTheDocument()
  })

  it('shows an error last, tagged with the line that threw it', async () => {
    render(<RunnableCode initialCode={"console.log('ok')\nnull.length"} />)

    await pressRun()
    act(() => screen.getByRole('button', { name: 'Show all' }).click())

    const error = within(output()).getByText(/^TypeError/)
    expect(error.closest('p')).toHaveTextContent('line 2')
  })

  it('runs the edited code', async () => {
    const user = userEvent.setup()
    render(<RunnableCode initialCode="" />)

    await user.type(
      screen.getByRole('textbox', { name: 'Editable JavaScript code' }),
      'oops()',
    )
    await pressRun()
    act(() => screen.getByRole('button', { name: 'Show all' }).click())

    expect(output()).toHaveTextContent('ReferenceError: oops is not defined')
  })

  it('resets the code back to the original', async () => {
    const user = userEvent.setup()
    render(<RunnableCode initialCode="let a = 1" />)
    const editor = screen.getByRole('textbox')

    await user.type(editor, ' + 1')
    await user.click(screen.getByRole('button', { name: 'Reset' }))

    expect(editor).toHaveValue('let a = 1')
  })
})

describe('RunnableCode problems', () => {
  it("explains a timeout in the student's language, with nothing to replay", async () => {
    runJavaScript.mockResolvedValueOnce({
      logs: [],
      lines: [],
      error: null,
      errorLine: null,
      problem: 'timeout',
    })
    const { default: i18n } = await import('../i18n')
    await i18n.changeLanguage('es')
    render(<RunnableCode initialCode="while (true) {}" />)

    await pressRun(/ejecutar/i)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Se detuvo después de 2 segundos. ¿Hay un bucle infinito?',
    )
    // The editor stays, so the student can fix the loop right away.
    expect(screen.getByRole('textbox')).toHaveValue('while (true) {}')
    expect(
      screen.queryByRole('button', { name: /repetir/i }),
    ).not.toBeInTheDocument()
  })
})
