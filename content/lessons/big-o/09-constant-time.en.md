---
title: 'O(1): constant time'
order: 9
minutes: 4
---

> **Goal:** recognize O(1) code, the best Big O there is.

## Jump straight to the box

```viz
constant-jump
```

`guests[3]` doesn't look at boxes 0, 1 and 2. It **jumps straight** to box 3. One step for 6 guests, one step for a million.

## A flat line

```viz
big-o-growth-chart
```

Work that doesn't grow with the input is **O(1)**, also called **constant time**. On the chart it's the flat line at the bottom: nothing is better.

A few steps is still O(1): 5 steps every time is O(5), and we drop the constant.

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli']

const first = guests[0]
const last = guests[guests.length - 1]
console.log('First:', first, '- Last:', last)
```
