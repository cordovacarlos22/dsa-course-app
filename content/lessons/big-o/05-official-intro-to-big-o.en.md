---
title: The official intro to Big O
order: 5
minutes: 8
---

> **Goal:** know the official meaning of Big O, and use it on four examples.

## Fuzzy counting, made official

```viz
big-o-growth-chart
```

We've been talking about Big O without officially naming it. Here it is: **Big O notation is a formal way of fuzzy counting.** It lets us talk precisely about **how the runtime of an algorithm grows as its input grows**. That's all it is: a description of the relationship between the size of the input and the time the code takes.

It ignores the small details and keeps only the broad trend. We've already seen two trends:

- With the formula version of `sumUpTo`, the size of n doesn't change the time at all.
- With the loop version, as n grows, the runtime grows with it in a roughly one-to-one pattern.

When you're unsure about a piece of code, ask yourself: _as the input grows, what will this chart look like?_ Does the time stay flat, grow in a straight line, or shoot up?

## The definition

```viz
same-shape
```

Here's the official definition. It looks scary, so we'll unpack it right after:

> We say an algorithm is **O(f(n))** if the number of simple operations the computer has to do is **eventually less than a constant times f(n)**, as n increases.

`f(n)` just means "some function of n": a formula that turns the input size into an amount of work. The common ones are:

- **f(n) = n**: linear. As n grows, the runtime grows in proportion.
- **f(n) = n²**: quadratic. The runtime grows with the square of n.
- **f(n) = 1**: constant. As n grows, the runtime doesn't change.
- …and a few others you'll meet soon, like log n.

"Eventually less than a constant times f(n)" is what makes Big O fuzzy. The loop version does about 5n + 2 operations. Once n is at least 2, that's never more than 6 × n, so it's **O(n)**. It doesn't matter whether the count is 1n, 5n or 50n: on a giant chart, all of them are straight lines, and we simplify them to just n.

One more thing to remember: Big O describes the **worst case**, the upper limit of the runtime. Whatever the input, the code won't do worse than this.

## Four examples

```viz
trace-print-pairs
```

Let's put labels on four functions:

1. **`sumUpToFormula(n)`** always does 3 operations. The line is flat: **O(1)**.
2. **`sumUpTo(n)`** with a loop does about 5n + 2 operations: **O(n)**.
3. **`countUpAndDown(n)`** counts up from 0 to n − 1, then back down. Run it:

```js-run
function countUpAndDown(n) {
  console.log('Going up!')
  for (let i = 0; i < n; i++) {
    console.log(i)
  }
  console.log('At the top! Going down...')
  for (let j = n - 1; j >= 0; j--) {
    console.log(j)
  }
  console.log('Back down.')
}

countUpAndDown(3)
```

Each loop grows with n, so the total is about 2n. You might want to call it O(2n), but remember: we care about the big picture, so it's simply **O(n)**.

4. **`printPairs(n)`** prints every pair of numbers from 0 to n − 1 with a loop **inside** another loop (that's the animation above). It isn't O(2n): because the loops are nested, each one runs n times **for every step** of the other. Count the pairs:

```js-run
function printPairs(n) {
  let pairs = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      pairs = pairs + 1
    }
  }
  return pairs
}

console.log('n = 2:', printPairs(2), 'pairs') // 4
console.log('n = 3:', printPairs(3), 'pairs') // 9
console.log('n = 4:', printPairs(4), 'pairs') // 16
```

2 → 4, 3 → 9, 4 → 16: the runtime grows like n × n, so it's **O(n²)**. That grows much faster than O(n): try n = 1,000 and you get a million pairs.

So our four functions are: constant, linear, linear and quadratic. If this feels like a lot, that's normal. The next lessons take each shape slowly, one at a time.
