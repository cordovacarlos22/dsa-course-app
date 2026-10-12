---
title: Visualizing time complexities
order: 4
minutes: 6
---

> **Goal:** see the growth of two solutions on a chart, and learn to read the trend instead of the exact numbers.

## Plot the time

One stopwatch measurement doesn't tell us much. But what if we time both versions of `sumUpTo` for **bigger and bigger n** and put every result on a chart?

```viz
timing-chart
```

Making a chart like this is simple: for each value of n, start a timer, run the function, stop the timer, and put a dot at (n, time). Then connect the dots. Two very different pictures appear:

- **The loop version** forms a straight line. Each time n grows by the same amount, the time grows by about the same amount. That matches what we counted: about 5n + 2 operations, so the time grows **in proportion** to n.
- **The formula version** stays flat along the bottom. Whether n is 200 million or a billion, it takes about the same tiny amount of time, because it always does 3 operations.

At n = 1 billion the difference is huge: more than a second for the loop, a tiny fraction of a millisecond for the formula. The exact times on the chart are examples; your computer will give different ones. The **shapes** are what every computer agrees on. The dots won't land perfectly on a line (real computers are noisy), but they're close enough to see the trend clearly.

## Try it yourself

```viz
stopwatch-race
```

Run this to time both versions for growing values of n on your own computer. Run it a few times:

```js-run
function sumUpTo(n) {
  let total = 0
  for (let i = 1; i <= n; i++) {
    total = total + i
  }
  return total
}

function sumUpToFormula(n) {
  return n * (n + 1) / 2
}

const sizes = [1000, 10000, 100000, 1000000, 10000000]
for (let k = 0; k < sizes.length; k++) {
  const n = sizes[k]
  let start = performance.now()
  sumUpTo(n)
  const loopTime = performance.now() - start
  start = performance.now()
  sumUpToFormula(n)
  const formulaTime = performance.now() - start
  console.log('n =', n, '| loop:', loopTime.toFixed(3), 'ms | formula:', formulaTime.toFixed(3), 'ms')
}
```

With small n, the loop's times jump around: at that tiny scale, everything else happening on your computer is bigger than the work itself. Don't let that confuse you. As n gets big, the loop's time climbs steadily (roughly 10 times more work each time n is 10 times bigger), while the formula's time barely moves.

That's the lesson: **don't read the exact numbers, read the trend**.

## The shapes Big O names

```viz
big-o-growth-chart
```

These trends are exactly what Big O describes. The flat line of the formula is called **O(1)**, or constant time. The straight line of the loop is **O(n)**, or linear time. There are a few more shapes you'll meet in this module: **O(n²)**, which curves up steeply, and **O(log n)**, which grows very slowly.

Here's what those shapes mean in practice. Going from 1,000 items to 1,000,000 items (1,000 times more), an O(1) function does the same work, an O(n) function does 1,000 times more work, and an O(n²) function does a **million** times more. That's why the shape matters more than any single measurement.

Step through the chart and compare them. In the next lesson we'll give Big O its official definition, and then go through each shape one by one.
