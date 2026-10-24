import { describe, it, expect } from 'vitest'
import { EXAM_SIZE, getSections } from './course'
import { examQuestions, getPractice, pickQuestions, shuffle } from './practice'

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

describe('examQuestions', () => {
  const foundations = getSections()[0].modules
  const exam = examQuestions(foundations)

  it("mixes every quiz question of the section's modules", () => {
    let total = 0
    for (let i = 0; i < foundations.length; i++) {
      total += getPractice(foundations[i].slug)?.questions.length ?? 0
    }
    expect(exam).toHaveLength(total)
  })

  it('tells where each question came from, with ids unique across modules', () => {
    expect(new Set(ids(exam)).size).toBe(exam.length)
    expect(exam[0].id).toBe(
      `introduction/${getPractice('introduction').questions[0].id}`,
    )
    expect(exam[0].source.en).toBe('Introduction')
  })

  it(`gives an exam of ${EXAM_SIZE} with no repeats`, () => {
    const picked = pickQuestions(exam, { order: 'random', count: EXAM_SIZE })
    expect(picked).toHaveLength(EXAM_SIZE)
    expect(new Set(ids(picked)).size).toBe(EXAM_SIZE)
  })
})
