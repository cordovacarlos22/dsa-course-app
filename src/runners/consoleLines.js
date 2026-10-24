import { parser } from '@lezer/javascript'

// The replay after Run shows which line printed each output line. To know it
// in every browser (Safari's stack traces have no line numbers for this
// code), we rewrite each `console.log(…)` in the student's code into
// `console.atLine(3).log(…)` before running it. The fake console then
// records the line with the text it prints.

const PRINTING = /^console\.(log|info|warn|error)$/

// It parses the code instead of searching its text, so `console.log` inside a
// string or a comment stays untouched. Only the callee changes, and never its
// line breaks, so every line keeps its number. A call split over two lines,
// or printing through another name (`const say = console.log`), just gets no
// line tag.
export function tagConsoleCalls(code) {
  const calls = []
  parser.parse(code).iterate({
    enter(node) {
      if (node.name !== 'CallExpression') return
      const callee = node.node.firstChild
      if (callee?.name !== 'MemberExpression') return
      const method = PRINTING.exec(code.slice(callee.from, callee.to))?.[1]
      if (method) calls.push({ from: callee.from, to: callee.to, method })
    },
  })

  // From the last call back to the first, so earlier positions stay valid.
  let tagged = code
  for (let i = calls.length - 1; i >= 0; i--) {
    const { from, to, method } = calls[i]
    const line = code.slice(0, from).split('\n').length
    tagged =
      tagged.slice(0, from) +
      `console.atLine(${line}).${method}` +
      tagged.slice(to)
  }
  return tagged
}
