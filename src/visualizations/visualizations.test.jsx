import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import i18n from '../i18n'
import { visualizations } from './index'
import { VISUALIZATION_NAMES } from './names'
import { buildBinarySearchSteps } from './binarySearchSteps'

describe('visualization registry', () => {
  it('has a component for every name the validator accepts', () => {
    expect(Object.keys(visualizations).sort()).toEqual(
      [...VISUALIZATION_NAMES].sort(),
    )
  })
})

// Plays an animation from the first to the last step and returns every
// caption it showed.
async function playToTheEnd(visualization) {
  const user = userEvent.setup()
  render(createElement(visualization))
  const captions = []
  const next = () => screen.getByRole('button', { name: /next|siguiente/i })
  const caption = () =>
    document.querySelector('figure p[aria-live]').textContent
  captions.push(caption())
  while (!next().disabled) {
    await user.click(next())
    captions.push(caption())
  }
  return captions
}

describe.each(['en', 'es'])('every animation in %s', (language) => {
  it.each(VISUALIZATION_NAMES)(
    '%s plays to the end with a caption on every step',
    async (name) => {
      await i18n.changeLanguage(language)
      const captions = await playToTheEnd(visualizations[name])
      expect(captions.length).toBeGreaterThan(1)
      for (const text of captions) {
        expect(text.trim()).not.toBe('')
        // A missing translation shows its key (e.g. "viz.trace.x.start").
        expect(text).not.toMatch(/viz\.|\{\{/)
      }
    },
  )
})

describe('code trace input picker', () => {
  it('restarts the trace with the input the student picks', async () => {
    const user = userEvent.setup()
    const Trace = visualizations['trace-count-short-names']
    render(<Trace />)
    await user.click(screen.getByRole('button', { name: '16 guests' }))
    expect(
      screen.getByRole('button', { name: '16 guests', pressed: true }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Step 1 of/)).toBeInTheDocument()
  })
})

describe('buildBinarySearchSteps', () => {
  it('finds the target in log₂(n) checks', () => {
    const steps = buildBinarySearchSteps([2, 4, 6, 8, 10, 12, 14, 16], 14)
    const last = steps.at(-1)
    expect(last.captionKey).toBe('found')
    expect(last.checks).toBe(3)
  })

  it('narrows the range after every check', () => {
    const steps = buildBinarySearchSteps([1, 2, 3, 4, 5, 6, 7, 8], 1)
    expect(steps.map((step) => step.captionKey)).toEqual([
      'start',
      'goLeft',
      'goLeft',
      'found',
    ])
  })

  it('works on names in ABC order', () => {
    const names = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli', 'Fay', 'Gus', 'Hana']
    expect(buildBinarySearchSteps(names, 'Gus').at(-1).captionKey).toBe('found')
  })
})
