// Short, happy sounds for the student's wins, like in a game. The browser
// makes them with the Web Audio API, so there are no audio files to download
// or license. The 🔊 button in the header turns them off, and the choice is
// saved in the browser like the language (every storage call is in try/catch).

const STORAGE_KEY = 'sounds'

// Each sound is a few notes played one after the other.
// frequency: the pitch in Hz · start: seconds after the sound begins.
function note(frequency, start, duration = 0.18) {
  return { frequency, start, duration }
}

const SOUNDS = {
  // A quick "ding-ding": a step's check passed.
  step: [note(659.25, 0), note(880, 0.09)],
  // C, E, G and a high C going up: the lesson is complete.
  lesson: [
    note(523.25, 0),
    note(659.25, 0.1),
    note(783.99, 0.2),
    note(1046.5, 0.3, 0.4),
  ],
  // The same chord, then a little fanfare: the whole module is complete.
  module: [
    note(523.25, 0),
    note(659.25, 0.12),
    note(783.99, 0.24),
    note(1046.5, 0.36),
    note(783.99, 0.52),
    note(1046.5, 0.64, 0.6),
  ],
  // Two soft notes going down: that answer wasn't right. Gentle on purpose,
  // so a mistake never feels like a punishment.
  miss: [note(392, 0, 0.16), note(311.13, 0.12, 0.26)],
}

// Used only when the browser blocks storage, so the 🔊 button still works
// until the page is closed.
let choiceInMemory = 'on'

export function isSoundOn() {
  try {
    return (localStorage.getItem(STORAGE_KEY) ?? 'on') !== 'off'
  } catch {
    return choiceInMemory !== 'off'
  }
}

export function setSoundOn(isOn) {
  choiceInMemory = isOn ? 'on' : 'off'
  try {
    localStorage.setItem(STORAGE_KEY, choiceInMemory)
  } catch {
    // Storage is blocked: the choice lasts until the page is closed.
  }
}

// One AudioContext for the whole app (browsers limit how many a page has).
let audioContext = null

// Returns null when the browser has no Web Audio (or won't make one).
function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext ?? window.webkitAudioContext
    if (!AudioContextClass) return null
    try {
      audioContext = new AudioContextClass()
    } catch {
      return null
    }
  }
  return audioContext
}

// A paused context plays nothing. resume() is refused (rejected) when the
// student hasn't clicked yet; the sound is skipped then, without an error.
function wakeUp(context) {
  if (context.state === 'suspended') context.resume().catch(() => {})
}

// Plays "step", "lesson", "module" or "miss".
export function playSound(name) {
  const notes = SOUNDS[name]
  if (!notes || !isSoundOn()) return
  try {
    const context = getAudioContext()
    if (!context) return
    wakeUp(context)
    for (let i = 0; i < notes.length; i++) {
      playNote(context, notes[i])
    }
  } catch {
    // A sound is only a bonus: if the browser can't play it, the lesson goes on.
  }
}

function playNote(context, { frequency, start, duration }) {
  const oscillator = context.createOscillator()
  const volume = context.createGain()
  oscillator.type = 'triangle'
  oscillator.frequency.value = frequency

  // Fade in fast and out slowly, so the note doesn't click. It stays quiet
  // (0.2 of full volume).
  const begin = context.currentTime + start
  volume.gain.setValueAtTime(0.0001, begin)
  volume.gain.exponentialRampToValueAtTime(0.2, begin + 0.02)
  volume.gain.exponentialRampToValueAtTime(0.0001, begin + duration)

  oscillator.connect(volume)
  volume.connect(context.destination)
  oscillator.start(begin)
  oscillator.stop(begin + duration + 0.05)
}

// Browsers (Safari above all) only let a page make sound after the student
// clicks or presses a key. A coding check finishes after its tests run, which
// is too late to count as a click, so the audio is switched on at the
// student's first click instead.
export function unlockSoundOnFirstTap() {
  function unlock() {
    // Muted: keep listening, in case the student turns sound on later.
    if (!isSoundOn()) return
    const context = getAudioContext()
    if (context) wakeUp(context)
    window.removeEventListener('click', unlock)
    window.removeEventListener('keydown', unlock)
  }
  window.addEventListener('click', unlock)
  window.addEventListener('keydown', unlock)
}
