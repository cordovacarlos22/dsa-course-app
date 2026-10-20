---
title: Drop the non-dominant terms
order: 10
minutes: 9
---

> **Goal:** simplify expressions like O(n² + n) with the second rule: keep only the term that grows fastest.

## A nested loop, then one more loop

Dropping **non-dominant terms** is the second way we simplify Big O. First, two words. A **term** is one piece of an expression joined to the others by `+`: in n² + 5n + 8, the terms are n², 5n and 8. The **dominant term** is the one that grows fastest as n grows; every other term is **non-dominant**. The rule says: keep the dominant term and drop the rest.

Why is that allowed? For the same reason we drop constants: Big O only describes the shape of the growth for **big** inputs. When n is big, the fastest-growing term does almost all the work, and the others shrink to a rounding error next to it.

Here's code with two terms. Take the nested loop from the last lesson and add one more ordinary loop after it:

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

**What just happened:** at n = 2, the n part was a big share of the work: 2 out of 6 steps. At n = 10 it was 10 out of 110. By n = 100, n² was **10,000** while the extra n added only **100**, under 1% of the total. At n = 1,000, the n part was a tiny sliver. **n²** is the **dominant term**, and the lonely **n** is a **non-dominant term**. So we simply drop it:

**O(n² + n) → O(n²)**

You can watch the n part's share shrink in numbers too:

```js-run
const sizes = [10, 100, 1000, 10000]
for (let k = 0; k < sizes.length; k++) {
  const n = sizes[k]
  const total = n * n + n
  const share = (100 * n) / total
  console.log('n =', n, '| n² + n =', total, '| the n part is', share.toFixed(2) + '% of it')
}
```

**Common mistake:** leaving the answer as O(n² + n) because it feels more precise. Big O isn't trying to be precise: it describes the shape for big inputs, and there n² + n and n² are the same shape. The simplified answer is the expected one.

## Smaller terms don't matter

The same idea works for any mix: keep the term that grows fastest and drop the rest. To find the dominant term, compare how each term grows, from slowest to fastest: a constant (like 8) never grows, then log n, then n, then n log n, then n², then n³. The term furthest along that list wins.

| You counted  | Write it as | Why                                                 |
| ------------ | ----------- | --------------------------------------------------- |
| n + 10       | O(n)        | 10 is a constant: it never grows                    |
| 1,000n + 50  | O(n)        | drop the 50, then the constant 1,000                |
| n² + 5n + 8  | O(n²)       | at n = 1,000: 1,000,000 vs only 5,008 from the rest |
| n² + n³      | O(n³)       | n³ grows faster than n², so n³ is the dominant term |
| 2n² + 7n + 3 | O(n²)       | drop 7n and 3, then the constant 2                  |

Look at n² + 5n + 8 with n = 1,000: that's 1,000,000 + 5,000 + 8. The difference between 1,005,008 and 1,000,000 is tiny, and that's only with n = 1,000. Plug in a billion and the 5n + 8 part is meaningless.

A good way to picture it: imagine looking at the chart from very, very far away, as if from outer space. From there, only the fastest-growing curve is visible; everything else is a flat smudge along the bottom.

```viz
big-o-growth-chart
```

**What just happened:** as the chart stretched to the right, O(n²) climbed so far above the others that O(n), O(log n) and O(1) were squeezed into a thin band along the bottom. If a piece of code had all four kinds of work in it, only the n² part would still be visible from far away. That's the part Big O keeps.

Here's one worked out step by step:

1. Start with O(2n² + 7n + 3).
2. Drop the non-dominant terms 7n and 3: O(2n²).
3. Drop the constant 2: **O(n²)**.

Use both rules together: drop the non-dominant terms, then drop the constants. When you're unsure, plug in a big number like n = 1,000 and see which part is left standing. This checks the worked example:

```js-run
const sizes = [10, 1000, 1000000]
for (let k = 0; k < sizes.length; k++) {
  const n = sizes[k]
  const full = 2 * n * n + 7 * n + 3
  const kept = 2 * n * n
  console.log('n =', n, '| 2n² + 7n + 3 =', full, '| 2n² alone =', kept, '| ratio:', (full / kept).toFixed(4))
}
```

The ratio gets closer and closer to 1: for big n, the dropped terms change almost nothing.

Careful with big constants: O(n + 1,000,000) is still just **O(n)**. However big it is, a fixed number doesn't grow, and once n is large enough, the n part always wins.

**Common mistake:** comparing the terms with a small n. At n = 1,000, the 1,000,000 in n + 1,000,000 is far bigger than n, so it's tempting to call the code O(1). But Big O asks what happens as n keeps growing, and at n = a billion, the n part is a thousand times bigger than the constant.
