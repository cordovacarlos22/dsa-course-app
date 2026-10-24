// A Web Worker runs code on a separate thread, so the page stays responsive
// and an infinite loop can be killed (see ./index.js).
import { checkCode, executeCode } from './executeCode'

// Two jobs: "run" just runs the code; "check" also grades it with tests.
self.onmessage = (event) => {
  const { type, code, checkpoint } = event.data
  self.postMessage(
    type === 'check' ? checkCode(code, checkpoint) : executeCode(code),
  )
}

// Loaded: the page can send the job and start the clock.
self.postMessage('ready')
