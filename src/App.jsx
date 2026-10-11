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

// All the app's pages. Every page is shown inside <Layout> (header + footer).
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="learn" element={<CourseHomePage />} />
        <Route path="learn/:moduleSlug" element={<ModulePage />} />
        <Route path="learn/:moduleSlug/:lessonSlug" element={<LessonPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
