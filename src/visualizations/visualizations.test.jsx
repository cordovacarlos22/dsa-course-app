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

describe('arrays and objects animations', () => {
  async function renderAtStep(name, nextClicks) {
    await i18n.changeLanguage('en')
    const user = userEvent.setup()
    const Animation = visualizations[name]
    render(<Animation />)
    for (let i = 0; i < nextClicks; i++) {
      await user.click(screen.getByRole('button', { name: /next/i }))
    }
  }

  it('re-indexes the array but not the object when adding at the start', async () => {
    await renderAtStep('array-vs-object', 3)
    expect(screen.getByText("guests.unshift('Zoe')")).toBeInTheDocument()
    expect(screen.getByText('touches 6 boxes')).toBeInTheDocument()
    expect(screen.getByText("rsvps['Zoe'] = 'no'")).toBeInTheDocument()
    expect(screen.getByText('touches 1 box')).toBeInTheDocument()
  })

  it('reads a key in one step, even in a huge object', async () => {
    await renderAtStep('object-access', 4)
    expect(screen.getByText(/a million guests/)).toBeInTheDocument()
    expect(screen.getByText('touches 1 box')).toBeInTheDocument()
  })

  it('builds the keys array one key at a time', async () => {
    await renderAtStep('object-to-array', 5)
    expect(
      screen.getByText("Next key: 'Eli'. That's 5 steps so far."),
    ).toBeInTheDocument()
    expect(screen.getByText('touches 5 boxes')).toBeInTheDocument()
  })

  it('places O(n log n) between O(n) and O(n²)', async () => {
    await renderAtStep('sort-growth-chart', 3)
    expect(
      screen.getByRole('img', { name: 'O(n), O(n log n), O(n²)' }),
    ).toBeInTheDocument()
  })

  it('keeps the original growth chart without O(n log n)', async () => {
    await renderAtStep('big-o-growth-chart', 4)
    expect(
      screen.getByRole('img', { name: 'O(1), O(log n), O(n), O(n²)' }),
    ).toBeInTheDocument()
  })
})

describe('problem-solving approach animations', () => {
  async function renderAtStep(name, nextClicks) {
    await i18n.changeLanguage('en')
    const user = userEvent.setup()
    const Animation = visualizations[name]
    render(<Animation />)
    for (let i = 0; i < nextClicks; i++) {
      await user.click(screen.getByRole('button', { name: /next/i }))
    }
  }

  it('reveals the five questions of step 1, one at a time', async () => {
    await renderAtStep('five-steps-understand', 5)
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent(
      'Understand the problem',
    )
    expect(screen.getByText('What will I call things?')).toBeInTheDocument()
  })

  it('turns the hard examples into decisions', async () => {
    await renderAtStep('example-ladder', 7)
    expect(
      screen.getByText('Not a string: we only accept strings'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Count the space?')).not.toBeInTheDocument()
  })

  it('says the character right after Z is not a letter', async () => {
    await renderAtStep('char-code-ranges', 6)
    expect(
      screen.getByText("'['.charCodeAt(0) → 91 → false"),
    ).toBeInTheDocument()
  })

  it('counts only letters and digits once every layer is back', async () => {
    await renderAtStep('solution-layers', 5)
    expect(screen.getByText('h')).toBeInTheDocument()
    expect(screen.queryByText('␣')).not.toBeInTheDocument()
    expect(screen.queryByText('!')).not.toBeInTheDocument()
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
