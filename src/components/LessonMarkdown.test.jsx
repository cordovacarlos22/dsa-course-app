import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LessonMarkdown from './LessonMarkdown'

const TABLE = `
| Big O | Name     |
| ----- | -------- |
| O(1)  | constant |
| O(n)  | linear   |
`

describe('LessonMarkdown', () => {
  it('puts a table in a box that can scroll sideways on small phones', () => {
    render(<LessonMarkdown markdown={TABLE} />)

    const box = screen.getByRole('region', { name: 'Table' })
    expect(box).toHaveClass('overflow-x-auto')
    expect(box).toHaveAttribute('tabindex', '0')
    expect(within(box).getByRole('table')).toHaveTextContent('O(n)linear')
  })
})
