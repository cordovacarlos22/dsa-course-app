import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'
import i18n from '../i18n'
import { celebrate } from '../lib/celebrate'
import { EXAM_SIZE } from '../lib/course'
import { saveLanguage } from '../lib/languageStorage'
import { loadQuizScore } from '../lib/quizScores'

// Confetti and sounds need a real browser: the tests only check what was asked for.
vi.mock('../lib/celebrate', () => ({ celebrate: vi.fn() }))
vi.mock('../lib/sounds', async (importOriginal) => ({
  ...(await importOriginal()),
  playSound: vi.fn(),
}))

async function renderAt(path, language = 'en') {
  saveLanguage(language)
  await i18n.changeLanguage(language)
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

beforeEach(() => celebrate.mockReset())

describe('section exam', () => {
  it('is linked at the end of a section that has quizzes, and not where none exist', async () => {
    await renderAt('/learn')
    const exams = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href').endsWith('/exam'))
    expect(exams[0]).toHaveAttribute('href', '/learn/sections/foundations/exam')
    expect(exams[0]).toHaveTextContent('Foundations exam')
    expect(exams[0]).toHaveTextContent('20 questions mixed')
    // Foundations, Problem Solving and Data Structures have quizzes so far.
    expect(exams).toHaveLength(3)
  })

  it(`asks ${EXAM_SIZE} mixed questions, says where each one is from, and keeps the best score`, async () => {
    const user = userEvent.setup()
    await renderAt('/learn/sections/foundations/exam')
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Section 1 exam: Foundations',
      }),
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(document.title).toBe(
        'Section 1 exam: Foundations · DSA in JavaScript',
      ),
    )

    for (let i = 0; i < EXAM_SIZE; i++) {
      expect(
        screen.getByText(`Question ${i + 1} of ${EXAM_SIZE}`),
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          /^From (Introduction|Big O|Big O of Arrays & Objects)$/,
        ),
      ).toBeInTheDocument()
      await user.click(screen.getAllByRole('radio')[0])
      await user.click(screen.getByRole('button', { name: 'Check answer' }))
      await user.click(
        screen.getByRole('button', {
          name: i === EXAM_SIZE - 1 ? 'See your score' : /Next question/,
        }),
      )
    }

    expect(
      screen.getByRole('heading', { name: /Exam complete!/ }),
    ).toHaveFocus()
    expect(loadQuizScore('exam:foundations').total).toBe(EXAM_SIZE)
    expect(
      screen.getByRole('link', { name: 'Back to the course' }),
    ).toHaveAttribute('href', '/learn')
  })

  it('shows "page not found" for a section with no quizzes', async () => {
    await renderAt('/learn/sections/graph-algorithms/exam')
    expect(
      await screen.findByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument()
  })
})
