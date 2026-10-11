---
title: Why a stopwatch isn't enough
order: 2
minutes: 6
---

> **Goal:** see why timing code gives unreliable answers, and why counting operations works better.

## Let's time some code

Here's a function that counts the even numbers in an array. We'll run it three times on the same million numbers and time each run with `performance.now()`, the browser's stopwatch:

```js-run
function countEvens(numbers) {
  let count = 0
  for (const number of numbers) {
    if (number % 2 === 0) count++
  }
  return count
}

const numbers = Array.from({ length: 1000000 }, (_, i) => i)

for (let run = 1; run <= 3; run++) {
  const start = performance.now()
  countEvens(numbers)
  const ms = performance.now() - start
  console.log('Run', run, 'took', ms.toFixed(2), 'ms')
}
```

Press **Run** a few times. The times change on every run, even though the code and the input never change!

## What's wrong with timing?

- **Different machines, different times.** A fast laptop and an old phone give completely different numbers for the same code.
- **The same machine isn't consistent either.** Other programs, the browser and JavaScript's own optimizations all affect each run.
- **Tiny inputs hide the difference.** Two very different algorithms can both look "instant" with 10 items.

We need a measure that depends only on the **code** and the **size of the input**.

## Count the operations instead

An operation is a small step: a comparison, an addition, an assignment. Let's count how many times the loop body runs for different input sizes:

```js-run
function countChecks(numbers) {
  let checks = 0
  for (const number of numbers) {
    checks++ // one "is it even?" check per number
  }
  return checks
}

for (const n of [10, 100, 1000, 10000]) {
  const numbers = Array.from({ length: n }, (_, i) => i)
  console.log('n =', n, '→', countChecks(numbers), 'checks')
}
```

This number is the same on every machine and every run. And it reveals the important thing: **the work grows at the same rate as `n`**.

## We don't need the exact count

If you counted every single operation in `countEvens` (setting `count`, each comparison, each `count++`…), you might get something like `2n + 2`. Would `3n + 5` really be different? Not in the way that matters. With a million numbers, both are "about a million times some small number".

What we care about is the **shape** of the growth: does the work stay flat, grow in a straight line, or explode? That's exactly what Big O captures, and in the next lessons you'll learn the simple rules for reading it.

## Recap

- Timing depends on the machine and changes on every run.
- Counting operations depends only on the code and the input size.
- Big O ignores the exact count and keeps the **shape** of the growth.

## Check yourself

1. Name two reasons why timing the same code can give different results.
2. If `countChecks` does 10,000 checks for 10,000 numbers, how many will it do for 50,000?
3. Why don't we care whether a function does `2n + 2` or `3n + 5` operations?
