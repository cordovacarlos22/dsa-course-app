// Runs student code safely, one runner per programming language.
// Only JavaScript for now; Python (Pyodide) can be added as another entry.

// Long enough for any exercise; short enough that a stuck loop feels quick.
export const RUN_TIMEOUT_MS = 2000
// How long the worker may take to load (a slow phone on a slow network)
// before we give up and say the code could not run.
const LOAD_TIMEOUT_MS = 10000

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

    function finish(result) {
      clearTimeout(timer)
      worker.terminate()
      resolve(result)
    }

    let timer = setTimeout(
      () => finish({ ...emptyResult, problem: 'crash' }),
      LOAD_TIMEOUT_MS,
    )
    let isJobSent = false

    worker.onmessage = (event) => {
      // The worker says 'ready' once its code has loaded. Only then does the
      // student's code get its time, so slow loading never looks like an
      // infinite loop. Only the first 'ready' counts: the student's code
      // could post one too, and must not restart its own clock.
      if (event.data === 'ready') {
        if (isJobSent) return
        isJobSent = true
        clearTimeout(timer)
        // If the code doesn't finish in time (e.g. `while (true) {}`), we
        // kill the worker. That's the only way to stop an infinite loop.
        timer = setTimeout(
          () => finish({ ...emptyResult, problem: 'timeout' }),
          timeoutMs,
        )
        worker.postMessage(job)
        return
      }
      finish({ ...event.data, problem: null })
    }

    worker.onerror = (event) => {
      finish({ ...emptyResult, error: event.message || null, problem: 'crash' })
    }
  })
}

// Runs JavaScript and resolves with { logs, lines, error, errorLine,
// problem } (see executeCode.js).
export function runJavaScript(code, timeoutMs = RUN_TIMEOUT_MS) {
  return runInWorker({ type: 'run', code }, timeoutMs, {
    logs: [],
    lines: [],
    error: null,
    errorLine: null,
  })
}

// Runs the code against a checkpoint's tests and resolves with
// { logs, error, passed, results: [{ ok, key, values }], problem }.
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
