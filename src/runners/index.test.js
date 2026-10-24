import { afterEach, describe, it, expect, vi } from 'vitest'
import { runJavaScript } from './index'

// jsdom has no Web Workers. This stand-in only answers when a test says so.
let worker = null
class FakeWorker {
  constructor() {
    this.jobs = []
    this.isTerminated = false
    worker = this
  }
  postMessage(job) {
    this.jobs.push(job)
  }
  terminate() {
    this.isTerminated = true
  }
  // Sends a message the way the real worker does.
  send(data) {
    this.onmessage({ data })
  }
}

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('runJavaScript', () => {
  it('gives the code its 2 seconds only once the worker has loaded', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('Worker', FakeWorker)
    const answer = runJavaScript('while (true) {}')

    // A slow phone takes 5 seconds to load the worker: not a timeout.
    vi.advanceTimersByTime(5000)
    expect(worker.jobs).toEqual([])
    worker.send('ready')
    expect(worker.jobs).toEqual([{ type: 'run', code: 'while (true) {}' }])

    vi.advanceTimersByTime(2000)
    await expect(answer).resolves.toMatchObject({ problem: 'timeout' })
    expect(worker.isTerminated).toBe(true)
  })

  it("resolves with the worker's answer", async () => {
    vi.stubGlobal('Worker', FakeWorker)
    const answer = runJavaScript("console.log('hi')")
    const printed = { logs: ['hi'], lines: [1], error: null, errorLine: null }

    worker.send('ready')
    worker.send(printed)

    await expect(answer).resolves.toEqual({ ...printed, problem: null })
  })

  it('says the code could not run when the worker never loads', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('Worker', FakeWorker)
    const answer = runJavaScript("console.log('hi')")

    vi.advanceTimersByTime(10000)

    await expect(answer).resolves.toMatchObject({ problem: 'crash' })
    expect(worker.jobs).toEqual([])
  })
})
