// Reads the small "front matter" block at the top of a lesson file:
//
//   ---
//   title: What is Big O?
//   order: 1
//   minutes: 6
//   ---
//
// Only simple `key: value` lines are supported, which is all lessons need.
// This file is plain JavaScript (no browser or Node APIs), so both the app
// and scripts/validate-content.js can use it.

const FRONT_MATTER = /^---\n([\s\S]*?)\n---\n?/

function parseValue(rawValue) {
  const value = rawValue.trim()
  if (/^\d+$/.test(value)) return Number(value)
  // Titles that contain ": " must be quoted to be valid YAML, e.g.
  // title: 'O(n): linear time'. The quotes aren't part of the title.
  const quoted = /^(['"])(.*)\1$/.exec(value)
  return quoted ? quoted[2] : value
}

// Returns { data, body }. `data` is {} when the file has no front matter.
export function parseFrontMatter(text) {
  const normalized = text.replace(/\r\n/g, '\n')
  const match = FRONT_MATTER.exec(normalized)
  if (!match) return { data: {}, body: normalized }

  const data = {}
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':')
    if (separator === -1) continue
    const key = line.slice(0, separator).trim()
    if (key) data[key] = parseValue(line.slice(separator + 1))
  }
  return { data, body: normalized.slice(match[0].length) }
}
