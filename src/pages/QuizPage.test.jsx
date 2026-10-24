import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'
import i18n from '../i18n'
import { celebrate } from '../lib/celebrate'
import { playSound } from '../lib/sounds'
import { saveLanguage } from '../lib/languageStorage'
import { getPractice } from '../lib/practice'
import { loadQuizScore, saveQuizScore } from '../lib/quizScores'

// Confetti needs a real canvas, and sounds need Web Audio: the tests only
// check which celebration was asked for.
vi.mock('../lib/celebrate', () => ({ celebrate: vi.fn() }))
vi.mock('../lib/sounds', async (importOriginal) => ({
  ...(await importOriginal()),
  playSound: vi.fn(),
}))

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

// Opens the quiz and starts it with the start screen's choices: in order,
// all the questions, unless the test picks others.
async function openQuiz(user, choices = []) {
  await renderAt('/learn/introduction/quiz')
  for (let i = 0; i < choices.length; i++) {
    await user.click(screen.getByRole('radio', { name: choices[i] }))
  }
  await user.click(
    await screen.findByRole('button', { name: 'Start the quiz' }),
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

beforeEach(() => {
  celebrate.mockReset()
  playSound.mockReset()
})

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
    // The title is set in an effect, a moment after the heading appears.
    await waitFor(() =>
      expect(document.title).toBe('Introduction quiz · DSA in JavaScript'),
    )
    // The start screen comes first; its defaults are in order, all questions.
    await user.click(screen.getByRole('button', { name: 'Start the quiz' }))
    expect(screen.getByText(`Question 1 of ${QUIZ.length}`)).toHaveFocus()
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
    await openQuiz(user)
    await screen.findByText(`Question 1 of ${QUIZ.length}`)

    await answer(user, wrongOption(QUIZ[0]))
    expect(
      screen.getByText('Not quite. The right answer is in green.'),
    ).toBeInTheDocument()
    expect(playSound).toHaveBeenCalledWith('miss')
    expect(celebrate).not.toHaveBeenCalled()
  })

  it('celebrates each right answer with a ding', async () => {
    const user = userEvent.setup()
    await openQuiz(user)
    await screen.findByText(`Question 1 of ${QUIZ.length}`)

    await answer(user, QUIZ[0].correctIndex)
    expect(celebrate).toHaveBeenCalledWith('step')
    expect(playSound).not.toHaveBeenCalledWith('miss')
  })

  it('scores the quiz, lists the misses and keeps the best score', async () => {
    const user = userEvent.setup()
    saveQuizScore('introduction', 5, QUIZ.length)
    await openQuiz(user)
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
    expect(celebrate).toHaveBeenLastCalledWith('lesson')
    expect(loadQuizScore('introduction')).toEqual({
      best: QUIZ.length - 1,
      total: QUIZ.length,
    })

    // Try again goes back to the start screen.
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    await user.click(screen.getByRole('button', { name: 'Start the quiz' }))
    expect(screen.getByText(`Question 1 of ${QUIZ.length}`)).toHaveFocus()
  })

  it('lets the student practice 5 random questions', async () => {
    const user = userEvent.setup()
    saveQuizScore('introduction', 3, QUIZ.length)
    await openQuiz(user, ['Random', '5'])

    const shown = []
    for (let i = 0; i < 5; i++) {
      expect(screen.getByText(`Question ${i + 1} of 5`)).toBeInTheDocument()
      const prompt = screen
        .getByText(`Question ${i + 1} of 5`)
        .closest('fieldset')
        .querySelector('p').textContent
      const question = QUIZ.find(
        (candidate) => candidate.prompt.en.replace(/[`*]/g, '') === prompt,
      )
      shown.push(question.id)
      await answer(user, question.correctIndex)
      await user.click(
        screen.getByRole('button', {
          name: i === 4 ? 'See your score' : /Next question/,
        }),
      )
    }

    expect(new Set(shown).size).toBe(5)
    expect(screen.getByText('5 of 5')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Only a quiz with all the questions updates your best score.',
      ),
    ).toBeInTheDocument()
    // A short practice never replaces the full quiz's best score.
    expect(loadQuizScore('introduction')).toEqual({
      best: 3,
      total: QUIZ.length,
    })
  })

  it('finishes early and scores only the answered questions', async () => {
    const user = userEvent.setup()
    await openQuiz(user)

    await answer(user, QUIZ[0].correctIndex)
    await user.click(screen.getByRole('button', { name: /Next question/ }))
    await answer(user, wrongOption(QUIZ[1]))
    await user.click(screen.getByRole('button', { name: 'Finish now' }))

    expect(
      screen.getByRole('heading', { name: 'Quiz complete!' }),
    ).toHaveFocus()
    expect(screen.getByText('1 of 2')).toBeInTheDocument()
    const review = screen.getByRole('heading', { name: 'Questions to review' })
    expect(
      within(review.nextElementSibling).getAllByRole('listitem'),
    ).toHaveLength(1)
    expect(loadQuizScore('introduction')).toBeNull()
  })

  it('celebrates a perfect score the most', async () => {
    const user = userEvent.setup()
    await openQuiz(user)
    await screen.findByText(`Question 1 of ${QUIZ.length}`)

    await playQuiz(user)

    expect(
      screen.getByText('Perfect score: every answer right!'),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Questions to review' }),
    ).not.toBeInTheDocument()
    expect(celebrate).toHaveBeenLastCalledWith('module')
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
    const user = userEvent.setup()
    await renderAt('/learn/introduction/quiz', 'es')
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Cuestionario de Introducción',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('¿Cómo quieres practicar?')).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Al azar' }))
    await user.click(
      screen.getByRole('button', { name: 'Empezar el cuestionario' }),
    )
    expect(screen.getByText(`Pregunta 1 de ${QUIZ.length}`)).toBeInTheDocument()
  })

  it('shows "page not found" for a module without a quiz', async () => {
    await renderAt('/learn/doubly-linked-lists/quiz')
    expect(
      await screen.findByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument()
  })
})
