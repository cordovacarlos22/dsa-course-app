import { expect, it } from 'vitest'

// Deliberately wrong, to prove the Unit tests job fails. Never merge.
it('fails on purpose', () => {
  expect(1 + 1).toBe(3)
})
