---
title: Best, average and worst case
order: 3
minutes: 6
---

> **Goal:** know what Ω (omega), Θ (theta) and O (big O) describe, and why interviews focus on the worst case.

## The same code, different amounts of work

You're looking for a song in an unsorted playlist, one song at a time. How long it takes depends on **where** the song is:

```js-run
const playlist = ['Intro', 'Sunrise', 'Echo', 'Drift', 'Finale']

function stepsToFind(song) {
  let steps = 0
  for (const track of playlist) {
    steps++
    if (track === song) return steps
  }
  return steps // checked every song and didn't find it
}

console.log('Best case (first song):', stepsToFind('Intro'), 'step')
console.log('Middle song:', stepsToFind('Echo'), 'steps')
console.log('Worst case (not there):', stepsToFind('Encore'), 'steps')
```

Same code, same playlist, but 1 step, 3 steps or 5 steps depending on the input.

## Three Greek letters

Computer scientists have a name for each situation:

| Case             | Letter               | Meaning                                  | Our playlist                  |
| ---------------- | -------------------- | ---------------------------------------- | ----------------------------- |
| **Best** case    | Ω (omega)            | the least work the code can ever do      | found on the first try: Ω(1)  |
| **Average** case | Θ (theta)            | the work you can expect most of the time | about half the playlist: Θ(n) |
| **Worst** case   | O (big O, "omicron") | the most work the code can ever do       | checked every song: O(n)      |

## Big O means the worst case

When people say "the Big O of this code", they mean the **worst case**. That's the useful promise: _no matter the input, it will never be slower than this_.

A common mix-up is saying "the best-case Big O". Technically, the best case is omega and the average case is theta. Big O is always the upper limit.

Why focus on the worst case? Because it's the one that bites you. A search that's usually fast but sometimes checks a million items will eventually do exactly that, for a real user.

## Recap

- The same code can do different amounts of work for different inputs.
- Ω = best case, Θ = average case, **O = worst case**.
- "What's the Big O?" always asks about the worst case.

## Check yourself

1. In the playlist example, what input gives the best case? And the worst?
2. Which letter describes the average case?
3. Why is the worst case the most useful one to know?
