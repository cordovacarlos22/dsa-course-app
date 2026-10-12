---
title: 'O(n): linear time'
order: 5
minutes: 5
---

> **Goal:** recognize O(n) code: work that grows in step with the input.

## One step per guest

Let's start with the easiest Big O to picture. `welcomeAll` prints a welcome message for every guest:

```viz
trace-welcome-all
```

The loop runs **once per guest**. With 3 guests it prints 3 messages; pick **6 guests** and it prints 6. If n is the number of guests, the work is n steps. That's **O(n)**, which you read as "O of n".

It doesn't matter what the names are or how long they are: what decides the amount of work is how many guests there are.

## A straight line

```viz
linear-boxes
```

Put the number of guests on one side of a chart and the number of steps on the other, and O(n) draws a **straight line**. Each time you double the guests, the steps double too. That's why O(n) is called **linear time**.

There's a word you'll hear in interviews for this: **proportional**. "The time is proportional to the size of the input" means O(n). It isn't as good as staying flat, but it's fair: more guests, proportionally more work.

## Spotting O(n)

```viz
trace-is-invited
```

Look for **one loop** that goes through the input once, doing a small, fixed amount of work for each item. For example:

- adding up or counting something for every guest,
- finding the longest name or the largest number,
- searching an unsorted list, like `isInvited` (worst case: the name isn't there).

A loop that can stop early, like `isInvited`, still counts as O(n): Big O is the worst case, and in the worst case the name isn't there and every guest gets checked.

Watch out for **hidden loops**. `guests.includes('Zoe')` and `guests.indexOf('Zoe')` are one line each, but behind the scenes they do exactly what the animation shows: check the guests one by one. So they're O(n) too.

Try changing this code. However many guests you add, the loop visits each one once:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']

let letters = 0
for (let i = 0; i < guests.length; i++) {
  letters = letters + guests[i].length
}
console.log('Letters in all the names:', letters)
```
