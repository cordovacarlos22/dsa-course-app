---
title: Counting operations
order: 3
minutes: 6
---

> **Goal:** count the operations in a function, and see why the exact number doesn't matter.

## What counts as an operation?

If we're going to count steps, we need to agree on what a step is. A **simple operation** is one small thing the computer does:

- giving a variable a value (`count = 0`),
- math (`count + 1`),
- a comparison (`i < guests.length`, `guests[i].length <= 3`).

Watch every operation of this function, one at a time:

```viz
trace-count-short-names
```

Notice the two kinds of lines. `let count = 0` runs **once**, no matter how many guests there are. The lines inside the loop run **once per guest**, so the more guests, the more times they run. Play it with **4 guests**, then pick **8** and **16** and compare the totals.

## One step or n steps?

Here's another way to see it. This function counts the guests one by one:

```viz
trace-count-guests
```

Every guest costs the same 5 operations: a comparison, an addition and an assignment for `count = count + 1`, and another addition and assignment for `i++`. Add the 3 operations that happen only once and you get **5n + 3**. With 4 guests that's 23 operations; with 16 guests, 83.

But JavaScript already keeps track of the size of an array. `guests.length` gives the same answer in **1 step**, whether there are 4 guests or 4 million:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']
console.log('Guests:', guests.length)
```

Same answer, very different growth: one grows with n, the other doesn't grow at all. That difference is exactly what Big O captures.

## Fuzzy counting

```viz
linear-boxes
```

Was it really 5n + 3? You could say `i++` is one operation, not two, and get 4n + 3. Someone else might count 3n + 2. The good news: **it doesn't matter**.

All of those have the same shape. Double the guests and the work doubles; the dots line up in a straight line. Big O is a kind of **fuzzy counting**: we count roughly, then keep only the big picture of how the count grows. In the next lessons you'll learn the rules for going from "5n + 3" to that big picture.
