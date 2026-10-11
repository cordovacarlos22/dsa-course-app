// Checks every content/sections/*.json file before it reaches the app.
// Run with: npm run content:validate
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import { sectionSchema } from './content-schema.js'

const SECTIONS_DIR = 'content/sections'

// Turns the solution source code into a real function we can call.
function loadFunction(code, functionName) {
  return new Function(`${code}\nreturn ${functionName}`)()
}

// Runs the reference solution against every test, so we never ship
// an exercise whose own answer is wrong.
export function checkSolution(exercise) {
  const errors = []
  let solve
  try {
    solve = loadFunction(exercise.solution.javascript, exercise.functionName)
  } catch (error) {
    return [
      `exercise "${exercise.slug}": solution does not compile (${error.message})`,
    ]
  }

  exercise.tests.forEach((test, index) => {
    // Copy the args so a solution that changes its input can't affect other tests.
    const args = structuredClone(test.args)
    try {
      const actual = solve(...args)
      if (!isDeepStrictEqual(actual, test.expected)) {
        errors.push(
          `exercise "${exercise.slug}" test ${index + 1}: expected ${JSON.stringify(test.expected)}, got ${JSON.stringify(actual)}`,
        )
      }
    } catch (error) {
      errors.push(
        `exercise "${exercise.slug}" test ${index + 1}: threw ${error.message}`,
      )
    }
  })
  return errors
}

function findDuplicates(values) {
  return values.filter((value, index) => values.indexOf(value) !== index)
}

// Returns a list of readable error messages. An empty list means the section is valid.
export function validateSection(data) {
  const result = sectionSchema.safeParse(data)
  if (!result.success) {
    return result.error.issues.map(
      (issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`,
    )
  }

  const section = result.data
  const errors = []

  for (const id of findDuplicates(section.questions.map((q) => q.id))) {
    errors.push(`duplicate question id "${id}"`)
  }
  for (const exerciseSlug of findDuplicates(
    section.exercises.map((e) => e.slug),
  )) {
    errors.push(`duplicate exercise slug "${exerciseSlug}"`)
  }
  for (const exercise of section.exercises) {
    errors.push(...checkSolution(exercise))
  }
  return errors
}

async function main() {
  const files = (await readdir(SECTIONS_DIR))
    .filter((name) => name.endsWith('.json'))
    .sort()
  let hasErrors = false

  for (const file of files) {
    const data = JSON.parse(await readFile(join(SECTIONS_DIR, file), 'utf8'))
    const errors = validateSection(data)

    // The file name must match the slug so it's easy to find a section's file.
    if (data.slug && file !== `${data.slug}.json`) {
      errors.push(`file name should be "${data.slug}.json"`)
    }

    if (errors.length > 0) {
      hasErrors = true
      console.error(`✗ ${file}`)
      errors.forEach((error) => console.error(`    - ${error}`))
    } else {
      console.log(
        `✓ ${file} (${data.questions.length} questions, ${data.exercises.length} exercises, all solutions pass)`,
      )
    }
  }

  if (files.length === 0) console.log('No section files found.')
  if (hasErrors) process.exit(1)
}

// Only run main() when this file is executed directly, not when tests import it.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
}
