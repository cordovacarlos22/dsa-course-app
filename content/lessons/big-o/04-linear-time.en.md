---
title: 'O(n): linear time'
order: 4
minutes: 5
---

> **Goal:** recognize O(n) code: work that grows in step with the input.

## One step per item

A café wants the total of today's orders. The simplest way is to add every order once:

```js-run
function totalSales(orders) {
  let total = 0
  for (const order of orders) {
    total += order
  }
  return total
}

console.log('Total:', totalSales([4.5, 3, 6.25, 2.75]))
```

The loop runs **once per order**. 4 orders → 4 additions. 1,000 orders → 1,000 additions. When the input doubles, the work doubles.

That's **O(n)**, also called **linear time**, where `n` is the number of items.

## Seeing it grow

Let's count the additions for bigger and bigger days:

```js-run
function countAdditions(orders) {
  let additions = 0
  for (const order of orders) {
    additions++
  }
  return additions
}

for (const n of [5, 50, 500, 5000]) {
  const orders = Array.from({ length: n }, () => 3)
  console.log(n, 'orders →', countAdditions(orders), 'additions')
}
```

On a chart, O(n) is a **straight line**: the work is **proportional** to the input. When you hear "proportional" in an interview, think O(n).

## Spotting O(n)

Look for a single loop that touches each item a fixed number of times:

- adding, counting or printing every item,
- finding the largest or smallest value,
- searching an unsorted array (worst case: the item isn't there).

Built-in methods count too: `array.includes(x)`, `array.indexOf(x)` and `array.map(fn)` all walk through the array, so they're O(n).

## Recap

- One pass over the input → **O(n)**, linear time.
- Double the input → double the work. On a chart it's a straight line.
- Hidden loops (`includes`, `indexOf`, `map`…) are O(n) too.

## Check yourself

1. What's the Big O of finding the largest number in an unsorted array?
2. If `totalSales` takes 1,000 additions for 1,000 orders, how many for 3,000?
3. Why is `array.includes(x)` O(n) even though it's one line?
