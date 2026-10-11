// Splits a lesson's Markdown into steps: every "## Heading" starts a new step.
// Text before the first "##" (the lesson's goal line) belongs to step 1.
// Headings inside code fences don't count. Plain JavaScript, so the app and
// scripts/validate-content.js split lessons exactly the same way.

const FENCE = /^\s*```/
const STEP_HEADING = /^## +(.+)$/

// Returns [{ title, body }]. `title` is null when a step has no heading
// (only possible for a lesson without any "##").
export function splitSteps(markdown) {
  const steps = []
  let intro = []
  let current = null
  let insideFence = false

  for (const line of markdown.split('\n')) {
    if (FENCE.test(line)) insideFence = !insideFence
    const heading = insideFence ? null : STEP_HEADING.exec(line)

    if (heading) {
      if (current) steps.push(current)
      current = { title: heading[1].trim(), lines: [...intro] }
      intro = []
    } else if (current) {
      current.lines.push(line)
    } else {
      intro.push(line)
    }
  }
  if (current) steps.push(current)
  if (steps.length === 0) steps.push({ title: null, lines: intro })

  return steps.map(({ title, lines }) => ({
    title,
    body: lines.join('\n').trim(),
  }))
}
