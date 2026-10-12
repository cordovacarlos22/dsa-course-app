// Code traces: a piece of code played line by line by <CodeTrace>.
//
// Each trace has:
// - key: its captions live in src/locales/*.json under viz.trace.<key>
// - code: the code students see (never translated)
// - counter: what the operations counter counts (viz.trace.counters.<counter>),
//   or null for no counter
// - inputs: one or more inputs the student can pick (the "n picker")
// - run(input): a generator that walks through the code and yields one step
//   per highlighted line: { line, captionKey, params, ops, vars, pointers,
//   states, output, result }. Lines are numbered from 1.
//
// traces.test.js runs every `code` for real and checks that the trace ends
// with the same result, so the animation can't disagree with its code.
import { isInvited, isInvitedAll } from './isInvited'
import { countShortNames } from './countShortNames'
import { countGuests } from './countGuests'
import { giveGifts } from './giveGifts'
import { welcomeAll, welcomeAndGoodbye } from './welcome'
import { greetEveryone } from './greetEveryone'
import { partySummary } from './partySummary'
import { sumLoop, sumFormula } from './sumUpTo'
import { printNumbers, printPairs } from './printNumbers'
import { doubleArray } from './doubleArray'

export const traces = {
  'trace-is-invited': isInvited,
  'trace-is-invited-all': isInvitedAll,
  'trace-count-short-names': countShortNames,
  'trace-count-guests': countGuests,
  'trace-give-gifts': giveGifts,
  'trace-welcome-all': welcomeAll,
  'trace-welcome-and-goodbye': welcomeAndGoodbye,
  'trace-greet-everyone': greetEveryone,
  'trace-party-summary': partySummary,
  'trace-sum-loop': sumLoop,
  'trace-sum-formula': sumFormula,
  'trace-print-numbers': printNumbers,
  'trace-print-pairs': printPairs,
  'trace-double-array': doubleArray,
}
