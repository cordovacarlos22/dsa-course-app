---
title: Best, average and worst case
order: 6
minutes: 6
---

> **Goal:** know what Ω, Θ and O describe, and why Big O always means the worst case.

## Where is the item?

When you work with this notation, three Greek letters show up again and again: **omega (Ω)**, **theta (Θ)** and **omicron (O)**. Omicron is better known as **O**, as in Big O, and it's the one you'll see most.

To see why there are three, picture an array of numbers and a loop that walks through it until it finds the number you want:

```js-run
const numbers = [1, 2, 3, 4, 5, 6, 7]

function stepsToFind(target) {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === target) return i + 1
  }
  return numbers.length
}

console.log('Find 1:', stepsToFind(1), 'step') // best case
console.log('Find 4:', stepsToFind(4), 'steps') // average case
console.log('Find 7:', stepsToFind(7), 'steps') // worst case
```

Looking for 1 takes the fewest iterations: it's the first item. That's the **best case**. Looking for 7 makes the loop go through every item: the **worst case**. Something around the middle, like 4, is the **average case**. Here's the same idea with our guest list:

```viz
search-cases
```

| Case    | Letter    | Also called | In simple terms                                      |
| ------- | --------- | ----------- | ---------------------------------------------------- |
| Best    | Ω (omega) | lower bound | the fastest the code can run, in the best situation  |
| Average | Θ (theta) | tight bound | what you can generally expect                        |
| Worst   | O (big O) | upper bound | the slowest the code can run, in the worst situation |

## Big O is the worst case

```viz
trace-is-invited
```

So **Big O is always the worst case**. It's very common to hear people say "OK, that's your worst-case Big O, but what's your best-case Big O?" Technically, there's no such thing: the best case is **omega** and the average case is **theta**. When we measure Big O, we're always measuring the worst case.

Pick **find 'Zoe'** above: she isn't on the list, so every guest gets checked. That's the worst case for `isInvited`, and it's n checks, so `isInvited` is **O(n)**.

Here are all three cases for `isInvited`, written in this notation:

- **Best case, Ω(1):** the name is the first one on the list. One check, however long the list is.
- **Average case, Θ(n):** on average the name is somewhere in the middle, so about n / 2 checks. Drop the ½ and it grows like n.
- **Worst case, O(n):** the name isn't there, so all n guests are checked.

Why focus on the worst case? Because it's a **promise**: whatever the input, the code will never be slower than this. A search that's usually quick but sometimes reads a million items **will** read a million items one day, for a real user. Planning for the worst case means no surprises.

That doesn't mean the other cases are useless. When you analyze code, think about all three: the best case, what usually happens, and the worst case. But when someone asks for "the Big O", give them the worst case.
