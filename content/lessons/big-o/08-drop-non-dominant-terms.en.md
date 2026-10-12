---
title: Drop the non-dominant terms
order: 8
minutes: 5
---

> **Goal:** simplify expressions like O(n² + n) with the second rule: keep only the term that grows fastest.

## A nested loop, then one more loop

Imagine a function that first has every guest greet every other guest (n² steps), then welcomes each guest once (n steps). In total: **n² + n**. Is that O(n² + n)? Watch what each part adds as the party grows:

```viz
dominant-term
```

At n = 100, n² is 10,000 and n adds only 100 more: about 1% of the work. At n = 1,000 the n part is down to 0.1%. As n grows, n² does almost all the work and the extra n barely changes anything. We call n² the **dominant term** and n a **non-dominant term**.

So we drop it: **O(n² + n) → O(n²)**. That's the second rule: **drop the non-dominant terms**.

## Keep the fastest-growing part

```viz
big-o-growth-chart
```

The same idea works for any mix: find the term that grows fastest on the chart and keep only that one.

| You counted  | Write it as | Why                                                 |
| ------------ | ----------- | --------------------------------------------------- |
| n + 10       | O(n)        | 10 is a constant: it doesn't grow                   |
| 1,000n + 50  | O(n)        | drop the term 50, then the constant 1,000           |
| n² + 5n + 8  | O(n²)       | at n = 1,000: 1,000,000 vs only 5,008 from the rest |
| 2n² + 7n + 3 | O(n²)       | drop 7n and 3, then the constant 2                  |

Use both rules together: drop the non-dominant terms, then drop the constants. A trick that helps: plug in a big number like n = 1,000 and see which part is left standing.

Careful with big constants: O(n + 1,000,000) is still just O(n). However big it is, a fixed number doesn't grow, and once n is large enough, the n part always wins.
