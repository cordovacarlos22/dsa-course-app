---
title: Space complexity
order: 14
minutes: 14
---

> **Goal:** measure how much extra memory code needs, with the same Big O notation.

## How much memory grows?

So far we've worried about **time**: how much longer an algorithm takes when its input gets bigger. That's **time complexity**. Now let's look at **space complexity**: how much **memory** an algorithm takes up as its input grows. We use the same Big O notation and the same rules (drop the constants, drop the non-dominant terms); we're just measuring something else.

Every value your code creates lives somewhere in the computer's memory: each variable, each new array, each new string. Space complexity asks how the amount of **new** memory grows with the input. A function that keeps a single counter needs the same memory for 10 guests or 10 million. A function that makes a new name tag for every guest needs more memory the longer the list gets.

There's one thing to get out of the way first. As n grows, the input itself obviously grows too: a list of a million guests takes more memory than a list of 10. We **ignore** that part. What we measure is the space the algorithm **needs on its own**, besides the input. If you read about this online, you may see it called **auxiliary space complexity**. In this course, unless we say otherwise, "space complexity" means auxiliary space complexity: what happens **inside** the algorithm.

```viz
memory-boxes
```

**What just happened:** counting the guests needed one box of memory, the counter, whether there were 3 guests or 6: **O(1) space**. Making a name tag for every guest needed a new box per guest, so 6 guests meant 6 boxes: **O(n) space**. The guest list itself was the same in both cases, and it didn't count.

Here's a function that reads every guest but only keeps one extra name:

```js-run
function longestName(guests) {
  let longest = guests[0] // one extra value...
  for (let i = 1; i < guests.length; i++) {
    // ...and the loop variable i
    if (guests[i].length > longest.length) {
      longest = guests[i]
    }
  }
  return longest
}

console.log(longestName(['Ana', 'Ben', 'Cleo', 'Dev']))
```

It looks at all n guests, so it's O(n) **time**. But it only ever keeps `longest` and `i`, however long the list is, so it's O(1) **space**.

**Common mistake:** counting the input as the function's space. Every function that takes an array of n items "has" n items in memory, but that memory was there before the function ran. Only count what the function creates.

## Rules of thumb for space

Just like with time, a few rules of thumb cover most code. They depend on what kind of value the code creates:

- **Most primitives take constant space.** Booleans, numbers, `undefined` and `null` take the same amount of memory whatever their value: the number 1 and the number 1,000 cost the same, and so do `true` and `false`. O(1).
- **Strings take O(n) space**, where n is the length of the string. A 50-character string takes about 50 times the space of a 1-character string.
- **Reference types (arrays and objects) are generally O(n)**, where n counts the items in the array or the keys in the object. An array of 4 items takes twice the space of an array of 2.

So to find a function's space complexity, look at what it **creates**: a few numbers and booleans are O(1), and an array, object or string that grows with the input is O(n).

```viz
trace-count-guests
```

**What just happened:** `countGuests` went through every guest, but the only values it kept were two numbers, `count` and `i`. They changed on every turn, but changing a number doesn't take new memory: the space was already there. Whether there are 4 guests or 4 million, it's still two numbers: **O(1) space**.

A string, on the other hand, grows as you add to it. Each turn of this loop makes the string longer, so its memory grows with the number of turns:

```js-run
let line = ''
for (let i = 0; i < 5; i++) {
  line = line + 'Ana '
}
console.log(line)
console.log('Length:', line.length) // 20 characters: 4 per turn, so O(n) space
```

**Common mistake:** thinking a bigger number takes more space. `let guestCount = 5` and `let guestCount = 5000000` take the same memory. A number is one box, whatever is written in it. It's strings, arrays and objects that grow.

## Totaling vs doubling the orders

Let's analyze two functions. Both loop over an array of snack orders (how many snacks each guest asked for), so both are O(n) **time**. But their space is very different, because one creates a single number and the other creates a whole new array.

**`totalOrders`** creates one number, `runningSum`, and the loop variable `i`. We keep adding into `runningSum`, but that takes time, not new space: the space is already there. Whether the array has 10 items or a million, the function only ever has those two numbers. That's **O(1) space**.

**`doubleOrders`** creates a **new array** and pushes one item into it for every order in the input. Watch it grow:

```viz
trace-double-orders
```

**What just happened:** `doubled` started as an empty array. For every order in the input, one more box appeared in it: 3 orders in, 3 new items stored; 6 orders in, 6 new items. With 50 orders, it would be 50. The space grows in direct proportion to n, so it's **O(n) space**. (It's really n plus a couple of variables, but we simplify to O(n).)

Run both:

```js-run
function totalOrders(orders) {
  let runningSum = 0
  for (let i = 0; i < orders.length; i++) {
    runningSum = runningSum + orders[i]
  }
  return runningSum
}

function doubleOrders(orders) {
  const doubled = []
  for (let i = 0; i < orders.length; i++) {
    doubled.push(orders[i] * 2)
  }
  return doubled
}

console.log(totalOrders([1, 2, 3])) // 6
console.log(doubleOrders([1, 2, 3])) // [2, 4, 6]
```

A function can be great at one and terrible at the other: think of a function that's O(n²) **time** but only uses a few variables, so it's O(1) **space**. When you analyze code, answer both questions: _"This is O(n) time and O(1) space."_

Try these:

- A loop from 1 to n that only prints `i`: **O(1) space** (just `i`).
- A function that copies every item at an even index into a new array: about n / 2 items, so **O(n) space**.
- A function that fills a new array with a running total for every item: n items, so **O(n) space**, even if it uses nested loops to compute them.

You don't need to master space complexity before moving on. The goal is that when we say "this one has great space complexity but terrible time complexity", you know what that means.

**Common mistake:** assuming time and space always match. Both functions above take O(n) time, but one is O(1) space and the other O(n). And a slow O(n²) function can still use almost no memory. Always give both answers separately.

## Trading space for time

Time and space often pull in opposite directions. Sometimes you can make code **faster** by letting it use **more memory**: you remember what you've already seen, so you never have to look for it again. That's called **trading space for time**, and it's one of the most useful ideas in this whole course.

Here's a classic job: _does the guest list have the same name twice?_ The first idea compares every name with every name after it, using two nested loops. It only keeps `i` and `j`, so it's **O(1) space**, but it's **O(n²) time**. The second idea walks the list **once** and writes every name it sees into an object, like a guest book. Before writing a name down, it checks whether the name is already in the book, and checking an object's key is a single jump, O(1). One pass makes it **O(n) time**, but the book can hold up to n names: **O(n) space**.

```js-run
function hasDuplicateSlow(guests) {
  for (let i = 0; i < guests.length; i++) {
    for (let j = i + 1; j < guests.length; j++) {
      if (guests[i] === guests[j]) {
        return true
      }
    }
  }
  return false
}

function hasDuplicateFast(guests) {
  const seen = {}
  for (let i = 0; i < guests.length; i++) {
    if (seen[guests[i]] === true) {
      return true
    }
    seen[guests[i]] = true
  }
  return false
}

const guests = ['Ana', 'Ben', 'Cleo', 'Ben']
console.log(hasDuplicateSlow(guests), hasDuplicateFast(guests)) // true true
```

Both give the same answers. With 10 names, nobody would notice a difference. With 100,000, the slow version makes up to about 5 billion comparisons, while the fast one takes 100,000 steps and keeps a book of up to 100,000 names. Usually that's a great deal: memory is cheap, and waiting isn't. But when memory is tight, the slow version's O(1) space can be the right choice. That's exactly what an interviewer means by _"What if we care more about memory?"_

**Common mistake:** thinking the faster version is always better. It's faster for big lists, but it pays with memory. Which one wins depends on what you're shorter on, time or memory, and interviews often ask about both sides.
