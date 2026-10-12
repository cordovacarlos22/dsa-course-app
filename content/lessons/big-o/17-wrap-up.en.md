---
title: 'Wrap-up: comparing everything'
order: 17
minutes: 8
---

> **Goal:** put every Big O side by side, know the words people use for each, and review the rules.

## The numbers side by side

```viz
big-o-growth-chart
```

How far apart are these shapes, really? Run this to count the steps for n = 100 and n = 1,000:

```js-run
const sizes = [100, 1000]
for (let i = 0; i < sizes.length; i++) {
  const n = sizes[i]
  console.log('n =', n)
  console.log('  O(1):', 1, ' O(log n):', Math.round(Math.log2(n)))
  console.log('  O(n):', n, ' O(n²):', n * n)
}
```

With n = 100: O(1) is 1, O(log n) is about 7, O(n) is 100 and O(n²) is 10,000. With n = 1,000: 1, about 10 (2¹⁰ = 1,024, close to a thousand), 1,000 and **1,000,000**. The gap between O(n) and O(n²) is already huge with a thousand items, and real apps handle millions. That's why choosing the right algorithm matters more than buying a faster computer.

## The words, and a cheat sheet

```viz
search-cases
```

| Big O      | Name                   | You'll hear…            | Example                        |
| ---------- | ---------------------- | ----------------------- | ------------------------------ |
| O(1)       | constant               | "constant time"         | reading an array item by index |
| O(log n)   | logarithmic            | "divide and conquer"    | binary search                  |
| O(n)       | linear                 | "proportional"          | looping through an array       |
| O(n log n) | linearithmic           | "the best general sort" | merge sort, quick sort         |
| O(n²)      | quadratic (polynomial) | "a loop within a loop"  | every guest greets every guest |

A great free reference is the **Big O Cheat Sheet** at bigocheatsheet.com. Its chart rates each growth rate on a scale from **Excellent** to **Horrible**: O(1) and O(log n) sit at the excellent end, O(n²), O(2ⁿ) and O(n!) at the horrible end, and O(n) and O(n log n) in between. It also shows O(2ⁿ) and O(n!), which grow even faster; O(n!) is something you'll basically only see if you write bad code on purpose.

Below the chart, its tables list common data structures with their **average (Θ)** and **worst (O)** time for each operation, plus their space. The sorting table adds the **best case (Ω)** too. You'll notice that some sorts have terrible time complexity but great space complexity (selection sort), while others have great time complexity but need more space (merge sort): the time and space trade-off again. Keep the page handy and come back to it as you learn each topic.

## Recap

```viz
dominant-term
```

To analyze the performance of an algorithm, we use **Big O notation**. It gives us a **high-level understanding** of how the runtime (time complexity) or the memory (space complexity) of an algorithm changes as its input grows. It doesn't care about precision, only about **general trends**. And it depends only on the **algorithm**, not on the hardware: a supercomputer runs the same code faster than your laptop, but the trend is the same.

The rules you learned:

1. **Count operations, not seconds.**
2. Big O is the **worst case** (Ω is the best case, Θ the average).
3. **Drop the constants:** O(2n) → O(n), O(100n²) → O(n²), O(500) → O(1).
4. **Drop the non-dominant terms:** O(n² + n) → O(n²).
5. **Different inputs, different terms:** O(a + b) and O(a · b).
6. A **loop within a loop** is O(n²); **divide and conquer** is O(log n); **O(1)** is the most efficient of all.
7. Measure **space** too: the extra memory the algorithm creates.

From best to worst: **O(1) < O(log n) < O(n) < O(n log n) < O(n²)**.

Big O is everywhere in this course, and you'll get plenty of practice with it. Before moving on, take the **Big O quiz** on the module page.
