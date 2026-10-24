import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, it, expect, vi } from 'vitest'
import StepPlayer from './StepPlayer'
import { AutoPlayContext } from '../visualizations/autoPlay'

const STEPS = [
  { caption: 'First step', value: 'A' },
  { caption: 'Second step', value: 'B' },
  { caption: 'Third step', value: 'C' },
]

function renderPlayer() {
  return render(
    <StepPlayer
      title="Demo"
      steps={STEPS}
      renderStep={(step) => <p>Drawing {step.value}</p>}
    />,
  )
}

afterEach(() => {
  vi.useRealTimers()
})

describe('StepPlayer', () => {
  it('moves forward and back one step at a time', async () => {
    const user = userEvent.setup()
    renderPlayer()

    expect(screen.getByText('First step')).toBeInTheDocument()
    expect(screen.getByText('Drawing A')).toBeInTheDocument()
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText('Second step')).toBeInTheDocument()
    expect(screen.getByText('Drawing B')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /previous/i }))
    expect(screen.getByText('First step')).toBeInTheDocument()
  })

  it('plays through every step on its own and stops at the end', () => {
    vi.useFakeTimers()
    renderPlayer()

    act(() => screen.getByRole('button', { name: 'Play' }).click())
    act(() => vi.advanceTimersByTime(2200))
    expect(screen.getByText('Second step')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(2200))
    expect(screen.getByText('Third step')).toBeInTheDocument()

    // At the end the button offers to start again.
    act(() => vi.advanceTimersByTime(2200))
    expect(screen.getByRole('button', { name: 'Restart' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  it('stops the moment it reaches the last step, and Restart plays it again', () => {
    vi.useFakeTimers()
    renderPlayer()

    act(() => screen.getByRole('button', { name: 'Play' }).click())
    act(() => vi.advanceTimersByTime(2200))
    act(() => vi.advanceTimersByTime(2200))
    // No extra wait: it already stopped on arrival.
    expect(screen.getByText('Third step')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Restart' })).toBeInTheDocument()

    act(() => screen.getByRole('button', { name: 'Restart' }).click())
    expect(screen.getByText('First step')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(2200))
    act(() => vi.advanceTimersByTime(2200))
    expect(screen.getByText('Third step')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Restart' })).toBeInTheDocument()
  })

  it('stops moving when the student pauses', () => {
    vi.useFakeTimers()
    renderPlayer()

    act(() => screen.getByRole('button', { name: 'Play' }).click())
    act(() => screen.getByRole('button', { name: 'Pause' }).click())
    act(() => vi.advanceTimersByTime(2200))
    act(() => vi.advanceTimersByTime(2200))
    expect(screen.getByText('First step')).toBeInTheDocument()
  })

  it('plays on its own and starts over inside AutoPlayContext', () => {
    vi.useFakeTimers()
    render(
      <AutoPlayContext value>
        <StepPlayer
          title="Demo"
          steps={STEPS}
          renderStep={(step) => <p>Drawing {step.value}</p>}
        />
      </AutoPlayContext>,
    )

    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(2200))
    act(() => vi.advanceTimersByTime(2200))
    expect(screen.getByText('Third step')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(2200))
    expect(screen.getByText('First step')).toBeInTheDocument()
  })
})
