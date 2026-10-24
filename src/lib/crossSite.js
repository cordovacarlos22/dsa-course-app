// In production the landing page (charliecodeacademy.com) and the course
// (app.charliecodeacademy.com) are two addresses of the same app. A page that
// belongs to the other address has to load there, so the course's browser
// storage (progress, language) always lives on the course's address.
//
// Returns the full URL to send the student to, or null to stay here. Without
// both origins (dev, tests, previews, staging) it always returns null.
export function crossSiteUrl({
  pathname,
  search = '',
  hash = '',
  here,
  siteOrigin,
  appOrigin,
  language,
}) {
  const siteHost = hostOf(siteOrigin)
  const appHost = hostOf(appOrigin)
  if (!siteHost || !appHost) return null
  const isCoursePage = pathname === '/learn' || pathname.startsWith('/learn/')
  // Hosts, not whole origins: a trailing slash or http:// in a Vercel
  // setting must never make a page send students to itself forever.
  if ((isCoursePage ? appHost : siteHost) === here) return null
  // Glue the path onto the address as text: new URL(path, base) would read a
  // crafted path that starts with // as a different website.
  const target = new URL(isCoursePage ? appOrigin : siteOrigin).origin
  const url = new URL(target + pathname + search + hash)
  // The language comes along: each address has its own browser storage.
  url.searchParams.set('lang', language)
  return url.href
}

// The host of an origin like "https://app.charliecodeacademy.com", or null
// when it's unset or not a URL (then the app stays on one address).
function hostOf(origin) {
  try {
    return new URL(origin).host
  } catch {
    return null
  }
}

// replace() keeps Back working: it returns to the page the student came from.
export function goTo(url) {
  window.location.replace(url)
}
