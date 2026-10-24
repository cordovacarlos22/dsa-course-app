import { describe, it, expect, vi, afterEach } from 'vitest'

// jsdom has no Web Audio, so these tests use a small fake that counts the
// notes it is asked to play.
let notesPlayed = 0

class FakeAudioContext {
  constructor() {
    this.state = 'running'
    this.currentTime = 0
    this.destination = {}
  }
  createOscillator() {
    notesPlayed++
    return {
      frequency: { value: 0 },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    }
  }
  createGain() {
    return {
      gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
    }
  }
  resume() {
    this.state = 'running'
    return Promise.resolve()
  }
}

// sounds.js keeps one AudioContext, so every test loads a fresh copy.
async function loadSounds() {
  vi.resetModules()
  return import('./sounds')
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  notesPlayed = 0
})

describe('sounds', () => {
  it('are on by default and remember when the student turns them off', async () => {
    const { isSoundOn, setSoundOn } = await loadSounds()
    expect(isSoundOn()).toBe(true)

    setSoundOn(false)
    expect(isSoundOn()).toBe(false)
    expect(localStorage.getItem('sounds')).toBe('off')
  })

  it('play a few notes when on, and nothing when off', async () => {
    vi.stubGlobal('AudioContext', FakeAudioContext)
    const { playSound, setSoundOn } = await loadSounds()

    playSound('step')
    expect(notesPlayed).toBe(2)
    playSound('lesson')
    expect(notesPlayed).toBe(6)

    setSoundOn(false)
    playSound('module')
    expect(notesPlayed).toBe(6)
  })

  it('play a soft two-note tone for a wrong answer, unless muted', async () => {
    vi.stubGlobal('AudioContext', FakeAudioContext)
    const { playSound, setSoundOn } = await loadSounds()

    playSound('miss')
    expect(notesPlayed).toBe(2)
    setSoundOn(false)
    playSound('miss')
    expect(notesPlayed).toBe(2)
  })

  it('do nothing (and never crash) without Web Audio', async () => {
    vi.stubGlobal('AudioContext', undefined)
    const { playSound } = await loadSounds()
    expect(() => playSound('lesson')).not.toThrow()
  })

  it('switch the audio on at the first click', async () => {
    let wakeUps = 0
    // Like Safari: the audio starts paused until the student clicks.
    class SleepingAudioContext extends FakeAudioContext {
      constructor() {
        super()
        this.state = 'suspended'
      }
      resume() {
        wakeUps++
        return super.resume()
      }
    }
    vi.stubGlobal('AudioContext', SleepingAudioContext)
    const { unlockSoundOnFirstTap } = await loadSounds()

    unlockSoundOnFirstTap()
    window.dispatchEvent(new Event('click'))
    expect(wakeUps).toBe(1)
    // Only the first click: the listener is gone after that.
    window.dispatchEvent(new Event('click'))
    expect(wakeUps).toBe(1)
  })

  it('still turn off when storage is blocked', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    const { isSoundOn, setSoundOn } = await loadSounds()
    expect(isSoundOn()).toBe(true)
    setSoundOn(false)
    expect(isSoundOn()).toBe(false)
  })
})
