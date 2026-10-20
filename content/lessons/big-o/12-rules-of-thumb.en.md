---
title: Rules of thumb
order: 12
minutes: 11
---

> **Goal:** find the Big O of a whole function quickly, by giving each line a cost.

## The cost of each line

Analyzing code can get complicated if you nitpick every detail. You don't need to count every operation, as we did in lesson 3. Instead, you can give each line a **cost** in Big O, add the costs up, and simplify with the two rules you know. These **rules of thumb** don't always work, but they're a great starting point:

1. **Arithmetic is constant.** Adding, subtracting, multiplying or dividing takes about the same time whatever the numbers are: 2 + 2 and 1,000,000 + 2 cost the same. O(1).
2. **Variable assignment is constant.** `x = 1000` takes as long as `x = 20000`. O(1).
3. **Accessing an element by index (in an array) or by key (in an object) is constant.** `guests[0]` or `party.host`: O(1).
4. **A loop costs how many times it runs, multiplied by the cost of one trip through its body.** A loop that runs n times and does O(1) work each time costs n × O(1) = **O(n)**.

Rules 1 to 3 cover single lines. Rule 4 is the important one, because loops are where the cost of most code comes from. Step through this function and watch a cost badge appear next to each line:

```viz
trace-party-summary
```

**What just happened:** `guests[0]` got O(1) (reading by index), `guests.length + 2` got O(1) (math), and `let longNames = 0` got O(1) (an assignment). Inside the loop, the check and the addition were O(1) each time, but the loop ran n times, so the loop as a whole cost n × O(1) = O(n). The return was O(1) too.

Add up the costs: O(1) + O(1) + O(1) + O(n) + O(1). Then apply the two rules you know (drop the constants and the non-dominant terms), and you get **O(n)**. You don't need to memorize these rules; you'll use them so often that they'll stick.

Here's the same function. The comment on each line is its cost:

```js-run
function partySummary(guests) {
  const first = guests[0] // O(1): reading by index
  const chairs = guests.length + 2 // O(1): math
  let longNames = 0 // O(1): assignment
  for (let i = 0; i < guests.length; i++) {
    // the loop runs n times...
    if (guests[i].length > 3) {
      longNames = longNames + 1 // ...and does O(1) work each time: O(n)
    }
  }
  return [first, chairs, longNames] // O(1)
}

console.log(partySummary(['Ana', 'Ben', 'Cleo', 'Dev', 'Eli']))
```

**Common mistake:** adding up the O(1) lines as if they mattered: "four O(1) lines and one O(n), so O(n + 4)". Drop the constants and the non-dominant terms, and it's just **O(n)**. The loop decides the cost.

## Loops multiply

Rule 4 explains nested loops too. It says a loop's cost is **how many times it runs** times **the work inside**. When the work inside is O(1), the loop is O(n). But when the work inside is **another loop** of n steps, the cost is n × O(n) = n × n = **O(n²)**. A loop inside a loop inside a loop would be n × n × n = O(n³).

The same rule works when the inside is a hidden loop. A loop over the guests with `guests.includes(name)` inside it is also n × O(n) = O(n²), even though there's only one `for` on the screen.

```viz
trace-greet-everyone
```

**What just happened:** for each guest `i`, the inner loop went through every guest `j`. When `i` and `j` were the same guest, there was no greeting, but the inner loop still took a step. With n guests, that's n × n inner steps: **O(n²)**.

Whenever you see a loop, ask two questions: _how many times does it run?_ and _how much work happens inside, each time?_ Then multiply. Here are both shapes, with a counter in each:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']

// A loop with O(1) inside: n × 1
let welcomes = 0
for (let i = 0; i < guests.length; i++) {
  welcomes = welcomes + 1
}

// A loop with another loop inside: n × n
let steps = 0
for (let i = 0; i < guests.length; i++) {
  for (let j = 0; j < guests.length; j++) {
    steps = steps + 1
  }
}

console.log('One loop:', welcomes, 'steps') // 4
console.log('Nested loops:', steps, 'steps') // 16
```

**Common mistake:** missing a hidden loop inside a loop. `for (let i = 0; i < guests.length; i++) { if (helpers.includes(guests[i])) … }` looks like one loop, but `includes` loops too. Count every loop, including the ones a method runs for you.

## At least 5, at most 5

How many times a loop runs isn't always obvious. Rule 4 needs the **length** of the loop, and sometimes that length is capped or padded by a fixed number. Two built-in helpers show up a lot: `Math.max(a, b)` gives the bigger of two numbers, and `Math.min(a, b)` gives the smaller one.

- A loop up to `Math.max(5, n)` runs **at least** 5 times. For tiny inputs it always runs 5 times, but we only care about what happens as n grows: with n = 10 million, it runs 10 million times, and the 5 doesn't matter. So it's **O(n)**.
- A loop up to `Math.min(5, n)` runs **at most** 5 times. With n = 2 it runs twice, but once n passes 5, it **always** runs 5 times: n = 1,000 or n = a million, still 5. A fixed maximum is a constant, so it's **O(1)**.

Compare the two functions:

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

Here's the same idea with gifts for the first 5 guests:

```viz
trace-give-gifts
```

**What just happened:** the loop handed out a gift on each turn, and stopped as soon as `i < 5` was false, even with guests still waiting. With 20 guests, it was still 5 gifts. A loop that can never run more than 5 times is **O(1)**, however long the guest list gets.

Practice with these:

| Code shape                               | Big O |
| ---------------------------------------- | ----- |
| A loop from 1 to n, printing each number | O(n)  |
| A loop up to Math.max(n, 10)             | O(n)  |
| A loop up to Math.min(n, 10)             | O(1)  |
| A loop over an array with an `if` inside | O(n)  |
| A loop inside a loop over the same array | O(n²) |

**Common mistake:** mixing up `Math.max` and `Math.min`. `max` lets the loop grow with n (at least 5), so it's O(n). `min` caps the loop (at most 5), so it's O(1). Ask: "Can this loop get longer when n grows?"
