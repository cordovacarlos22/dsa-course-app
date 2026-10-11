---
title: Dropping non-dominant terms
order: 7
minutes: 5
---

> **Goal:** simplify expressions like O(n² + n) with the second rule: keep only the term that grows fastest.

## A nested loop, then a single loop

A teacher prints a "who sat next to whom" grid for the class, then a simple attendance list:

```js-run
function grid(students) {
  let steps = 0
  for (const a of students) {
    for (const b of students) {
      steps++ // one cell of the grid
    }
  }
  for (const student of students) {
    steps++ // one line of the attendance list
  }
  return steps
}

console.log(grid(['Ana', 'Bo', 'Cai', 'Dee']), 'steps for 4 students')
```

The grid takes **n²** steps and the list takes **n** steps: **n² + n** in total. Is that O(n² + n)?

## Rule 2: drop the non-dominant terms

Watch what each part contributes as the class grows:

```js-run
for (const n of [10, 100, 1000]) {
  const squared = n * n
  const total = squared + n
  const share = ((squared / total) * 100).toFixed(1)
  console.log('n =', n, '→ n² =', squared, '+ n =', n, '→ n² is', share + '% of the work')
}
```

As `n` grows, the n² part is almost all of the work, and the extra `n` barely matters. n² is the **dominant term**; n is **non-dominant**. So we drop it:

**O(n² + n) → O(n²)**

The same idea works for any mix. Keep the fastest-growing term:

| You counted  | Write it as |
| ------------ | ----------- |
| n² + n       | O(n²)       |
| n + 1000     | O(n)        |
| n³ + n² + 5  | O(n³)       |
| 2n² + 7n + 3 | O(n²)       |

Remember both rules together: first drop the constants, then the non-dominant terms.

## Recap

- **Drop the non-dominant terms:** keep only the part that grows fastest.
- O(n² + n) → O(n²), O(n + 1000) → O(n).
- Combined with rule 1: O(2n² + 7n + 3) → O(n²).

## Check yourself

1. Simplify O(n² + 50n).
2. Simplify O(n + 1,000,000). (Careful: the big number is still a constant!)
3. A function has a nested loop, then two single loops over the same array. What's its Big O?
