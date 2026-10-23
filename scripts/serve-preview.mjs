// Serves the production build (dist/) the way Vercel does: every route that
// isn't a file falls back to index.html, and every response gets the
// security headers from vercel.json. The end-to-end tests and QA use it, so
// a Content-Security-Policy problem shows up before it reaches production.
// Usage: npm run build && node scripts/serve-preview.mjs [port]
import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname, resolve, sep } from 'node:path'

const port = Number(process.argv[2] ?? process.env.PORT ?? 4174)
const root = resolve(import.meta.dirname, '..')
const dist = join(root, 'dist')

if (!existsSync(join(dist, 'index.html'))) {
  console.error('No build found. Run `npm run build` first.')
  process.exit(1)
}

const config = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'))
const headers = config.headers.flatMap((rule) => rule.headers)
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
}

createServer((request, response) => {
  const path = decodeURIComponent(
    new URL(request.url, 'http://localhost').pathname,
  )
  let file = resolve(dist, '.' + path)
  // Never serve anything outside dist/ (e.g. /../package.json).
  const insideDist = file === dist || file.startsWith(dist + sep)
  if (!insideDist || !existsSync(file) || statSync(file).isDirectory()) {
    file = join(dist, 'index.html')
  }
  for (const { key, value } of headers) response.setHeader(key, value)
  response.setHeader(
    'Content-Type',
    types[extname(file)] ?? 'application/octet-stream',
  )
  response.end(readFileSync(file))
}).listen(port, () =>
  console.log(
    `Serving dist/ with vercel.json's headers on http://localhost:${port}`,
  ),
)
