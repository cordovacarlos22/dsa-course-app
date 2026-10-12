import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import confetti from 'canvas-confetti'
import { celebrate } from './celebrate'
import { playSound } from './sounds'

// jsdom has no canvas, so the confetti library and the sounds are fakes here.
vi.mock('canvas-confetti', () => ({ default: vi.fn() }))
vi.mock('./sounds', () => ({ playSound: vi.fn() }))

function askForLessMotion() {
  vi.stubGlobal('matchMedia', (query) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
  }))
}

beforeEach(() => {
  confetti.mockReset()
  playSound.mockReset()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('celebrate', () => {
  it('plays a small burst and the step sound for a passed step', async () => {
    await celebrate('step')
    expect(playSound).toHaveBeenCalledWith('step')
    expect(confetti).toHaveBeenCalledTimes(1)
    expect(confetti).toHaveBeenCalledWith(
      expect.objectContaining({
        colors: expect.arrayContaining(['#0b84d8', '#f5b700']),
        disableForReducedMotion: true,
      }),
    )
  })

  it('fires two cannons, twice, for a finished lesson', async () => {
    vi.useFakeTimers()
    await celebrate('lesson')
    expect(playSound).toHaveBeenCalledWith('lesson')
    expect(confetti).toHaveBeenCalledTimes(2)
    vi.advanceTimersByTime(300)
    expect(confetti).toHaveBeenCalledTimes(4)
  })

  it('adds about 2.5 seconds of star fireworks for a finished module', async () => {
    vi.useFakeTimers()
    await celebrate('module')
    expect(playSound).toHaveBeenCalledWith('module')
    expect(confetti).toHaveBeenCalledTimes(2) // the cannons

    vi.advanceTimersByTime(2500)
    expect(confetti).toHaveBeenCalledTimes(12)
    expect(confetti).toHaveBeenLastCalledWith(
      expect.objectContaining({ shapes: ['star'] }),
    )
    // Then it stops.
    vi.advanceTimersByTime(1000)
    expect(confetti).toHaveBeenCalledTimes(12)
  })

  it('skips the confetti, not the sound, for students who ask for less motion', async () => {
    askForLessMotion()
    await celebrate('lesson')
    expect(playSound).toHaveBeenCalledWith('lesson')
    expect(confetti).not.toHaveBeenCalled()
  })
})
