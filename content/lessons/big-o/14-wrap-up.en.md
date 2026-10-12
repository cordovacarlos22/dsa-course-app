---
title: 'Wrap-up: all the shapes'
order: 14
minutes: 6
---

> **Goal:** put every Big O side by side and know the words people use for each.

## The numbers side by side

```viz
big-o-growth-chart
```

How far apart are these shapes, really? Run this to count the steps for 100 and 1,000 guests:

```js-run
const sizes = [100, 1000]
for (let i = 0; i < sizes.length; i++) {
  const n = sizes[i]
  console.log('n =', n)
  console.log('  O(1):', 1, ' O(log n):', Math.round(Math.log2(n)))
  console.log('  O(n):', n, ' O(n²):', n * n)
}
```

With 100 guests: 1, about 7, 100 and 10,000 steps. With 1,000 guests: 1, about 10, 1,000 and **1,000,000**. The gap between O(n) and O(n²) is already huge with a thousand items, and real apps handle millions. That's why choosing the right algorithm matters more than buying a faster computer.

## The words people use

```viz
search-cases
```

| Big O      | Name        | You'll hear…               | Guest-list example             |
| ---------- | ----------- | -------------------------- | ------------------------------ |
| O(1)       | constant    | "constant time"            | `guests[3]`, `guests.length`   |
| O(log n)   | logarithmic | "divide and conquer"       | binary search in a sorted list |
| O(n)       | linear      | "proportional"             | welcome every guest            |
| O(n log n) | n log n     | "the best general sorting" | sorting (later in the course)  |
| O(n²)      | quadratic   | "a loop inside a loop"     | every guest greets every guest |

A great free reference is the **Big O Cheat Sheet** at bigocheatsheet.com. Its chart also shows O(2ⁿ) and O(n!), which grow even faster than O(n²); you'll rarely see them in everyday code. Its tables list data structures and sorting algorithms with columns for the best (Ω), average (Θ) and worst (O) cases, plus space. You'll notice that some sorts are fast but need extra memory, while others need almost no memory but are slow: the time and space trade-off again. Come back to it as you learn each topic.

## The rules you learned

```viz
dominant-term
```

1. **Count steps, not seconds.** Big O depends on the algorithm, not on the computer.
2. Big O is the **worst case** (Ω is the best case, Θ the average).
3. **Drop the constants:** O(2n) → O(n), O(500) → O(1).
4. **Drop the non-dominant terms:** O(n² + n) → O(n²).
5. **Different inputs, different letters:** O(a + b) and O(a · b).
6. **Measure space too:** the extra memory the code creates.

From best to worst: **O(1) < O(log n) < O(n) < O(n log n) < O(n²)**.

Next module: the Big O of the tools you use every day, **arrays and objects**. Before you go, take the **Big O quiz** on the module page.
