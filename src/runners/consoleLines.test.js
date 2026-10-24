import { describe, it, expect } from 'vitest'
import { tagConsoleCalls } from './consoleLines'

describe('tagConsoleCalls', () => {
  it('tells each console call which line it is on', () => {
    expect(
      tagConsoleCalls("let a = 1\nconsole.log(a)\nconsole.warn('!')"),
    ).toBe("let a = 1\nconsole.atLine(2).log(a)\nconsole.atLine(3).warn('!')")
  })

  it('tags a call inside another call, and leaves other code alone', () => {
    expect(tagConsoleCalls('console.error(console.log(1), Math.max(2))')).toBe(
      'console.atLine(1).error(console.atLine(1).log(1), Math.max(2))',
    )
  })

  it('never adds or removes a line', () => {
    const code =
      "console\n  .log('split')\n/* console.log() */\nconsole.info(`${1}`)"
    const tagged = tagConsoleCalls(code)
    expect(tagged.split('\n')).toHaveLength(code.split('\n').length)
    expect(tagged).toContain("console\n  .log('split')")
    expect(tagged).toContain('/* console.log() */')
    expect(tagged).toContain('console.atLine(4).info(`${1}`)')
  })
})
