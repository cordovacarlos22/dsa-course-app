---
title: The data structures you get for free
order: 1
minutes: 10
---

> **Goal:** know what a data structure is, meet the two that JavaScript gives you for free, and learn the four questions we'll ask about each one.

## What is a data structure?

You just spent a whole module learning to measure code with Big O. Before we use it on searching, sorting and the data structures you'll build yourself, let's point it at something you already use every day: **arrays and objects**. This module doesn't teach how to use them from scratch. You already know how to make an array or read a property. Instead, we'll look at them **through the lens of Big O**: which things they do fast, which things are slower than you'd expect, and why.

First, a definition. A **data structure** is a way of organizing data in memory so that some things are easy and fast to do with it. The same information can be stored in different structures, and the structure you pick decides which operations are cheap and which are expensive.

You already do this in real life. A dictionary keeps its words in alphabetical order, so finding a word is quick, but adding a new word means making room on the right page. A shoebox of receipts is the opposite: tossing a new receipt in takes no effort at all, but finding one specific receipt means digging through the whole box. Neither one is "the best". Each one is good at something and bad at something else. That's called a **trade-off**, and every data structure has one.

Most of this course is about data structures: linked lists, stacks, queues, trees, heaps, hash tables and graphs. You'll build each of them yourself. But JavaScript already gives you two for free, with no code to write: the **array** and the **object**.

```viz
array-vs-object
```

**What just happened:** the same party was stored in two different ways.

- The **array** `guests` keeps the guests **in order**, each one at a numbered position (an index).
- The **object** `rsvps` doesn't care about order. It **labels** each answer with a key, the guest's name.

Reading, adding at the end and searching cost about the same in both. But when Zoe was added at the start, the array had to re-index every guest, while the object had no "start" to worry about. That's the trade-off you'll study in this module: the array pays for its order.

Run this to see both structures and a surprise:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli']
const rsvps = { Ana: 'yes', Ben: 'no', Cleo: 'maybe', Dev: 'yes', Eli: 'no' }

console.log(guests)
console.log(rsvps)

console.log(typeof guests) // 'object'!
console.log(Array.isArray(guests), Array.isArray(rsvps))
```

`typeof` says that an array is an `'object'`. In JavaScript, arrays really are a special kind of object, one whose keys are the numbers 0, 1, 2… plus a `length`. They behave so differently that we study them separately, and `Array.isArray` is how you tell them apart.

**Common mistake:** thinking one of them is always better. Arrays aren't "worse objects" and objects aren't "faster arrays". They're built for different jobs.

## Access vs search

To compare data structures fairly, we ask the same four questions about each one. These words will come back in every module of the course, so it's worth being precise about them:

- **Insert:** add a new item.
- **Remove:** take an item out.
- **Access:** read an item when you know **where** it is: its index in an array, or its key in an object.
- **Search:** find an item when you only know **what** it is: its value.

The difference between the last two is the one people mix up the most. Access asks "what's at index 3?" or "what did Dev answer?". Search asks "is Zoe on the list?" or "did anyone answer maybe?". With access you have an address, so you can go straight there. With search you have no address, so you may have to look everywhere.

```viz
search-cases
```

**What just happened:** looking for a guest by name means checking the boxes one by one. In the best case the name is in the first box; in the worst case it isn't there at all and every box gets checked. That's search, and in an unsorted list it's **O(n)**.

Compare that with reading `guests[3]`, which jumps straight to box 3 in one step, as you saw in the Big O module. Same array, same guests, two very different costs: it all depends on whether you know **where** or only **what**.

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli']

// Access: we know where. One step: O(1).
console.log(guests[3])

// Search: we only know what. indexOf checks the boxes one by one: O(n).
console.log(guests.indexOf('Eli'))
console.log(guests.indexOf('Zoe')) // -1: checked them all, not there
```

**Common mistake:** calling `indexOf` or `includes` "access". They're one line each, but they're searches: there's a loop inside them.

## Why measure tools you already use?

It's tempting to think that built-in tools are free because you didn't write them. They're not. When you call a method, someone else's code runs, and that code has a Big O just like yours. Some built-ins do one small step. Others loop over every item, and a few do even more. If you don't know which is which, one innocent-looking line inside a loop can turn a fast function into a slow one.

That's why this module has three goals:

1. **Put a Big O on every basic operation of objects and arrays**, and know the reason behind each one.
2. **Explain what makes the front of an array the expensive end**, and what you can do about it.
3. **Weigh arrays against objects, and their built-in methods against each other**: `push`, `slice`, `sort`, `Object.keys`, `hasOwnProperty` and more.

You'll also meet one new Big O, **O(n log n)**, which is where JavaScript's `sort` lands. Here's the scale we'll keep using:

```viz
big-o-growth-chart
```

**What just happened:** these are the shapes from the Big O module, from the flat O(1) to the steep O(n²). Every operation in this module lands on one of them. To place it, ask one simple question: **how many items does it touch?** One item, whatever the size: O(1). Every item once: O(n).

You don't need to memorize a table of every method. If you understand **why** an operation costs what it costs, you can work it out when you need it. That's a much more useful skill in an interview than a memorized list.

You can feel the difference right now. This code adds 30,000 guests at the end of one array and 30,000 at the start of another:

```js-run
let start = performance.now()
const atTheEnd = []
for (let i = 0; i < 30000; i++) {
  atTheEnd.push(i)
}
console.log('push:', (performance.now() - start).toFixed(1), 'ms')

start = performance.now()
const atTheStart = []
for (let i = 0; i < 30000; i++) {
  atTheStart.unshift(i)
}
console.log('unshift:', (performance.now() - start).toFixed(1), 'ms')
```

Same number of items, same final size, a very different time. The rest of this module explains why.
