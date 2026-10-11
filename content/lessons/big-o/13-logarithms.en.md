---
title: 'Logarithms and O(log n)'
order: 13
minutes: 5
---

> **Goal:** understand what a logarithm is (no scary math) and why O(log n) is so fast.

## A logarithm counts halvings

```viz
halving-count
```

**log₂(n)** answers one question: _how many times can you cut n in half until 1 is left?_ 16 → 8 → 4 → 2 → 1 is 4 halvings, so log₂(16) = 4. In Big O we just write **log n**.

## Find a name in a sorted list

```viz
binary-search-halving
```

When the guest list is **sorted from A to Z**, you don't have to read it name by name. Look at the middle name, and throw away the half that can't have the name you want. Repeat.

That's **binary search**, a "divide and conquer" algorithm: **O(log n)**. A million sorted names need only about 20 checks. It only works on **sorted** data.
