import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import CourseHomePage from './pages/CourseHomePage'
import ModulePage from './pages/ModulePage'
import NotFoundPage from './pages/NotFoundPage'

// Lessons need the Markdown libraries, which are big. Loading this page only
// when a student opens a lesson keeps the first page load small.
const LessonPage = lazy(() => import('./pages/LessonPage'))
// The quiz brings the module's full practice file, so it loads on demand too.
const QuizPage = lazy(() => import('./pages/QuizPage'))
// A section's exam reuses the quiz screens, so it loads with them.
const ExamPage = lazy(() => import('./pages/ExamPage'))
// Exercises reuse the lessons' coding workspace, and load on demand too.
const ExercisePage = lazy(() => import('./pages/ExercisePage'))
// For reviewing animations; not linked from the menu.
const AnimationGalleryPage = lazy(() => import('./pages/AnimationGalleryPage'))

// All the app's pages. Every page is shown inside <Layout> (header + footer).
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="learn" element={<CourseHomePage />} />
        <Route path="learn/:moduleSlug" element={<ModulePage />} />
        <Route path="learn/:moduleSlug/quiz" element={<QuizPage />} />
        <Route path="learn/sections/:sectionSlug/exam" element={<ExamPage />} />
        <Route
          path="learn/:moduleSlug/exercises/:exerciseSlug"
          element={<ExercisePage />}
        />
        <Route path="learn/:moduleSlug/:lessonSlug" element={<LessonPage />} />
        <Route path="dev/animations" element={<AnimationGalleryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
