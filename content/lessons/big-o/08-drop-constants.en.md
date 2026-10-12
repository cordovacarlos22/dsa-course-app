---
title: Drop the constants
order: 8
minutes: 7
---

> **Goal:** simplify expressions like O(2n) with the first rule: drop the constants.

## Two loops in a row

Big O has a few rules that simplify the notation and make our lives easier. The first one is called **drop constants** (you'll also hear "remove constants").

Take `printNumbers` from the last lesson and add a second loop that does the same thing, using `j` instead of `i`:

```js-run
function printTwice(n) {
  for (let i = 0; i < n; i++) {
    console.log(i)
  }
  for (let j = 0; j < n; j++) {
    console.log(j)
  }
}

printTwice(3)
```

With 3, it prints 0, 1, 2 from the first loop, then 0, 1, 2 again from the second. Both loops run n times, so the code runs **n + n = 2n** times. Here's the same shape with the guest list, a welcome loop and then a goodbye loop:

```viz
trace-welcome-and-goodbye
```

It makes sense to call this **O(2n)**. But this is where the simplification comes in: it doesn't matter if it's 2n, 3n or 100n. If there's a constant, **we drop the constant**, and this code is **O(n)**.

## Same shape, so drop the number

```viz
same-shape
```

Why is that allowed? Look at the lines n, 2n and 3n. They're all **straight lines**. 2n is steeper, but double the input and both of them double. Big O describes the **shape** of the growth, not its steepness.

Imagine the chart stretching out to enormous values of n, and zooming way out. From that far away, 13n², n² and 1,000n² look almost the same, and so do n, 2n and 100n. Constants just don't change the big picture:

| You counted  | Write it as |
| ------------ | ----------- |
| 2n           | O(n)        |
| 100n         | O(n)        |
| n / 2        | O(n)        |
| 500 (always) | O(1)        |
| 13n²         | O(n²)       |

The O(500) row is worth a second look: it means "500 operations every time, whatever n is". That's a flat line, so we simplify it to **O(1)**, constant time.

## Why it's allowed

```viz
big-o-growth-chart
```

This rule comes straight from the definition: code is O(f(n)) if its operations are eventually **less than a constant times f(n)**. 2n is never more than 2 × n, and 100n is never more than 100 × n, so both are O(n). The constant is already "baked into" the definition, so writing it again adds nothing.

Try simplifying these:

- O(100 × n) → **O(n)**
- O(25) → **O(1)**
- O(n + n + n + n) → O(4n) → **O(n)**

Does this mean constants never matter? No. A version that walks the list once is still faster than one that walks it twice, and in real code that can count. But that's a second-level improvement. Big O is about the big picture first: is the work flat, a straight line, or a curve that shoots up?
