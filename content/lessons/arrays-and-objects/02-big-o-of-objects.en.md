---
title: Big O of objects
order: 2
minutes: 11
---

> **Goal:** know why adding, reading, changing and removing a key are all O(1), and why searching for a value is O(n).

## Objects: labels instead of positions

An **object** stores its data as **key–value pairs**. The **key** is a label, like `'Dev'`. The **value** is whatever that label points to, like `'yes'`. One key together with its value is called a **property**. Keys are strings (JavaScript turns other keys, like numbers, into strings), and values can be anything: strings, numbers, booleans, arrays, even other objects.

The big difference from an array is that an object is **unordered**. There's no index, no first property and no last one. You don't ask an object "what's in position 2?"; you ask "what's under the key `'Dev'`?". You may notice that JavaScript usually prints the keys in the order you added them, but that's just how they're displayed. Nothing you can do with an object depends on a key's position.

So when should you use an object? When the order of the data **doesn't matter**, and when you want reading, adding and deleting entries to stay **quick** however big the object gets. A guest list where you look people up by name, the settings of an app, or a count of how many times each word appears in a text are all great fits.

```viz
object-access
```

**What just happened:** `rsvps['Dev']` went straight to Dev's card, without looking at Ana, Ben or Cleo first. Reading Eli, the key that was added last, cost exactly the same. Even with a million guests, reading one key is a single step. Reading a key is **O(1)**, constant time: the best Big O there is, and the same as reading an array by its index.

There are two ways to write a lookup, and they do the same thing:

```js-run
const rsvps = { Ana: 'yes', Ben: 'no', Cleo: 'maybe', Dev: 'yes', Eli: 'no' }

console.log(rsvps.Dev) // dot notation
console.log(rsvps['Dev']) // bracket notation: same lookup

// Brackets let you use a key stored in a variable
const guest = 'Cleo'
console.log(rsvps[guest])

// A key that isn't there gives undefined (still one step)
console.log(rsvps['Zoe'])
console.log(rsvps[0]) // no positions, so no "first" property
```

Use the **dot** when you know the key while writing the code. Use **brackets** when the key is in a variable, or has characters a dot can't handle, like a space.

**Common mistake:** writing `rsvps[0]` to get the "first" answer. An object has no positions, so JavaScript looks for a key called `'0'`, finds nothing and returns `undefined`.

## Adding, changing and removing: O(1)

How can an object find any key in one step, with no index? The full answer comes in the **hash tables** module, where you'll build this yourself. Here's the idea for now. A computer's memory is a long row of numbered slots, and it can't directly look for a slot "called Dev". So JavaScript runs the key through a small, fast function called a **hash function**, which turns `'Dev'` into a slot number. Same key, same number, every time. Think of a coat check: you hand over your coat and get a ticket with a number, and later the ticket takes you straight to your coat without searching the whole rack.

The same trick works for every basic operation:

- **Insert:** turn the new key into a slot and store the value there.
- **Access:** turn the key into its slot and read it.
- **Update:** that's just access plus writing a new value.
- **Remove:** turn the key into its slot and clear it.

And because an object has no order, **where** you add a key doesn't matter. There's no beginning, middle or end, so there's nothing to re-index and no cascade.

```viz
object-insert-remove
```

**What just happened:** adding Fay, changing Ben's answer and deleting Cleo each touched **one card**. No other card moved or changed. Compare that with `unshift` and `shift` on an array, which had to re-index every item. Inserting, updating and removing a key are all **O(1)**.

Try it:

```js-run
const rsvps = { Ana: 'yes', Ben: 'no', Cleo: 'maybe' }

rsvps.Fay = 'yes' // insert: a new key
rsvps.Ben = 'yes' // update: same syntax, the key already exists
delete rsvps.Cleo // remove

console.log(rsvps)
```

Notice that inserting and updating use the same syntax. If the key doesn't exist yet, it's created; if it does, its value is replaced.

One honest footnote: O(1) here describes how objects behave in practice, on average. In the hash tables module you'll see the rare cases where two keys land on the same slot, and how hash tables deal with them. For everyday code, treat these operations as constant time.

**Common mistake:** thinking `delete` works like `shift`. Removing a key never moves the other keys, because they don't have positions to move.

## Searching for a value: O(n)

Here's the one operation that isn't fast. **Searching** doesn't mean looking up a key: we've seen that's O(1). It means checking whether some **value** is stored anywhere in the object. Did anyone answer `'maybe'`? Is anyone's answer `'late'`?

The hash function only works in one direction: it turns a key into a slot. Nothing turns a value into a slot. So to find a value, the only way is to go through the properties one by one and check each value, just like searching an unsorted array.

```viz
trace-has-answer
```

**What just happened:** `hasAnswer` got the list of names with `Object.keys` (you'll study it in the next lesson), then read each guest's answer until it found a match. Looking for `'maybe'` stopped at Cleo, the third guest. Looking for `'late'` had to check every guest before it could return `false`. As the number of properties grows, the worst case grows with it: searching for a value is **O(n)**.

```js-run
function hasAnswer(rsvps, answer) {
  const guestNames = Object.keys(rsvps)
  for (let i = 0; i < guestNames.length; i++) {
    if (rsvps[guestNames[i]] === answer) return true
  }
  return false
}

const rsvps = { Ana: 'yes', Ben: 'no', Cleo: 'maybe', Dev: 'yes', Eli: 'no' }
console.log(hasAnswer(rsvps, 'maybe')) // true, after 3 checks
console.log(hasAnswer(rsvps, 'late')) // false, after checking all 5
```

In practice, you rarely need to search an object by value. If you find yourself doing it over and over, that's a sign the data should be stored differently, with the thing you search for as the **key**. You'll use exactly that trick in the problem-solving patterns module.

Here's the Big O of objects in one table:

| Operation                | Big O |
| ------------------------ | ----- |
| Insert a key             | O(1)  |
| Remove a key             | O(1)  |
| Access (or update) a key | O(1)  |
| Search for a value       | O(n)  |

When you don't need any order, objects are an excellent choice: they're fast at almost everything. The price is that they have no order at all. Arrays, as you'll see again at the end of this module, are the opposite: their order is useful, but it can slow some operations down.

**Common mistake:** mixing up "search" with "access". `rsvps['Dev']` is access, O(1). "Who answered maybe?" is search, O(n).
