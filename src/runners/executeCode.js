import { runCheckpointTests } from './testHarness'

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

// A console that writes into `logs` instead of the browser's console.
function captureConsole(logs) {
  const print = (...values) => logs.push(values.map(formatValue).join(' '))
  return { log: print, info: print, warn: print, error: print }
}

// Returns { logs: string[], error: string | null }.
export function executeCode(code) {
  const logs = []
  const fakeConsole = captureConsole(logs)

  try {
    // The student's code sees our `console`, so we can capture its output.
    new Function('console', code)(fakeConsole)
    return { logs, error: null }
  } catch (error) {
    return { logs, error: `${error.name}: ${error.message}` }
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
