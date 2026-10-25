import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test, expect, sidewaysScroll, lessonsByModule } from './fixtures.js'

const LOCALES = join(import.meta.dirname, '..', 'src', 'locales')
const showAllLabel = (language) =>
  JSON.parse(readFileSync(join(LOCALES, `${language}.json`), 'utf8')).runnable
    .showAll

// Snippets that are meant to fail: a lesson shows an error or an infinite
// loop on purpose, so the student learns to read it.
const EXPECTED_CRASH =
  /totalCharacters\(null\)|let tail = null|gret\('Grace'\)|guests\[5\]\.length/
const EXPECTED_STOP = /never add 1 to count|nunca le sumamos 1/

// Marks every step of the lesson as passed, so ?step=N opens any step.
async function unlockLesson(page, moduleSlug, lesson) {
  await page.addInitScript(
    ({ key, steps }) => {
      const passed = Array.from({ length: steps }, (_, i) => i)
      localStorage.setItem(
        key,
        JSON.stringify({
          passed,
          attempts: {},
          viewedSolution: [],
          completed: true,
        }),
      )
    },
    { key: `progress:${moduleSlug}/${lesson.slug}`, steps: lesson.steps },
  )
}

// Plays an animation to its last step, checking every caption on the way.
async function playToTheEnd(figure, problems, where) {
  for (let guard = 0; guard < 60; guard++) {
    const caption = (
      await figure.locator('p[aria-live]').first().textContent()
    ).trim()
    if (!caption) problems.push(`${where}: an animation step has no caption`)
    if (/viz\.|\{\{/.test(caption))
      problems.push(`${where}: missing text "${caption}"`)
    const next = figure.locator('div > button').last()
    if (await next.isDisabled()) return
    await next.click()
  }
}

// Runs a snippet and checks its output: no error, unless it's meant to.
// After Run, the output replays line by line; "Show all" skips to the end.
async function runSnippet(box, problems, where, language) {
  const code = await box.locator('textarea').inputValue()
  await box.locator('button', { hasText: '▶' }).click()
  const output = box.locator('[role=status]')
  await expect(output).toBeVisible({ timeout: 5000 })
  const showAll = box.getByRole('button', { name: showAllLabel(language) })
  if ((await showAll.count()) > 0 && (await showAll.isEnabled()))
    await showAll.click()
  const text = await output.innerText()
  const failed = /Error|could not run|no se pudo|Stopped after|Se detuvo/.test(
    text,
  )
  if (EXPECTED_CRASH.test(code)) {
    if (!/Error/.test(text))
      problems.push(`${where}: the error example should show an error`)
  } else if (EXPECTED_STOP.test(code)) {
    if (!/Stopped|stopped|detuv/.test(text))
      problems.push(`${where}: the infinite loop should be stopped`)
  } else if (failed) {
    problems.push(`${where}: snippet failed: ${text.slice(0, 120)}`)
  }
}

for (const module of lessonsByModule()) {
  test.describe(module.slug, () => {
    for (const lesson of module.lessons) {
      test(lesson.slug, async ({ page, language }) => {
        const problems = []
        await unlockLesson(page, module.slug, lesson)
        for (let step = 1; step <= lesson.steps; step++) {
          const where = `${lesson.slug} step ${step}`
          await page.goto(`/learn/${module.slug}/${lesson.slug}?step=${step}`)
          await expect(page.locator('h1')).toBeVisible()
          await page.waitForLoadState('networkidle')

          const scroll = await sidewaysScroll(page)
          if (scroll > 0)
            problems.push(`${where}: scrolls sideways by ${scroll}px`)
          const missing = await page.locator('body').innerText()
          const missingText = missing.match(
            /Animation ".*" not found|viz\.[a-zA-Z]+\./,
          )
          if (missingText) problems.push(`${where}: ${missingText[0]}`)

          for (const figure of await page.locator('figure').all()) {
            await playToTheEnd(figure, problems, where)
          }
          for (const box of await page.locator('[data-runnable-code]').all()) {
            await runSnippet(box, problems, where, language)
          }
        }
        expect(problems).toEqual([])
      })
    }
  })
}

// The tests above open each step by its address; a student presses Next, and
// the next step's code box must start from its own code (#112).
test('Next gives the next step its own code box', async ({ page }) => {
  const lesson = lessonsByModule()
    .find((module) => module.slug === 'big-o')
    .lessons.find((each) => each.slug === '01-why-big-o')
  await unlockLesson(page, 'big-o', lesson)
  await page.goto('/learn/big-o/01-why-big-o?step=1')
  const firstBox = page.locator('[data-runnable-code]').first()
  await expect(firstBox.locator('textarea')).toHaveValue(/const sizes/)
  await firstBox.locator('button', { hasText: '▶' }).click()
  await expect(firstBox.locator('[role=status]')).toBeVisible()

  await page
    .getByRole('navigation', { name: /^(Steps|Pasos)$/ })
    .getByRole('button', { name: /^(Next|Siguiente)/ })
    .click()
  await expect(
    page.locator('[data-runnable-code]').first().locator('textarea'),
  ).toHaveValue(/function reverseWithLoop/)
})
