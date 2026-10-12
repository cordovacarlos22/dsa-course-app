import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import SoundToggle from './SoundToggle'
import { playSound } from '../lib/sounds'

vi.mock('../lib/sounds', async (importOriginal) => ({
  ...(await importOriginal()),
  playSound: vi.fn(),
}))

describe('SoundToggle', () => {
  it('turns the sounds off and on, and remembers the choice', async () => {
    const user = userEvent.setup()
    render(<SoundToggle />)

    const button = screen.getByRole('button', { name: 'Sounds' })
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveAttribute('title', 'Turn sounds off')

    await user.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveAttribute('title', 'Turn sounds on')
    expect(localStorage.getItem('sounds')).toBe('off')
    expect(playSound).not.toHaveBeenCalled()

    // Turning them back on plays a short "ding" to show they work.
    await user.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(localStorage.getItem('sounds')).toBe('on')
    expect(playSound).toHaveBeenCalledWith('step')
  })

  it('starts muted when the student muted it before', () => {
    localStorage.setItem('sounds', 'off')
    render(<SoundToggle />)
    expect(screen.getByRole('button', { name: 'Sounds' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})
