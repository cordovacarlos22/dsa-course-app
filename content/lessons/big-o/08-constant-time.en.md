---
title: 'O(1): constant time'
order: 8
minutes: 5
---

> **Goal:** recognize O(1) code, the most efficient Big O there is.

## Work that doesn't care about the input size

Some operations take the same number of steps no matter how big the input is:

```js-run
function firstAndLast(items) {
  return [items[0], items[items.length - 1]]
}

const small = ['a', 'b', 'c']
const huge = Array.from({ length: 1000000 }, (_, i) => i)

console.log(firstAndLast(small))
console.log(firstAndLast(huge))
```

Reading `items[0]` or `items[items.length - 1]` jumps straight to the right spot. It doesn't matter whether the array has 3 items or a million: the work is the same.

That's **O(1)**, also called **constant time**.

## More O(1) examples

```js-run
const prices = { coffee: 3, tea: 2.5, juice: 4 }

function priceWithTax(price) {
  return price * 1.08 // a fixed number of steps
}

console.log(prices.tea) // looking up an object key
console.log(priceWithTax(10)) // simple math
console.log([5, 9, 2].length) // reading the length
```

- Reading an array item by **index** (`arr[5]`)
- Reading or setting an object **key** (`prices.tea`)
- Math on a few values (`price * 1.08`)
- `push` and `pop` at the end of an array

A few steps or a dozen steps is still O(1): remember rule 1, drop the constants. O(3) is written **O(1)**.

## The best Big O

On a chart, O(1) is a **flat line** at the bottom. Nothing grows more slowly. When you hear "constant time" in an interview, it means O(1), and it's the best you can get.

Careful, though: one line of code isn't automatically O(1). `array.includes(x)` is one line, but it walks the whole array: O(n).

## Recap

- Work that doesn't grow with the input → **O(1)**, constant time.
- Index lookups, object keys, simple math, push/pop.
- One line doesn't mean O(1): look for hidden loops.

## Check yourself

1. What's the Big O of `arr[arr.length - 1]`?
2. A function does 3 additions and 2 comparisons, always. Big O?
3. Why isn't `array.indexOf(x)` O(1)?
