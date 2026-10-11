---
title: 'O(n²): a loop inside a loop'
order: 7
minutes: 5
---

> **Goal:** recognize O(n²) code and see why it gets slow so fast.

## Every guest greets every guest

```viz
nested-grid
```

Each row is a guest. For every row, the inner loop goes through every guest again. **n rows × n columns = n²** steps.

## Watch the two loops

```viz
trace-greet-everyone
```

Follow **i** (the outer loop) and **j** (the inner loop). For each `i`, `j` goes all the way from 0 to the end. Pick **4 guests**: 16 inner steps instead of 9.

Double the guests and the work is **4 times** bigger. That's **O(n²)**, quadratic time. Three loops inside each other would be O(n³).
