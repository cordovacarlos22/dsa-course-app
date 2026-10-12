---
title: Timing our code
order: 2
minutes: 9
---

> **Goal:** compare two working solutions with a stopwatch, and see why timing isn't a good enough measure.

## The loop version

Let's compare two solutions to the same problem: **write a function that adds up every number from 1 to n**. With n = 3, the answer is 1 + 2 + 3 = 6.

The first idea most people have: start a `total` at 0, then loop from 1 to n and add each number. Watch it run:

```viz
trace-sum-loop
```

Here's the same code. Press **Run** to check a few answers:

```js-run
function sumUpTo(n) {
  let total = 0
  for (let i = 1; i <= n; i++) {
    total = total + i
  }
  return total
}

console.log(sumUpTo(3)) // 6
console.log(sumUpTo(6)) // 21
console.log(sumUpTo(100)) // 5050
```

## The formula version

The second solution looks completely different. There's no loop at all, just one line of math: **n × (n + 1) ÷ 2**.

```viz
trace-sum-formula
```

Why does it work? Write the numbers 1 to 100 in a row, then pair them from both ends: 1 + 100, 2 + 99, 3 + 98… Every pair adds up to 101, and there are 50 pairs, so the total is 50 × 101 = 5,050. The formula does exactly that for any n. How it works isn't the point of this lesson, though. What matters is that it gives the same answers:

```js-run
function sumUpToFormula(n) {
  return n * (n + 1) / 2
}

console.log(sumUpToFormula(3)) // 6
console.log(sumUpToFormula(6)) // 21
console.log(sumUpToFormula(100)) // 5050
```

It's shorter, but shorter doesn't automatically mean better. Two working solutions, so which one **is** better?

## What does "better" mean?

```viz
big-o-growth-chart
```

Before we can answer, we have to agree on what "better" means. It could mean:

- **Faster:** it finishes in less time.
- **Faster for big inputs:** fast with small numbers is easy, but what about adding up to a billion?
- **Less memory:** it creates fewer variables and stores less data while it runs.
- **More readable:** someone else can understand and change it.
- **Shorter:** some people love code with as few characters as possible.

All of these are valid, and the right answer depends on the situation. But most developers agree that **speed and memory** usually come first, and unfortunately they often come at the cost of readability. Writing code that's fast, light **and** still easy to read is the balancing act of good programming, and it will come up again and again in this course.

We'll start with speed, and come back to memory later in this module.

## Let's time them

```viz
stopwatch-race
```

The simplest way to measure speed is a stopwatch. In the browser, `performance.now()` tells you how many milliseconds have passed since the page opened. Save it before the code runs, check it again after, and subtract. Press **Run** a few times:

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

const n = 100000000 // 100 million

let start = performance.now()
sumUpTo(n)
console.log('Loop:', (performance.now() - start).toFixed(2), 'ms')

start = performance.now()
sumUpToFormula(n)
console.log('Formula:', (performance.now() - start).toFixed(2), 'ms')
```

The formula wins by a mile. But look at the times as you run it again: they change on every run, even though nothing in the code changed. That's the **problem with time**:

1. **Different machines record different times.** The same code is faster on a new laptop than on an old phone. The winner usually stays the same, but the numbers don't.
2. **The same machine records different times.** Other programs, the browser and JavaScript's own optimizations change a little on every run.
3. **Fast code may be too fast to measure.** When several solutions all finish in a tiny fraction of a millisecond, the stopwatch can't tell which one is really the most efficient.

Timing your code isn't a bad idea; developers do it all the time to confirm that a change helped. But imagine code that runs for an hour, compared with another version that runs for four. You don't want to run both (and wait five hours!) just to know which one is better. We need a way to talk about how code performs **without** timing it. That's where Big O comes in.
