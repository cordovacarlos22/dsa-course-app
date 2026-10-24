// In production the landing page (charliecodeacademy.com) and the course
// (app.charliecodeacademy.com) are two addresses of the same app. A page that
// belongs to the other address has to load there, so the course's browser
// storage (progress, language) always lives on the course's address.
//
// Returns the full URL to send the student to, or null to stay here. Without
// both origins (dev, tests, previews, staging) it always returns null.
export function crossSiteUrl({
  pathname,
  here,
  siteOrigin,
  appOrigin,
  language,
}) {
  if (!siteOrigin || !appOrigin) return null
  const isCoursePage = pathname === '/learn' || pathname.startsWith('/learn/')
  const target = isCoursePage ? appOrigin : siteOrigin
  if (target === here) return null
  // The language comes along: each address has its own browser storage.
  return `${target}${pathname}?lang=${language}`
}

// replace() keeps Back working: it returns to the page the student came from.
export function goTo(url) {
  window.location.replace(url)
}
