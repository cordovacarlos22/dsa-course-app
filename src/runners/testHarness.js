// Runs a solution against tests and explains each result in plain words.
// Shared by the browser (Web Worker, for students) and by
// scripts/validate-content.js (for our own reference solutions), so a test
// means exactly the same thing in both places.
//
// Two kinds of tests, the same format as exercises in content/practice/:
// - function: { args: [...], expected }        → call fn(...args)
// - class:    { steps: [{ create }, { call, args, expected? }, { read, expected }] }

// Compares JSON-like values (numbers, strings, booleans, null, arrays, plain
// objects). Test data comes from JSON, so that's all we need.
export function deepEqual(a, b) {
  if (a === b) return true
  if (typeof a !== typeof b || a === null || b === null) return false
  if (typeof a !== 'object') return Number.isNaN(a) && Number.isNaN(b)
  if (Array.isArray(a) !== Array.isArray(b)) return false
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  return keysA.every((key) => deepEqual(a[key], b[key]))
}

// How a value looks in a message: "abc" with quotes, arrays as [1,2].
export function show(value) {
  return value === undefined ? 'undefined' : JSON.stringify(value)
}

function showArgs(args) {
  return args.map(show).join(', ')
}

// Plays the steps of one class test on one instance and returns what each
// step produced (null for steps without an `expected`).
// IMPORTANT: this function must not use anything from outside its own body,
// because the validator sends its source code into a node:vm sandbox.
export function playClassSteps(TheClass, steps) {
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
      value = instance[step.call](...(step.args ?? []))
    } else {
      value = step.read.split('.').reduce((obj, key) => obj?.[key], instance)
    }
    // Only keep values we'll compare: a method that returns `this` could
    // point back to itself, and that can't be turned into JSON.
    return 'expected' in step ? value : null
  })
  return JSON.stringify(results)
}

function describeStep(step, className) {
  if ('call' in step) return `${step.call}(${showArgs(step.args ?? [])})`
  return `${className}.${step.read}`
}

// Checks the values produced by the code against the tests.
// `produce(test)` returns the actual value(s) for one test: the function's
// return value, or (for classes) the array returned by playClassSteps.
// Returns [{ ok, message }], one entry per test.
export function gradeTests(checkpoint, produce) {
  const name = checkpoint.functionName ?? checkpoint.className
  return checkpoint.tests.map((test) => {
    try {
      const actual = produce(test)
      if (checkpoint.kind !== 'class') {
        const call = `${name}(${showArgs(test.args)})`
        return deepEqual(actual, test.expected)
          ? { ok: true, message: `${call} returned ${show(actual)}` }
          : {
              ok: false,
              message: `${call} should return ${show(test.expected)}, but returned ${show(actual)}`,
            }
      }
      const mismatch = test.steps.findIndex(
        (step, index) =>
          'expected' in step && !deepEqual(actual[index], step.expected),
      )
      if (mismatch === -1) {
        return {
          ok: true,
          message: `new ${name}(${showArgs(test.steps[0].create)}) worked as expected`,
        }
      }
      const step = test.steps[mismatch]
      return {
        ok: false,
        message: `${describeStep(step, name)} should be ${show(step.expected)}, but was ${show(actual[mismatch])}`,
      }
    } catch (error) {
      return {
        ok: false,
        message: `${error.name ?? 'Error'}: ${error.message}`,
      }
    }
  })
}

// Loads the student's function or class from their code, without running
// anything else twice. `console` is passed in so their logs can be captured.
export function loadSubject(code, checkpoint, fakeConsole) {
  const name = checkpoint.functionName ?? checkpoint.className
  // typeof check: a missing name gives a friendly error instead of a crash.
  const subject = new Function(
    'console',
    `${code}\nreturn typeof ${name} === 'undefined' ? undefined : ${name}`,
  )(fakeConsole)
  if (subject === undefined) {
    throw new Error(
      `${checkpoint.kind === 'class' ? 'Class' : 'Function'} "${name}" was not found. Did you rename it?`,
    )
  }
  return subject
}

// Runs every test of a checkpoint in the current JavaScript context
// (the browser's Web Worker). Returns { passed, results }.
export function runCheckpointTests(code, checkpoint, fakeConsole) {
  const subject = loadSubject(code, checkpoint, fakeConsole)
  const results = gradeTests(checkpoint, (test) => {
    // structuredClone: a solution that changes its input can't affect the next test.
    if (checkpoint.kind === 'class') {
      return JSON.parse(playClassSteps(subject, structuredClone(test.steps)))
    }
    return subject(...structuredClone(test.args))
  })
  return { passed: results.every((result) => result.ok), results }
}
