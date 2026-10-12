---
title: Different terms for inputs
order: 13
minutes: 6
---

> **Goal:** write O(a + b) and O(a · b) for code with two inputs. A classic interview "gotcha"!

## Two inputs

Remember `printTwice`, with one loop after another? Each loop ran n times, so it was O(2n), and we dropped the constant to get O(n). Here's the interview twist: instead of passing in **one** number n, we pass in **two** different ones, a and b. The first loop runs a times and the second runs b times:

```js-run
function printBoth(a, b) {
  for (let i = 0; i < a; i++) {
    console.log('first loop:', i)
  }
  for (let j = 0; j < b; j++) {
    console.log('second loop:', j)
  }
}

printBoth(2, 4)
```

The knee-jerk answer, if you haven't seen this before, goes like this: "A single loop is O(n), and this other single loop is O(n). Add them: O(2n). Drop the constant: O(n)."

**That's not correct.** You can't say that a equals n **and** b equals n: they're two different inputs. What if a is 1 and b is a million? Those are very different loops. So the first loop is **O(a)**, the second is **O(b)**, and together they're **O(a + b)**. That's as far as it simplifies.

Here's the same idea with a party that has guests (a) and helpers (b):

```viz
two-inputs
```

And if the loops were **nested** (every guest thanks every helper), it would be **O(a · b)**: a loop over b inside a loop over a runs a × b times.

## Don't call them both n

```viz
trace-welcome-and-goodbye
```

Compare that with this animation: here both loops go over the **same** list, so n + n = 2n really is O(n). The rule is simple: **use a different letter for each input**. Only when two loops go over the same input can you use the same letter.

| Code shape                                  | Big O    |
| ------------------------------------------- | -------- |
| Two loops in a row over the same list       | O(n)     |
| Loop over guests, then loop over helpers    | O(a + b) |
| Two nested loops over the same list         | O(n²)    |
| Loop over helpers inside a loop over guests | O(a · b) |

Why can't O(a + b) be simplified? Because neither term is a constant, and you don't know which one is bigger. If there are 4 guests and 1,000 helpers, the helpers decide the work; with a million guests and 3 helpers, the guests do. Big O keeps both, so the answer is right whichever input turns out to be large.

In an interview, it's a good habit to say this out loud: "Let's call the number of guests a and the number of helpers b. The first loop is O(a), the second is O(b), so the whole function is O(a + b)."
