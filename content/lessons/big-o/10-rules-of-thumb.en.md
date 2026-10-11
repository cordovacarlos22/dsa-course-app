---
title: Rules of thumb
order: 10
minutes: 5
---

> **Goal:** find the Big O of a function by giving each line a cost.

## The cost of each line

```viz
trace-party-summary
```

Step through it and watch the badges appear:

- Reading by index (`guests[0]`) or by key: **O(1)**.
- Math on numbers (`guests.length + 2`): **O(1)**.
- Giving a variable a value (`let x = 0`): **O(1)**.
- A loop: **(how many times it runs) × (the work inside)**.

Add up the costs, then use the two rules to simplify.

## Loops multiply

```viz
trace-greet-everyone
```

The outer loop runs n times. The work inside it is **another loop** of n steps. So the cost is n × n = **O(n²)**. If the work inside were O(1), it would be n × 1 = **O(n)**.
