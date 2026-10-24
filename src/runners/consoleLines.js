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
  // In source order: the parser visits a call before the calls inside it.
  const calls = []
  let hasOwnConsole = false
  parser.parse(code).iterate({
    enter(node) {
      if (node.name === 'VariableDefinition') {
        if (code.slice(node.from, node.to) === 'console') hasOwnConsole = true
        return
      }
      if (node.name !== 'CallExpression') return
      const callee = node.node.firstChild
      if (callee?.name !== 'MemberExpression') return
      const method = PRINTING.exec(code.slice(callee.from, callee.to))?.[1]
      if (method) calls.push({ from: callee.from, to: callee.to, method })
    },
  })
  // Code that names something `console` (say, a function parameter) runs as
  // written: that `console` has no `atLine`.
  if (hasOwnConsole) return code

  // The new text starts with `console`, like the old, so code without
  // semicolons still splits into the same statements.
  let tagged = ''
  let copiedUpTo = 0
  let line = 1
  for (let i = 0; i < calls.length; i++) {
    const { from, to, method } = calls[i]
    const before = code.slice(copiedUpTo, from)
    line += before.split('\n').length - 1
    tagged += `${before}console.atLine(${line}).${method}`
    copiedUpTo = to
  }
  return tagged + code.slice(copiedUpTo)
}
