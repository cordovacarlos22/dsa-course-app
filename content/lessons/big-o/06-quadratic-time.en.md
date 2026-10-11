---
title: 'O(n²): nested loops'
order: 6
minutes: 6
---

> **Goal:** recognize O(n²) code, and understand why it gets slow so quickly.

## Every pair, once each way

A chess club wants every player to play every other player, once with white and once with black. Let's list the games with a loop inside a loop:

```js-run
const players = ['Ada', 'Ben', 'Cy']

let games = 0
for (const white of players) {
  for (const black of players) {
    if (white !== black) console.log(white, 'vs', black)
    games++ // count every inner step, even when a player meets themselves
  }
}
console.log('Inner steps:', games)
```

For each of the 3 players, the inner loop runs 3 times: **3 × 3 = 9** steps. With `n` players, that's **n × n = n²**.

That's **O(n²)**, also called **quadratic time**. When you see a loop inside a loop, both over the same input, think O(n²).

## How fast does it grow?

```js-run
function innerSteps(n) {
  let steps = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      steps++
    }
  }
  return steps
}

for (const n of [10, 100, 1000]) {
  console.log('n =', n, '→', innerSteps(n), 'steps')
}
```

10 times more players means **100 times** more work. That's why O(n²) code feels fine in testing and then crawls with real data.

A third nested loop multiplies again: **n × n × n = O(n³)**, which grows even faster.

## O(n²) is a warning sign

Nested loops aren't always avoidable, but they're often a hint that there's a smarter way. Many interview problems start with an O(n²) idea and ask you to get it to O(n). In this course, the patterns module will show you how.

In short:

- A loop inside a loop over the same input → **O(n²)**.
- 10× the input → 100× the work.
- Three nested loops → O(n³).
