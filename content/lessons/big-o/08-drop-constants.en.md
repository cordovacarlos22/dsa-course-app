---
title: Drop the constants
order: 8
minutes: 10
---

> **Goal:** simplify expressions like O(2n) with the first rule: drop the constants.

## Two loops in a row

Big O has a few rules that simplify the notation and make our lives easier. They exist because Big O only cares about the **shape** of the growth, so anything that doesn't change the shape can go. The first rule is called **drop constants** (you'll also hear "remove constants"). A **constant** is a fixed number that doesn't depend on n, like the 2 in 2n or the 100 in 100n.

Here's where constants come from. Take `printNumbers` from the last lesson and add a second loop that does the same thing, using `j` instead of `i`. The first loop runs n times; then the second loop runs n times. Two loops **one after the other** add up: n + n = **2n**.

Here's the same shape with the guest list, a welcome loop and then a goodbye loop:

```viz
trace-welcome-and-goodbye
```

**What just happened:** the first loop welcomed every guest, one message each. When it finished, the second loop started from the beginning and said goodbye to every guest. With 3 guests, that's 3 + 3 = 6 messages; with 6 guests, 12. The total is always 2n.

Here's `printTwice`, the numbers version:

```js-run
function printTwice(n) {
  for (let i = 0; i < n; i++) {
    console.log(i)
  }
  for (let j = 0; j < n; j++) {
    console.log(j)
  }
}

printTwice(3)
```

With 3, it prints 0, 1, 2 from the first loop, then 0, 1, 2 again from the second. Both loops run n times, so the code runs **n + n = 2n** times. It makes sense to call this **O(2n)**. Here's the simplification: 2n, 3n or 100n, the number in front makes no difference. Whatever the constant is, **we drop it**, and this code is **O(n)**.

**Common mistake:** thinking that dropping the constant means the code does less work. `printTwice(50)` still prints 100 lines. Big O just doesn't use the 2 to describe it, because 2n and n grow the same way.

## Same shape, so drop the number

Why is that allowed? Because a constant changes how **steep** a line is, not what **kind** of line it is. Look at the lines n, 2n and 3n. They're all **straight lines**. 2n is steeper, but double the input and both of them double. Big O describes the **shape** of the growth, not its steepness.

```viz
same-shape
```

**What just happened:** n, 2n and 3n were drawn on the same chart. Each one was steeper than the last, but all three were straight. Then n² appeared, and it bent upward and left all three behind. Multiplying by a constant made the lines steeper; only changing the shape, from n to n², made a real difference.

Imagine the chart stretching out to enormous values of n, and zooming way out. From that far away, 13n², n² and 1,000n² look almost the same, and so do n, 2n and 100n. Constants just don't change the big picture:

| You counted  | Write it as |
| ------------ | ----------- |
| 2n           | O(n)        |
| 100n         | O(n)        |
| n / 2        | O(n)        |
| 500 (always) | O(1)        |
| 13n²         | O(n²)       |

The O(500) row is worth a second look: it means "500 operations every time, whatever n is". That's a flat line, so we simplify it to **O(1)**, constant time. And n / 2 is a constant too: it's n times ½.

You can see "same shape" in numbers. Double n, and every one of these doubles, whatever its constant:

```js-run
const sizes = [10, 20, 40]
for (let k = 0; k < sizes.length; k++) {
  const n = sizes[k]
  console.log('n =', n, '| n:', n, '| 2n:', 2 * n, '| 100n:', 100 * n, '| n / 2:', n / 2)
}
```

**Common mistake:** dropping the little 2 in n² as if it were a constant. 13n² becomes **O(n²)**, not O(n). The 13 is a constant multiplier, so it goes. The ² is part of the shape: it says the work grows with n × n, and that stays.

## Why it's allowed

This rule comes straight from the definition: code is O(f(n)) if, once n is big enough, its operations are never more than **a constant times f(n)**. 2n is never more than 2 × n, and 100n is never more than 100 × n, so both are O(n). The constant is already "baked into" the definition, so writing it again adds nothing.

Try simplifying these:

- O(n × 40) → **O(n)**
- O(1,000,000) → **O(1)**
- O(2n + 5n) → O(7n) → **O(n)**

The big picture is the same as the chart from lesson 4. Each shape there is one line, and there's no separate line for 2n or 100n: they're all part of the O(n) family.

```viz
big-o-growth-chart
```

**What just happened:** the chart drew one line per shape: O(1), O(log n), O(n) and O(n²). When we drop constants, we're saying which of these lines a piece of code belongs to. `printTwice` belongs with O(n), even though its exact line would be twice as steep.

Does this mean constants never matter? No. A version that walks the list once is still faster than one that walks it twice, and in real code that can count. Run this to compare the work of one pass and two passes over a million guests:

```js-run
const n = 1000000

let onePass = 0
for (let i = 0; i < n; i++) {
  onePass++ // welcome each guest
}

let twoPasses = 0
for (let i = 0; i < n; i++) {
  twoPasses++ // welcome each guest
}
for (let i = 0; i < n; i++) {
  twoPasses++ // then say goodbye to each guest
}

console.log('One pass:', onePass, 'steps')
console.log('Two passes:', twoPasses, 'steps')
```

Both are O(n), and both would double if the guest list doubled. Two passes do twice the work, which you might fix someday, but that's a second-level improvement. Big O is about the big picture first: is the work flat, a straight line, or a curve that shoots up?

**Under the hood:** the constant isn't even a reliable number. Our counts treat every operation as equal, but the processor doesn't. Reading a value that's already in its **cache** (a small, very fast memory right next to it) can be around a hundred times faster than fetching it from the main memory. And the engine may turn one line into several machine steps, or several lines into one. So two functions that both "do 2n operations" can run at quite different speeds on the same computer. The constant depends on the hardware and the engine; the shape doesn't. That's one more reason Big O keeps only the shape.

**Common mistake:** writing the constant in an interview answer, like "it's O(2n)". It isn't wrong math, but it tells the interviewer you haven't simplified yet. Say "it's O(n)", and if it helps, add "it goes through the list twice".
