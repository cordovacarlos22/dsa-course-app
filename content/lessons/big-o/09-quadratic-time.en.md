---
title: 'O(n²): a loop inside a loop'
order: 9
minutes: 10
---

> **Goal:** recognize O(n²) code and understand why it's considered inefficient.

## Print every seat

Our next notation is **O(n²)**, read "O of n squared". It's what you get when a loop over the input sits **inside** another loop over the same input. Start with the two loops from the last lesson, but instead of putting them one after the other, put one inside the other, and print both `i` and `j`.

The key is how a **nested loop** runs. The outer loop takes one step, and then the inner loop runs **all the way through**, from start to finish. Only then does the outer loop take its next step, and the inner loop starts over from the beginning. So the inner loop doesn't run n times in total: it runs n times **for each** step of the outer loop. With n steps outside and n steps inside each one, the total is **n × n = n²**.

Watch it with a small n:

```viz
trace-print-seats
```

**What just happened:** with n = 3, `i` started at 0, and the inner loop printed `0 0`, `0 1`, `0 2`. Then `i` moved to 1 and the inner loop started over: `1 0`, `1 1`, `1 2`. Then the same for `i = 2`. Three rows of three: 9 lines, which is 3². Pick n = 4 and you get 16.

Run it with 10:

```js-run
function printSeats(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      console.log(i, j)
    }
  }
}

printSeats(10)
```

Scroll the output: it starts at `0 0` and ends at `9 9`. That's **100 lines**. For each of the 10 values of `i`, the inner loop runs 10 times: **n × n = n²**. That's where O(n²) comes from.

**Common mistake:** adding the two loops instead of multiplying them. Two loops of 10 one after the other print 10 + 10 = 20 lines. Two loops of 10 **one inside the other** print 10 × 10 = 100. Where the second loop sits changes everything.

## The grid

A grid is a good way to picture O(n²). Each **row** is one step of the outer loop, and each row has a **cell** for every step of the inner loop. With n rows and n columns, there are n × n cells, and the code visits every one of them. At our party, picture every guest greeting every other guest: one row per guest, one cell per greeting.

The grid also shows why O(n²) grows so fast. Make the list twice as long and the grid gets twice as many rows **and** twice as many columns, so it has **4 times** as many cells. Ten times the guests means a hundred times the cells.

```viz
nested-grid
```

**What just happened:** each row was a guest, and for every row the inner loop went through every column. 3 guests filled a 3 × 3 grid: 9 cells. Then the list doubled to 6 guests, and the grid became 6 × 6 = 36 cells. Twice the guests, four times the work. (The grey cells were guests meeting themselves, which the code skips, but the loop still visits them.)

You'll also hear this called **quadratic time**, and in general **polynomial time**: each nested loop over the input adds another power of n. Three loops nested inside each other run n × n × n times, which is **O(n³)**.

And a nested loop is still O(n²) even when the inner loop is shorter. If the inner loop only goes up to `i` (`for (let j = 0; j <= i; j++)`), it runs 1 + 2 + … + n times in total. That's n(n + 1) / 2, the formula from lesson 2: about n² / 2. Drop the constant, and it's still **O(n²)**. Before you run them, predict both counts for n = 10:

```js-run
function countTriples(n) {
  let count = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        count = count + 1
      }
    }
  }
  return count
}

function countTriangle(n) {
  let count = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      count = count + 1
    }
  }
  return count
}

console.log(countTriples(10)) // n × n × n: O(n³)
console.log(countTriangle(10)) // about n² / 2: still O(n²)
```

**Common mistake:** deciding that a shorter inner loop makes the code O(n). The inner loop gets longer as `i` grows, so the total is still about half of n², and half of a curve that bends upward still bends upward.

## Why it's inefficient

Now we can compare two pieces of code with Big O for real. If two functions do the same job, and one is O(n²) while the other is O(n), the **O(n) code is better**: it completes the task with far fewer operations, and the gap grows with every extra item.

| n     | O(n)  | O(n²)     |
| ----- | ----- | --------- |
| 10    | 10    | 100       |
| 100   | 100   | 10,000    |
| 1,000 | 1,000 | 1,000,000 |

O(n²) is generally considered **inefficient**. It often feels fine when you test it with a few items, then crawls with real data. If you can rewrite your code so it's O(n), it will be much more efficient. That's a very common interview question: the first idea for a problem is O(n²), and the interviewer asks, "Can you do better?"

Put O(n²) on the graph next to O(n) and the difference jumps out:

```viz
big-o-growth-chart
```

**What just happened:** O(n) climbed as a straight line, and O(n²) curved up and left it far behind. By n = 1,000, O(n²) had reached a million operations while O(n) was still at a thousand.

See it in real numbers. Each time n doubles, watch what happens to the seats:

```js-run
function countSeats(n) {
  let seats = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      seats = seats + 1
    }
  }
  return seats
}

const sizes = [1000, 2000, 4000]
for (let k = 0; k < sizes.length; k++) {
  console.log('n =', sizes[k], '| seats:', countSeats(sizes[k]))
}
```

1 million, then 4 million, then 16 million: every time the input doubles, the work quadruples. Later in the course you'll learn patterns that turn many O(n²) solutions into O(n), and sorting algorithms like bubble sort that are O(n²).

**Under the hood:** most O(n²) code is comparing **pairs**: for each item, it looks at every other item. Questions like "do two guests have the same name?" or "which two numbers add up to 10?" are about pairs, and a list of n items has about n² / 2 of them, so the obvious solution checks them all. The faster O(n) solutions you'll learn don't get lucky and skip pairs. They **remember** what they've already seen, usually in an object, so a single look can answer "have I seen this one before?" without a second loop. You'll see exactly that trick in the space complexity lesson: trading space for time.

**Common mistake:** testing O(n²) code with five items and deciding it's fast. With 5 items it does 25 steps, which feels instant. With 100,000 items it does 10 billion. Always ask what happens when the input is big.
