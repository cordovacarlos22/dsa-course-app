import { describe, it, expect } from 'vitest'
import { crossSiteUrl } from './crossSite'

const site = 'https://charliecodeacademy.com'
const app = 'https://app.charliecodeacademy.com'

function urlFor(
  pathname,
  here,
  origins = { siteOrigin: site, appOrigin: app },
) {
  return crossSiteUrl({ pathname, here, language: 'es', ...origins })
}

describe('crossSiteUrl', () => {
  it('stays on the page when the two addresses are not set up', () => {
    expect(urlFor('/learn', site, {})).toBeNull()
    expect(urlFor('/learn', site, { siteOrigin: site })).toBeNull()
  })

  it('sends a course page on the landing address to the course address, with the language', () => {
    expect(urlFor('/learn', site)).toBe(`${app}/learn?lang=es`)
    expect(urlFor('/learn/big-o/01-why-big-o', site)).toBe(
      `${app}/learn/big-o/01-why-big-o?lang=es`,
    )
  })

  it('sends the landing page and other pages on the course address to the landing address', () => {
    expect(urlFor('/', app)).toBe(`${site}/?lang=es`)
    expect(urlFor('/dev/animations', app)).toBe(
      `${site}/dev/animations?lang=es`,
    )
  })

  it('stays when the page already belongs to this address', () => {
    expect(urlFor('/', site)).toBeNull()
    expect(urlFor('/learn/linked-lists', app)).toBeNull()
  })

  it('does not treat a page that only starts with "learn" as a course page', () => {
    expect(urlFor('/learning-tips', site)).toBeNull()
  })
})
