---
title: 'Logarithms and O(log n)'
order: 11
minutes: 7
---

> **Goal:** understand what a logarithm is (no scary math), and why O(log n) is so fast.

## A guessing game

I'm thinking of a number from 1 to 100. After each guess I say "higher" or "lower". The smart strategy is to always guess the **middle** of what's left, so every answer throws away half of the possibilities.

How many guesses do you need, at most? Let's count how many times we can cut 100 in half before only one number is left:

```js-run
function halvings(n) {
  let steps = 0
  while (n > 1) {
    n = Math.ceil(n / 2) // keep the bigger half, to be safe
    steps++
  }
  return steps
}

for (const n of [8, 100, 1000, 1000000, 1000000000]) {
  console.log(n, 'possibilities →', halvings(n), 'guesses at most')
}
```

Only **30 guesses** for a **billion** possibilities! That count is the **logarithm**.

## What a logarithm means

**log₂(n)** answers one question: _how many times can you cut `n` in half until you reach 1?_ Put another way: _2 to what power gives `n`?_

- log₂(8) = 3, because 2 × 2 × 2 = 8
- log₂(1,024) = 10
- log₂(about a billion) ≈ 30

In Big O we just write **log n**: the base doesn't change the shape of the growth.

## Binary search: O(log n) in action

Binary search finds an item in a **sorted** array the same way you played the guessing game: look at the middle, then throw away the half that can't contain the target. Step through it:

```viz
binary-search-halving
```

That technique of cutting the problem in half again and again is called **divide and conquer**. When you hear it, think O(log n). It only works because the data is sorted; on an unsorted array you'd have to check everything, O(n).

## Where you'll see logarithms

- **O(log n):** binary search, and searching balanced trees (later in the course).
- **O(n log n):** the best general-purpose sorting algorithms, like merge sort. That's `n` items times `log n` levels of splitting. You'll build it yourself in the Merge Sort module.

## Recap

- log₂(n) = how many times you can halve `n` before reaching 1.
- **O(log n)** grows incredibly slowly: a billion items → about 30 steps.
- "Divide and conquer" → O(log n). Good sorting → O(n log n).

## Check yourself

1. What is log₂(16)?
2. Why does binary search need a sorted array?
3. If n goes from 1,000 to 1,000,000, about how many more steps does an O(log n) algorithm need?
