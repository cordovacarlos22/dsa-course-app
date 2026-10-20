import { describe, it, expect, vi, afterEach } from 'vitest'
import { loadQuizScore, saveQuizScore } from './quizScores'

afterEach(() => vi.restoreAllMocks())

describe('quiz scores', () => {
  it('has no score before the quiz is finished', () => {
    expect(loadQuizScore('big-o')).toBeNull()
  })

  it('keeps the best score per module', () => {
    expect(saveQuizScore('big-o', 7, 10)).toEqual({ best: 7, total: 10 })
    expect(saveQuizScore('big-o', 5, 10)).toEqual({ best: 7, total: 10 })
    expect(saveQuizScore('big-o', 9, 10)).toEqual({ best: 9, total: 10 })
    expect(loadQuizScore('big-o')).toEqual({ best: 9, total: 10 })
    expect(loadQuizScore('introduction')).toBeNull()
  })

  it('ignores a broken saved value', () => {
    localStorage.setItem('quiz:big-o', '{not json')
    expect(loadQuizScore('big-o')).toBeNull()
    localStorage.setItem('quiz:big-o', JSON.stringify({ best: 'a lot' }))
    expect(loadQuizScore('big-o')).toBeNull()
  })

  it('still works when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(loadQuizScore('big-o')).toBeNull()
    expect(saveQuizScore('big-o', 3, 4)).toEqual({ best: 3, total: 4 })
  })
})
