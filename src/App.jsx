import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import CourseHomePage from './pages/CourseHomePage'
import ModulePage from './pages/ModulePage'
import NotFoundPage from './pages/NotFoundPage'

// All the app's pages. Every page is shown inside <Layout> (header + footer).
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="learn" element={<CourseHomePage />} />
        <Route path="learn/:moduleSlug" element={<ModulePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
