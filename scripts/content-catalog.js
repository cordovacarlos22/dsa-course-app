// A Vite plugin that sums up the course content when the app is built, as
// the module "virtual:content-catalog": for each module, its lessons' titles
// and minutes, and how many quiz questions and exercises it has.
//
// Why: the course home, the module pages and the landing page only need
// that summary. The full lessons and quizzes (hundreds of kB) then load
// later, with the pages that show them, instead of with the very first page.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { parseFrontMatter } from '../src/lib/frontMatter.js'

const ID = 'virtual:content-catalog'
const RESOLVED_ID = '\0' + ID

// "01-why-big-o.en.md" → { slug: "01-why-big-o", language: "en" }
const LESSON_FILE = /^(.+)\.(en|es)\.md$/

// macOS / iCloud sometimes copies a file as "name 2.ext". Skip those copies,
// like the validator does (isIcloudDuplicate in validate-content.js).
const isIcloudCopy = (fileName) => / \d+\.[^.]+$/.test(fileName)

function readLessons(moduleDir) {
  const bySlug = {}
  for (const file of readdirSync(moduleDir)) {
    const match = LESSON_FILE.exec(file)
    if (!match || isIcloudCopy(file)) continue
    const [, slug, language] = match
    const { data } = parseFrontMatter(
      readFileSync(join(moduleDir, file), 'utf8'),
    )
    bySlug[slug] ??= { slug, titles: {} }
    bySlug[slug].titles[language] = data.title
    // English is written first, so its order and minutes are the reference.
    if (language === 'en' || bySlug[slug].order === undefined) {
      bySlug[slug].order = data.order
      bySlug[slug].minutes = data.minutes
    }
  }
  return Object.values(bySlug).sort((a, b) => a.order - b.order)
}

function countPractice(practice) {
  let build = 0
  let interview = 0
  for (let i = 0; i < practice.exercises.length; i++) {
    if (practice.exercises[i].category === 'build') build++
    else interview++
  }
  return { questions: practice.questions.length, build, interview }
}

// { [moduleSlug]: { lessons: [{ slug, order, minutes, titles }], practice } }
// `practice` is { questions, build, interview }, or null for a module
// without a practice file.
export function buildCatalog(contentDir) {
  const catalog = {}
  const lessonsDir = join(contentDir, 'lessons')
  for (const moduleSlug of readdirSync(lessonsDir)) {
    const moduleDir = join(lessonsDir, moduleSlug)
    if (moduleSlug.startsWith('.') || !statSync(moduleDir).isDirectory())
      continue
    catalog[moduleSlug] = { lessons: readLessons(moduleDir), practice: null }
  }
  const practiceDir = join(contentDir, 'practice')
  for (const file of readdirSync(practiceDir)) {
    if (!file.endsWith('.json') || isIcloudCopy(file)) continue
    const practice = JSON.parse(readFileSync(join(practiceDir, file), 'utf8'))
    catalog[practice.slug] ??= { lessons: [], practice: null }
    catalog[practice.slug].practice = countPractice(practice)
  }
  return catalog
}

export default function contentCatalog(contentDir) {
  return {
    name: 'content-catalog',
    resolveId(id) {
      if (id === ID) return RESOLVED_ID
    },
    load(id) {
      if (id !== RESOLVED_ID) return
      return `export default ${JSON.stringify(buildCatalog(contentDir))}`
    },
    // With `npm run dev`, editing a lesson or a quiz rebuilds the summary.
    configureServer(server) {
      server.watcher.add(contentDir)
      server.watcher.on('all', (event, file) => {
        if (!file.startsWith(contentDir)) return
        const module = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (!module) return
        server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload' })
      })
    },
  }
}
