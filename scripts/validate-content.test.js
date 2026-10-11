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
