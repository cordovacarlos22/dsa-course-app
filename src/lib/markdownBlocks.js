// Lessons use two special kinds of fenced code blocks:
//
//   ```viz              → an animation; the block contains its name, e.g.
//   big-o-growth-chart     "big-o-growth-chart" (see src/visualizations/)
//   ```
//
//   ```js-run           → JavaScript the student can edit and run
//   console.log(1 + 1)
//   ```
//
// Plain JavaScript, so the app and the content validator share it.

export const VIZ_LANGUAGE = 'viz'
export const RUNNABLE_LANGUAGE = 'js-run'

const FENCED_BLOCK = /^```([\w-]*)[^\n]*\n([\s\S]*?)^```/gm

// Every fenced block in a Markdown text, as { language, code }.
export function extractFencedBlocks(markdown) {
  return [...markdown.matchAll(FENCED_BLOCK)].map((match) => ({
    language: match[1],
    code: match[2].replace(/\n$/, ''),
  }))
}
