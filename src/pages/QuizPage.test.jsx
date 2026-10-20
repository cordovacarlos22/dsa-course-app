import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'
import i18n from '../i18n'
import { celebrate } from '../lib/celebrate'
import { saveLanguage } from '../lib/languageStorage'
import { getPractice } from '../lib/practice'
import { loadQuizScore, saveQuizScore } from '../lib/quizScores'

// Confetti needs a real canvas, and sounds need Web Audio: the tests only
// check which celebration was asked for.
vi.mock('../lib/celebrate', () => ({ celebrate: vi.fn() }))

const QUIZ = getPractice('introduction').questions
const wrongOption = (question) => (question.correctIndex + 1) % 4

async function renderAt(path, language = 'en') {
  saveLanguage(language)
  await i18n.changeLanguage(language)
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

// Picks an option (by its position) and checks it.
async function answer(user, optionIndex) {
  await user.click(screen.getAllByRole('radio')[optionIndex])
  await user.click(screen.getByRole('button', { name: 'Check answer' }))
}

// Answers every question, getting only the ones in `missed` wrong.
async function playQuiz(user, missed = []) {
  for (let i = 0; i < QUIZ.length; i++) {
    const question = QUIZ[i]
    await answer(
      user,
      missed.includes(i) ? wrongOption(question) : question.correctIndex,
    )
    const isLast = i === QUIZ.length - 1
    await user.click(
      screen.getByRole('button', {
        name: isLast ? 'See your score' : /Next question/,
      }),
    )
  }
}

beforeEach(() => celebrate.mockReset())

describe('quiz page', () => {
  it('shows one question at a time and explains the answer', async () => {
    const user = userEvent.setup()
    await renderAt('/learn/introduction/quiz')

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Introduction quiz',
      }),
    ).toBeInTheDocument()
    expect(document.title).toBe('Introduction quiz · DSA in JavaScript')
    expect(screen.getByText(`Question 1 of ${QUIZ.length}`)).toBeInTheDocument()
    // Nothing is selected yet.
    expect(screen.getByRole('button', { name: 'Check answer' })).toBeDisabled()

    await answer(user, QUIZ[0].correctIndex)
    expect(screen.getByText('✓ Correct!')).toBeInTheDocument()
    // One answer per question: the options are locked after Check.
    expect(screen.getAllByRole('radio')[0]).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /Next question/ }))
    expect(screen.getByText(`Question 2 of ${QUIZ.length}`)).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Check answer' })).toBeDisabled()
  })

  it('points to the right answer after a wrong one', async () => {
    const user = userEvent.setup()
    await renderAt('/learn/introduction/quiz')
    await screen.findByText(`Question 1 of ${QUIZ.length}`)

    await answer(user, wrongOption(QUIZ[0]))
    expect(
      screen.getByText('Not quite. The right answer is in green.'),
    ).toBeInTheDocument()
  })

  it('scores the quiz, lists the misses and keeps the best score', async () => {
    const user = userEvent.setup()
    saveQuizScore('introduction', 5, QUIZ.length)
    await renderAt('/learn/introduction/quiz')
    await screen.findByText(`Question 1 of ${QUIZ.length}`)

    await playQuiz(user, [0])

    expect(
      screen.getByRole('heading', { name: 'Quiz complete!' }),
    ).toHaveFocus()
    expect(
      screen.getByText(`${QUIZ.length - 1} of ${QUIZ.length}`),
    ).toBeInTheDocument()
    const review = screen.getByRole('heading', { name: 'Questions to review' })
    expect(
      within(review.nextElementSibling).getAllByRole('listitem'),
    ).toHaveLength(1)
    expect(celebrate).toHaveBeenCalledWith('lesson')
    expect(loadQuizScore('introduction')).toEqual({
      best: QUIZ.length - 1,
      total: QUIZ.length,
    })

    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(screen.getByText(`Question 1 of ${QUIZ.length}`)).toHaveFocus()
  })

  it('celebrates a perfect score the most', async () => {
    const user = userEvent.setup()
    await renderAt('/learn/introduction/quiz')
    await screen.findByText(`Question 1 of ${QUIZ.length}`)

    await playQuiz(user)

    expect(
      screen.getByText('Perfect score: every answer right!'),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Questions to review' }),
    ).not.toBeInTheDocument()
    expect(celebrate).toHaveBeenCalledWith('module')
  })

  it('is linked from the module page, with the best score', async () => {
    saveQuizScore('introduction', 8, 10)
    await renderAt('/learn/introduction')
    const link = screen.getByRole('link', { name: /^Quiz/ })
    expect(link).toHaveAttribute('href', '/learn/introduction/quiz')
    expect(link).toHaveTextContent('Best: 8 of 10')
  })

  it('asks the first-timer to take the quiz', async () => {
    await renderAt('/learn/introduction')
    expect(screen.getByRole('link', { name: /^Quiz/ })).toHaveTextContent(
      'Take the quiz',
    )
  })

  it('speaks Spanish', async () => {
    await renderAt('/learn/introduction/quiz', 'es')
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Cuestionario de Introducción',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(`Pregunta 1 de ${QUIZ.length}`)).toBeInTheDocument()
  })

  it('shows "page not found" for a module without a quiz', async () => {
    await renderAt('/learn/doubly-linked-lists/quiz')
    expect(
      await screen.findByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument()
  })
})
