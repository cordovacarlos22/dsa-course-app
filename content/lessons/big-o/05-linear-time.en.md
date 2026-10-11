---
title: 'O(n): linear time'
order: 5
minutes: 4
---

> **Goal:** recognize O(n) code: one step per item.

## One step per guest

```viz
trace-welcome-all
```

The loop runs **once per guest**. 3 guests → 3 messages. 6 guests → 6 messages. The work grows in step with **n**, the number of guests.

## A straight line

```viz
linear-boxes
```

On a chart, O(n) is a **straight line**. It's also called **linear time**. When you hear "proportional" in an interview, think O(n).

Spot it in code: **one loop** that visits each item a fixed number of times.

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']

let letters = 0
for (let i = 0; i < guests.length; i++) {
  letters = letters + guests[i].length
}
console.log('Letters in all the names:', letters)
```
