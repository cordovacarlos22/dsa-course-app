import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  exerciseAsStep,
  formatDuration,
  loadExerciseResult,
  loadTimerMode,
  saveSolved,
  saveTimerMode,
  saveViewedSolution,
} from './exercises'

afterEach(() => vi.restoreAllMocks())

describe('exercise results', () => {
  it('starts unsolved and keeps the fastest time', () => {
    expect(loadExerciseResult('big-o', 'find-max')).toEqual({
      solved: false,
      bestTimeMs: null,
      viewedSolution: false,
    })
    saveSolved('big-o', 'find-max', 90_000)
    saveSolved('big-o', 'find-max', 120_000)
    expect(loadExerciseResult('big-o', 'find-max')).toMatchObject({
      solved: true,
      bestTimeMs: 90_000,
    })
    saveSolved('big-o', 'find-max', 30_000)
    expect(loadExerciseResult('big-o', 'find-max').bestTimeMs).toBe(30_000)
    expect(loadExerciseResult('big-o', 'binary-search').solved).toBe(false)
  })

  it('remembers a revealed solution', () => {
    saveViewedSolution('big-o', 'find-max')
    expect(loadExerciseResult('big-o', 'find-max')).toMatchObject({
      solved: false,
      viewedSolution: true,
    })
  })

  it('still works when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(saveSolved('big-o', 'find-max', 1000).solved).toBe(true)
    expect(loadTimerMode()).toBe('stopwatch')
    saveTimerMode('off')
  })
})

describe('timer setting', () => {
  it('defaults to the stopwatch and remembers the choice', () => {
    expect(loadTimerMode()).toBe('stopwatch')
    saveTimerMode('countdown')
    expect(loadTimerMode()).toBe('countdown')
    localStorage.setItem('timerMode', 'sundial')
    expect(loadTimerMode()).toBe('stopwatch')
  })
})

describe('formatDuration', () => {
  it('writes minutes and seconds, and hours when needed', () => {
    expect(formatDuration(0)).toBe('0:00')
    expect(formatDuration(75_000)).toBe('1:15')
    expect(formatDuration(15 * 60_000)).toBe('15:00')
    expect(formatDuration(3_725_000)).toBe('1:02:05')
    expect(formatDuration(-5000)).toBe('0:00')
  })
})

describe('exerciseAsStep', () => {
  it('turns an exercise into a coding step', () => {
    const exercise = {
      description: { en: 'Do it' },
      starterCode: { javascript: 'function f() {}' },
      solution: { javascript: 'function f() { return 1 }' },
      functionName: 'f',
      tests: [{ args: [], expected: 1 }],
    }
    const hint = { en: 'Aim for O(1)' }
    expect(exerciseAsStep(exercise, hint)).toEqual({
      title: null,
      body: '',
      checkpoint: {
        task: { en: 'Do it' },
        hint,
        starterCode: 'function f() {}',
        solution: 'function f() { return 1 }',
        kind: 'function',
        functionName: 'f',
        className: undefined,
        tests: [{ args: [], expected: 1 }],
      },
    })
  })
})
