---
title: Space complexity
order: 12
minutes: 4
---

> **Goal:** measure how much extra memory code needs, with the same Big O language.

## How much memory grows?

```viz
memory-boxes
```

**Space complexity** counts the **extra memory** the code creates as the input grows (the input itself doesn't count).

- A few numbers or true/false values: **O(1) space**.
- A new array, object or string that grows with the input: **O(n) space**.

## Time and space are separate questions

```viz
trace-welcome-all
```

`welcomeAll` takes **O(n) time** (one message per guest) but only keeps `i`: **O(1) space**. Interviewers often ask for both: _"What's the time complexity? And the space?"_

```js-run
const guests = ['Ana', 'Ben', 'Cleo']

// O(n) space: one new name tag per guest.
const nameTags = []
for (let i = 0; i < guests.length; i++) {
  nameTags.push("Hi, I'm " + guests[i])
}
console.log(nameTags)
```
