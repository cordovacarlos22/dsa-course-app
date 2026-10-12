---
title: 'O(n²): a loop inside a loop'
order: 9
minutes: 7
---

> **Goal:** recognize O(n²) code and understand why it's considered inefficient.

## Print every pair

Our next notation is **O(n²)**, read "O of n squared". Start with the two loops from the last lesson, but instead of putting them one after the other, put one **inside** the other, and print both `i` and `j`:

```viz
trace-print-pairs
```

Run it with 10:

```js-run
function printPairs(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      console.log(i, j)
    }
  }
}

printPairs(10)
```

Scroll the output: it starts at `0 0` and ends at `9 9`. That's **100 lines**. For each of the 10 values of `i`, the inner loop runs 10 times: **n × n = n²**. That's where O(n²) comes from.

## The grid

```viz
nested-grid
```

A grid is a good way to picture it. Each row is one step of the outer loop, and each row has a cell for every step of the inner loop. With n rows and n columns, there are n² cells. That's why doubling the input makes **4 times** the work: 3 guests make 9 cells, 6 guests make 36.

You'll also hear this called **quadratic time**, and in general **polynomial time**: each nested loop over the input adds another power of n. Three loops nested inside each other run n × n × n times:

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

console.log(countTriples(10)) // 1000: n × n × n = O(n³)
```

Careful: a nested loop is still O(n²) even when the inner loop is shorter. If the inner loop only goes up to `i` (`for (let j = 0; j <= i; j++)`), it runs 1 + 2 + … + n times in total, which is about n² / 2. Drop the constant: still **O(n²)**.

## Why it's inefficient

```viz
big-o-growth-chart
```

Put O(n²) on the graph next to O(n) and the difference jumps out: O(n) is a straight line, O(n²) curves up and leaves it far behind.

| n     | O(n)  | O(n²)     |
| ----- | ----- | --------- |
| 10    | 10    | 100       |
| 100   | 100   | 10,000    |
| 1,000 | 1,000 | 1,000,000 |

So if you have two pieces of code that do the same job, and one is O(n²) while the other is O(n), the **O(n) code is better**: it completes the task with far fewer operations. This is our first real chance to compare two pieces of code with Big O.

O(n²) is generally considered **inefficient**. It often feels fine when you test it with a few items, then crawls with real data. If you can rewrite your code so it's O(n), it will be much more efficient. That's a very common interview question: the first idea for a problem is O(n²), and the interviewer asks, "Can you do better?" Later in the course you'll learn patterns that turn many O(n²) solutions into O(n), and sorting algorithms like bubble sort that are O(n²).
