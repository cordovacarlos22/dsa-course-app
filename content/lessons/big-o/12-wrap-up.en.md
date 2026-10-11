---
title: 'Wrap-up: comparing growth rates'
order: 12
minutes: 6
---

> **Goal:** put all the Big O notations side by side, and know the words people use for each.

## The numbers side by side

Let's calculate roughly how many steps each Big O needs as `n` grows:

```js-run
const rows = [10, 100, 1000, 1000000].map((n) => ({
  n,
  'O(1)': 1,
  'O(log n)': Math.round(Math.log2(n)),
  'O(n)': n,
  'O(n log n)': Math.round(n * Math.log2(n)),
  'O(n²)': n * n,
}))

for (const row of rows) console.log(row)
```

At n = 1,000,000, O(log n) needs about **20** steps, O(n) needs a **million**, and O(n²) needs a **trillion**. That gap is why choosing the right algorithm matters more than a faster computer.

## The shapes

```viz
big-o-growth-chart
```

## The vocabulary

You'll hear these words in interviews and documentation:

| Big O      | Name         | You'll hear…               | Example                 |
| ---------- | ------------ | -------------------------- | ----------------------- |
| O(1)       | constant     | "constant time"            | `arr[i]`, `obj.key`     |
| O(log n)   | logarithmic  | "divide and conquer"       | binary search           |
| O(n)       | linear       | "proportional"             | one loop over the input |
| O(n log n) | linearithmic | "the best general sorting" | merge sort              |
| O(n²)      | quadratic    | "a loop inside a loop"     | comparing every pair    |

From best to worst: **O(1) < O(log n) < O(n) < O(n log n) < O(n²)**.

## The rules you learned

1. **Count steps, not seconds.**
2. Big O means the **worst case** (Ω best, Θ average).
3. **Drop the constants:** O(2n) → O(n).
4. **Drop the non-dominant terms:** O(n² + n) → O(n²).
5. **Different inputs, different variables:** O(a + b), O(a · b).
6. Measure **space** too, not just time.

## What's next

Next module: the Big O of the tools you use every day, **arrays and objects**. Then you'll learn a step-by-step method for solving problems you've never seen before.

Before moving on, take the **Big O quiz** on the module page and try the **Big O interview problems**.

## Check yourself

1. Put these in order from fastest to slowest: O(n²), O(1), O(n log n), O(log n), O(n).
2. Which phrase goes with O(log n)?
3. Simplify O(3n² + 10n + 7).
