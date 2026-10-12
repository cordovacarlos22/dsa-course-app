---
title: 'O(1): constant time'
order: 9
minutes: 5
---

> **Goal:** recognize O(1) code, the best Big O there is.

## Jump straight to the box

Some code does the same amount of work however big the input is:

```viz
constant-jump
```

`guests[3]` doesn't look at boxes 0, 1 and 2 first. An array knows exactly where each box is, so reading by index **jumps straight** to the right one. One step with 6 guests, one step with a million. `guests.length` works the same way: the array already knows its size.

Compare that with `isInvited`, which may have to look at every guest. Reading a box by its index never depends on how many boxes there are.

## A flat line

```viz
big-o-growth-chart
```

Work that doesn't grow with the input is **O(1)**, read "O of 1" and also called **constant time**. On the chart it's the **flat line** at the bottom. Nothing is better than O(1).

A few steps is still O(1). This code does two steps, every time:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli']

const first = guests[0]
const last = guests[guests.length - 1]
console.log('First:', first, '- Last:', last)
```

Two steps is O(2), and we drop the constant: O(1). Other everyday O(1) work: reading or setting an object key (`party.host`), math on a few numbers (`guests.length * 2`), and giving a variable a value. When you hear "constant time" in an interview, it means O(1).

That's why O(1) operations are so valuable for things your app does all the time: you can read `guests.length` a thousand times and it never gets slower as the party grows.

## One line isn't always O(1)

```viz
trace-is-invited
```

Careful: short code isn't the same as fast code. `guests.includes('Zoe')` is one line, and it looks like it should be one step. But to answer, JavaScript has to do exactly what this animation shows: check the guests one by one until it finds the name or runs out. That's O(n).

So when you look for the Big O of a line, ask: _does this line jump straight to the answer, or does it hide a loop?_ `guests[3]` jumps. `guests.includes(name)` and `guests.indexOf(name)` loop.
