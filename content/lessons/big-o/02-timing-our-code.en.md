---
title: Timing our code
order: 2
minutes: 12
---

> **Goal:** compare two working solutions with a stopwatch, and see why timing isn't a good enough measure.

## The loop version

To compare solutions, we need a problem with more than one good answer. Here's ours: **write a function that adds up every number from 1 to n**, including n itself. With n = 3, the answer is 1 + 2 + 3 = 6. With n = 6, it's 1 + 2 + 3 + 4 + 5 + 6 = 21.

The first idea most people have is an **accumulator**: a variable that starts at 0 and collects the answer a piece at a time. Make a `runningSum` at 0, loop from 1 up to n, and add each number to `runningSum` on the way. When the loop ends, `runningSum` holds the sum. It's the solution that comes to mind first because it does exactly what you'd do by hand.

Watch it run, one line at a time:

```viz
trace-sum-loop
```

**What just happened:** `runningSum` started at 0. On each turn of the loop, `i` was the next number, and `runningSum = runningSum + i` added it in. With n = 3, `runningSum` went 0 → 1 → 3 → 6. Then `i` became 4, the check `i <= n` failed, the loop stopped, and the function returned 6. Notice how the work grows: n = 3 took three turns, and n = 10 would take ten.

Here's the same code. Press **Run** to check a few answers:

```js-run
function sumOneTo(n) {
  let runningSum = 0
  for (let i = 1; i <= n; i++) {
    runningSum = runningSum + i
  }
  return runningSum
}

console.log(sumOneTo(3)) // 6
console.log(sumOneTo(6)) // 21
console.log(sumOneTo(100)) // 5050
```

**Common mistake:** writing the loop as `i < n`. It stops one number too early, so `sumOneTo(3)` adds 1 + 2 and returns 3. The problem says "up to and including n", so the check is `i <= n`.

## The formula version

The second solution looks completely different. There's no loop at all, just one line of math: **n × (n + 1) ÷ 2**. It's less intuitive than the loop, and you wouldn't come up with it unless you'd seen it before. That's fine: in real code, a lot of good solutions are tricks someone found once and everyone shares.

Why does it work? Write the numbers 1 to 100 in a row, then pair them from both ends: 1 + 100, 2 + 99, 3 + 98… Every pair adds up to 101, and there are 50 pairs, so the total is 50 × 101 = 5,050. The formula does exactly that for any n: there are n ÷ 2 pairs, and each pair adds up to n + 1. (A well-known story says the mathematician Carl Friedrich Gauss found this as a schoolboy, when his teacher asked the class to add up 1 to 100.)

How it works isn't the point of this lesson, though. What matters is that it gives the same answers. Watch it:

```viz
trace-sum-formula
```

**What just happened:** with n = 3, the formula did n + 1 = 4, then 3 × 4 = 12, then 12 ÷ 2 = 6. That's the same 6 the loop got, but with no loop at all: three small math steps. Pick a bigger n in the animation, like 1,000,000, and it's still three steps. (The same goes for n = 6: 6 + 1 = 7, 6 × 7 = 42, 42 ÷ 2 = 21.)

Run it and compare with the loop's answers:

```js-run
function sumOneToFormula(n) {
  return n * (n + 1) / 2
}

console.log(sumOneToFormula(3)) // 6
console.log(sumOneToFormula(6)) // 21
console.log(sumOneToFormula(100)) // 5050
```

It's shorter, but shorter doesn't automatically mean better. Two working solutions, so which one **is** better?

**Common mistake:** dropping the parentheses. `n * n + 1 / 2` isn't the same formula: JavaScript multiplies and divides before it adds, so it works out `n * n` and `1 / 2` first, and `sumOneToFormula(3)` would return 9.5. The parentheses in `n * (n + 1) / 2` make the addition happen first.

## What does "better" mean?

Before we can answer, we have to agree on what "better" means. It could mean:

- **Faster:** it finishes in less time.
- **Faster for big inputs:** fast with small numbers is easy, but what about adding up to a billion?
- **Less memory:** it creates fewer variables and stores less data while it runs.
- **More readable:** someone else can understand and change it.
- **Shorter:** some people love code with as few characters as possible.

All of these are valid, and the right answer depends on the situation. But most developers agree that **speed and memory** usually come first, and sadly, chasing them often makes code harder to read. Writing code that's fast, light **and** still easy to read is the balancing act of good programming, and it will come up again and again in this course.

"Faster for big inputs" is the one that separates our two solutions. With small numbers, both finish instantly. The difference only shows up as n grows, and that's what this chart is about:

```viz
big-o-growth-chart
```

**What just happened:** each line showed how the work grows as n grows. Near the left edge, where n is small, the lines sit close together, so every solution looks fine. Further right, they spread far apart. That's why we judge speed by what happens with **big** inputs: that's where a slow solution hurts.

Readability matters too. These two functions do the same math, but only one of them tells you what it's doing:

```js-run
// Short, but hard to read:
function f(x) {
  return x * (x + 1) / 2
}

// The same math, with names that explain it:
function sumOneToFormula(n) {
  const pairs = n / 2
  const eachPairAddsUpTo = n + 1
  return pairs * eachPairAddsUpTo
}

console.log(f(100), sumOneToFormula(100))
```

We'll start with speed, and come back to memory later in this module.

**Common mistake:** treating "fewer characters" as "faster". The number of characters in your code says nothing about how much work it does. A one-line call to a built-in method can hide a loop over a million items.

## Let's time them

The simplest way to measure speed is a stopwatch. In the browser, `performance.now()` tells you how many milliseconds have passed since the page opened. Save it in a variable before the code runs, check it again after, and subtract: the difference is how long the code took, in milliseconds. (Divide by 1,000 if you want seconds.)

Developers really do this. It's called **benchmarking**, and it's a good way to confirm that a change made your code faster. But time has a problem, and the next animation shows it:

```viz
stopwatch-race
```

**What just happened:** the same code ran on a fast laptop and on an old phone. The laptop finished much sooner, and a second run gave different times on both, even though nothing in the code changed. But both machines did exactly the same number of steps, and the steps only changed when the number of guests changed. In the last scene, a tiny job showed 0.0 ms on both: too fast to measure at all.

Now time our two solutions yourself. Before you press **Run**, predict which one wins, and by roughly how much. Then run it a few times:

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

const n = 100000000 // 100 million

let start = performance.now()
sumOneTo(n)
console.log('Loop:', (performance.now() - start).toFixed(2), 'ms')

start = performance.now()
sumOneToFormula(n)
console.log('Formula:', (performance.now() - start).toFixed(2), 'ms')
```

The formula wins by a mile. But look at the times as you run it again: they change on every run, even though nothing in the code changed. That's the **problem with time**:

1. **Different machines record different times.** The same code is faster on a new laptop than on an old phone. The winner usually stays the same, but the numbers don't.
2. **The same machine records different times.** Other programs, the browser and JavaScript's own optimizations change a little on every run.
3. **Fast code may be too fast to measure.** When several solutions all finish in a tiny fraction of a millisecond, the stopwatch can't tell which one is really the most efficient.

**Under the hood:** two things make the times wobble even on one computer. First, JavaScript engines don't run your code the same way every time: they watch which parts run a lot, like a busy loop, and compile those parts into faster machine code while the program runs. So the first runs can be slower than later ones, before that kicks in. Second, browsers make `performance.now()` a little less precise on purpose, as a security measure, so a job that takes a few microseconds can show up as 0. Both are reasons to benchmark with big inputs and several runs, and both are reasons to count operations instead.

Timing your code isn't a bad idea; developers do it all the time to confirm that a change helped. But imagine code that runs for an hour, compared with another version that runs for four. You don't want to run both (and wait five hours!) just to know which one is better. We need a way to talk about how code performs **without** timing it. That's where Big O comes in.

**Common mistake:** timing once and trusting the number. One run can be thrown off by anything else your computer is doing. If you do benchmark, run it several times, with a big input, and compare the trend, not a single result.
