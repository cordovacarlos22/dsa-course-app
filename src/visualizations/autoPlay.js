import { createContext } from 'react'

// Animations inside <AutoPlayContext value> play on their own and start over
// at the end (the landing page's reel). In lessons the students press Play.
export const AutoPlayContext = createContext(false)
