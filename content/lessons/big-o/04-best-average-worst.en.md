---
title: Best, average and worst case
order: 4
minutes: 5
---

> **Goal:** know what Ω, Θ and O describe, and why Big O means the worst case.

## Where is the name?

`isInvited` doesn't always do the same amount of work. It depends on **where** the name is:

```viz
search-cases
```

Computer scientists use three Greek letters for these situations:

| Case    | Letter    | Meaning                                  | Our guest list                 |
| ------- | --------- | ---------------------------------------- | ------------------------------ |
| Best    | Ω (omega) | the least work the code can ever do      | the name is first: 1 check     |
| Average | Θ (theta) | the work you can expect most of the time | around the middle: about n / 2 |
| Worst   | O (big O) | the most work the code can ever do       | not on the list: n checks      |

Some books call the O "omicron", another Greek letter, but everyone just says "big O".

## Big O is the worst case

```viz
trace-is-invited
```

Pick **find 'Zoe'** and watch every guest get checked. That's the worst case, and it's what people mean when they say "the Big O of this code". Big O is an **upper limit**: a promise that, whatever the input, the code will **never be slower** than this.

You'll sometimes hear "the best-case Big O" or "the average-case Big O". Technically those don't exist: the best case is Ω and the average case is Θ. Big O always describes the worst case.

Why focus on the worst case? Because it's the one that hurts. A search that's usually quick but sometimes reads a million names **will** read a million names one day, for a real user. Planning for the worst case means no surprises. For `isInvited`, the worst case is n checks, so it's **O(n)**. The next lesson shows what that looks like.
