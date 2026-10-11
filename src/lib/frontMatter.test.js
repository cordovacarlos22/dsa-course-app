import { describe, it, expect } from 'vitest'
import { parseFrontMatter } from './frontMatter'

describe('parseFrontMatter', () => {
  it('reads key: value lines and turns whole numbers into numbers', () => {
    const { data, body } = parseFrontMatter(
      '---\ntitle: What is Big O?\norder: 1\nminutes: 6\n---\n# Hello',
    )
    expect(data).toEqual({ title: 'What is Big O?', order: 1, minutes: 6 })
    expect(body).toBe('# Hello')
  })

  it('keeps colons that are part of the value', () => {
    expect(parseFrontMatter('---\ntitle: Big O: O(n)\n---\n').data.title).toBe(
      'Big O: O(n)',
    )
  })

  it('handles Windows line endings', () => {
    expect(parseFrontMatter('---\r\norder: 2\r\n---\r\nText').data).toEqual({
      order: 2,
    })
  })

  it('returns empty data when there is no front matter', () => {
    expect(parseFrontMatter('# Just text')).toEqual({
      data: {},
      body: '# Just text',
    })
  })
})
