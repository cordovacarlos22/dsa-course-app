// Code traces: a piece of code played line by line by <CodeTrace>.
//
// Each trace has:
// - key: its captions live in src/locales/viz.<language>.json under trace.<key>
// - code: the code students see (never translated)
// - counter: what the operations counter counts (viz.trace.counters.<counter>),
//   or null for no counter
// - inputs: one or more inputs the student can pick (the "n picker")
// - run(input): a generator that walks through the code and yields one step
//   per highlighted line: { line, captionKey, params, ops, vars, pointers,
//   states, output, result }. Lines are numbered from 1. A linked list
//   trace yields `list` (props for LinkedListDiagram) instead of boxes.
// - construct: true when the code is a class: the test calls it with `new`
// - method: true when the code is one LinkedList method: the test puts it
//   in a class and checks play(LinkedList, input) instead of call()
// - uses: the other method traces whose code that method calls (set uses get)
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
import { sumLoop, sumFormula } from './sumOneTo'
import { printNumbers, printSeats } from './printNumbers'
import { doubleOrders } from './doubleOrders'
import { hasAnswer } from './hasAnswer'
import { countCharacters } from './countCharacters'
import { linkedListWalk } from './linkedListWalk'
import { linkedListConstructor } from './linkedListConstructor'
import {
  linkedListPop,
  linkedListPush,
  linkedListShift,
  linkedListUnshift,
} from './linkedListMethods'
import {
  linkedListGet,
  linkedListInsert,
  linkedListRemove,
  linkedListReverse,
  linkedListSet,
} from './linkedListIndexMethods'

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
  'trace-print-seats': printSeats,
  'trace-double-orders': doubleOrders,
  'trace-has-answer': hasAnswer,
  'trace-count-characters': countCharacters,
  'trace-ll-walk': linkedListWalk,
  'trace-ll-constructor': linkedListConstructor,
  'trace-ll-push': linkedListPush,
  'trace-ll-pop': linkedListPop,
  'trace-ll-unshift': linkedListUnshift,
  'trace-ll-shift': linkedListShift,
  'trace-ll-get': linkedListGet,
  'trace-ll-set': linkedListSet,
  'trace-ll-insert': linkedListInsert,
  'trace-ll-remove': linkedListRemove,
  'trace-ll-reverse': linkedListReverse,
}
