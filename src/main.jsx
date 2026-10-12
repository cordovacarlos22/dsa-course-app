import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import i18n from './i18n'
import { unlockSoundOnFirstTap } from './lib/sounds'
import './index.css'
import App from './App.jsx'

// Screen readers use <html lang> to pick the right pronunciation.
document.documentElement.lang = i18n.language

// Browsers only allow sound after the student's first click (see sounds.js).
unlockSoundOnFirstTap()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
