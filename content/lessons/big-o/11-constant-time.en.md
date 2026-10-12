---
title: 'O(1): constant time'
order: 11
minutes: 6
---

> **Goal:** recognize O(1) code, the most efficient Big O there is.

## One operation, whatever n is

Next is **O(1)**. Here's a function that just returns n + n:

```js-run
function addItems(n) {
  return n + n
}

function addItemsAgain(n) {
  return n + n + n
}

console.log(addItems(1), addItems(1000000))
console.log(addItemsAgain(1), addItemsAgain(1000000))
```

`addItems` does **one operation**: the addition. It doesn't matter if n is 1 or a million; it's always one operation. That's **O(1)**.

What if we add another addition, like `addItemsAgain`? Now it's two operations, so O(2). And as you've probably guessed, we simplify that to **O(1)**: the number of operations is a constant that doesn't change when n changes. The formula version of `sumUpTo` is the same: 3 operations every time, so O(1).

```viz
trace-sum-formula
```

## Jump straight to the box

```viz
constant-jump
```

O(1) work **doesn't depend on the size of the data**. The classic example is reading an array item by its index: `guests[3]` doesn't look at boxes 0, 1 and 2 first. The array knows where every box is, so it **jumps straight** to the right one. One step with 6 guests, one step with a million. `guests.length` works the same way: the array already knows its size.

Other everyday O(1) work:

- reading or setting an object key (`party.host`),
- math on a few numbers (`guests.length * 2`),
- giving a variable a value.

## The most efficient Big O

On the graph, O(1) is a **flat line** along the bottom. It's the **most efficient** Big O: nothing is more efficient than O(1). You'll often hear it called **constant time**; when you hear that phrase, it means O(1).

Constant time doesn't mean "instant". A function that always does 1,000 operations is still O(1), because that 1,000 never grows: it does the same work for 10 items or 10 million. What O(1) promises is that the work **doesn't grow** with the input.

That's exactly why the formula version of `sumUpTo` beat the loop version: the formula is O(1), the loop is O(n), and the gap gets bigger every time n grows. It's also why O(1) operations are so valuable for things an app does all the time: you can read `guests.length` a thousand times and it never gets slower as the party grows.

Careful, though: short code isn't the same as constant time. Watch what one innocent-looking line can hide:

```viz
trace-is-invited
```

`guests.includes('Zoe')` is one line, and it looks like it should be one step. But to answer, JavaScript has to do exactly what this animation shows: check the guests one by one until it finds the name or runs out. That's O(n).

So when you look for the Big O of a line, ask: _does it jump straight to the answer, or does it hide a loop?_ `guests[3]` jumps. `guests.includes(name)` and `guests.indexOf(name)` loop.
