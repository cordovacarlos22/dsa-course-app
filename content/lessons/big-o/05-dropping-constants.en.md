---
title: Dropping constants
order: 5
minutes: 5
---

> **Goal:** simplify Big O expressions like O(2n) and O(500) with the first rule: drop the constants.

## Two passes over the same array

Say you want both the lowest and the highest temperature of the month. One way is to walk the array twice: once for the minimum, once for the maximum.

```js-run
function lowAndHigh(temperatures) {
  let steps = 0

  let low = temperatures[0]
  for (const t of temperatures) {
    steps++
    if (t < low) low = t
  }

  let high = temperatures[0]
  for (const t of temperatures) {
    steps++
    if (t > high) high = t
  }

  return { low, high, steps }
}

console.log(lowAndHigh([18, 22, 15, 30, 25]))
```

5 temperatures, 10 steps: two loops of `n` steps each, so **n + n = 2n**. It's tempting to write O(2n).

## Rule 1: drop the constants

Big O describes the **shape** of the growth, not the exact count. `2n`, `3n` and `100n` are all straight lines: double the input and the work doubles, whatever the number in front.

So we **drop the constant** and write **O(n)**.

The same rule works for any fixed number of operations. A function that always does 5, 50 or 500 steps, no matter the input, is written **O(1)**, never O(5) or O(500).

| You counted | Write it as |
| ----------- | ----------- |
| 2n          | O(n)        |
| 100n        | O(n)        |
| n / 2       | O(n)        |
| 500         | O(1)        |
| 3n²         | O(n²)       |

## But the faster version is still faster!

True. Finding both values in **one** pass does `n` steps instead of `2n`:

```js-run
function lowAndHighOnePass(temperatures) {
  let low = temperatures[0]
  let high = temperatures[0]
  let steps = 0
  for (const t of temperatures) {
    steps++
    if (t < low) low = t
    if (t > high) high = t
  }
  return { low, high, steps }
}

console.log(lowAndHighOnePass([18, 22, 15, 30, 25]))
```

Both versions are O(n). Big O tells you they grow the same way. Constants still matter in practice, but they're a smaller, second-level improvement. Big O is about the big picture first.

## Recap

- **Drop the constants:** O(2n) → O(n), O(500) → O(1), O(3n²) → O(n²).
- Big O keeps the shape of the growth, not the exact number of steps.
- Two separate loops over the same array are still O(n).

## Check yourself

1. How do you write O(4n + 4n) in Big O?
2. A function always does exactly 12 operations. What's its Big O?
3. Is the one-pass version better than O(n)?
