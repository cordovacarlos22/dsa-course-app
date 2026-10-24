import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ExplainCheckpoint from './ExplainCheckpoint'

const text = (en) => ({ en, es: `${en} (es)` })

const CHECKPOINT = {
  type: 'explain',
  question: text('Why do we count steps instead of timing the code?'),
  modelAnswer: text(
    'Time changes from one computer to another; the number of steps does not.',
  ),
  checklist: [
    text('Says the time depends on the computer'),
    text('Says the number of steps stays the same'),
  ],
}

function renderCheckpoint(props = {}) {
  const onPassed = vi.fn()
  render(
    <ExplainCheckpoint
      checkpoint={CHECKPOINT}
      isPassed={false}
      cheer="Nice!"
      onPassed={onPassed}
      {...props}
    />,
  )
  return onPassed
}

describe('ExplainCheckpoint', () => {
  it('asks the student to write an explanation before showing the model answer', async () => {
    const user = userEvent.setup()
    renderCheckpoint()
    const compare = screen.getByRole('button', {
      name: 'Compare with a model answer',
    })

    expect(compare).toBeDisabled()
    expect(screen.getByText('Write at least a sentence first.')).toBeVisible()
    await user.type(screen.getByLabelText('Your explanation'), 'Because')
    expect(compare).toBeDisabled()

    await user.type(
      screen.getByLabelText('Your explanation'),
      ' computers are not equally fast',
    )
    expect(compare).toBeEnabled()
    expect(screen.queryByText(/the number of steps does not/)).toBeNull()
  })

  it('shows the model answer and passes once every point is ticked', async () => {
    const user = userEvent.setup()
    const onPassed = renderCheckpoint()

    await user.type(
      screen.getByLabelText('Your explanation'),
      'Each computer runs at its own speed.',
    )
    await user.click(
      screen.getByRole('button', { name: 'Compare with a model answer' }),
    )

    expect(screen.getByText(/the number of steps does not/)).toBeInTheDocument()
    // The student can keep improving their explanation.
    expect(screen.getByLabelText('Your explanation')).toHaveValue(
      'Each computer runs at its own speed.',
    )
    const done = screen.getByRole('button', { name: 'Done' })
    expect(done).toBeDisabled()

    await user.click(
      screen.getByRole('checkbox', {
        name: 'Says the time depends on the computer',
      }),
    )
    expect(done).toBeDisabled()
    await user.click(
      screen.getByRole('checkbox', {
        name: 'Says the number of steps stays the same',
      }),
    )
    await user.click(done)

    expect(onPassed).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status')).toHaveTextContent('Explained! Nice!')
    expect(screen.getByLabelText('Your explanation')).toBeInTheDocument()
  })

  it('keeps the explanation and the cheer when the page marks the step passed', async () => {
    const user = userEvent.setup()
    const props = { checkpoint: CHECKPOINT, cheer: 'Nice!', onPassed: vi.fn() }
    const { rerender } = render(
      <ExplainCheckpoint {...props} isPassed={false} />,
    )
    await user.type(
      screen.getByLabelText('Your explanation'),
      'Each computer runs at its own speed.',
    )
    await user.click(
      screen.getByRole('button', { name: 'Compare with a model answer' }),
    )
    for (const box of screen.getAllByRole('checkbox')) await user.click(box)
    await user.click(screen.getByRole('button', { name: 'Done' }))

    // Passing re-renders the lesson with isPassed true.
    rerender(<ExplainCheckpoint {...props} isPassed />)

    expect(screen.getByRole('status')).toHaveTextContent('Explained! Nice!')
    expect(screen.getByLabelText('Your explanation')).toHaveValue(
      'Each computer runs at its own speed.',
    )
  })

  it('shows a step passed earlier as done when the student comes back', () => {
    renderCheckpoint({ isPassed: true })

    expect(screen.getByText(/the number of steps does not/)).toBeVisible()
    for (const box of screen.getAllByRole('checkbox')) {
      expect(box).toBeChecked()
      expect(box).toBeDisabled()
    }
    expect(screen.queryByRole('button', { name: 'Done' })).toBeNull()
    expect(screen.getByRole('status')).toHaveTextContent(
      'You already passed this step.',
    )
  })
})
