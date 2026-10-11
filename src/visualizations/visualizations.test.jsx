import { describe, it, expect } from 'vitest'
import { visualizations } from './index'
import { VISUALIZATION_NAMES } from './names'
import { buildBinarySearchSteps } from './binarySearchSteps'

describe('visualization registry', () => {
  it('has a component for every name the validator accepts', () => {
    expect(Object.keys(visualizations).sort()).toEqual(
      [...VISUALIZATION_NAMES].sort(),
    )
  })
})

describe('buildBinarySearchSteps', () => {
  it('finds the target in log₂(n) checks', () => {
    const steps = buildBinarySearchSteps([2, 4, 6, 8, 10, 12, 14, 16], 14)
    const last = steps.at(-1)
    expect(last.captionKey).toBe('found')
    expect(last.checks).toBe(3)
  })

  it('narrows the range after every check', () => {
    const steps = buildBinarySearchSteps([1, 2, 3, 4, 5, 6, 7, 8], 1)
    expect(steps.map((step) => step.captionKey)).toEqual([
      'start',
      'goLeft',
      'goLeft',
      'found',
    ])
  })
})
