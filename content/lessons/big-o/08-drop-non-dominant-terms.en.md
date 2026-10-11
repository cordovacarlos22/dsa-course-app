---
title: Drop the non-dominant terms
order: 8
minutes: 4
---

> **Goal:** simplify O(n² + n) to O(n²) with the second rule.

## A nested loop, then one more loop

```viz
dominant-term
```

Greet everyone (n²), then welcome everyone (n): **n² + n** steps. Watch the n part shrink to almost nothing as the party grows. n² is the **dominant term**.

## Keep only the fastest-growing part

```viz
big-o-growth-chart
```

For big inputs, only the fastest-growing part matters. So we **drop the non-dominant terms**:

| You counted  | Write it as |
| ------------ | ----------- |
| n² + n       | O(n²)       |
| n + 1,000    | O(n)        |
| 2n² + 7n + 3 | O(n²)       |

Use both rules together: drop the constants, then drop the non-dominant terms.
