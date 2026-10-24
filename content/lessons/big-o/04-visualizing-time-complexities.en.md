---
title: Visualizing time complexities
order: 4
minutes: 11
---

> **Goal:** see the growth of two solutions on a chart, and learn to read the trend instead of the exact numbers.

## Plot the time

One stopwatch measurement doesn't tell us much: it's a single number from a single run on a single computer. But what if we time both versions of `sumOneTo` for **bigger and bigger n** and put every result on a chart? Then we're no longer looking at one number. We're looking at a **trend**: how the time changes as the input grows.

Making a chart like this is simple. The horizontal axis is **n**, the size of the input. The vertical axis is the **time** the function took. For each value of n, start a timer, run the function, stop the timer, and put a dot at (n, time). Then connect the dots. The shape the dots make tells you more than any one of them.

There are two shapes to look for. A **straight line** going up means the time grows **in proportion** to n: each time n grows by the same amount, the time grows by about the same amount. A **flat line** means n doesn't affect the time at all. Here's what our two solutions look like:

```viz
timing-chart
```

**What just happened:** two very different pictures appeared.

- **The loop version** formed a straight line. Each time n grew by 200 million, the time grew by about the same amount. That matches what we counted: about 5n + 2 operations, so the time grows **in proportion** to n.
- **The formula version** stayed flat along the bottom. Whether n is 200 million or a billion, it takes about the same tiny amount of time, because it always does 3 operations.

At n = 1 billion the difference is huge: more than a second for the loop, a tiny fraction of a millisecond for the formula. The exact times on the chart are examples; your computer will give different ones. The **shapes** are what every computer agrees on. The dots won't land perfectly on a line (real computers are noisy), but they're close enough to see the trend clearly.

You can draw the same two shapes with operations instead of time. This prints one `#` per operation, so each line is a bar:

```js-run
const sizes = [1, 2, 3, 4, 5]
for (let k = 0; k < sizes.length; k++) {
  const n = sizes[k]
  let loopBar = ''
  for (let i = 0; i < 5 * n + 2; i++) {
    loopBar = loopBar + '#'
  }
  console.log('n = ' + n + ' | loop:    ' + loopBar)
  console.log('      | formula: ###')
}
```

**Common mistake:** expecting the dots to land exactly on a line. Real timings wobble a little. If the dots are close to a straight line, the growth is linear; you don't need a perfect line to see the shape.

## Try it yourself

Now time both versions on your own computer, for growing values of n. Before you run it, a warning about small inputs: when the work takes a tiny fraction of a millisecond, everything else happening on your computer (other apps, the browser itself, JavaScript getting ready to run your code faster) is bigger than the work itself. That **noise** makes small timings jump around from run to run.

There's also a trick to reading the results: compare each result with the one before it. Our sizes grow 10 times at each step. If the time also grows about 10 times, the work is growing in proportion to n, a straight line. If the time barely changes, the line is flat.

Remember the stopwatch race from lesson 2? Keep its last scene in mind while you run the code:

```viz
stopwatch-race
```

**What just happened:** the times changed from machine to machine and from run to run, but the steps didn't. And in the last scene, a tiny job showed 0.0 ms on both machines, because it was too fast to measure. That's exactly what you're about to see with the smallest values of n.

Run this a few times:

```js-run
function sumOneTo(n) {
  let runningSum = 0
  for (let i = 1; i <= n; i++) {
    runningSum = runningSum + i
  }
  return runningSum
}

function sumOneToFormula(n) {
  return n * (n + 1) / 2
}

const sizes = [1000, 10000, 100000, 1000000, 10000000]
for (let k = 0; k < sizes.length; k++) {
  const n = sizes[k]
  let start = performance.now()
  sumOneTo(n)
  const loopTime = performance.now() - start
  start = performance.now()
  sumOneToFormula(n)
  const formulaTime = performance.now() - start
  console.log('n =', n, '| loop:', loopTime.toFixed(3), 'ms | formula:', formulaTime.toFixed(3), 'ms')
}
```

With small n, the loop's times jump around: at that tiny scale, everything else happening on your computer is bigger than the work itself. Don't let that confuse you. As n gets big, the loop's time climbs steadily (roughly 10 times more work each time n is 10 times bigger), while the formula's time barely moves.

That's the lesson: **don't read the exact numbers, read the trend**.

Here's the comparison trick done with operation counts, which never wobble. Each size is 10 times the one before, so divide each count by the previous one: about 10 means the work grows in proportion to n, and 1 means it doesn't grow at all. Predict what the numbers will show, then run it:

```js-run
const sizes = [1000, 10000, 100000, 1000000]
let previousLoop = 0
let previousFormula = 0
for (let k = 0; k < sizes.length; k++) {
  const n = sizes[k]
  const loopOperations = 5 * n + 2
  const formulaOperations = 3
  let growth = ''
  if (previousLoop > 0) {
    const loopGrowth = (loopOperations / previousLoop).toFixed(2)
    const formulaGrowth = (formulaOperations / previousFormula).toFixed(2)
    growth = ' (times the last one: loop ' + loopGrowth + ', formula ' + formulaGrowth + ')'
  }
  console.log('n = ' + n + ': loop ' + loopOperations + ', formula ' + formulaOperations + growth)
  previousLoop = loopOperations
  previousFormula = formulaOperations
}
```

Every time n grew 10 times, the loop's count grew 10 times: a straight line. The formula's count stayed at 3, a ratio of 1: a flat line. Use the same test on real timings: with big inputs, a ratio near 10 means the work grows in proportion to n, even when the exact milliseconds wobble.

**Common mistake:** deciding from one small run that the loop is "sometimes faster". With tiny inputs, the noise is bigger than the work, so either version can look faster. Only big inputs show which one really grows.

## The shapes Big O names

These trends are exactly what Big O describes. Each shape has a name, written with a capital O and, in parentheses, how the work grows with n:

- **O(1)**, **constant time:** a flat line. The work stays the same however big n gets, like the formula.
- **O(n)**, **linear time:** a straight line. The work grows in proportion to n, like the loop.
- **O(n²)**, **quadratic time:** a curve that bends up steeply. The work grows with n × n.
- **O(log n)**, **logarithmic time:** a curve that grows very slowly. Doubling n adds just one more step.
- **O(n log n)**, **linearithmic time:** a curve that climbs a little faster than O(n)'s straight line. It's how the best general sorting algorithms grow, like merge sort.

You'll meet each of these again later in the module, most of them in a lesson of their own (O(n log n) comes with logarithms). For now, the point is that the **shape matters more than any single measurement**. Going from 1,000 items to 1,000,000 items (1,000 times more), an O(1) function does the same work, an O(n) function does 1,000 times more work, and an O(n²) function does a **million** times more.

```viz
big-o-growth-chart
```

**What just happened:** the chart drew each shape on the same axes. O(1) stayed flat, O(log n) crept up slowly, O(n) climbed in a straight line, and O(n²) shot up, reaching 1,000,000 operations by n = 1,000. Step through it again and compare where each line is at the right edge. (O(n log n) isn't on this chart: you'll see it next to these in the logarithms lesson.)

Run the numbers behind that comparison:

```js-run
const small = 1000
const big = 1000000 // 1,000 times more items

console.log('O(1):  ', 1, '→', 1, 'operations')
console.log('O(n):  ', small, '→', big, 'operations')
console.log('O(n²): ', small * small, '→', big * big, 'operations')
console.log('O(n²) grew', (big * big) / (small * small), 'times')
```

In the next lesson we'll give Big O its official definition, and then go through each shape one by one.

**Common mistake:** thinking O(n²) is "a little worse" than O(n). With 10 items the difference is small (100 steps against 10). With a million items, it's a million steps against a **trillion**. The gap keeps growing as n grows.
