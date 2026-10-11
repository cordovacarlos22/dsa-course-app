---
title: What is Big O?
order: 1
minutes: 7
---

> **Goal:** understand what Big O measures and why we count steps instead of seconds.

## Two ways to check a guest list

You're at the door of a party with the guest list. Someone walks up and says their name. Is it on the list?

Here are two programs that answer that question:

```js-run
const guests = ['Ana', 'Luis', 'Maya', 'Omar', 'Zoe']

// Version 1: read the list from the top until you find the name.
function isInvitedList(name) {
  for (const guest of guests) {
    if (guest === name) return true
  }
  return false
}

// Version 2: put the names in a Set once, then just ask the Set.
const guestSet = new Set(guests)
function isInvitedSet(name) {
  return guestSet.has(name)
}

console.log(isInvitedList('Omar'), isInvitedSet('Omar'))
console.log(isInvitedList('Leo'), isInvitedSet('Leo'))
```

Press **Run**. Both versions give the same answers. So which one is better?

With 5 guests, you can't tell. Now imagine a stadium with a million names on the list.

## Count the steps, not the seconds

Your first idea might be a stopwatch: run both and see which finishes first. The problem is that a stopwatch measures your _computer_ as much as your _code_. The same program runs faster on a new laptop than on an old phone.

So instead, we count **steps**: how many names each version has to check. That number doesn't depend on the machine. Let's count them for bigger and bigger lists, looking for a name that isn't there (the slowest case for version 1):

```js-run
function checksWithList(list, name) {
  let checks = 0
  for (const guest of list) {
    checks++
    if (guest === name) break
  }
  return checks
}

for (const n of [10, 1000, 1000000]) {
  const list = Array.from({ length: n }, (_, i) => 'guest-' + i)
  console.log('n =', n, '→ the list needs', checksWithList(list, 'Leo'), 'checks')
}
console.log('The Set needs about 1 check, no matter how many guests there are.')
```

The list version does **one check per guest**, so its work grows with the number of guests, `n`. The Set jumps straight to the answer: its work stays about the same whether there are 10 guests or a million.

That's what **Big O** describes: **how the work grows as the input grows**.

- `isInvitedList` is **O(n)**: the work grows in step with `n`.
- `isInvitedSet` is **O(1)** (on average): the work stays the same, no matter what `n` is.

## How different growth rates look

Step through the chart. Each line is a way that work can grow as `n` gets bigger:

```viz
big-o-growth-chart
```

The gap between these lines is small for tiny inputs, and enormous for big ones. That's why Big O matters: real programs handle thousands or millions of items.

## Time and space

Big O measures two things:

- **Time complexity:** how the number of **steps** grows with the input.
- **Space complexity:** how much **extra memory** the code needs as the input grows.

Our guest list shows the trade-off. The Set is faster, but it's a **second copy** of every name, so it uses extra memory: O(n) space. The list version uses no extra memory: O(1) space. In an interview you may hear, _"Great, it's fast. Can you do it with less memory?"_ We'll mostly talk about time, but keep space in mind.

In short:

| Code                  | Time            | Extra space |
| --------------------- | --------------- | ----------- |
| `isInvitedList(name)` | O(n)            | O(1)        |
| `isInvitedSet(name)`  | O(1) on average | O(n)        |

When you finish the Big O lessons, take the **Big O quiz** on the module page.
