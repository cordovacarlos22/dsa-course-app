---
title: 'Logarithms and O(log n)'
order: 13
minutes: 7
---

> **Goal:** understand what a logarithm is (no scary math) and why O(log n) is so fast.

## A logarithm counts halvings

A logarithm is the **opposite of an exponent**, the same way division is the opposite of multiplication. 2³ = 8 means "multiply three 2s together and you get 8". The logarithm asks the question backwards: **log₂(8) = 3**, "how many 2s do you multiply to get 8?"

An easier way to think about it: **how many times can you cut a number in half until you reach 1?**

```viz
halving-count
```

16 → 8 → 4 → 2 → 1 is 4 halvings, so log₂(16) = 4. Numbers that don't split evenly land in between: 20 → 10 → 5 → 2.5 → 1.25 → 0.625 passes 1 somewhere between the 4th and the 5th halving, and log₂(20) is about 4.3:

```js-run
console.log(Math.log2(8)) // 3
console.log(Math.log2(16)) // 4
console.log(Math.log2(20)) // about 4.3
console.log(Math.log2(1000000)) // about 20
```

Logarithms can use other bases, like log₁₀, but in Big O the base doesn't change the shape of the curve, so we just write **log n**.

## Find a name in a sorted list

```viz
binary-search-halving
```

Logarithms show up when code **cuts the problem in half** at every step. If the guest list is **sorted from A to Z**, you don't have to read it name by name. Look at the name in the middle: if the name you want comes later in ABC order, throw away the whole left half. Repeat with the half that's left.

That's **binary search**, a "divide and conquer" algorithm. Each check throws away half of what's left, so the number of checks is the number of halvings: **O(log n)**. With 1,000,000 sorted names it needs about **20** checks, while reading them one by one could take a million. It only works because the list is sorted.

## Where logarithms show up

```viz
big-o-growth-chart
```

On the chart, O(log n) climbs a little at the start and then stays almost flat. It isn't as good as O(1), but it's far better than O(n): a thousand times more guests adds only about 10 more checks.

You'll meet logarithms again later in the course:

- **Searching** sorted data, like binary search and search trees: O(log n).
- **The best general-purpose sorting algorithms**, like merge sort: **O(n log n)**. That's n items times log n rounds of splitting, which lands between O(n) and O(n²).
- **Recursion**, where they describe how much memory a function uses as it calls itself.
