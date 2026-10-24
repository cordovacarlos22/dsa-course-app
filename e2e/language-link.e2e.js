import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test, expect } from './fixtures.js'

// On the real domain the landing page links to the course with ?lang=,
// because the two addresses don't share browser storage
// (src/lib/crossSite.js). The course must open in that language, and drop
// ?lang= from the address bar so a bookmark doesn't reset it every visit.
const spanish = JSON.parse(
  readFileSync(
    join(import.meta.dirname, '..', 'src', 'locales', 'es.json'),
    'utf8',
  ),
)

test('a link with ?lang=es opens the course in Spanish', async ({
  page,
  language,
}) => {
  test.skip(language === 'es', 'this setup starts in Spanish anyway')
  await page.goto('/learn?lang=es')
  await expect(
    page.getByRole('heading', { level: 1, name: spanish.course.title }),
  ).toBeVisible()
  await expect(page).toHaveURL(/\/learn$/)
})
