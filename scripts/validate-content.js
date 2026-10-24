// Checks every content/practice/*.json file before it reaches the app.
// Run with: npm run content:validate
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import vm from 'node:vm'
import {
  courseSchema,
  lessonChecksSchema,
  lessonFrontMatterSchema,
  practiceSchema,
} from './content-schema.js'
import { parseFrontMatter } from '../src/lib/frontMatter.js'
import { splitSteps } from '../src/lib/steps.js'
import {
  extractFencedBlocks,
  RUNNABLE_LANGUAGE,
  VIZ_LANGUAGE,
} from '../src/lib/markdownBlocks.js'
import { VISUALIZATION_NAMES } from '../src/visualizations/names.js'
// The same test logic the browser uses to grade students (shared on purpose).
import { deepEqual, playClassSteps } from '../src/runners/testHarness.js'

const PRACTICE_DIR = 'content/practice'
const COURSE_FILE = 'content/course.json'
const LESSONS_DIR = 'content/lessons'

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
    return deepEqual(actual, test.expected)
      ? []
      : [describeMismatch(test.expected, actual)]
  }
  const errors = []
  test.steps.forEach((step, stepIndex) => {
    if ('expected' in step && !deepEqual(actual[stepIndex], step.expected)) {
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

  // Every module must appear in exactly one section.
  const slugsInSections = result.data.sections.flatMap(
    (section) => section.modules,
  )
  for (const moduleSlug of slugsInSections) {
    if (!modules.some((module) => module.slug === moduleSlug)) {
      errors.push(`section lists "${moduleSlug}", which is not a module`)
    }
  }
  for (const moduleSlug of findDuplicates(slugsInSections)) {
    errors.push(`module "${moduleSlug}" is in more than one section`)
  }
  for (const module of modules) {
    if (!slugsInSections.includes(module.slug)) {
      errors.push(`module "${module.slug}" is not in any section`)
    }
  }
  return errors
}

// A practice file must belong to a module in the outline, with the same order.
export function checkPracticeInCourse(practice, course) {
  const module = course.modules.find((m) => m.slug === practice.slug)
  if (!module) return [`slug "${practice.slug}" is not a module in course.json`]
  if (module.order !== practice.order) {
    return [`order should be ${module.order} (as in course.json)`]
  }
  return []
}

// Returns a list of readable error messages. An empty list means the practice file is valid.
export function validatePractice(data) {
  const result = practiceSchema.safeParse(data)
  if (!result.success) return formatIssues(result.error)

  const practice = result.data
  const errors = []

  for (const id of findDuplicates(practice.questions.map((q) => q.id))) {
    errors.push(`duplicate question id "${id}"`)
  }
  for (const exerciseSlug of findDuplicates(
    practice.exercises.map((e) => e.slug),
  )) {
    errors.push(`duplicate exercise slug "${exerciseSlug}"`)
  }
  for (const exercise of practice.exercises) {
    errors.push(...checkSolution(exercise))
    const code = [
      ...Object.values(exercise.starterCode),
      ...Object.values(exercise.solution),
    ].join('\n')
    errors.push(
      ...findAdvancedLoops(code).map((error) => `${exercise.slug}: ${error}`),
    )
  }
  for (const question of practice.questions) {
    errors.push(
      ...findDuplicateOptions(question.options).map(
        (error) => `question "${question.id}" ${error}`,
      ),
    )
    if (!question.code) continue
    errors.push(
      ...findAdvancedLoops(question.code).map(
        (error) => `question "${question.id}": ${error}`,
      ),
    )
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

// "01-what-is-big-o.en.md" → { order: 1, slug: "01-what-is-big-o", language: "en" }
const LESSON_FILE_NAME = /^((\d{2})-[a-z0-9]+(?:-[a-z0-9]+)*)\.(en|es)\.md$/

// Checks one lesson file. An empty list means it's valid.
// Teaching code is written for people who only know basic JavaScript, so
// loops use an index: for (let i = 0; i < guests.length; i++) { guests[i] }.
// Returns a message when `code` uses a loop style beginners find harder.
const BEGINNER_LOOP_RULES = [
  { pattern: /for\s*\(\s*(const|let|var)\s+\w+\s+of\b/, name: 'for...of' },
  { pattern: /\.forEach\s*\(/, name: '.forEach' },
]
// Every option of a multiple-choice question must be different, in each
// language (two identical options usually means a typo or a broken script).
export function findDuplicateOptions(options) {
  const errors = []
  for (const language of ['en', 'es']) {
    const texts = options.map((option) => option[language]).filter(Boolean)
    if (new Set(texts).size !== texts.length) {
      errors.push(`has the same ${language} option twice`)
    }
  }
  return errors
}

export function findAdvancedLoops(code) {
  return BEGINNER_LOOP_RULES.filter(({ pattern }) => pattern.test(code)).map(
    ({ name }) =>
      `uses ${name}: write loops as for (let i = 0; i < list.length; i++)`,
  )
}

export function validateLesson({ moduleSlug, fileName, text }, course) {
  const errors = []
  if (!course.modules.some((module) => module.slug === moduleSlug)) {
    errors.push(`folder "${moduleSlug}" is not a module in course.json`)
  }

  const nameMatch = LESSON_FILE_NAME.exec(fileName)
  if (!nameMatch) {
    return [
      ...errors,
      'file name must look like "01-lesson-name.en.md" (or .es.md)',
    ]
  }

  const { data, body } = parseFrontMatter(text)
  const result = lessonFrontMatterSchema.safeParse(data)
  if (!result.success) {
    return [
      ...errors,
      ...formatIssues(result.error).map((e) => `front matter ${e}`),
    ]
  }
  if (result.data.order !== Number(nameMatch[2])) {
    errors.push(
      `order should be ${Number(nameMatch[2])} (it comes from the file name)`,
    )
  }

  for (const block of extractFencedBlocks(body)) {
    if (block.language === VIZ_LANGUAGE) {
      const name = block.code.trim()
      if (!VISUALIZATION_NAMES.includes(name)) {
        errors.push(
          `unknown animation "${name}" (known: ${VISUALIZATION_NAMES.join(', ')})`,
        )
      }
    }
    if (block.language === RUNNABLE_LANGUAGE) {
      try {
        new vm.Script(block.code) // only checks the syntax
      } catch (error) {
        errors.push(`js-run block does not compile (${error.message})`)
      }
      errors.push(
        ...findAdvancedLoops(block.code).map(
          (error) => `js-run block ${error}`,
        ),
      )
    }
  }
  return errors
}

// How many steps a lesson file has (every "## " heading starts one).
export function countSteps(lessonText) {
  return splitSteps(parseFrontMatter(lessonText).body).length
}

// Checks a lesson's checkpoints file against its lesson files.
// `stepCounts` is { en: 4, es: 4 }: the number of steps in each language.
export function validateLessonChecks(data, stepCounts) {
  const result = lessonChecksSchema.safeParse(data)
  if (!result.success) return formatIssues(result.error)

  const { steps } = result.data
  const errors = []
  for (const [language, count] of Object.entries(stepCounts)) {
    if (count !== steps.length) {
      errors.push(
        `the ${language} lesson has ${count} steps but there are ${steps.length} checkpoints`,
      )
    }
  }

  steps.forEach((checkpoint, index) => {
    const label = `checkpoint ${index + 1}`
    if (checkpoint.type === 'choice') {
      errors.push(
        ...findDuplicateOptions(checkpoint.options).map(
          (error) => `${label} ${error}`,
        ),
      )
      return
    }
    // The student checks their own explanation: there's no code to run.
    if (checkpoint.type === 'explain') return
    const teachingText = [
      checkpoint.starterCode,
      checkpoint.solution,
      ...Object.values(checkpoint.hint),
    ].join('\n')
    errors.push(
      ...findAdvancedLoops(teachingText).map((error) => `${label} ${error}`),
    )
    // Reuse the exercise checker: same test format, same sandbox.
    const asExercise = (code) => ({
      ...checkpoint,
      slug: label,
      solution: { javascript: code },
    })
    errors.push(...checkSolution(asExercise(checkpoint.solution)))

    try {
      new vm.Script(checkpoint.starterCode) // only checks the syntax
    } catch (error) {
      errors.push(`${label}: starter code does not compile (${error.message})`)
      return
    }
    // A checkpoint the starter code already passes doesn't check anything.
    if (checkSolution(asExercise(checkpoint.starterCode)).length === 0) {
      errors.push(`${label}: the starter code already passes every test`)
    }
  })
  return errors
}

// macOS / iCloud sometimes copies a file as "name 2.ext". git, ESLint and
// Prettier already ignore those copies; the validator skips them too.
export function isIcloudDuplicate(fileName) {
  return / \d+\.[^.]+$/.test(fileName)
}

// English is written first: every Spanish lesson needs its English original.
export function findLessonsMissingEnglish(fileNames) {
  return fileNames
    .filter((name) => name.endsWith('.es.md'))
    .filter((name) => !fileNames.includes(name.replace(/\.es\.md$/, '.en.md')))
}

async function validateAllLessons(course) {
  let moduleFolders
  try {
    moduleFolders = (await readdir(LESSONS_DIR, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
  } catch {
    return { lessonCount: 0, checkpointCount: 0, hasErrors: false } // no lessons folder yet
  }

  let lessonCount = 0
  let checkpointCount = 0
  let hasErrors = false
  for (const moduleSlug of moduleFolders) {
    const folder = join(LESSONS_DIR, moduleSlug)
    const allFiles = (await readdir(folder)).filter(
      (name) => !isIcloudDuplicate(name),
    )
    const fileNames = allFiles.filter((name) => name.endsWith('.md'))
    const checksFiles = allFiles.filter((name) => name.endsWith('.checks.json'))

    for (const fileName of fileNames.sort()) {
      const text = await readFile(join(folder, fileName), 'utf8')
      const errors = validateLesson({ moduleSlug, fileName, text }, course)
      lessonCount++
      if (errors.length > 0) {
        hasErrors = true
        console.error(`✗ lessons/${moduleSlug}/${fileName}`)
        errors.forEach((error) => console.error(`    - ${error}`))
      }
    }
    for (const checksName of checksFiles) {
      const lessonBase = checksName.replace(/\.checks\.json$/, '')
      const stepCounts = {}
      for (const language of ['en', 'es']) {
        const lessonFile = `${lessonBase}.${language}.md`
        if (fileNames.includes(lessonFile)) {
          stepCounts[language] = countSteps(
            await readFile(join(folder, lessonFile), 'utf8'),
          )
        }
      }
      const data = JSON.parse(await readFile(join(folder, checksName), 'utf8'))
      const errors =
        Object.keys(stepCounts).length === 0
          ? [`no lesson file "${lessonBase}.en.md" for these checkpoints`]
          : validateLessonChecks(data, stepCounts)
      checkpointCount += data.steps?.length ?? 0
      if (errors.length > 0) {
        hasErrors = true
        console.error(`✗ lessons/${moduleSlug}/${checksName}`)
        errors.forEach((error) => console.error(`    - ${error}`))
      }
    }
    for (const fileName of findLessonsMissingEnglish(fileNames)) {
      hasErrors = true
      console.error(`✗ lessons/${moduleSlug}/${fileName}`)
      console.error('    - has no English version (.en.md)')
    }
  }
  return { lessonCount, checkpointCount, hasErrors }
}

function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

// e.g. "12 questions, 1 exercise, all solutions pass"
function describePractice(practice) {
  const summary = [
    plural(practice.questions.length, 'question'),
    plural(practice.exercises.length, 'exercise'),
  ]
  if (practice.exercises.length > 0) summary.push('all solutions pass')
  return summary.join(', ')
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

  const files = (await readdir(PRACTICE_DIR))
    .filter((name) => name.endsWith('.json') && !isIcloudDuplicate(name))
    .sort()
  let hasErrors = false
  let missingSpanish = countMissingSpanish(course)

  for (const file of files) {
    const data = JSON.parse(await readFile(join(PRACTICE_DIR, file), 'utf8'))
    const errors = validatePractice(data)
    if (errors.length === 0) errors.push(...checkPracticeInCourse(data, course))

    // The file name must match the slug so it's easy to find a module's practice file.
    if (data.slug && file !== `${data.slug}.json`) {
      errors.push(`file name should be "${data.slug}.json"`)
    }

    missingSpanish += countMissingSpanish(data)

    if (errors.length > 0) {
      hasErrors = true
      console.error(`✗ ${file}`)
      errors.forEach((error) => console.error(`    - ${error}`))
    } else {
      console.log(`✓ ${file} (${describePractice(data)})`)
    }
  }

  if (files.length === 0) console.log('No practice files found.')

  const lessons = await validateAllLessons(course)
  if (lessons.hasErrors) hasErrors = true
  else {
    console.log(
      `✓ lessons (${plural(lessons.lessonCount, 'file')}, ${plural(lessons.checkpointCount, 'checkpoint')})`,
    )
  }

  if (missingSpanish > 0) {
    console.warn(`⚠ ${missingSpanish} texts still need a Spanish translation`)
  }
  if (hasErrors) process.exit(1)
}

// Only run main() when this file is executed directly, not when tests import it.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
}
