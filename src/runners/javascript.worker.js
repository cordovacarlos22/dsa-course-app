// A Web Worker runs code on a separate thread, so the page stays responsive
// and an infinite loop can be killed (see runJavaScript in ./index.js).
import { executeCode } from './executeCode'

self.onmessage = (event) => {
  self.postMessage(executeCode(event.data.code))
}
