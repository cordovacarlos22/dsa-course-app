---
title: Different inputs, different variables
order: 9
minutes: 5
---

> **Goal:** write the Big O of code that takes two independent inputs, like O(a + b) and O(a · b). This is a classic interview trap.

## Two lists, two sizes

A school sends a message to every student, then to every mentor:

```js-run
function sendMessages(students, mentors) {
  let messages = 0
  for (const student of students) messages++
  for (const mentor of mentors) messages++
  return messages
}

console.log(sendMessages(['Ana', 'Bo', 'Cai'], ['Dr. Lee']))
```

Two loops, one after the other. The tempting answer: "each loop is O(n), so O(2n), which is O(n)." **That's wrong.**

## Why it's wrong

`n` means "the size of the input", but there are **two** inputs, and they can be completely different sizes. What if there are 3 students and 1 million mentors? Calling both sizes `n` hides that.

Use **one variable per input**: `a` students and `b` mentors. Loops one after the other **add**:

**O(a + b)**

You can't simplify it further: neither term is a constant, and you don't know which one is bigger.

## Nested loops multiply

Now the school pairs every student with every mentor for a short meeting:

```js-run
function scheduleMeetings(students, mentors) {
  let meetings = 0
  for (const student of students) {
    for (const mentor of mentors) {
      meetings++
    }
  }
  return meetings
}

console.log(scheduleMeetings(['Ana', 'Bo', 'Cai'], ['Dr. Lee', 'Ms. Ruiz']))
```

3 students × 2 mentors = 6 meetings. Nested loops over two different inputs **multiply**:

**O(a · b)**

It's only O(n²) if both loops go over the **same** input.

## Recap

| Code shape                           | Big O    |
| ------------------------------------ | -------- |
| Loop over `a`, then loop over `b`    | O(a + b) |
| Loop over `b` inside a loop over `a` | O(a · b) |
| Nested loops over the same array     | O(n²)    |

## Check yourself

1. A function loops over `orders` and then over `customers`. What's its Big O?
2. Why can't you simplify O(a + b) to O(n)?
3. When does O(a · b) become O(n²)?
