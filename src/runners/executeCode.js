import { runCheckpointTests } from './testHarness'
import { tagConsoleCalls } from './consoleLines'

// Runs a student's JavaScript and collects what it prints with console.log.
// It runs inside a Web Worker (see javascript.worker.js), so an infinite loop
// can be stopped without freezing the page. Kept free of worker APIs so it
// can be unit-tested directly.

// Turns any value into the text a student would expect to see printed.
export function formatValue(value) {
  if (typeof value === 'string') return value
  if (value === undefined) return 'undefined'
  if (typeof value === 'function')
    return `[Function ${value.name || 'anonymous'}]`
  try {
    return JSON.stringify(value) ?? String(value)
  } catch {
    // Circular objects (e.g. linked list nodes pointing back) can't be JSON.
    return String(value)
  }
}

// A console that writes into `logs` instead of the browser's console, and
// the code line of each printed line into `lines` (null when unknown).
function captureConsole(logs, lines = []) {
  function consoleForLine(line) {
    const print = (...values) => {
      logs.push(values.map(formatValue).join(' '))
      lines.push(line)
    }
    return { log: print, info: print, warn: print, error: print }
  }
  // tagConsoleCalls turns `console.log(…)` into `console.atLine(3).log(…)`.
  return { ...consoleForLine(null), atLine: consoleForLine }
}

// `new Function` puts two lines of its own before the student's first line.
const WRAPPER_LINES = 2

// The student's line where an error was thrown, when the browser says.
// Chrome names the code by its sourceURL in the stack; Safari has error.line.
function errorLine(error, code) {
  const fromStack = /student-code\.js:(\d+):\d+/.exec(error?.stack ?? '')
  const reported = fromStack ? Number(fromStack[1]) : error?.line
  const line = reported - WRAPPER_LINES
  const lastLine = code.split('\n').length
  return Number.isInteger(line) && line >= 1 && line <= lastLine ? line : null
}

// Returns { logs: string[], lines: (number | null)[], error: string | null,
// errorLine: number | null }. `lines[i]` is the code line that printed
// `logs[i]`, for the replay after Run.
export function executeCode(code) {
  const logs = []
  const lines = []
  const fakeConsole = captureConsole(logs, lines)

  try {
    // The student's code sees our `console`, so we can capture its output.
    const run = new Function(
      'console',
      `${tagConsoleCalls(code)}\n//# sourceURL=student-code.js`,
    )
    run(fakeConsole)
    return { logs, lines, error: null, errorLine: null }
  } catch (error) {
    return {
      logs,
      lines,
      error: `${error.name}: ${error.message}`,
      errorLine: errorLine(error, code),
    }
  }
}

// Runs the student's code against a checkpoint's tests.
// Returns { logs, error, passed, results: [{ ok, message }] }.
export function checkCode(code, checkpoint) {
  const logs = []
  try {
    const { passed, results } = runCheckpointTests(
      code,
      checkpoint,
      captureConsole(logs),
    )
    return { logs, error: null, passed, results }
  } catch (error) {
    // The code didn't even load (syntax error, missing function…).
    return {
      logs,
      error: `${error.name}: ${error.message}`,
      passed: false,
      results: [],
    }
  }
}
