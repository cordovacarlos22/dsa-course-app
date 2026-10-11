---
title: Drop the constants
order: 6
minutes: 4
---

> **Goal:** simplify O(2n) to O(n) with the first rule.

## Two loops in a row

```viz
trace-welcome-and-goodbye
```

First a welcome for every guest, then a goodbye for every guest: **n + n = 2n** messages. It's tempting to write O(2n).

## Same shape, so drop the number

```viz
same-shape
```

n, 2n and 3n are all straight lines. Double the guests and the work doubles, whatever the number in front. Big O keeps the **shape**, so we **drop the constant**:

| You counted | Write it as |
| ----------- | ----------- |
| 2n          | O(n)        |
| 100n        | O(n)        |
| n / 2       | O(n)        |
| 5 (always)  | O(1)        |
