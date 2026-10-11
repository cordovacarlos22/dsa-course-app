import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  emptyProgress,
  failedAttempts,
  firstUnpassedStep,
  loadProgress,
  markStepPassed,
  recordFailedAttempt,
  recordViewedSolution,
  saveProgress,
} from './progress'

afterEach(() => vi.restoreAllMocks())

describe('lesson progress', () => {
  it('starts empty and is saved per lesson', () => {
    expect(loadProgress('big-o', '01-a')).toEqual(emptyProgress())

    const progress = markStepPassed(emptyProgress(), 0, 3)
    saveProgress('big-o', '01-a', progress)

    expect(loadProgress('big-o', '01-a').passed).toEqual([0])
    expect(loadProgress('big-o', '02-b')).toEqual(emptyProgress())
  })

  it('is complete when every step passed', () => {
    let progress = markStepPassed(emptyProgress(), 1, 2)
    expect(progress.completed).toBe(false)
    progress = markStepPassed(progress, 0, 2)
    expect(progress).toMatchObject({ passed: [0, 1], completed: true })
    // Passing a step twice doesn't count twice.
    expect(markStepPassed(progress, 0, 2).passed).toEqual([0, 1])
  })

  it('counts failed tries and remembers revealed solutions', () => {
    let progress = recordFailedAttempt(emptyProgress(), 2)
    progress = recordFailedAttempt(progress, 2)
    expect(failedAttempts(progress, 2)).toBe(2)
    expect(failedAttempts(progress, 0)).toBe(0)

    progress = recordViewedSolution(progress, 2)
    expect(recordViewedSolution(progress, 2).viewedSolution).toEqual([2])
  })

  it('resumes at the first step that has not passed', () => {
    expect(firstUnpassedStep({ passed: [0, 1] }, 4)).toBe(2)
    expect(firstUnpassedStep({ passed: [0, 1] }, 2)).toBe(1)
  })

  it('still works when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(() => saveProgress('big-o', '01-a', emptyProgress())).not.toThrow()
    expect(loadProgress('big-o', '01-a')).toEqual(emptyProgress())
  })
})
