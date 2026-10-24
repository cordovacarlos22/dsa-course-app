import { test, expect, sidewaysScroll } from './fixtures.js'

// A section exam: 20 questions mixed from the section's quizzes, then the
// score card, with no sideways scroll on any screen.
test('the Foundations exam can be finished', async ({ page }) => {
  await page.goto('/learn')
  await page.locator('a[href="/learn/sections/foundations/exam"]').click()
  await expect(page.locator('form fieldset')).toBeVisible()

  for (let i = 0; i < 20; i++) {
    expect(await sidewaysScroll(page)).toBe(0)
    await page.locator('input[type=radio]').nth(1).check()
    await page.locator('form button[type=submit]').click()
    await expect(page.locator('form [role=status] > div')).toBeVisible()
    await page.locator('form button[type=button]').click()
  }

  await expect(page.locator('section h2')).toBeVisible()
  expect(await sidewaysScroll(page)).toBe(0)
  const text = await page.locator('body').innerText()
  expect(text).not.toMatch(/exam\.[a-zA-Z]+|quiz\.[a-zA-Z]+/)
})
