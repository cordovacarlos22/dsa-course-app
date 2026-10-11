---
title: Best, average and worst case
order: 4
minutes: 4
---

> **Goal:** know what Ω, Θ and O describe, and why Big O means the worst case.

## Where is the name?

```viz
search-cases
```

The same search can take 1 check or check every guest. It depends on **where** the name is:

| Case    | Letter    | Our guest list                |
| ------- | --------- | ----------------------------- |
| Best    | Ω (omega) | the name is first             |
| Average | Θ (theta) | the name is around the middle |
| Worst   | O (big O) | the name isn't on the list    |

## Big O is the worst case

```viz
trace-is-invited
```

Pick **find 'Zoe'**: every guest gets checked. When people ask for "the Big O" of your code, they mean this **worst case**: the code will never be slower than this.
