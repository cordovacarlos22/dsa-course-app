---
title: Space complexity
order: 10
minutes: 6
---

> **Goal:** measure how much extra memory code needs, using the same Big O language.

## Memory is a cost too

So far we've counted steps. **Space complexity** counts something else: how much **extra memory** the code creates as the input grows. (The input itself doesn't count; we only measure what the code adds.)

## A few rules of thumb

- Numbers, booleans, `undefined` and `null` take a fixed amount of space → O(1).
- Strings take space proportional to their length.
- Arrays and objects take space proportional to how many items they hold.

## O(1) space: a few variables

```js-run
function averageScore(scores) {
  let total = 0 // one number
  for (const score of scores) {
    total += score
  }
  return total / scores.length
}

console.log(averageScore([80, 92, 75, 100]))
```

No matter how many scores there are, the function only keeps `total` (and the loop variable). That's **O(1) space**, even though it takes **O(n) time**.

## O(n) space: a new array that grows

```js-run
function withBonus(scores) {
  const boosted = [] // grows with the input
  for (const score of scores) {
    boosted.push(score + 5)
  }
  return boosted
}

console.log(withBonus([80, 92, 75, 100]))
```

This one builds a **new array** with one item per score. Double the scores and you double the memory: **O(n) space**.

## Time and space are separate questions

| Function       | Time | Extra space |
| -------------- | ---- | ----------- |
| `averageScore` | O(n) | O(1)        |
| `withBonus`    | O(n) | O(n)        |

Interviewers often ask both: _"What's the time complexity? And the space?"_ Sometimes you'll trade one for the other, like the guest list in the first lesson: the `Set` made lookups faster by using more memory.

## Recap

- **Space complexity** = how much extra memory grows with the input.
- A few variables → O(1) space. A new array/object/string that grows with the input → O(n) space.
- Always answer time **and** space when asked.

## Check yourself

1. A function counts the vowels in a string using one counter variable. What's its space complexity?
2. A function returns a reversed copy of an array. Space complexity?
3. Can a function be O(n) time and O(1) space? Give an example from this lesson.
