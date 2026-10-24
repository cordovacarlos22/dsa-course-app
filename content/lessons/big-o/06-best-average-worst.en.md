---
title: Best, average and worst case
order: 6
minutes: 12
---

> **Goal:** know what Ω, Θ and O describe, and why Big O always means the worst case.

## Where is the item?

When you work with this notation, three Greek letters show up again and again: **omega (Ω)**, **theta (Θ)** and **omicron (O)**. You already know omicron by its everyday name, **O**: the O in Big O. It's the one you'll see most.

Why three? Because the same code can do very different amounts of work depending on its input. Picture an array of numbers, 1 to 7, and a loop that walks through it until it finds the number you want. The code never changes, but **where** the number sits decides how long the walk is:

- Looking for 1 takes the fewest iterations: it's the first item. That's the **best case**: the input that makes the code do the least work.
- Looking for 7 makes the loop go through every item. That's the **worst case**: the input that makes the code do the most work.
- Something around the middle, like 4, is the **average case**: what you can expect most of the time.

Each case has its own letter:

| Case    | Letter    | Also called | In simple terms                                      |
| ------- | --------- | ----------- | ---------------------------------------------------- |
| Best    | Ω (omega) | lower bound | the fastest the code can run, in the best situation  |
| Average | Θ (theta) | tight bound | what you can generally expect                        |
| Worst   | O (big O) | upper bound | the slowest the code can run, in the worst situation |

A **bound** is a limit. The lower bound says "it can't go faster than this"; the upper bound says "it can't go slower than this". Here's the same idea with our guest list:

```viz
search-cases
```

**What just happened:** `isInvited` read the list from the start every time. When the name was first, it was found in 1 check: the best case, Ω. When the name was in the middle, it took about half the list: the average case, Θ. When the name wasn't on the list at all, every guest was checked: the worst case, O.

Now with the numbers 1 to 7. Each call counts how many steps the loop takes:

```js-run
const numbers = [1, 2, 3, 4, 5, 6, 7]

function stepsToFind(target) {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === target) {
      return i + 1
    }
  }
  return numbers.length
}

console.log('Find 1:', stepsToFind(1), 'step') // best case
console.log('Find 4:', stepsToFind(4), 'steps') // average case
console.log('Find 7:', stepsToFind(7), 'steps') // worst case
```

**Common mistake:** thinking "best case" means "the best algorithm". The three cases describe **one** piece of code with different inputs. To compare two algorithms, you compare the same case of each, usually the worst.

## Big O is the worst case

So **Big O is always the worst case**. You'll often hear questions like "Fine, and what's the Big O in the best case?" Technically, there's no such thing: the best case is **omega** and the average case is **theta**. When we measure Big O, we're always measuring the worst case.

Why focus on the worst case? Because it's a **promise**: whatever the input, the code will never be slower than this. A search that's usually quick but sometimes reads a million items **will** read a million items one day, for a real user. Planning for the worst case means no surprises. It's also the easiest case to agree on. The average case depends on which inputs are likely, and that changes from app to app. The worst case only depends on the code.

Watch the worst case happen:

```viz
trace-is-invited
```

**What just happened:** pick **find 'Zoe'**. 'Zoe' isn't on the list, so every guest got checked before the function could return `false`. That's the worst case for `isInvited`, and it's n checks for n guests, so `isInvited` is **O(n)**.

Here are all three cases for `isInvited`, written in this notation:

- **Best case, Ω(1):** the name is the first one on the list. One check, however long the list is.
- **Average case, Θ(n):** on average the name is somewhere in the middle, so about n / 2 checks. Drop the ½ and it grows like n.
- **Worst case, O(n):** the name isn't there, so all n guests are checked.

You can check the average yourself. This looks for every guest on the list, one at a time, and averages the checks:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli', 'Fay']

function checksToFind(name) {
  for (let i = 0; i < guests.length; i++) {
    if (guests[i] === name) {
      return i + 1
    }
  }
  return guests.length
}

let totalChecks = 0
for (let i = 0; i < guests.length; i++) {
  totalChecks = totalChecks + checksToFind(guests[i])
}
console.log('Best case:', checksToFind('Ana'), 'check')
console.log('Average for a name on the list:', totalChecks / guests.length, 'checks') // about n / 2
console.log('Worst case:', checksToFind('Zoe'), 'checks')
```

With 6 guests, the average is 3.5 checks: about half the list. Double the guests and the average doubles too, which is why the average case is still Θ(n).

That doesn't mean the other cases are useless. When you analyze code, think about all three: the best case, what usually happens, and the worst case. But when someone asks for "the Big O", give them the worst case.

**Under the hood:** built-in methods have best and worst cases too. JavaScript's own rules for `includes` and `indexOf` describe a loop: start at index 0, compare each item with the value you're looking for, and stop at the first match. So `guests.includes('Ana')` is Ω(1) when Ana is first on the list, and O(n) when the name isn't there at all, exactly like `isInvited`. Whenever you call a method on a list, ask it the same two questions you'd ask your own loop: can it stop early, and what's the worst input?

**Common mistake:** answering "O(1)" because the name you tried was first on the list. That's the best case, Ω(1). The Big O of `isInvited` is O(n), because some inputs make it read every name.

## When all three cases match

`isInvited` has a lucky input because it can stop early: when the name comes first, it's done. But some code has no lucky input. To count the short names on the guest list, a loop has to look at **every** name, because a short name could be anywhere, even last. So it never stops early, and every list of n guests costs about the same: n checks.

When the best case and the worst case grow the same way, there's nothing left between them: the lower bound (Ω) and the upper bound (O) squeeze together into one exact description. That's what **Θ** is for, and why it's called a **tight bound**. `countShortNames` is **Θ(n)**: its best case, average case and worst case are all n checks. You'll often see Θ used this way in books: not just for the average case, but whenever the best and worst cases grow alike.

```viz
trace-count-short-names
```

**What just happened:** the loop visited every name on the list, short or not. A short name cost one extra operation (adding 1 to `count`), but no name let the loop stop early. With 4 names, then 8, then 16, the total grew with the list every time: there's no lucky list that finishes sooner.

Before you run this, predict: which list makes `countShortNames` check fewer names, the one where every name is short, or the one with no short names at all?

```js-run
function countShortNames(guests) {
  let count = 0
  let checks = 0
  for (let i = 0; i < guests.length; i++) {
    checks++
    if (guests[i].length <= 3) {
      count = count + 1
    }
  }
  return 'short names: ' + count + ', checks: ' + checks
}

console.log(countShortNames(['Ana', 'Ben', 'Dev', 'Eli', 'Fay', 'Gus'])) // every name is short
console.log(countShortNames(['Cleo', 'Hana', 'Ivan', 'Jade', 'Lola', 'Omar'])) // no short names
```

Neither: both lists cost 6 checks. The names changed how many short ones there were, but not how much work the loop did. That's what a Θ(n) loop looks like.

**Common mistake:** thinking every loop has an Ω(1) best case. A loop only has a lucky input if it can stop early, with a `return` or a `break` inside. If it always runs to the end, its best case is as slow as its worst.
