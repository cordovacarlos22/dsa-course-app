import { useState } from 'react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useLanguage } from '../hooks/useLanguage'
import { EXAM_SIZE, getSections, localize } from '../lib/course'
import { examQuestions, pickQuestions } from '../lib/practice'
import { QuizPlayer } from './QuizPage'
import NotFoundPage from './NotFoundPage'

// A section's exam (/learn/sections/:section/exam): EXAM_SIZE random
// questions mixed from all its module quizzes. Untimed and always open; the
// best score is kept like a quiz's, under "exam:<section>".
function ExamPage() {
  const { sectionSlug } = useParams()
  const { t } = useTranslation()
  const { language } = useLanguage()
  const sections = getSections()
  const number = sections.findIndex((section) => section.slug === sectionSlug)
  const section = sections[number]
  const questions = section ? examQuestions(section.modules) : []
  const hasExam = questions.length > 0
  const quiz = hasExam && {
    title: t('exam.title', {
      number: number + 1,
      title: localize(section.title, language),
    }),
    back: { to: '/learn', label: t('exam.backToCourse') },
    scoreId: `exam:${section.slug}`,
    doneLabel: t('exam.complete'),
    shortRunLabel: t('exam.shortRun'),
  }
  // Called before the early return: hooks must run on every render.
  useDocumentTitle(hasExam ? quiz.title : t('notFound.title'))

  if (!hasExam) return <NotFoundPage />

  // `key`: another section starts with fresh state.
  return <Exam key={sectionSlug} quiz={quiz} questions={questions} />
}

// A fresh mix of questions for every try.
function Exam({ quiz, questions }) {
  const pick = () =>
    pickQuestions(questions, { order: 'random', count: EXAM_SIZE })
  const [run, setRun] = useState(() => ({ id: 0, questions: pick() }))

  return (
    <QuizPlayer
      key={run.id}
      quiz={quiz}
      questions={run.questions}
      isFullRun
      focusFirstQuestion={run.id > 0}
      onRestart={() => setRun({ id: run.id + 1, questions: pick() })}
    />
  )
}

export default ExamPage
