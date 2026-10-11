---
title: Different inputs, different letters
order: 11
minutes: 4
---

> **Goal:** write O(a + b) and O(a · b) for code with two inputs. A classic interview trap!

## Guests and helpers

```viz
two-inputs
```

The party has **guests** and **helpers**: two lists that can be very different sizes. Use one letter per input: **a** guests and **b** helpers.

| Code shape                                  | Big O    |
| ------------------------------------------- | -------- |
| Loop over guests, then loop over helpers    | O(a + b) |
| Loop over helpers inside a loop over guests | O(a · b) |

## Don't call them both n

```viz
trace-welcome-and-goodbye
```

Here both loops go over the **same** list, so n + n = 2n = O(n). But if the second loop went over the helpers, you couldn't call both sizes n: there could be 4 guests and 1,000 helpers. That's why it's O(a + b), and it can't be simplified further.
