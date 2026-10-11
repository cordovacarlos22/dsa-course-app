// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  checkSectionInCourse,
  countMissingSpanish,
  validateCourse,
  validateSection,
} from './validate-content.js'

const text = (en) => ({ en, es: `${en} (es)` })

// A small section that passes every rule. Each test breaks one thing.
function makeValidSection() {
  return {
    slug: '99-sample',
    order: 99,
    title: text('Sample'),
    sourceFolder: 'Section 99 - Sample',
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

describe('validateSection', () => {
  it('accepts a valid section', () => {
    expect(validateSection(makeValidSection())).toEqual([])
  })

  it('rejects a missing English text', () => {
    const section = makeValidSection()
    delete section.questions[0].prompt.en
    expect(validateSection(section)).toEqual([
      expect.stringContaining('questions.0.prompt.en'),
    ])
  })

  it('accepts a missing Spanish translation (English first)', () => {
    const section = makeValidSection()
    delete section.questions[0].prompt.es
    expect(validateSection(section)).toEqual([])
  })

  it('rejects a question with only 3 options', () => {
    const section = makeValidSection()
    section.questions[0].options.pop()
    expect(validateSection(section)).toEqual([
      expect.stringContaining('exactly 4 options'),
    ])
  })

  it('rejects a correctIndex outside 0-3', () => {
    const section = makeValidSection()
    section.questions[0].correctIndex = 4
    expect(validateSection(section)).toEqual([
      expect.stringContaining('questions.0.correctIndex'),
    ])
  })

  it('rejects duplicate question ids', () => {
    const section = makeValidSection()
    section.questions.push({ ...section.questions[0] })
    expect(validateSection(section)).toEqual(['duplicate question id "q1"'])
  })

  it('rejects a solution that fails its tests', () => {
    const section = makeValidSection()
    section.exercises[0].solution.javascript =
      'function add(a, b) { return a - b }'
    const errors = validateSection(section)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0]).toContain('exercise "add" test 1: expected 3, got -1')
  })

  it('stops a solution that loops forever', () => {
    const section = makeValidSection()
    section.exercises[0].solution.javascript =
      'function add(a, b) { while (true) {} }'
    const errors = validateSection(section)
    expect(errors).toHaveLength(5)
    expect(errors[0]).toContain('timed out')
  }, 15_000)

  it('rejects a solution that does not compile', () => {
    const section = makeValidSection()
    section.exercises[0].solution.javascript =
      'function add(a, b) { return a + }'
    expect(validateSection(section)).toEqual([
      expect.stringContaining('solution does not compile'),
    ])
  })
})

describe('countMissingSpanish', () => {
  it('counts every text that has English but no Spanish', () => {
    const section = makeValidSection()
    expect(countMissingSpanish(section)).toBe(0)

    delete section.title.es
    delete section.questions[0].options[2].es
    expect(countMissingSpanish(section)).toBe(2)
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

  it('rejects duplicate module slugs', () => {
    const course = makeValidCourse()
    course.modules[1].slug = '01-intro'
    expect(validateCourse(course)).toContain('duplicate module slug "01-intro"')
  })
})

describe('checkSectionInCourse', () => {
  it('accepts a section that matches a module', () => {
    const section = { slug: '02-next', order: 2 }
    expect(checkSectionInCourse(section, makeValidCourse())).toEqual([])
  })

  it('rejects a section whose slug is not in the outline', () => {
    const section = { slug: '99-sample', order: 99 }
    expect(checkSectionInCourse(section, makeValidCourse())).toEqual([
      'slug "99-sample" is not a module in course.json',
    ])
  })

  it('rejects a section with a different order', () => {
    const section = { slug: '02-next', order: 5 }
    expect(checkSectionInCourse(section, makeValidCourse())).toEqual([
      'order should be 2 (as in course.json)',
    ])
  })
})

// A section whose only exercise is a class with 5 step-based tests.
function makeClassSection() {
  const section = makeValidSection()
  const createAndRead = (start) => ({
    steps: [
      { create: [start] },
      { call: 'increment' },
      { read: 'count', expected: start + 1 },
    ],
  })
  section.exercises = [
    {
      slug: 'counter',
      kind: 'class',
      title: text('Counter'),
      description: text('Build a Counter class.'),
      difficulty: 'easy',
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
  return section
}

describe('class exercises', () => {
  it('accepts a class solution that passes every step', () => {
    expect(validateSection(makeClassSection())).toEqual([])
  })

  it('reports the step that got a wrong value', () => {
    const section = makeClassSection()
    section.exercises[0].tests[4].steps[2].expected = 4
    expect(validateSection(section)).toEqual([
      'exercise "counter" test 5: step 3: expected 4, got 3',
    ])
  })

  it('reports a method that does not exist', () => {
    const section = makeClassSection()
    section.exercises[0].solution.javascript =
      'class Counter { constructor(start) { this.count = start } }'
    const errors = validateSection(section)
    expect(errors).toHaveLength(5)
    expect(errors[0]).toContain('method "increment" does not exist')
  })

  it('stops a method that loops forever', () => {
    const section = makeClassSection()
    section.exercises[0].tests = section.exercises[0].tests.slice(0, 5)
    section.exercises[0].solution.javascript =
      'class Counter { constructor(start) { this.count = start } increment() { while (true) {} } }'
    const errors = validateSection(section)
    expect(errors[0]).toContain('timed out')
  }, 15_000)

  it('requires the first step to create the instance', () => {
    const section = makeClassSection()
    section.exercises[0].tests[0].steps.shift()
    expect(validateSection(section)).toEqual([
      expect.stringContaining('the first step must be { create: [...] }'),
    ])
  })
})
