---
title: Space complexity
order: 12
minutes: 5
---

> **Goal:** measure how much extra memory code needs, with the same Big O language.

## How much memory grows?

So far we've counted **steps** (time complexity). **Space complexity** uses the same Big O language for **memory**: as the input grows, how much extra memory does the code need?

```viz
memory-boxes
```

We only count the memory the code **creates**, not the input itself. The guest list already exists before the function runs, so it doesn't count. (In books you may see this called _auxiliary_ space.)

Rules of thumb for what takes space:

- **Numbers, true/false, `null` and `undefined`:** a fixed amount each, so a few of them are O(1).
- **Strings:** the space grows with their length. A name with 50 letters takes about 50 times the space of a 1-letter name.
- **Arrays and objects:** the space grows with how many items they hold, so a new array of n items is O(n).

For example, `countGuests` from the counting lesson only needs two numbers, `count` and `i`. Whether there are 10 guests or 10 million, that's still two numbers: **O(1) space**. As soon as code builds something new for every guest (a list, an object with a key per guest, one long string with every name), its space grows with n.

## Time and space are separate questions

```viz
trace-welcome-all
```

`welcomeAll` takes **O(n) time**: one message per guest. But it only keeps one variable, `i`, however many guests there are. So it's **O(1) space**. Fast or slow and light or heavy are different questions, and a function can be good at one and bad at the other.

This one builds a new array with a name tag for every guest, so its memory grows with n: **O(n) space**.

```js-run
const guests = ['Ana', 'Ben', 'Cleo']

const nameTags = []
for (let i = 0; i < guests.length; i++) {
  nameTags.push("Hi, I'm " + guests[i])
}
console.log(nameTags)
```

Sometimes you'll trade one for the other: using extra memory (for example, remembering the names you've already seen) to make code faster. In interviews, give both answers: _"This is O(n) time and O(1) space."_ And if the interviewer asks you to use less memory, look for the new arrays and objects your code creates: they're usually where the space goes.
