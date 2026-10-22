---
title: Counting operations
order: 3
minutes: 10
---

> **Goal:** count the simple operations of a function instead of timing it, and see why the exact count doesn't matter.

## Count the formula

If seconds change from machine to machine, what doesn't? How many **simple operations** the code needs. A **simple operation** is one small step: an addition, a subtraction, a multiplication, a division, a comparison like `i <= n`, or giving a variable a value (an **assignment**). Five operations are five operations on a fast laptop or an old phone. A faster computer does each one sooner, but it can't skip any.

That's the idea behind Big O: instead of timing code, we count how many operations it needs, and, more importantly, how that count changes when the input grows. Counting doesn't need a stopwatch, doesn't change between runs, and works on code you haven't even run yet.

Numbers that are just written in the code, like the `1` and `2` in the formula, aren't operations: they're values the computer already has. And the size of a number doesn't matter either. Multiplying 3 × 4 and multiplying 3,000,000 × 4,000,000 are both one multiplication for the computer. Let's count the formula version first:

```viz
trace-sum-formula
```

**What just happened:** `n * (n + 1) / 2` has one addition, one multiplication and one division: **3 operations**. Here's the important part: it doesn't matter if n is 2 or 1,000,000,000. Pick **n = 1,000,000** in the animation and watch the counter stop at 3. The work never grows.

Try it with a really big n. The answer appears instantly, because a billion costs the same 3 operations as 3 does:

```js-run
function sumOneToFormula(n) {
  return n * (n + 1) / 2
}

console.log(sumOneToFormula(3)) // 3 operations
console.log(sumOneToFormula(1000000000)) // still 3 operations
```

**Common mistake:** thinking a bigger number means more operations. The formula with n = 1,000,000,000 doesn't do a billion of anything. The input's **size** only matters when the code does something once per item, or once per number, like a loop.

## Count the loop

Now the loop version. Its `+` isn't one operation anymore, because it sits **inside a loop**. An operation inside a loop runs once for every turn of the loop, so to count it, you multiply by the number of turns. That's the key skill for the rest of this module: find the loops, then ask how many times each one runs.

Let's go line by line:

- `runningSum = runningSum + i` is an addition **and** an assignment, and it runs once per number: n additions and n assignments. If n is 5, that's 5 of each; if n is a billion, a billion of each.
- `i++` is short for `i = i + 1`: another addition and another assignment, again n times.
- `i <= n` is a comparison, checked n times.
- `let runningSum = 0` and `let i = 1` happen only **once**, at the start.

Add it up and you get about **5n + 2** operations: 5 for every number, plus 2 at the start. Watch the counter climb:

```viz
trace-sum-loop
```

**What just happened:** every turn of the loop cost the same 5 operations: the comparison, the addition and assignment in `runningSum = runningSum + i`, and the addition and assignment in `i++`. With n = 3 that's 5 × 3 + 2 = 17. Pick **n = 10** and you get 5 × 10 + 2 = 52. The two operations at the start never repeat; everything else repeats once per number.

| n     | Loop (5n + 2) | Formula |
| ----- | ------------- | ------- |
| 5     | 27            | 3       |
| 10    | 52            | 3       |
| 1,000 | 5,002         | 3       |

Here's the loop again, this time keeping its own count as it goes:

```js-run
function countOperations(n) {
  let operations = 2 // let runningSum = 0 and let i = 1, once each
  let runningSum = 0
  for (let i = 1; i <= n; i++) {
    runningSum = runningSum + i
    operations = operations + 5 // the comparison, + and = in runningSum, + and = in i++
  }
  return operations
}

console.log(countOperations(5)) // 27
console.log(countOperations(10)) // 52
console.log(countOperations(1000)) // 5002
```

**Common mistake:** worrying that your count doesn't match someone else's. Is the comparison that finally ends the loop one more operation? Is `i++` one operation or two? People get slightly different totals, like 5n + 2 or 5n + 3, and that's fine. As the next step shows, the exact number isn't what we're after.

## Fuzzy counting

Here's the good news: **the exact number doesn't matter**. Whether it's 5n + 2, 3n or 2n, what matters is the **general trend**: the operation count rises **roughly in proportion to n** as n gets bigger. Double n and you double the work. Multiply n by 1,000 and the work grows about 1,000 times. That's the big picture, and the big picture is what Big O cares about.

Why can we ignore the details? Because with a big n, they stop mattering. With n = 1,000,000, the "+ 2" in 5n + 2 is two operations out of five million. And whether each number costs 5 operations or 3, the loop is still the one whose work grows with n, while the formula's doesn't grow at all. That difference is what decides which solution survives a huge input.

```viz
linear-boxes
```

**What just happened:** welcoming each guest was one step, so 4 guests took 4 steps, 8 took 8 and 16 took 16. The dots formed a straight line: double the guests, double the work. That steady, in-proportion growth is what our loop has too, whatever its exact count per number.

The same thing happens when you count the guests. Counting them one by one with a loop takes about 5 operations per guest:

```viz
trace-count-guests
```

**What just happened:** the loop paid 5 operations for every guest, plus 3 at the start: 5n + 3, a straight line again. But the last caption pointed out a shortcut: JavaScript already knows how many items an array has, so `guests.length` gives the same answer in **1 step**, whether there are 4 guests or 4 million. Same answer, completely different growth.

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']

// Counting one by one: the work grows with the guests.
let count = 0
for (let i = 0; i < guests.length; i++) {
  count = count + 1
}
console.log('With a loop:', count)

// Asking the array: one step, however many guests there are.
console.log('With length:', guests.length)
```

So we won't count every single operation from now on. Big O is a kind of **fuzzy counting**: count roughly, then keep only how the count grows. The next lessons show how.

**Common mistake:** thinking `guests.length` loops through the array to count it. An array keeps its length up to date every time it changes, so reading `length` is a single step. The cost is in loops you write yourself, and in methods that loop for you.
