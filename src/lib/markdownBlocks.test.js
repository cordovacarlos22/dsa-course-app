import { describe, it, expect } from 'vitest'
import { extractFencedBlocks } from './markdownBlocks'

describe('extractFencedBlocks', () => {
  it('finds every fenced block with its language', () => {
    const markdown = [
      'Intro',
      '```viz',
      'array-reindex',
      '```',
      'Middle',
      '```js-run',
      'const a = 1',
      'console.log(a)',
      '```',
      '```',
      'plain',
      '```',
    ].join('\n')

    expect(extractFencedBlocks(markdown)).toEqual([
      { language: 'viz', code: 'array-reindex' },
      { language: 'js-run', code: 'const a = 1\nconsole.log(a)' },
      { language: '', code: 'plain' },
    ])
  })
})
