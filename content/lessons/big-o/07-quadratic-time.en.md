---
title: 'O(n²): a loop inside a loop'
order: 7
minutes: 6
---

> **Goal:** recognize O(n²) code and see why it gets slow so quickly.

## Every guest greets every guest

At the party, every guest wants to say hello to every other guest. Each row in this grid is a guest, and each column is a guest they greet:

```viz
nested-grid
```

For each guest (a row), we go through every guest again (the columns). With n guests that's **n rows × n columns = n²** cells. Count them for small parties:

| Guests | Cells |
| ------ | ----- |
| 2      | 4     |
| 3      | 9     |
| 4      | 16    |

## Watch the two loops

In code, a grid like that is a **loop inside a loop**:

```viz
trace-greet-everyone
```

Follow **i** (the outer loop) and **j** (the inner loop). For every value of `i`, `j` goes all the way from 0 to the end of the list. That's why the inner step runs n × n times. (The code skips a guest greeting themselves, but the inner loop still takes that step.)

Pick **4 guests**: 16 inner steps instead of 9. Double the guests and the work grows **4 times**. That's **O(n²)**, read "O of n squared", also called **quadratic time**. A third loop inside the second one would make it n × n × n = **O(n³)**, which grows even faster.

## A warning sign

```viz
big-o-growth-chart
```

On the chart, O(n²) is the curve that shoots up. The numbers explain why: 10 guests need 100 steps, 1,000 guests need **1,000,000** steps, and 100,000 users would need 10 billion. Code like that feels fine when you test it with a few items, then crawls with real data.

Nested loops aren't always avoidable, but they're often a hint that there's a better way. In interviews, the first idea for a problem is very often O(n²), and the follow-up question is: "Can you do it in O(n)?" Later in the course, the problem-solving patterns will show you how.
