import { describe, it, expect } from 'vitest'
import { crossSiteUrl } from './crossSite'

const site = 'https://charliecodeacademy.com'
const app = 'https://app.charliecodeacademy.com'
const siteHost = 'charliecodeacademy.com'
const appHost = 'app.charliecodeacademy.com'

function urlFor(
  pathname,
  here,
  { origins = { siteOrigin: site, appOrigin: app }, ...rest } = {},
) {
  return crossSiteUrl({ pathname, here, language: 'es', ...origins, ...rest })
}

describe('crossSiteUrl', () => {
  it('stays on the page when the two addresses are not set up', () => {
    expect(urlFor('/learn', siteHost, { origins: {} })).toBeNull()
    expect(
      urlFor('/learn', siteHost, { origins: { siteOrigin: site } }),
    ).toBeNull()
    expect(
      urlFor('/learn', siteHost, {
        origins: { siteOrigin: 'not a url', appOrigin: app },
      }),
    ).toBeNull()
  })

  it('sends a course page on the landing address to the course address, with the language', () => {
    expect(urlFor('/learn', siteHost)).toBe(`${app}/learn?lang=es`)
    expect(urlFor('/learn/big-o/01-why-big-o', siteHost)).toBe(
      `${app}/learn/big-o/01-why-big-o?lang=es`,
    )
  })

  it('sends the landing page and other pages on the course address to the landing address', () => {
    expect(urlFor('/', appHost)).toBe(`${site}/?lang=es`)
    expect(urlFor('/dev/animations', appHost)).toBe(
      `${site}/dev/animations?lang=es`,
    )
  })

  it('stays when the page already belongs to this address', () => {
    expect(urlFor('/', siteHost)).toBeNull()
    expect(urlFor('/learn/linked-lists', appHost)).toBeNull()
  })

  it('stays put even when a setting has a trailing slash or http://', () => {
    const origins = {
      siteOrigin: `${site}/`,
      appOrigin: 'http://app.charliecodeacademy.com',
    }
    expect(urlFor('/', siteHost, { origins })).toBeNull()
    expect(urlFor('/learn', appHost, { origins })).toBeNull()
  })

  it("keeps the page's own query and #", () => {
    expect(
      urlFor('/learn/big-o', siteHost, { search: '?step=2', hash: '#top' }),
    ).toBe(`${app}/learn/big-o?step=2&lang=es#top`)
  })

  it('does not treat a page that only starts with "learn" as a course page', () => {
    expect(urlFor('/learning-tips', siteHost)).toBeNull()
  })
})
