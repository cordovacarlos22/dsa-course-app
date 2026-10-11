---
title: 'Wrap-up: all the shapes'
order: 14
minutes: 4
---

> **Goal:** put every Big O side by side and know the words people use for each.

## The shapes

```viz
big-o-growth-chart
```

| Big O      | Name        | You'll hear…               | Guest-list example             |
| ---------- | ----------- | -------------------------- | ------------------------------ |
| O(1)       | constant    | "constant time"            | `guests[3]`, `guests.length`   |
| O(log n)   | logarithmic | "divide and conquer"       | binary search in a sorted list |
| O(n)       | linear      | "proportional"             | welcome every guest            |
| O(n log n) | n log n     | "the best general sorting" | sorting (later in the course)  |
| O(n²)      | quadratic   | "a loop inside a loop"     | every guest greets every guest |

From best to worst: **O(1) < O(log n) < O(n) < O(n log n) < O(n²)**.

## The rules you learned

```viz
search-cases
```

1. **Count steps, not seconds.**
2. Big O is the **worst case** (Ω best, Θ average).
3. **Drop the constants:** O(2n) → O(n).
4. **Drop the non-dominant terms:** O(n² + n) → O(n²).
5. **Different inputs, different letters:** O(a + b), O(a · b).
6. Measure **space** too.

Next module: the Big O of the tools you use every day, **arrays and objects**. Before you go, take the **Big O quiz** on the module page.
