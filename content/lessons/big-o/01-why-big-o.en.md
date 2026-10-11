---
title: Why Big O?
order: 1
minutes: 5
---

> **Goal:** see why "it works" isn't enough, and what Big O measures.

## Two versions that both work

```viz
trace-is-invited
```

You're at the door of a party with the guest list. `isInvited` checks the names one by one and **stops as soon as it finds the name**. Press **Play**, then try the other names at the top.

## A version that never stops early

```viz
trace-is-invited-all
```

`isInvitedAll` gives the same answers, but it **always reads the whole list**. Pick **find 'Ana'**: Ana is first, and it still checks all 6 guests.

Both versions work. One does less work. How do we say which one is better?

## The label for "how much work"

```viz
big-o-growth-chart
```

With 6 guests, nobody notices the difference. With a million guests, everybody does.

**Big O** is the label we give code to describe **how the work grows as the input grows**. It lets you compare two solutions, and every coding interview asks for it.
