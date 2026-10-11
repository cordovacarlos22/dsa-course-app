// Runs student code safely, one runner per programming language.
// Only JavaScript for now; Python (Pyodide) can be added as another entry.

// Long enough for any exercise; short enough that a stuck loop feels quick.
export const RUN_TIMEOUT_MS = 2000

// Runs JavaScript in a fresh Web Worker. Never rejects; resolves with
// { logs: string[], error: string | null, problem: null | 'timeout' | 'crash' }.
// `problem` says what went wrong *outside* the student's code, so the page can
// explain it in the student's language. (`error` is JavaScript's own message,
// which is always in English.)
export function runJavaScript(code, timeoutMs = RUN_TIMEOUT_MS) {
  return new Promise((resolve) => {
    const worker = new Worker(
      new URL('./javascript.worker.js', import.meta.url),
      { type: 'module' },
    )

    // If the code doesn't finish in time (e.g. `while (true) {}`), we kill
    // the worker. That's the only way to stop an infinite loop.
    const timer = setTimeout(() => {
      worker.terminate()
      resolve({ logs: [], error: null, problem: 'timeout' })
    }, timeoutMs)

    worker.onmessage = (event) => {
      clearTimeout(timer)
      worker.terminate()
      resolve({ ...event.data, problem: null })
    }

    worker.onerror = (event) => {
      clearTimeout(timer)
      worker.terminate()
      resolve({ logs: [], error: event.message || null, problem: 'crash' })
    }

    worker.postMessage({ code })
  })
}

export const runners = {
  javascript: runJavaScript,
}
