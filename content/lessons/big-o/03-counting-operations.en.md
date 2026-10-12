---
title: Counting operations
order: 3
minutes: 7
---

> **Goal:** count the simple operations of a function instead of timing it, and see why the exact count doesn't matter.

## Count the formula

If seconds change from machine to machine, what doesn't? The **number of simple operations** the computer has to do. A simple operation is one small step: an addition, a multiplication, a division, a comparison, giving a variable a value. Five operations are five operations on a fast laptop or an old phone.

Let's count the formula version first:

```viz
trace-sum-formula
```

`n * (n + 1) / 2` has one addition, one multiplication and one division: **3 operations**. The numbers 1 and 2 aren't operations; they're just values. And here's the important part: it doesn't matter if n is 2 or 1,000,000,000. It's always **3 operations**. Pick **n = 1,000,000** in the animation and watch the counter stop at 3.

## Count the loop

Now the loop version. Its `+` isn't one operation anymore, because it sits **inside a loop**:

```viz
trace-sum-loop
```

Let's go line by line:

- `total = total + i` is an addition **and** an assignment, and it runs once per number: n additions and n assignments. If n is 5, that's 5 of each; if n is a billion, a billion of each.
- `i++` is short for `i = i + 1`: another addition and another assignment, again n times.
- `i <= n` is a comparison, checked n times.
- `let total = 0` and `let i = 1` happen only **once**, at the start.

Add it up and you get about **5n + 2** operations. With n = 10, that's 52 operations; with n = 1,000, it's 5,002. Pick **n = 10** in the animation to see it.

| n     | Loop (5n + 2) | Formula |
| ----- | ------------- | ------- |
| 5     | 27            | 3       |
| 10    | 52            | 3       |
| 1,000 | 5,002         | 3       |

You could also count it differently. Is the comparison that finally ends the loop one more operation? Is `i++` one operation or two? People get slightly different totals, and that's fine.

## Fuzzy counting

```viz
linear-boxes
```

Here's the good news: **the exact number doesn't matter**. Whether it's 5n + 2, 3n or 2n, what matters is the **general trend**: as n grows, the number of operations grows **roughly in proportion to n**. Double n and you double the work. That's the big picture, and the big picture is what Big O cares about.

The same thing happens with the guest list. Counting the guests one by one with a loop takes about 5 operations per guest:

```viz
trace-count-guests
```

But JavaScript already knows the length of an array, so `guests.length` gives the same answer in **1 step**, whether there are 4 guests or 4 million. Same answer, completely different growth.

So we won't count every single operation from now on. Big O is a kind of **fuzzy counting**: count roughly, then keep only how the count grows. The next lessons show how.
