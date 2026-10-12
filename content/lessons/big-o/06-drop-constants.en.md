---
title: Drop the constants
order: 6
minutes: 6
---

> **Goal:** simplify expressions like O(2n) with the first rule: drop the constants.

## Two loops in a row

What if the code goes through the list twice? First a welcome for every guest, then a goodbye for every guest:

```viz
trace-welcome-and-goodbye
```

The first loop prints n messages and the second one prints n more: **n + n = 2n**. So it's tempting to write **O(2n)**. But that's not how Big O is written.

## Same shape, so drop the number

```viz
same-shape
```

Look at the lines n, 2n and 3n. They're all **straight lines**. 2n is steeper than n, but they grow the same way: double the guests and both double. Big O describes the **shape** of the growth, so it ignores the number in front. That's the first rule: **drop the constants**.

| You counted  | Write it as |
| ------------ | ----------- |
| 2n           | O(n)        |
| 100n         | O(n)        |
| n / 2        | O(n)        |
| 500 (always) | O(1)        |
| 13n²         | O(n²)       |

The fourth row matters: code that always does 500 steps, whatever the input, doesn't grow at all. It's written O(1), never O(500). n² is the curved line in the animation; you'll meet it properly in the next lesson.

## Why we're allowed to do that

```viz
big-o-growth-chart
```

Here's the official definition, in plain words: code is **O(f(n))** if, once n is big enough, its number of operations is **never more than some constant times f(n)**.

So 2n is O(n), because 2n is never more than 2 × n. And 5n + 3 is O(n) too: once n is at least 3, 5n + 3 is never more than 6 × n. The constant can be any number you like; what matters is the shape f(n) draws on the chart.

Does that mean constants never matter? No. A version that walks the guest list once is still faster than one that walks it twice, and in real code that can count. But it's a second-level improvement. Big O is about the big picture first: is the work flat, a straight line, or a curve that shoots up?
