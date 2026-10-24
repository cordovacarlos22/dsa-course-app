---
title: 'O(n): linear time'
order: 7
minutes: 9
---

> **Goal:** recognize O(n) code: work that grows in proportion to the input.

## Print 0 to n − 1

Our first Big O notation is **O(n)**, read "O of n". It isn't the most efficient or the least efficient one; we start with it because it's the easiest to get your head around. **O(n)** means the work grows **in step with the input**: if the input is n items (or the number n), the code does about n units of work. One more item, one more unit of work.

The simplest O(n) code is a loop that runs once for each number up to n. Here's a function, `printNumbers`, with a `for` loop that runs n times and prints `i` each time. Before you watch it, predict: if you pass it 3, how many lines will it print?

```viz
trace-print-numbers
```

**What just happened:** with n = 3, the loop started at `i = 0` and printed 0, 1 and 2. When `i` reached 3, the check `i < n` failed and the loop stopped: 3 lines for n = 3. Pick n = 10 and you get 10 lines. The number of lines is always exactly n.

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

**Common mistake:** expecting `printNumbers(10)` to print 1 through 10. The loop starts at 0 and stops **before** n, so it prints 0 through 9. That's still ten numbers, which is exactly what O(n) promises: n turns of the loop.

## A straight line

Let's put it on a graph. One axis is **n**, the size of the input. The other axis is the **number of operations**. O(n) is **always a straight line**.

That's because O(n) is **proportional**: the operation count rises in direct proportion to n. Double n and you double the operations; multiply n by 10 and you do 10 times the work. That's why O(n) is also called **linear time** ("linear" means "in a line"), and why "proportional" is the word you'll hear for it in interviews.

```viz
linear-boxes
```

**What just happened:** each guest added one step. 4 guests took 4 steps, 8 guests took 8, and 16 took 16. Every dot landed on the same straight line, because each new guest costs the same amount of work as the one before. As the module goes on, we'll add the other notations to this same graph, so you can compare them against each other.

Proportional has a simple test: divide the work by n. If the answer stays about the same as n grows, the growth is linear. Run it:

```js-run
function countSteps(n) {
  let steps = 0
  for (let i = 0; i < n; i++) {
    steps++
  }
  return steps
}

const sizes = [1000, 2000, 3000]
for (let k = 0; k < sizes.length; k++) {
  const n = sizes[k]
  const steps = countSteps(n)
  console.log('n =', n, '| steps =', steps, '| steps ÷ n =', steps / n)
}
```

The ratio stays at 1: every item costs one step. A loop with 4 operations per item would show a ratio of 4, still the same for every n, and still a straight line.

**Common mistake:** thinking O(n) means slow. When a job needs to look at every item at least once, like finding the largest number in an unsorted list, O(n) is the best anyone can do. You can't know which number is largest without looking at all of them.

## The same idea with guests

Notice that **n** isn't always a number you pass in. In `printNumbers`, n is the number itself. Most of the time, though, n is **the size of the input**: the length of an array, the number of characters in a string, the number of guests. Whatever the input is, n measures how much of it there is, and the work grows with it.

Here's O(n) with an array. `welcomeAll` prints one welcome message per guest:

```viz
trace-welcome-all
```

**What just happened:** with 3 guests, the loop printed 3 messages; with 6 guests, 6 messages. The loop went through the array once, doing one small, fixed job for each guest. Same shape as `printNumbers`: O(n), where n is the number of guests.

To spot O(n) in code, look for **one loop that goes through the input once**, doing a small, fixed amount of work for each item. For example:

- looping through an array to print, count or add up its items,
- finding the largest number or the longest name,
- searching an unsorted list, like `isInvited` (in the worst case, the name isn't there).

And watch out for **hidden loops**. `guests.includes('Zoe')` and `guests.indexOf('Zoe')` are one line each, but they check the items one by one behind the scenes, so they're O(n) too:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']

// One loop, one message per guest: O(n).
for (let i = 0; i < guests.length; i++) {
  console.log('Welcome, ' + guests[i] + '!')
}

// One line each, but each one checks the guests one by one: also O(n).
console.log(guests.includes('Zoe'))
console.log(guests.indexOf('Dev'))
```

**Under the hood:** strings hide loops too. A string keeps its `length` stored, so reading it is one step. But `name.toUpperCase()` builds a brand-new string one character at a time, `name.split('')` makes an array with one item per character, and `name.includes('an')` checks position after position until it finds a match. Each of those grows with the length of the text. For a guest's name, that's a handful of steps; for a whole book stored in one string, it's hundreds of thousands. When n is the number of characters, one method call can be an O(n) loop.

**Common mistake:** calling a loop O(1) because it can stop early. `isInvited` stops as soon as it finds the name, so sometimes it does just one check. But Big O is the worst case, and in the worst case the name isn't there and every guest gets checked. A loop that can stop early still counts as **O(n)**.
