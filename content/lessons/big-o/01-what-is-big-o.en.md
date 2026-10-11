---
title: What is Big O?
order: 1
minutes: 7
---

> **Goal:** understand what Big O measures and why we count operations instead of seconds.

## Two programs, one answer

Say you need the sum of every number from 1 to `n`. Here are two programs that both get it right:

```js-run
function sumWithLoop(n) {
  let total = 0
  for (let i = 1; i <= n; i++) {
    total += i
  }
  return total
}

function sumWithFormula(n) {
  return (n * (n + 1)) / 2
}

console.log(sumWithLoop(10), sumWithFormula(10))
```

Press **Run**. Both print `55`. So which one is better?

You can't tell by looking at the answer. You have to look at **how much work** each one does to get there.

## Count the work, not the seconds

Your first idea might be a stopwatch: run both and see which finishes first. The problem is that the stopwatch measures your _computer_ as much as your _code_. The same program runs faster on a new laptop than on an old phone.

So instead, we count **operations**: the steps the code takes. That number doesn't depend on the machine. Let's count them:

```js-run
function sumWithLoop(n) {
  let total = 0
  let operations = 0
  for (let i = 1; i <= n; i++) {
    total += i
    operations++
  }
  return operations
}

for (const n of [10, 1000, 1000000]) {
  console.log('n =', n, '→ loop does', sumWithLoop(n), 'additions')
}
console.log('The formula always does about 3 operations.')
```

The loop does **one addition per number**, so its work grows with `n`. The formula does the same few operations whether `n` is 10 or a million.

That's what **Big O** describes: **how the work grows as the input grows**.

- `sumWithLoop` is **O(n)**: the work grows in step with `n`.
- `sumWithFormula` is **O(1)**: the work stays the same, no matter what `n` is.

## How different growth rates look

Step through the chart. Each line is a way that work can grow as `n` gets bigger:

```viz
big-o-growth-chart
```

The gap between these lines is small for tiny inputs, and enormous for big ones. That's why Big O matters: real programs handle thousands or millions of items.

## Time and space

Big O measures two things:

- **Time complexity:** how the number of **operations** grows with the input.
- **Space complexity:** how much **extra memory** the code needs as the input grows.

Sometimes they pull in opposite directions. A faster solution might use more memory, and in an interview you may be asked, _"Can you do it with less memory?"_ We'll mostly talk about time, but keep space in mind.

## Big O recap

| Code                | Work as `n` grows | Big O |
| ------------------- | ----------------- | ----- |
| `sumWithFormula(n)` | stays the same    | O(1)  |
| `sumWithLoop(n)`    | grows with `n`    | O(n)  |

## Check yourself

1. Why don't we measure code speed with a stopwatch?
2. If an input gets 10 times bigger, what happens to the work of an O(n) function? And an O(1) function?
3. What's the difference between time complexity and space complexity?

When you finish the Big O lessons, take the **Big O quiz** on the module page.
