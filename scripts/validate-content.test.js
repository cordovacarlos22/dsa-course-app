// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  checkPracticeInCourse,
  countMissingSpanish,
  countSteps,
  findAdvancedLoops,
  findDuplicateOptions,
  findLessonsMissingEnglish,
  isIcloudDuplicate,
  validateCourse,
  validateLesson,
  validateLessonChecks,
  validatePractice,
} from './validate-content.js'

const text = (en) => ({ en, es: `${en} (es)` })

// A small practice file that passes every rule. Each test breaks one thing.
function makeValidPractice() {
  return {
    slug: '99-sample',
    order: 99,
    title: text('Sample'),
    sourceFolder: 'Module 99 - Sample',
    questions: [
      {
        id: 'q1',
        topic: 'Basics',
        prompt: text('What is 1 + 1?'),
        options: [text('1'), text('2'), text('3'), text('4')],
        correctIndex: 1,
        explanation: text('1 + 1 = 2'),
      },
    ],
    exercises: [
      {
        slug: 'add',
        title: text('Add'),
        description: text('Return a + b.'),
        difficulty: 'easy',
        category: 'interview',
        functionName: 'add',
        starterCode: { javascript: 'function add(a, b) {\n}' },
        solution: { javascript: 'function add(a, b) { return a + b }' },
        tests: [
          { args: [1, 2], expected: 3 },
          { args: [0, 0], expected: 0 },
          { args: [-1, 1], expected: 0 },
          { args: [10, 5], expected: 15 },
          { args: [2, 2], expected: 4 },
        ],
        expectedComplexity: { time: 'O(1)', space: 'O(1)' },
      },
    ],
  }
}

describe('validatePractice', () => {
  it('accepts a valid practice file', () => {
    expect(validatePractice(makeValidPractice())).toEqual([])
  })

  it('accepts a module that draws on two course folders', () => {
    const practice = makeValidPractice()
    practice.sourceFolder = [
      'course 1 /Section 2 - Big o ',
      'course 2/section 2 - big o ',
    ]
    expect(validatePractice(practice)).toEqual([])
  })

  it('rejects an empty list of source folders', () => {
    const practice = makeValidPractice()
    practice.sourceFolder = []
    expect(validatePractice(practice)).toEqual([
      expect.stringContaining('sourceFolder'),
    ])
  })

  it('rejects a missing English text', () => {
    const practice = makeValidPractice()
    delete practice.questions[0].prompt.en
    expect(validatePractice(practice)).toEqual([
      expect.stringContaining('questions.0.prompt.en'),
    ])
  })

  it('accepts a missing Spanish translation (English first)', () => {
    const practice = makeValidPractice()
    delete practice.questions[0].prompt.es
    expect(validatePractice(practice)).toEqual([])
  })

  it('rejects an exercise without a valid category', () => {
    const practice = makeValidPractice()
    practice.exercises[0].category = 'homework'
    expect(validatePractice(practice)).toEqual([
      expect.stringContaining('exercises.0'),
    ])
  })

  it('rejects a question with only 3 options', () => {
    const practice = makeValidPractice()
    practice.questions[0].options.pop()
    expect(validatePractice(practice)).toEqual([
      expect.stringContaining('exactly 4 options'),
    ])
  })

  it('rejects a correctIndex outside 0-3', () => {
    const practice = makeValidPractice()
    practice.questions[0].correctIndex = 4
    expect(validatePractice(practice)).toEqual([
      expect.stringContaining('questions.0.correctIndex'),
    ])
  })

  it('rejects duplicate question ids', () => {
    const practice = makeValidPractice()
    practice.questions.push({ ...practice.questions[0] })
    expect(validatePractice(practice)).toEqual(['duplicate question id "q1"'])
  })

  it('rejects a solution that fails its tests', () => {
    const practice = makeValidPractice()
    practice.exercises[0].solution.javascript =
      'function add(a, b) { return a - b }'
    const errors = validatePractice(practice)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0]).toContain('exercise "add" test 1: expected 3, got -1')
  })

  it('stops a solution that loops forever', () => {
    const practice = makeValidPractice()
    practice.exercises[0].solution.javascript =
      'function add(a, b) { while (true) {} }'
    const errors = validatePractice(practice)
    expect(errors).toHaveLength(5)
    expect(errors[0]).toContain('timed out')
  }, 15_000)

  it('rejects a solution that does not compile', () => {
    const practice = makeValidPractice()
    practice.exercises[0].solution.javascript =
      'function add(a, b) { return a + }'
    expect(validatePractice(practice)).toEqual([
      expect.stringContaining('solution does not compile'),
    ])
  })
})

describe('countMissingSpanish', () => {
  it('counts every text that has English but no Spanish', () => {
    const practice = makeValidPractice()
    expect(countMissingSpanish(practice)).toBe(0)

    delete practice.title.es
    delete practice.questions[0].options[2].es
    expect(countMissingSpanish(practice)).toBe(2)
  })
})

function makeValidCourse() {
  return {
    slug: 'sample-course',
    title: text('Sample course'),
    description: text('A course for tests'),
    modules: [
      { slug: '01-intro', order: 1, title: text('Intro'), sourceFolder: 'a' },
      { slug: '02-next', order: 2, title: text('Next'), sourceFolder: 'b' },
    ],
    sections: [
      {
        slug: 'basics',
        title: text('Basics'),
        modules: ['01-intro', '02-next'],
      },
    ],
  }
}

describe('validateCourse', () => {
  it('accepts a valid outline', () => {
    expect(validateCourse(makeValidCourse())).toEqual([])
  })

  it('rejects modules that are out of order', () => {
    const course = makeValidCourse()
    course.modules[1].order = 3
    expect(validateCourse(course)).toEqual([
      'module "02-next" should have order 2',
    ])
  })

  it('rejects a module that is not in any section', () => {
    const course = makeValidCourse()
    course.sections[0].modules = ['01-intro']
    expect(validateCourse(course)).toEqual([
      'module "02-next" is not in any section',
    ])
  })

  it('rejects a module listed in two sections', () => {
    const course = makeValidCourse()
    course.sections.push({
      slug: 'more',
      title: text('More'),
      modules: ['02-next'],
    })
    expect(validateCourse(course)).toEqual([
      'module "02-next" is in more than one section',
    ])
  })

  it('rejects a section that lists a module that does not exist', () => {
    const course = makeValidCourse()
    course.sections[0].modules.push('99-ghost')
    expect(validateCourse(course)).toEqual([
      'section lists "99-ghost", which is not a module',
    ])
  })

  it('rejects duplicate module slugs', () => {
    const course = makeValidCourse()
    course.modules[1].slug = '01-intro'
    expect(validateCourse(course)).toContain('duplicate module slug "01-intro"')
  })
})

describe('checkPracticeInCourse', () => {
  it('accepts a practice file that matches a module', () => {
    const practice = { slug: '02-next', order: 2 }
    expect(checkPracticeInCourse(practice, makeValidCourse())).toEqual([])
  })

  it('rejects a practice file whose slug is not in the outline', () => {
    const practice = { slug: '99-sample', order: 99 }
    expect(checkPracticeInCourse(practice, makeValidCourse())).toEqual([
      'slug "99-sample" is not a module in course.json',
    ])
  })

  it('rejects a practice file with a different order', () => {
    const practice = { slug: '02-next', order: 5 }
    expect(checkPracticeInCourse(practice, makeValidCourse())).toEqual([
      'order should be 2 (as in course.json)',
    ])
  })
})

// A practice whose only exercise is a class with 5 step-based tests.
function makeClassPractice() {
  const practice = makeValidPractice()
  const createAndRead = (start) => ({
    steps: [
      { create: [start] },
      { call: 'increment' },
      { read: 'count', expected: start + 1 },
    ],
  })
  practice.exercises = [
    {
      slug: 'counter',
      kind: 'class',
      title: text('Counter'),
      description: text('Build a Counter class.'),
      difficulty: 'easy',
      category: 'build',
      className: 'Counter',
      starterCode: { javascript: 'class Counter {\n}' },
      solution: {
        javascript:
          'class Counter {\n  constructor(start) { this.count = start }\n  increment() { this.count++; return this.count }\n}',
      },
      tests: [
        createAndRead(0),
        createAndRead(5),
        createAndRead(-1),
        createAndRead(99),
        {
          steps: [
            { create: [1] },
            { call: 'increment', args: [], expected: 2 },
            { call: 'increment', expected: 3 },
          ],
        },
      ],
      expectedComplexity: { time: 'O(1)', space: 'O(1)' },
    },
  ]
  return practice
}

describe('class exercises', () => {
  it('accepts a class solution that passes every step', () => {
    expect(validatePractice(makeClassPractice())).toEqual([])
  })

  it('reports the step that got a wrong value', () => {
    const practice = makeClassPractice()
    practice.exercises[0].tests[4].steps[2].expected = 4
    expect(validatePractice(practice)).toEqual([
      'exercise "counter" test 5: step 3: expected 4, got 3',
    ])
  })

  it('reports a method that does not exist', () => {
    const practice = makeClassPractice()
    practice.exercises[0].solution.javascript =
      'class Counter { constructor(start) { this.count = start } }'
    const errors = validatePractice(practice)
    expect(errors).toHaveLength(5)
    expect(errors[0]).toContain('method "increment" does not exist')
  })

  it('stops a method that loops forever', () => {
    const practice = makeClassPractice()
    practice.exercises[0].tests = practice.exercises[0].tests.slice(0, 5)
    practice.exercises[0].solution.javascript =
      'class Counter { constructor(start) { this.count = start } increment() { while (true) {} } }'
    const errors = validatePractice(practice)
    expect(errors[0]).toContain('timed out')
  }, 15_000)

  it('requires the first step to create the instance', () => {
    const practice = makeClassPractice()
    practice.exercises[0].tests[0].steps.shift()
    expect(validatePractice(practice)).toEqual([
      expect.stringContaining('the first step must be { create: [...] }'),
    ])
  })
})

// A lesson in module "01-intro" of makeValidCourse(), with every feature.
function makeLesson(overrides = {}) {
  return {
    moduleSlug: '01-intro',
    fileName: '02-sample-lesson.en.md',
    text: [
      '---',
      'title: A sample lesson',
      'order: 2',
      'minutes: 5',
      '---',
      '',
      'Some text.',
      '',
      '```viz',
      'big-o-growth-chart',
      '```',
      '',
      '```js-run',
      'console.log(1 + 1)',
      '```',
    ].join('\n'),
    ...overrides,
  }
}

describe('validateLesson', () => {
  it('accepts a valid lesson', () => {
    expect(validateLesson(makeLesson(), makeValidCourse())).toEqual([])
  })

  it('rejects a lesson in a folder that is not a module', () => {
    const lesson = makeLesson({ moduleSlug: '99-nope' })
    expect(validateLesson(lesson, makeValidCourse())).toEqual([
      'folder "99-nope" is not a module in course.json',
    ])
  })

  it('rejects a badly named file', () => {
    const lesson = makeLesson({ fileName: 'sample.md' })
    expect(validateLesson(lesson, makeValidCourse())).toEqual([
      expect.stringContaining('file name must look like'),
    ])
  })

  it('rejects missing front matter fields', () => {
    const lesson = makeLesson({ text: '---\ntitle: No order\n---\nText' })
    const errors = validateLesson(lesson, makeValidCourse())
    expect(errors).toEqual([
      expect.stringContaining('front matter order'),
      expect.stringContaining('front matter minutes'),
    ])
  })

  it('rejects an order that does not match the file name', () => {
    const lesson = makeLesson({ fileName: '03-sample-lesson.en.md' })
    expect(validateLesson(lesson, makeValidCourse())).toEqual([
      'order should be 3 (it comes from the file name)',
    ])
  })

  it('rejects an animation that does not exist', () => {
    const lesson = makeLesson()
    lesson.text = lesson.text.replace('big-o-growth-chart', 'dancing-tree')
    expect(validateLesson(lesson, makeValidCourse())).toEqual([
      expect.stringContaining('unknown animation "dancing-tree"'),
    ])
  })

  it('rejects runnable code that does not compile', () => {
    const lesson = makeLesson()
    lesson.text = lesson.text.replace('console.log(1 + 1)', 'console.log(')
    expect(validateLesson(lesson, makeValidCourse())).toEqual([
      expect.stringContaining('js-run block does not compile'),
    ])
  })
})

describe('isIcloudDuplicate', () => {
  it('spots the copies macOS / iCloud make', () => {
    expect(isIcloudDuplicate('17-wrap-up.es 2.md')).toBe(true)
    expect(isIcloudDuplicate('01-why-big-o.checks 3.json')).toBe(true)
    expect(isIcloudDuplicate('big-o 2.json')).toBe(true)
  })

  it('keeps real lesson and practice files', () => {
    expect(isIcloudDuplicate('17-wrap-up.es.md')).toBe(false)
    expect(isIcloudDuplicate('01-why-big-o.checks.json')).toBe(false)
    expect(isIcloudDuplicate('big-o.json')).toBe(false)
  })
})

describe('findLessonsMissingEnglish', () => {
  it('finds Spanish lessons without an English original', () => {
    expect(
      findLessonsMissingEnglish([
        '01-a.en.md',
        '01-a.es.md',
        '02-b.es.md',
        '03-c.en.md',
      ]),
    ).toEqual(['02-b.es.md'])
  })
})

// A checks file with one choice and one code checkpoint that passes every rule.
function makeValidChecks() {
  return {
    steps: [
      {
        type: 'choice',
        question: text('Which is faster for big lists?'),
        options: [text('O(n)'), text('O(1)')],
        answer: 1,
        hint: text('Count the steps.'),
        explanation: text('O(1) does not grow.'),
      },
      {
        type: 'code',
        task: text('Return true when n is even.'),
        hint: text('Use %.'),
        starterCode: 'function isEven(n) {\n  // your code\n}',
        solution: 'function isEven(n) {\n  return n % 2 === 0\n}',
        kind: 'function',
        functionName: 'isEven',
        tests: [
          { args: [2], expected: true },
          { args: [3], expected: false },
        ],
      },
    ],
  }
}

describe('countSteps', () => {
  it('counts the ## headings after the front matter', () => {
    const lesson =
      '---\ntitle: A\norder: 1\nminutes: 3\n---\nGoal\n## One\nx\n## Two\ny'
    expect(countSteps(lesson)).toBe(2)
  })
})

describe('validateLessonChecks', () => {
  it('accepts valid checkpoints', () => {
    expect(validateLessonChecks(makeValidChecks(), { en: 2, es: 2 })).toEqual(
      [],
    )
  })

  it('needs one checkpoint per step in every language', () => {
    const errors = validateLessonChecks(makeValidChecks(), { en: 2, es: 3 })
    expect(errors).toEqual([
      'the es lesson has 3 steps but there are 2 checkpoints',
    ])
  })

  it('rejects a choice answer that is not one of the options', () => {
    const checks = makeValidChecks()
    checks.steps[0].answer = 5
    expect(validateLessonChecks(checks, { en: 2 }).join()).toMatch(/answer/)
  })

  it('fails when the solution does not pass its tests', () => {
    const checks = makeValidChecks()
    checks.steps[1].solution = 'function isEven(n) { return true }'
    expect(validateLessonChecks(checks, { en: 2 }).join()).toMatch(
      /checkpoint 2/,
    )
  })

  it('fails when the starter code already passes', () => {
    const checks = makeValidChecks()
    checks.steps[1].starterCode = checks.steps[1].solution
    expect(validateLessonChecks(checks, { en: 2 })).toEqual([
      'checkpoint 2: the starter code already passes every test',
    ])
  })

  it('fails when the starter code does not compile', () => {
    const checks = makeValidChecks()
    checks.steps[1].starterCode = 'function isEven(n) {'
    expect(validateLessonChecks(checks, { en: 2 }).join()).toMatch(
      /starter code does not compile/,
    )
  })
})

describe('findAdvancedLoops', () => {
  it('accepts indexed loops', () => {
    expect(
      findAdvancedLoops('for (let i = 0; i < guests.length; i++) {}'),
    ).toEqual([])
  })

  it('rejects for...of and forEach', () => {
    expect(findAdvancedLoops('for (const guest of guests) {}')).toHaveLength(1)
    expect(findAdvancedLoops('guests.forEach((g) => g)')).toHaveLength(1)
  })

  it('is applied to a checkpoint solution', () => {
    const checks = makeValidChecks()
    checks.steps[1].solution =
      'function isEven(n) {\n  for (const x of [n]) return x % 2 === 0\n}'
    expect(validateLessonChecks(checks, { en: 2 }).join()).toMatch(
      /for\.\.\.of/,
    )
  })
})

describe('findDuplicateOptions', () => {
  it('accepts options that are all different', () => {
    expect(findDuplicateOptions([text('O(1)'), text('O(n)')])).toEqual([])
  })

  it('rejects a question whose options repeat', () => {
    const broken = [
      { en: 'en', es: 'es' },
      { en: 'en', es: 'es' },
    ]
    expect(findDuplicateOptions(broken)).toHaveLength(2)
  })

  it('is applied to lesson checkpoints', () => {
    const checks = makeValidChecks()
    checks.steps[0].options = [text('Same'), text('Same')]
    expect(validateLessonChecks(checks, { en: 2 }).join()).toMatch(
      /checkpoint 1 has the same en option twice/,
    )
  })
})
