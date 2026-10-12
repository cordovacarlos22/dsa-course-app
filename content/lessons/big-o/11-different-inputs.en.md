---
title: Different inputs, different letters
order: 11
minutes: 5
---

> **Goal:** write O(a + b) and O(a · b) for code with two inputs. A classic interview trap!

## Guests and helpers

So far every function had one input, the guest list, and we called its size n. But the party also has **helpers**, and the list of helpers can be a completely different size:

```viz
two-inputs
```

Use **one letter per input**: **a** guests and **b** helpers.

- A loop over the guests, then a loop over the helpers: a steps + b steps = **O(a + b)**. Loops one after the other **add**.
- A loop over the helpers **inside** a loop over the guests (every guest thanks every helper): a × b steps = **O(a · b)**. Loops inside each other **multiply**.

## Don't call them both n

```viz
trace-welcome-and-goodbye
```

Here's the interview trap. You see two loops in a row and think: "Each loop is O(n), so O(n + n) = O(2n), drop the constant, O(n)." That's exactly right for this animation, because **both loops go over the same list**.

But if the second loop went over the helpers, it would be wrong. What if there are 4 guests and 1,000 helpers? Or a million guests and 3 helpers? Calling both sizes n hides that they can be wildly different. So the answer is **O(a + b)**, and it can't be simplified any further: neither term is a constant, and you don't know which one is bigger.

The same goes for nested loops: over the same list it's O(n²), but over two different lists it's O(a · b).

| Code shape                                  | Big O    |
| ------------------------------------------- | -------- |
| Two loops in a row over the same list       | O(n)     |
| Loop over guests, then loop over helpers    | O(a + b) |
| Two nested loops over the same list         | O(n²)    |
| Loop over helpers inside a loop over guests | O(a · b) |
