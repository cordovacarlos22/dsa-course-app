import { describe, it, expect } from 'vitest'
import { getPractice, pickQuestions, shuffle } from './practice'

const QUIZ = getPractice('big-o').questions
const ids = (questions) => questions.map((question) => question.id)

describe('pickQuestions', () => {
  it('keeps the order and every question by default', () => {
    expect(
      ids(pickQuestions(QUIZ, { order: 'inOrder', count: 'all' })),
    ).toEqual(ids(QUIZ))
  })

  it('takes the first questions when the student picks a count', () => {
    expect(ids(pickQuestions(QUIZ, { order: 'inOrder', count: 5 }))).toEqual(
      ids(QUIZ).slice(0, 5),
    )
  })

  it('shuffles without losing or repeating a question', () => {
    const random = pickQuestions(QUIZ, { order: 'random', count: 'all' })
    expect([...ids(random)].sort()).toEqual([...ids(QUIZ)].sort())
    expect(pickQuestions(QUIZ, { order: 'random', count: 10 })).toHaveLength(10)
  })
})

describe('shuffle', () => {
  it('returns a new list and leaves the original alone', () => {
    const list = [1, 2, 3, 4]
    const shuffled = shuffle(list)
    expect(shuffled).not.toBe(list)
    expect(list).toEqual([1, 2, 3, 4])
    expect([...shuffled].sort()).toEqual([1, 2, 3, 4])
  })

  it('can produce every order', () => {
    const seen = new Set()
    for (let i = 0; i < 400; i++) seen.add(shuffle([1, 2, 3]).join(''))
    expect(seen.size).toBe(6)
  })
})
