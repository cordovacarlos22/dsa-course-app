// Checks every content/sections/*.json file before it reaches the app.
// Run with: npm run content:validate
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import vm from 'node:vm'
import { sectionSchema } from './content-schema.js'

const SECTIONS_DIR = 'content/sections'

// A buggy solution can loop forever, so each test gets a time limit.
const TEST_TIMEOUT_MS = 1000

// Runs one test in a separate JS context (node:vm) with a timeout.
// Note: node:vm is NOT a security sandbox. That's fine here because we only
// run our own reference solutions, never code typed by students.
// Args go in as JSON and the result comes out as JSON, so every test gets
// fresh copies and the values are plain objects we can compare.
function runTest(code, functionName, args) {
  const script = `${code}\nJSON.stringify(${functionName}(...JSON.parse(argsJson)))`
  const resultJson = vm.runInNewContext(
    script,
    { argsJson: JSON.stringify(args) },
    { timeout: TEST_TIMEOUT_MS },
  )
  return resultJson === undefined ? undefined : JSON.parse(resultJson)
}

// Runs the reference solution against every test, so we never ship
// an exercise whose own answer is wrong.
export function checkSolution(exercise) {
  const code = exercise.solution.javascript
  try {
    new vm.Script(code) // only checks the syntax, doesn't run anything
  } catch (error) {
    return [
      `exercise "${exercise.slug}": solution does not compile (${error.message})`,
    ]
  }

  const errors = []
  exercise.tests.forEach((test, index) => {
    try {
      const actual = runTest(code, exercise.functionName, test.args)
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

// A localized text is any object with an `en` string. Returns how many of
// them still have no Spanish translation, so the backlog stays visible.
export function countMissingSpanish(value) {
  if (Array.isArray(value)) {
    return value.reduce((total, item) => total + countMissingSpanish(item), 0)
  }
  if (value === null || typeof value !== 'object') return 0
  if (typeof value.en === 'string') return value.es ? 0 : 1

  return Object.values(value).reduce(
    (total, child) => total + countMissingSpanish(child),
    0,
  )
}

async function main() {
  const files = (await readdir(SECTIONS_DIR))
    .filter((name) => name.endsWith('.json'))
    .sort()
  let hasErrors = false
  let missingSpanish = 0

  for (const file of files) {
    const data = JSON.parse(await readFile(join(SECTIONS_DIR, file), 'utf8'))
    const errors = validateSection(data)

    // The file name must match the slug so it's easy to find a section's file.
    if (data.slug && file !== `${data.slug}.json`) {
      errors.push(`file name should be "${data.slug}.json"`)
    }

    missingSpanish += countMissingSpanish(data)

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
  if (missingSpanish > 0) {
    console.warn(`⚠ ${missingSpanish} texts still need a Spanish translation`)
  }
  if (hasErrors) process.exit(1)
}

// Only run main() when this file is executed directly, not when tests import it.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
}
