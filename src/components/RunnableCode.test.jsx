import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
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

describe('RunnableCode', () => {
  it('runs the code and shows what it printed', async () => {
    const user = userEvent.setup()
    render(<RunnableCode initialCode="console.log(2 + 3)" />)

    await user.click(screen.getByRole('button', { name: /run/i }))

    expect(runJavaScript).toHaveBeenCalledWith('console.log(2 + 3)')
    expect(screen.getByRole('status', { name: 'Output' })).toHaveTextContent(
      '5',
    )
  })

  it('runs the edited code and shows errors', async () => {
    const user = userEvent.setup()
    render(<RunnableCode initialCode="" />)

    await user.type(
      screen.getByRole('textbox', { name: 'Editable JavaScript code' }),
      'oops()',
    )
    await user.click(screen.getByRole('button', { name: /run/i }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'ReferenceError: oops is not defined',
    )
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
  it("explains a timeout in the student's language", async () => {
    const user = userEvent.setup()
    runJavaScript.mockResolvedValueOnce({
      logs: [],
      error: null,
      problem: 'timeout',
    })
    const { default: i18n } = await import('../i18n')
    await i18n.changeLanguage('es')
    render(<RunnableCode initialCode="while (true) {}" />)

    await user.click(screen.getByRole('button', { name: /ejecutar/i }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'Se detuvo después de 2 segundos. ¿Hay un bucle infinito?',
    )
  })
})
