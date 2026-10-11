// Runs student code safely, one runner per programming language.
// Only JavaScript for now; Python (Pyodide) can be added as another entry.

// Long enough for any exercise; short enough that a stuck loop feels quick.
export const RUN_TIMEOUT_MS = 2000

// Sends one job to a fresh Web Worker and waits for the answer. Never rejects.
// The result always has `problem: null | 'timeout' | 'crash'`, which says what
// went wrong *outside* the student's code, so the page can explain it in the
// student's language. (`error` is JavaScript's own message, always English.)
function runInWorker(job, timeoutMs, emptyResult) {
  return new Promise((resolve) => {
    const worker = new Worker(
      new URL('./javascript.worker.js', import.meta.url),
      { type: 'module' },
    )

    // If the code doesn't finish in time (e.g. `while (true) {}`), we kill
    // the worker. That's the only way to stop an infinite loop.
    const timer = setTimeout(() => {
      worker.terminate()
      resolve({ ...emptyResult, problem: 'timeout' })
    }, timeoutMs)

    worker.onmessage = (event) => {
      clearTimeout(timer)
      worker.terminate()
      resolve({ ...event.data, problem: null })
    }

    worker.onerror = (event) => {
      clearTimeout(timer)
      worker.terminate()
      resolve({
        ...emptyResult,
        error: event.message || null,
        problem: 'crash',
      })
    }

    worker.postMessage(job)
  })
}

// Runs JavaScript and resolves with { logs, error, problem }.
export function runJavaScript(code, timeoutMs = RUN_TIMEOUT_MS) {
  return runInWorker({ type: 'run', code }, timeoutMs, {
    logs: [],
    error: null,
  })
}

// Runs the code against a checkpoint's tests and resolves with
// { logs, error, passed, results: [{ ok, message }], problem }.
export function checkJavaScript(code, checkpoint, timeoutMs = RUN_TIMEOUT_MS) {
  return runInWorker({ type: 'check', code, checkpoint }, timeoutMs, {
    logs: [],
    error: null,
    passed: false,
    results: [],
  })
}

export const runners = {
  javascript: { run: runJavaScript, check: checkJavaScript },
}
