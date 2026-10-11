import { describe, it, expect } from 'vitest'
import { splitSteps } from './steps'

describe('splitSteps', () => {
  it('starts a new step at every ## heading, with the intro in step 1', () => {
    const steps = splitSteps(
      [
        '> Goal: learn things',
        '',
        '## First',
        'One',
        '',
        '## Second',
        'Two',
      ].join('\n'),
    )
    expect(steps).toEqual([
      { title: 'First', body: '> Goal: learn things\n\nOne' },
      { title: 'Second', body: 'Two' },
    ])
  })

  it('ignores ## lines inside code blocks', () => {
    const steps = splitSteps(
      ['## Only step', '```js', '## not a heading', '```'].join('\n'),
    )
    expect(steps).toHaveLength(1)
    expect(steps[0].body).toContain('## not a heading')
  })

  it('treats a lesson without headings as one step', () => {
    expect(splitSteps('Just text')).toEqual([
      { title: null, body: 'Just text' },
    ])
  })

  it('does not split on ### subheadings', () => {
    expect(splitSteps('## A\n### detail\ntext')).toHaveLength(1)
  })
})
