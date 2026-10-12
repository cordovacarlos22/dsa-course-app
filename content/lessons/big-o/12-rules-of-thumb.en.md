---
title: Rules of thumb
order: 12
minutes: 8
---

> **Goal:** find the Big O of a whole function quickly, by giving each line a cost.

## The cost of each line

Analyzing code can get complicated if you nitpick every detail. These rules of thumb don't always work, but they're a great starting point. Step through this function and watch a cost badge appear next to each line:

```viz
trace-party-summary
```

1. **Arithmetic is constant.** Adding, subtracting, multiplying or dividing takes about the same time whatever the numbers are: 2 + 2 and 1,000,000 + 2 cost the same. O(1).
2. **Variable assignment is constant.** `x = 1000` takes as long as `x = 20000`. O(1).
3. **Accessing an element by index (in an array) or by key (in an object) is constant.** `guests[0]` or `party.host`: O(1).
4. **In a loop, the cost is the length of the loop times the cost of whatever happens inside it.** This loop runs n times and does O(1) work each time, so it's n × O(1) = **O(n)**.

Add up the costs: O(1) + O(1) + O(1) + O(n) + O(1). Then apply the two rules you know (drop the constants and the non-dominant terms), and you get **O(n)**. You don't need to memorize these rules; you'll use them so often that they'll stick.

## Loops multiply

```viz
trace-greet-everyone
```

Rule 4 explains nested loops too. The outer loop runs n times, and the work inside it isn't O(1) this time: it's **another loop** of n steps. So the cost is n × n = **O(n²)**. A loop inside a loop inside a loop would be n × n × n = O(n³).

Whenever you see a loop, ask two questions: _how many times does it run?_ and _how much work happens inside, each time?_ Then multiply.

## At least 5, at most 5

How many times a loop runs isn't always obvious. Compare these two functions:

```js-run
function printAtLeast5(n) {
  for (let i = 1; i <= Math.max(5, n); i++) {
    console.log(i)
  }
}

function printAtMost5(n) {
  for (let i = 1; i <= Math.min(5, n); i++) {
    console.log(i)
  }
}

printAtLeast5(3) // still prints 1 to 5
printAtLeast5(8) // prints 1 to 8
printAtMost5(3) // prints 1 to 3
printAtMost5(8) // stops at 5
```

`printAtLeast5` loops up to the bigger of 5 and n. For tiny inputs it always prints 5 numbers, but we only care about what happens as n grows: with n = 10 million, it prints 10 million numbers, and the 5 doesn't matter. So it's **O(n)**.

`printAtMost5` loops up to the smaller of 5 and n. With n = 2 it runs twice, but once n passes 5, it **always** runs 5 times: n = 1,000 or n = a million, still 5. A fixed maximum is a constant, so it's **O(1)**. Here's the same idea with gifts for the first 5 guests:

```viz
trace-give-gifts
```

Practice with these:

| Code shape                               | Big O |
| ---------------------------------------- | ----- |
| A loop from 1 to n, printing each number | O(n)  |
| A loop up to Math.max(n, 10)             | O(n)  |
| A loop up to Math.min(n, 10)             | O(1)  |
| A loop over an array with an `if` inside | O(n)  |
| A loop inside a loop over the same array | O(n²) |
