---
title: 'O(n): linear time'
order: 7
minutes: 6
---

> **Goal:** recognize O(n) code: work that grows in proportion to the input.

## Print 0 to n − 1

Our first Big O notation is **O(n)**. It isn't the most efficient or the least efficient one; we start with it because it's the easiest to get your head around.

Here's a function with a `for` loop that runs n times and prints `i` each time:

```viz
trace-print-numbers
```

Run it with the number 10:

```js-run
function printNumbers(n) {
  for (let i = 0; i < n; i++) {
    console.log(i)
  }
}

printNumbers(10)
```

It prints 0 through 9: **ten things**. That's O(n) in a sentence: we passed the function the number n, and it **ran n times**. Pass it 10, it runs 10 times. Pass it a million, it runs a million times.

If you counted the operations exactly, you'd get something like 4n + 1: a comparison, a print and an `i++` (two operations) for every number, plus `let i = 0` once. But you already know the exact count doesn't matter: it grows in proportion to n, so it's O(n).

## A straight line

```viz
linear-boxes
```

Let's put it on a graph. One axis is **n**, the size of the input. The other axis is the **number of operations**. O(n) is **always a straight line**.

That's because O(n) is **proportional**: the number of operations is directly proportional to n. Double n and you double the operations; multiply n by 10 and you do 10 times the work. That's why O(n) is also called **linear time**, and why "proportional" is the word you'll hear for it in interviews.

As the module goes on, we'll add the other notations to this same graph, so you can compare them against each other.

## The same idea with guests

```viz
trace-welcome-all
```

`welcomeAll` prints one welcome message per guest. 3 guests, 3 messages; 6 guests, 6 messages. Same shape: O(n).

Notice that **n** isn't always a number you pass in. In `printNumbers`, n is the number itself; in `welcomeAll`, n is the **length of the array**, the number of guests. Either way, n is "the size of the input", and the work grows with it.

To spot O(n) in code, look for **one loop that goes through the input once**, doing a small, fixed amount of work for each item. For example:

- looping through an array to print, count or add up its items,
- finding the largest number or the longest name,
- searching an unsorted list, like `isInvited` (in the worst case, the name isn't there).

A loop that can stop early still counts as O(n), because Big O is the worst case. And watch out for **hidden loops**: `guests.includes('Zoe')` and `guests.indexOf('Zoe')` are one line each, but they check the items one by one behind the scenes, so they're O(n) too.
