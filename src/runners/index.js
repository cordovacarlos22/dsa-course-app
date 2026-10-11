// Runs student code safely, one runner per programming language.
// Only JavaScript for now; Python (Pyodide) can be added as another entry.

// Long enough for any exercise; short enough that a stuck loop feels quick.
export const RUN_TIMEOUT_MS = 2000

// Runs JavaScript in a fresh Web Worker. Resolves with
// { logs: string[], error: string | null } and never rejects.
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
      resolve({
        logs: [],
        error: `Stopped after ${timeoutMs / 1000} seconds. Is there an infinite loop?`,
      })
    }, timeoutMs)

    worker.onmessage = (event) => {
      clearTimeout(timer)
      worker.terminate()
      resolve(event.data)
    }

    worker.onerror = (event) => {
      clearTimeout(timer)
      worker.terminate()
      resolve({ logs: [], error: event.message || 'The code could not run.' })
    }

    worker.postMessage({ code })
  })
}

export const runners = {
  javascript: runJavaScript,
}
