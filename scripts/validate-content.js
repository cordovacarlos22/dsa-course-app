// Checks every content/sections/*.json file before it reaches the app.
// Run with: npm run content:validate
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import vm from 'node:vm'
import { courseSchema, sectionSchema } from './content-schema.js'

const SECTIONS_DIR = 'content/sections'
const COURSE_FILE = 'content/course.json'

// A buggy solution can loop forever, so each test gets a time limit.
const TEST_TIMEOUT_MS = 1000

// Runs a script in a separate JS context (node:vm) with a timeout.
// Note: node:vm is NOT a security sandbox. That's fine here because we only
// run our own reference solutions, never code typed by students.
// Values go in and come out as JSON, so every test gets fresh copies and the
// results are plain objects we can compare.
function runInSandbox(script, inputs) {
  const resultJson = vm.runInNewContext(script, inputs, {
    timeout: TEST_TIMEOUT_MS,
  })
  return resultJson === undefined ? undefined : JSON.parse(resultJson)
}

function runFunctionTest(code, functionName, args) {
  return runInSandbox(
    `${code}\nJSON.stringify(${functionName}(...JSON.parse(argsJson)))`,
    { argsJson: JSON.stringify(args) },
  )
}

// This function runs INSIDE the sandbox (we send its source code there).
// It plays the steps of one class test and returns what each step produced.
function playClassSteps(TheClass, steps) {
  let instance
  const results = steps.map((step) => {
    if ('create' in step) {
      instance = new TheClass(...step.create)
      return null
    }
    let value
    if ('call' in step) {
      if (typeof instance[step.call] !== 'function') {
        throw new Error(`method "${step.call}" does not exist`)
      }
      value = instance[step.call](...step.args)
    } else {
      // "head.value" → instance.head.value (undefined if a link is missing)
      value = step.read.split('.').reduce((obj, key) => obj?.[key], instance)
    }
    // Only keep values we'll compare: a method that returns `this` could
    // point back to itself, and that can't be turned into JSON.
    return 'expected' in step ? value : null
  })
  return JSON.stringify(results)
}

function runClassTest(code, className, steps) {
  return runInSandbox(
    `${code}\n(${playClassSteps.toString()})(${className}, JSON.parse(stepsJson))`,
    { stepsJson: JSON.stringify(steps) },
  )
}

function describeMismatch(expected, actual) {
  return `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
}

// Compares one test's result(s) with what the test expects.
// Returns error messages (empty list = the test passed).
function compareResults(exercise, test, actual) {
  if (exercise.kind === 'function') {
    return isDeepStrictEqual(actual, test.expected)
      ? []
      : [describeMismatch(test.expected, actual)]
  }
  const errors = []
  test.steps.forEach((step, stepIndex) => {
    if (
      'expected' in step &&
      !isDeepStrictEqual(actual[stepIndex], step.expected)
    ) {
      errors.push(
        `step ${stepIndex + 1}: ${describeMismatch(step.expected, actual[stepIndex])}`,
      )
    }
  })
  return errors
}

function runOneTest(exercise, test) {
  const code = exercise.solution.javascript
  return exercise.kind === 'function'
    ? runFunctionTest(code, exercise.functionName, test.args)
    : runClassTest(code, exercise.className, test.steps)
}

// Runs the reference solution against every test, so we never ship
// an exercise whose own answer is wrong.
export function checkSolution(exercise) {
  try {
    new vm.Script(exercise.solution.javascript) // only checks the syntax
  } catch (error) {
    return [
      `exercise "${exercise.slug}": solution does not compile (${error.message})`,
    ]
  }

  const errors = []
  exercise.tests.forEach((test, index) => {
    const label = `exercise "${exercise.slug}" test ${index + 1}`
    try {
      const actual = runOneTest(exercise, test)
      for (const problem of compareResults(exercise, test, actual)) {
        errors.push(`${label}: ${problem}`)
      }
    } catch (error) {
      errors.push(`${label}: threw ${error.message}`)
    }
  })
  return errors
}

function findDuplicates(values) {
  return values.filter((value, index) => values.indexOf(value) !== index)
}

function formatIssues(zodError) {
  return zodError.issues.map(
    (issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`,
  )
}

// Checks the course outline. An empty list means it's valid.
export function validateCourse(data) {
  const result = courseSchema.safeParse(data)
  if (!result.success) return formatIssues(result.error)

  const { modules } = result.data
  const errors = []
  for (const moduleSlug of findDuplicates(modules.map((m) => m.slug))) {
    errors.push(`duplicate module slug "${moduleSlug}"`)
  }
  modules.forEach((module, index) => {
    // Orders must be 1, 2, 3… so the app can show modules in sequence.
    if (module.order !== index + 1) {
      errors.push(`module "${module.slug}" should have order ${index + 1}`)
    }
  })
  return errors
}

// A section must belong to a module in the outline, with the same order.
export function checkSectionInCourse(section, course) {
  const module = course.modules.find((m) => m.slug === section.slug)
  if (!module) return [`slug "${section.slug}" is not a module in course.json`]
  if (module.order !== section.order) {
    return [`order should be ${module.order} (as in course.json)`]
  }
  return []
}

// Returns a list of readable error messages. An empty list means the section is valid.
export function validateSection(data) {
  const result = sectionSchema.safeParse(data)
  if (!result.success) return formatIssues(result.error)

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
  const course = JSON.parse(await readFile(COURSE_FILE, 'utf8'))
  const courseErrors = validateCourse(course)
  if (courseErrors.length > 0) {
    console.error('✗ course.json')
    courseErrors.forEach((error) => console.error(`    - ${error}`))
    process.exit(1)
  }
  console.log(`✓ course.json (${course.modules.length} modules)`)

  const files = (await readdir(SECTIONS_DIR))
    .filter((name) => name.endsWith('.json'))
    .sort()
  let hasErrors = false
  let missingSpanish = countMissingSpanish(course)

  for (const file of files) {
    const data = JSON.parse(await readFile(join(SECTIONS_DIR, file), 'utf8'))
    const errors = validateSection(data)
    if (errors.length === 0) errors.push(...checkSectionInCourse(data, course))

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
