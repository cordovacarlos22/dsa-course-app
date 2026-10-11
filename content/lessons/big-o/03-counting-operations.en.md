---
title: Counting operations
order: 3
minutes: 5
---

> **Goal:** count the operations in a function and see how the total grows with n.

## Every line is an operation

```viz
trace-count-short-names
```

Every highlighted line adds 1 to the counter: giving a variable a value, comparing, adding. Play it with **4 guests**, then pick **8** and **16** and compare the totals.

## We don't need the exact count

```viz
linear-boxes
```

Counting every single operation gets you something like "3 or 4 per guest". That exact number doesn't matter. What matters is the **shape**: double the guests and the work doubles. That's what Big O describes.
