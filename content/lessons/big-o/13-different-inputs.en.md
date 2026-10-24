---
title: Different terms for inputs
order: 13
minutes: 10
---

> **Goal:** write O(a + b) and O(a · b) for code with two inputs. A classic interview "gotcha"!

## Two inputs

So far, every function had **one** input, and we called its size n. But plenty of functions take two: two lists to compare, a list of guests and a list of helpers, two strings. Each input can have any size, and the sizes don't have to match. So each input gets **its own letter** in Big O. When a function takes two inputs, we usually call their sizes **a** and **b**.

Remember `printTwice`, with one loop after another? Each loop ran n times, so it was O(2n), and we dropped the constant to get O(n). Here's the interview twist: instead of passing in **one** number n, we pass in **two** different ones, a and b. The first loop runs a times and the second runs b times.

The first answer that comes to mind, if you haven't seen this before, goes like this: "A single loop is O(n), and this other single loop is O(n). Add them: O(2n). Drop the constant: O(n)." **That's not correct.** You can't say that a equals n **and** b equals n: they're two different inputs. Picture a = 1 and b = 1,000,000: one loop barely runs, and the other runs a million times. So the first loop is **O(a)**, the second is **O(b)**, and together they're **O(a + b)**. That's as far as it simplifies.

Here's the same idea with a party that has guests (a) and helpers (b):

```viz
two-inputs
```

**What just happened:** the party had 4 guests and 2 helpers: two different lists. The first loop welcomed every guest (a steps), and a second loop then went over the helpers (b more steps), for **O(a + b)** in total. In the last scene, every guest thanked every helper: a loop over the helpers **inside** a loop over the guests. That's a × b steps: **O(a · b)**.

Here's `printBoth`, the numbers version:

```js-run
function printBoth(a, b) {
  for (let i = 0; i < a; i++) {
    console.log('first loop:', i)
  }
  for (let j = 0; j < b; j++) {
    console.log('second loop:', j)
  }
}

printBoth(2, 4) // 2 + 4 = 6 lines: O(a + b)
```

And here are both shapes with counters, one after the other and one inside the other:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev'] // a = 4
const helpers = ['Kai', 'Lu'] // b = 2

let inARow = 0
for (let i = 0; i < guests.length; i++) {
  inARow++ // welcome a guest
}
for (let j = 0; j < helpers.length; j++) {
  inARow++ // brief a helper
}

let nested = 0
for (let i = 0; i < guests.length; i++) {
  for (let j = 0; j < helpers.length; j++) {
    nested++ // this guest thanks this helper
  }
}

console.log('In a row:', inARow, 'steps (a + b)') // 6
console.log('Nested:', nested, 'steps (a · b)') // 8
```

**Common mistake:** that first answer, calling both loops O(n) and ending up with O(n). Two loops over **different** inputs never collapse into one letter. Write one letter per input, then add (loops in a row) or multiply (one loop inside the other).

## Don't call them both n

When **can** you use the same letter? Only when two loops go over the **same** input. Then their sizes really are the same number, and the rules you already know apply: two loops in a row over the same list are n + n = 2n, which is O(n); one inside the other is n × n, which is O(n²). So the rule is simple: **use a different letter for each input**.

```viz
trace-welcome-and-goodbye
```

**What just happened:** both loops went over the **same** guest list. The welcome loop ran once per guest, then the goodbye loop ran once per guest again: n + n = 2n. Because it's one input, n really is the same number in both loops, so 2n is O(n).

| Code shape                                  | Big O    |
| ------------------------------------------- | -------- |
| Two loops in a row over the same list       | O(n)     |
| Loop over guests, then loop over helpers    | O(a + b) |
| Two nested loops over the same list         | O(n²)    |
| Loop over helpers inside a loop over guests | O(a · b) |

Why can't O(a + b) be simplified? Because neither term is a constant, and you don't know which one is bigger. If there are 4 guests and 1,000 helpers, the helpers decide the work; with a million guests and 3 helpers, the guests do. Big O keeps both, so the answer is right whichever input turns out to be large. Run both cases:

```js-run
function stepsInARow(a, b) {
  return a + b
}
function stepsNested(a, b) {
  return a * b
}

console.log('4 guests, 1,000 helpers:', stepsInARow(4, 1000), 'in a row,', stepsNested(4, 1000), 'nested')
console.log('1,000,000 guests, 3 helpers:', stepsInARow(1000000, 3), 'in a row,', stepsNested(1000000, 3), 'nested')
```

In the first case, b does almost all the work; in the second, a does. Neither letter can be dropped, because the code works for both parties.

There's one exception: when the problem **promises** that an input never grows. If every party has exactly 3 helpers, b isn't a variable anymore: it's the constant 3. Then O(a + 3) simplifies to O(a), and O(a · 3) to O(a) as well. A letter only stays in the answer for an input that can grow.

In an interview, it's a good habit to say this out loud: "Let's call the number of guests a and the number of helpers b. The first loop is O(a), the second is O(b), so the whole function is O(a + b)."

**Under the hood:** two inputs can hide inside a single line, too. `text.includes(word)` looks for one string inside another. The simplest way to do that, and a good picture of the work, is to line the word up under the start of the text, compare letter by letter, and if they don't match, slide the word one position over and try again. With a text of a letters and a word of b letters, an unlucky search compares about a × b letters, so even this one line can be O(a · b). Real engines use cleverer methods, and some keep even the unlucky case close to a + b, but JavaScript's rules don't promise any of them. When you can't know which method runs, O(a · b) is the safe answer.

**Common mistake:** dropping one input because it's "probably small". Maybe there are usually only a few helpers, but Big O describes the worst case, and nothing in the code stops the helper list from being huge. Unless the problem promises a limit, keep both letters.
