---
title: Drop the non-dominant terms
order: 10
minutes: 6
---

> **Goal:** simplify expressions like O(n² + n) with the second rule: keep only the term that grows fastest.

## A nested loop, then one more loop

Dropping **non-dominant terms** is the second way we simplify Big O. Take the nested loop from the last lesson and add one more ordinary loop after it:

```js-run
function printAll(n) {
  let lines = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      lines = lines + 1 // print i, j
    }
  }
  for (let k = 0; k < n; k++) {
    lines = lines + 1 // print k
  }
  return lines
}

console.log(printAll(10)) // 100 from the nested loop + 10 from the last one
```

With 10, the nested loop does `0 0` through `9 9` (100 steps), and the last loop does 0 through 9 (10 steps). The nested loop is O(n²), the last loop is O(n), so together it's **O(n² + n)**. Watch what each part adds as n grows:

```viz
dominant-term
```

Think about n = 100: n² is **10,000**, while the extra n adds only **100**. It barely changes the number of operations. At n = 1,000, the n part is a tiny sliver of the total. **n²** is the **dominant term**, and the lonely **n** is a **non-dominant term**. So we simply drop it:

**O(n² + n) → O(n²)**

## Smaller terms don't matter

```viz
big-o-growth-chart
```

The same idea works for any mix: keep the term that grows fastest and drop the rest.

| You counted  | Write it as | Why                                                 |
| ------------ | ----------- | --------------------------------------------------- |
| n + 10       | O(n)        | 10 is a constant: it never grows                    |
| 1,000n + 50  | O(n)        | drop the 50, then the constant 1,000                |
| n² + 5n + 8  | O(n²)       | at n = 1,000: 1,000,000 vs only 5,008 from the rest |
| n² + n³      | O(n³)       | n³ grows faster than n², so n³ is the dominant term |
| 2n² + 7n + 3 | O(n²)       | drop 7n and 3, then the constant 2                  |

Look at n² + 5n + 8 with n = 1,000: that's 1,000,000 + 5,000 + 8. The difference between 1,005,008 and 1,000,000 is tiny, and that's only with n = 1,000. Plug in a billion and the 5n + 8 part is meaningless.

A good way to picture it: imagine looking at the chart from very, very far away, as if from outer space. From there, only the fastest-growing curve is visible; everything else is a flat smudge along the bottom.

Here's one worked out step by step:

1. Start with O(2n² + 7n + 3).
2. Drop the non-dominant terms 7n and 3: O(2n²).
3. Drop the constant 2: **O(n²)**.

Use both rules together: drop the non-dominant terms, then drop the constants. When you're unsure, plug in a big number like n = 1,000 and see which part is left standing.

Careful with big constants: O(n + 1,000,000) is still just **O(n)**. However big it is, a fixed number doesn't grow, and once n is large enough, the n part always wins.
