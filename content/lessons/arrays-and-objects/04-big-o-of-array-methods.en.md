---
title: Big O of array methods
order: 4
minutes: 14
---

> **Goal:** know the Big O of the array methods you use every day, and choose between an array and an object for the job.

## The end is cheap, the start is expensive

Arrays come with dozens of built-in methods. You don't need to memorize the Big O of every one of them. What matters is that you can work it out, and the way to do that is the question from the first lesson of this module: **how many items does it touch?**

Let's start with the four you already know from the Big O module, because they set the pattern for everything else:

- **`push`** and **`pop`** work at the **end**. Nobody else moves, so they're **O(1)**, whether the array has 1 item or a million.
- **`shift`** and **`unshift`** work at the **start**. Every other item has to be re-indexed, so they're **O(n)**.

The names even tell the story: when you `shift` an array, everything in it shifts over by one.

```viz
array-reindex
```

**What just happened:** `push` and `pop` touched only the box at the end, while `shift` and `unshift` made every guest move to a new index. Accessing an item by index, as you know, is O(1) too, so the end of an array behaves as nicely as an object does.

This matters most when the method runs **inside a loop**. Here's a line of guests being served from the front, two ways:

```js-run
// Version 1: shift in a loop. Each shift is O(n)...
const line = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli']
while (line.length > 0) {
  const next = line.shift()
  console.log('Serving', next)
}

// Version 2: read by index. Each read is O(1).
const line2 = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli']
for (let i = 0; i < line2.length; i++) {
  console.log('Serving', line2[i])
}
```

Both print the same thing. But version 1 calls an O(n) method n times, which adds up to **O(n²)** as the line grows, while version 2 is **O(n)**. (Version 1 empties the array, so it's the right tool if you really need that. Just know what it costs.)

**Common mistake:** saying `shift` is O(n/2) because "on average" half the items move. Every item moves, every time. And even if it were n/2, we drop the constant: O(n).

## concat, slice and splice: O(n)

These three methods copy or move groups of items:

- **`concat`** joins arrays: `guests.concat(more)` builds a **new** array with every item of `guests` followed by every item of `more`. It has to copy all of them. If the arrays have n and m items, that's **O(n + m)** steps. You'll usually see it simply written as **O(n)**, where n is the size of the final array. Both say the same thing: the work grows with the total number of items.
- **`slice(start, end)`** returns a **copy** of part of the array, from `start` up to (but not including) `end`. With no arguments it copies the whole array. Its cost is the **size of the copy**: copying 10 items is 10 steps, copying 1,000 is 1,000. Since a slice can be as big as the whole array, it's listed as **O(n)**. `slice` never changes the original array.
- **`splice(start, deleteCount, …items)`** **changes** the array in place: it can remove items, insert items or both, anywhere. Insert at the end and nothing moves; insert at the start or in the middle and every item after that spot is re-indexed. In general, **O(n)**.

```viz
array-copy-methods
```

**What just happened:** `concat` copied all 9 items into a new array. `slice(1, 4)` copied only 3, and `slice()` copied all 6. `splice` at index 2 moved the 4 guests after Zoe; at index 0 it moved everybody. In each case the work grows with the array, so each is **O(n)**.

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli', 'Fay']
const more = ['Gus', 'Hana', 'Ivan']

console.log(guests.concat(more)) // a new array with all 9
console.log(guests.slice(1, 4)) // a copy of 3: ['Ben', 'Cleo', 'Dev']
console.log(guests) // slice and concat didn't change guests

guests.splice(2, 0, 'Zoe') // insert at index 2: the rest move up
console.log(guests) // splice DID change guests
```

**Common mistake:** mixing up `slice` and `splice`. One letter apart, very different jobs: `slice` copies and leaves the array alone; `splice` changes the array itself.

## sort: O(n log n)

Sorting is the slowest common array method, and it's worth understanding why. To put items in order, you can't just look at each item once: an item doesn't know where it belongs until it has been **compared** with others. So sorting means making comparisons and moving things around.

How many comparisons? The obvious way, comparing every item with every other item, is O(n²). Good sorting algorithms are much smarter and need about **n × log n** comparisons. That's a new Big O, **O(n log n)**: slower than looking at each item once, but far faster than comparing every pair. For 1,000 items, n² is 1,000,000 steps, while n log n is only about 10,000.

JavaScript's built-in `sort` uses one of these smart algorithms, so it's **O(n log n)**. Later in the course you'll write six sorting algorithms yourself, some O(n²) and some O(n log n), and you'll see exactly where the log comes from. For now, just remember where sort sits on the scale:

```viz
sort-growth-chart
```

**What just happened:** O(n log n) sits between the straight O(n) line and the steep O(n²) curve, much closer to O(n). That's why sorting first can still be a good idea: for example, sorting a list once so that you can binary-search it many times.

`sort` has two surprises, and both bite beginners:

```js-run
const scores = [10, 9, 1, 100]

// Surprise 1: by default, sort compares items as TEXT
console.log([10, 9, 1, 100].sort()) // [1, 10, 100, 9]

// To sort numbers, give it a compare function
scores.sort((a, b) => a - b)
console.log(scores) // [1, 9, 10, 100]

// Surprise 2: sort changes the array itself
console.log(scores)
```

Without a compare function, `sort` turns the items into strings and puts them in dictionary order, where "100" comes before "9" because "1" comes before "9". The compare function `(a, b) => a - b` tells it to compare them as numbers.

**Common mistake:** sorting numbers with a plain `sort()`. It works for 1 to 9, which hides the bug until the first two-digit number arrives.

## forEach, map, filter and reduce: O(n)

These four methods all take a **callback**: a function you pass in, which the method calls once for each item. A short way to write a callback is an **arrow function**: `(name) => name.toUpperCase()` means "a function that takes `name` and returns it in capital letters".

- **`forEach`** runs the callback on every item, and returns nothing. It's a loop in disguise.
- **`map`** runs the callback on every item and builds a **new array** with the results, the same length as the original.
- **`filter`** runs the callback on every item and builds a **new array** with only the items for which it returned `true`.
- **`reduce`** runs the callback on every item to combine them all into **one value**, like a total.

Each one visits every item once, so each one is **O(n)**. Like `Object.keys`, they look like a single step, but there's a loop inside.

```viz
array-loop-methods
```

**What just happened:** every method touched all 5 guests. `map` produced 5 new boxes, `filter` kept the 4 short names, and `reduce` boiled everything down to one number, 16. Different results, same cost: one visit per item, **O(n)**.

Here's `forEach` next to the plain loop it replaces. They do exactly the same work:

```js
guests.forEach((name) => console.log('Welcome, ' + name))
```

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli']

// What forEach does for you: one loop over every guest
for (let i = 0; i < guests.length; i++) {
  console.log('Welcome, ' + guests[i])
}

console.log(guests.map((name) => name.toUpperCase()))
console.log(guests.filter((name) => name.length === 3))
console.log(guests.reduce((total, name) => total + name.length, 0))
```

In this course we keep writing most loops as `for (let i = 0; …)`, because it shows every step. But now you know that when you see `forEach`, `map`, `filter` or `reduce`, you're looking at a loop.

**Common mistake:** forgetting the cost of the callback. `guests.map((name) => guests.indexOf(name))` runs `indexOf`, an O(n) search, once per guest: that's **O(n²)**. The total cost is n times the cost of the callback.

## Arrays or objects?

Here's every array method from this module in one table:

| Method                               | Big O      | Why                        |
| ------------------------------------ | ---------- | -------------------------- |
| `arr[i]`, `push`, `pop`              | O(1)       | nobody moves               |
| `shift`, `unshift`                   | O(n)       | everybody moves            |
| `concat`, `slice`, `splice`          | O(n)       | copies or moves many items |
| `includes`, `indexOf`                | O(n)       | a search, item by item     |
| `forEach`, `map`, `filter`, `reduce` | O(n)       | one visit per item         |
| `sort`                               | O(n log n) | many comparisons           |

Almost everything is O(n). `sort` takes longer. And `push`, `pop` and reading by index are as fast as it gets, much faster than adding or removing at the start.

```viz
array-vs-object
```

**What just happened:** this is the big picture of the module. Put the two structures side by side and the main takeaways appear:

1. **Objects are fast at almost everything**: insert, remove, access and update are all O(1). But there's **no order** at all.
2. **Arrays are great when you need order**, and fast at the end. But adding or removing at the **start** sets off a cascade of re-indexing, and so does adding or removing in the **middle**: O(n).
3. **Searching for a value is O(n) in both**, unless the data is organized for it.

So choose by the job. If you look things up by name and don't care about order, use an object. If order matters, use an array, and work at the end whenever you can.

And this is the **limitation of arrays**: inserting at the beginning isn't as easy as it looks. There are data structures that are much better at it. **Linked lists**, which you'll build soon, keep their items in order just like arrays, but can add and remove at the start in O(1). You'll see how they pull that off when you get there.

**Common mistake:** picking a data structure out of habit. Ask what you'll do with the data most often, then pick the structure that makes that operation cheap.
