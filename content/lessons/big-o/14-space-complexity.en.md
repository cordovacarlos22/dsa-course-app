---
title: Space complexity
order: 14
minutes: 8
---

> **Goal:** measure how much extra memory code needs, with the same Big O notation.

## How much memory grows?

So far we've worried about **time**: how the runtime of an algorithm grows as its input grows. That's **time complexity**. Now let's look at **space complexity**: how much **memory** an algorithm takes up as its input grows. We use the same Big O notation; we're just measuring something else.

```viz
memory-boxes
```

There's one thing to get out of the way first. As n grows, the input itself obviously grows too: a list of a million guests takes more memory than a list of 10. We **ignore** that part. What we measure is the space the algorithm **needs on its own**, besides the input. If you read about this online, you may see it called **auxiliary space complexity**. In this course, unless we say otherwise, "space complexity" means auxiliary space complexity: what happens **inside** the algorithm.

## Rules of thumb for space

```viz
trace-count-guests
```

- **Most primitives take constant space.** Booleans, numbers, `undefined` and `null` take the same amount of memory whatever their value: the number 1 and the number 1,000 cost the same, and so do `true` and `false`. O(1).
- **Strings take O(n) space**, where n is the length of the string. A 50-character string takes about 50 times the space of a 1-character string.
- **Reference types (arrays and objects) are generally O(n)**, where n is the length of the array or the number of keys in the object. An array of 4 items takes twice the space of an array of 2.

`countGuests` in the animation only keeps two numbers, `count` and `i`. Whether there are 4 guests or 4 million, it's still two numbers: **O(1) space**.

## Sum vs double an array

Let's analyze two functions. Both loop over an array of numbers, but their space is very different:

```js-run
function sumArray(numbers) {
  let total = 0
  for (let i = 0; i < numbers.length; i++) {
    total = total + numbers[i]
  }
  return total
}

function doubleArray(numbers) {
  const doubled = []
  for (let i = 0; i < numbers.length; i++) {
    doubled.push(numbers[i] * 2)
  }
  return doubled
}

console.log(sumArray([1, 2, 3])) // 6
console.log(doubleArray([1, 2, 3])) // [2, 4, 6]
```

**`sumArray`** creates one number, `total`, and the loop variable `i`. We keep adding into `total`, but that takes time, not new space: the space is already there. Whether the array has 10 items or a million, the function only ever has those two numbers. That's **O(1) space**.

**`doubleArray`** creates a **new array** and pushes one item into it for every number in the input. Watch it grow:

```viz
trace-double-array
```

10 numbers in, 10 new items stored; 50 numbers in, 50 new items. The space grows in direct proportion to n, so it's **O(n) space**. (It's really n plus a couple of variables, but we simplify to O(n).)

A function can be great at one and terrible at the other: think of a function that's O(n²) **time** but only uses a few variables, so it's O(1) **space**. When you analyze code, answer both questions: _"This is O(n) time and O(1) space."_

Try these:

- A loop from 1 to n that only prints `i`: **O(1) space** (just `i`).
- A function that copies every item at an even index into a new array: about n / 2 items, so **O(n) space**.
- A function that fills a new array with a running total for every item: n items, so **O(n) space**, even if it uses nested loops to compute them.

You don't need to master space complexity before moving on. The goal is that when we say "this one has great space complexity but terrible time complexity", you know what that means.
