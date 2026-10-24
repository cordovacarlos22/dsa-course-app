import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test, expect, sidewaysScroll, practice } from './fixtures.js'

const LOCALES = join(import.meta.dirname, '..', 'src', 'locales')
const labels = (language) => {
  const text = JSON.parse(
    readFileSync(join(LOCALES, `${language}.json`), 'utf8'),
  )
  return {
    codeTab: text.workspace.code,
    check: text.workspace.check,
    showSolution: text.workspace.showSolution,
    // "Solved in {{time}}!" → "Solved in"
    solved: text.exercise.solvedIn.split('{{')[0].replace('¡', '').trim(),
  }
}

for (const { module, hasQuiz, exercises } of practice()) {
  test.describe(module, () => {
    if (hasQuiz) {
      // Answers every question (every third one wrong) and reaches the score card.
      test('quiz', async ({ page }) => {
        const problems = []
        await page.goto(`/learn/${module}/quiz`)
        // The start screen's defaults: in order, every question.
        await page.locator('form button[type=submit]').click()
        await expect(page.locator('form fieldset')).toBeVisible()
        for (let i = 0; ; i++) {
          const scroll = await sidewaysScroll(page)
          if (scroll > 0)
            problems.push(`question ${i + 1}: scrolls sideways by ${scroll}px`)
          await page
            .locator('input[type=radio]')
            .nth(i % 3 === 2 ? 0 : 1)
            .check()
          await page.locator('form button[type=submit]').click()
          await expect(page.locator('form [role=status] > div')).toBeVisible()
          const next = page.locator('form button[type=button]')
          const isLast = !(await next.textContent()).includes('→')
          await next.click()
          if (isLast) break
        }
        await expect(page.locator('section h2')).toBeVisible()
        const scroll = await sidewaysScroll(page)
        if (scroll > 0)
          problems.push(`score card: scrolls sideways by ${scroll}px`)
        const text = await page.locator('body').innerText()
        const missing = text.match(/quiz\.[a-zA-Z]+|module\.[a-zA-Z]+/)
        if (missing) problems.push(`missing text ${missing[0]}`)
        expect(problems).toEqual([])
      })
    }

    // Fails three times with the starter code, reveals the solution, and
    // checks that the reference solution passes in the real browser.
    for (const slug of exercises) {
      test(`exercise ${slug}`, async ({ page, language }) => {
        const label = labels(language)
        await page.goto(`/learn/${module}/exercises/${slug}`)
        // On phones the workspace is tabs (Learn, Code, Output), and Check
        // switches to Output. Before each click, open the tab that holds
        // the button, like a student would.
        const tabs = page.getByRole('tab')
        async function reveal(locator) {
          if (await locator.isVisible()) return locator
          for (const tab of await tabs.all()) {
            if (!(await tab.isVisible())) continue
            await tab.click()
            if (await locator.isVisible()) return locator
          }
          return locator
        }
        // The editor loads a moment after the page, so look for its tab
        // again until it shows (a slow phone can reach the last tab first).
        await expect(async () => {
          await reveal(page.locator('.cm-editor'))
          await expect(page.locator('.cm-editor')).toBeVisible({
            timeout: 1_000,
          })
        }).toPass({ timeout: 15_000 })
        expect(await sidewaysScroll(page)).toBe(0)
        const check = page.getByRole('button', {
          name: `✓ ${label.check}`,
          exact: true,
        })
        async function pressCheck() {
          await reveal(check)
          await expect(check).toBeEnabled({ timeout: 15_000 })
          await check.click()
        }
        for (let i = 0; i < 3; i++) await pressCheck()
        const showSolution = page.getByRole('button', {
          name: label.showSolution,
        })
        await reveal(showSolution)
        await expect(showSolution).toBeEnabled({ timeout: 15_000 })
        await showSolution.click()
        await pressCheck()
        await expect(page.getByText(label.solved)).toBeVisible({
          timeout: 15_000,
        })
      })
    }
  })
}
