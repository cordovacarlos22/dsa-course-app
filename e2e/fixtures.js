import { test as base, expect } from '@playwright/test'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const CONTENT = join(import.meta.dirname, '..', 'content')

// Every test gets a page that starts in the project's language, with sounds
// off, and collects Content-Security-Policy violations and page errors.
// The test fails at the end if any happened.
export const test = base.extend({
  language: ['en', { option: true }],
  problems: async ({}, use) => {
    await use([])
  },
  page: async ({ page, language, problems }, use) => {
    await page.addInitScript((language) => {
      localStorage.setItem('language', language)
      localStorage.setItem('sounds', 'off')
    }, language)
    page.on('console', (message) => {
      if (/Content Security Policy|Refused to/i.test(message.text())) {
        problems.push(`CSP: ${message.text()}`)
      }
    })
    page.on('pageerror', (error) =>
      problems.push(`page error: ${error.message}`),
    )
    await use(page)
    expect(problems, 'CSP violations and page errors').toEqual([])
  },
})

export { expect }

// How far the page scrolls sideways (0 means it fits the screen).
export function sidewaysScroll(page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  )
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

// The modules in course order, each with its lessons and how many steps
// each lesson has (every "## " heading starts a step).
export function lessonsByModule() {
  const course = readJson(join(CONTENT, 'course.json'))
  const modules = []
  for (const module of course.modules) {
    const folder = join(CONTENT, 'lessons', module.slug)
    if (!existsSync(folder)) continue
    const lessons = readdirSync(folder)
      .filter((file) => file.endsWith('.en.md'))
      .sort()
      .map((file) => {
        const text = readFileSync(join(folder, file), 'utf8')
        return {
          slug: file.replace('.en.md', ''),
          steps: text.split('\n').filter((line) => line.startsWith('## '))
            .length,
        }
      })
    if (lessons.length > 0) modules.push({ slug: module.slug, lessons })
  }
  return modules
}

// Practice files: the modules with a quiz, and every exercise.
export function practice() {
  const folder = join(CONTENT, 'practice')
  return readdirSync(folder)
    .filter((file) => file.endsWith('.json'))
    .map((file) => readJson(join(folder, file)))
    .map((data) => ({
      module: data.slug,
      hasQuiz: (data.questions ?? []).length > 0,
      exercises: (data.exercises ?? []).map((exercise) => exercise.slug),
    }))
}
