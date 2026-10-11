// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { countMissingSpanish, validateSection } from './validate-content.js'

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
