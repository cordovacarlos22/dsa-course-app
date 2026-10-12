---
title: Rules of thumb
order: 10
minutes: 6
---

> **Goal:** find the Big O of a whole function by giving each line a cost.

## The cost of each line

You don't need to count every single operation to find the Big O of a function. A few rules of thumb get you there faster. Step through this function and watch a cost badge appear next to each line:

```viz
trace-party-summary
```

- **Math is O(1).** `guests.length + 2` takes the same time whether the numbers are small or huge.
- **Giving a variable a value is O(1).** `let longNames = 0`.
- **Reading by index or by key is O(1).** `guests[0]`, `party.host`.
- **A loop costs (how many times it runs) × (the work inside).** This loop runs n times and the work inside is O(1), so the loop is n × O(1) = **O(n)**.

Add up the costs: O(1) + O(1) + O(1) + O(n) + O(1). Then use the two rules you know: drop the constants and the non-dominant terms. What's left is **O(n)**.

## Loops multiply

```viz
trace-greet-everyone
```

The same rule explains nested loops. The outer loop runs n times. The work inside it isn't O(1) this time: it's **another loop** of n steps. So the cost is n × n = **O(n²)**. A loop inside a loop inside a loop would be n × n × n = O(n³).

Whenever you see a loop, ask two questions: _how many times does it run?_ and _how much work happens inside, each time?_ Then multiply.

## A loop with a limit

Not every loop grows with the input. Here, only the first 5 guests get a gift:

```viz
trace-give-gifts
```

Pick **20 guests**: still 5 gifts. The loop stops at whichever comes first, the end of the list or 5. It **never runs more than 5 times**, however long the list gets. A fixed maximum is a constant, so this loop is **O(1)**.

Now flip it around: print a name card for every guest, and always print at least 5 cards (blank ones if there are fewer guests). That loop runs 5 times for a small party but n times for a big one, so it grows with n: **O(n)**. When you see a limit, ask: _does the loop stop at a fixed number, or does it keep growing with n?_

Practice simplifying:

| You counted     | Big O |
| --------------- | ----- |
| n + 3 + 4       | O(n)  |
| at most 5 steps | O(1)  |
| n × n + 10      | O(n²) |
| 3n              | O(n)  |
