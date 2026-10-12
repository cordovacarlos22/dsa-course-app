import { playSound } from './sounds'

// Confetti and a sound for the student's wins, like in a game:
//   'step'   a small burst: a step's check passed
//   'lesson' two cannons: the lesson is complete
//   'module' star fireworks: every lesson of the module is complete
// The confetti library is only downloaded the first time it's needed.

// The brand blue and yellow, plus green and purple.
const COLORS = ['#0b84d8', '#f5b700', '#22c55e', '#a855f7']

// Every burst uses our colors. disableForReducedMotion is a second guard for
// students who ask their device for less motion (see celebrate() below).
const BASE = { colors: COLORS, disableForReducedMotion: true }

const FIREWORKS_BURSTS = 10 // one every 250 ms: about 2.5 seconds

const BURSTS = {
  // A small pop from the bottom of the screen, above the Next button.
  step(confetti) {
    confetti({
      ...BASE,
      particleCount: 60,
      spread: 70,
      startVelocity: 35,
      origin: { x: 0.5, y: 0.9 },
    })
  },

  // Two cannons, one on each side, fired twice.
  lesson(confetti) {
    fireCannons(confetti)
    setTimeout(() => fireCannons(confetti), 300)
  },

  // The cannons, then star fireworks all over the screen.
  module(confetti) {
    fireCannons(confetti)
    let bursts = 0
    const timer = setInterval(() => {
      confetti({
        ...BASE,
        particleCount: 40,
        spread: 360,
        startVelocity: 25,
        ticks: 90,
        shapes: ['star'],
        origin: { x: Math.random(), y: 0.1 + Math.random() * 0.4 },
      })
      bursts++
      if (bursts === FIREWORKS_BURSTS) clearInterval(timer)
    }, 250)
  },
}

function fireCannons(confetti) {
  confetti({
    ...BASE,
    particleCount: 80,
    angle: 60,
    spread: 60,
    origin: { x: 0, y: 0.7 },
  })
  confetti({
    ...BASE,
    particleCount: 80,
    angle: 120,
    spread: 60,
    origin: { x: 1, y: 0.7 },
  })
}

function prefersReducedMotion() {
  return (
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  )
}

export async function celebrate(level) {
  playSound(level)
  // Students who ask for less motion still get the sound and the message on
  // the page, but no confetti (and the library isn't even downloaded).
  if (prefersReducedMotion()) return
  try {
    const { default: confetti } = await import('canvas-confetti')
    BURSTS[level]?.(confetti)
  } catch {
    // The confetti couldn't load (offline?). It's only a bonus, so the
    // lesson goes on without it.
  }
}
