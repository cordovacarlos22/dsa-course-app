---
title: Big O of object methods
order: 3
minutes: 10
---

> **Goal:** know the Big O of `Object.keys`, `Object.values`, `Object.entries` and `hasOwnProperty`, and spot a hidden loop before it slows your code down.

## Object.keys, values and entries: O(n)

Objects come with a few built-in methods that you'll use all the time. Three of them turn an object into an array:

- **`Object.keys(obj)`** returns an array with every **key**.
- **`Object.values(obj)`** returns an array with every **value**.
- **`Object.entries(obj)`** returns an array of **pairs**, each one a small array `[key, value]`.

They're handy because arrays have things objects don't: a `length`, indexes and an order you can loop over with `for (let i = 0; …)`. But think about what each method has to do. To build an array with every key, it must **visit every property** of the object once and copy it into a new array. Nothing about hashing helps here, because the job itself is "every property". An object with 10 properties means about 10 steps; one with 10,000 means about 10,000.

```viz
object-to-array
```

**What just happened:** `Object.keys` started with an empty array and visited the keys one by one, copying each into the new array: 5 keys, 5 steps. `Object.values` took the same walk but copied the answers, and `Object.entries` copied both as pairs. Entries does a bit more work per key, since it builds a little pair each time, so it might be 2n or 3n steps instead of n. Remember the rule from the Big O module: **drop the constants**. All three are **O(n) time**.

They also cost memory. Each one returns a **new array** with one item per property, so the extra space grows with n too: **O(n) space**. That's the space complexity you learned about in the Big O module.

```js-run
const rsvps = { Ana: 'yes', Ben: 'no', Cleo: 'maybe', Dev: 'yes', Eli: 'no' }

console.log(Object.keys(rsvps))
console.log(Object.values(rsvps))
console.log(Object.entries(rsvps))

// Now we can loop over the object like an array
const pairs = Object.entries(rsvps)
for (let i = 0; i < pairs.length; i++) {
  console.log(pairs[i][0] + ' said ' + pairs[i][1])
}
```

**Common mistake:** using `Object.keys(rsvps).length` as if it were as cheap as an array's `length`. An array keeps its length ready, so reading it is O(1). An object has no `length`, so `Object.keys(rsvps).length` first builds the whole array of keys: O(n). It's fine to use; just don't assume it's free.

## hasOwnProperty: O(1)

Often you don't need every key. You just want to know if **one** key is there: has Dev answered yet? Is Zoe on the list? That's what **`hasOwnProperty`** does. You give it a key, and it answers `true` or `false`.

Think about why it's fast. You already know that an object can find a key's value in O(1): the hash function turns the key into a slot, and the object looks in that slot. Checking whether a key **exists** is the same trip: go to the slot and see if anything's there. So `hasOwnProperty` is **O(1)**.

```viz
object-has-key
```

**What just happened:** `hasOwnProperty('Dev')` went straight to where Dev's key would be and found it: `true`. `hasOwnProperty('Zoe')` went straight to where Zoe's key would be, found nothing and answered `false`, still in one step. But the last question, whether anyone answered `'late'`, was about a **value**, and values have no shortcut: every card had to be read.

There are a few ways to ask "is this key here?", and they're not all the same:

```js-run
const rsvps = { Ana: 'yes', Ben: 'no', Cleo: 'maybe' }

console.log(rsvps.hasOwnProperty('Ana')) // true
console.log(rsvps.hasOwnProperty('Zoe')) // false

// The "in" operator also checks keys...
console.log('Ana' in rsvps) // true
// ...but it also counts the methods every object inherits
console.log('toString' in rsvps) // true!
console.log(rsvps.hasOwnProperty('toString')) // false

// Newer JavaScript has the same check as a function
console.log(Object.hasOwn(rsvps, 'Ben')) // true
```

Every object inherits some built-in methods, like `toString`, from JavaScript itself. The **`in`** operator counts those too, while `hasOwnProperty` only counts the keys the object **owns**, the ones you put there. `Object.hasOwn(obj, key)` is a newer way to write `hasOwnProperty`. All of them are O(1).

**Common mistake:** checking `rsvps[name] !== undefined` to see if a key exists. It works most of the time, but a key can exist with the value `undefined`. `hasOwnProperty` answers the real question.

## Hidden loops

Here's the most useful lesson in this module: **the cost of a line is the cost of everything that runs inside it**. `Object.keys(rsvps)` looks like one small step, but you now know it's a loop over every property. That's fine when you call it once. It becomes a problem when you call it **inside another loop**.

Look at this function. For every guest, it counts how many guests there are in total:

```js
function shareOfGuests(rsvps) {
  const names = Object.keys(rsvps) // O(n), once
  for (let i = 0; i < names.length; i++) {
    // Object.keys runs again on EVERY pass: O(n) each time
    const total = Object.keys(rsvps).length
    console.log(names[i] + ' is 1 of ' + total)
  }
}
```

The outer loop runs n times, and on every pass `Object.keys` visits all n keys again. That's n × n steps: **O(n²)**, a loop inside a loop, even though you only typed one `for`.

```viz
nested-grid
```

**What just happened:** this is the picture of any loop inside a loop. Each row is one pass of the outer loop, and on each row the inner loop runs across all n guests. In `shareOfGuests`, that inner loop is the one hidden inside `Object.keys`. Double the guests and the work grows four times.

The fix is simple: do the expensive work **once**, before the loop, and save the result in a variable.

```js-run
function shareOfGuests(rsvps) {
  const names = Object.keys(rsvps) // O(n), once
  const total = names.length // O(1): names is an array
  for (let i = 0; i < names.length; i++) {
    console.log(names[i] + ' is 1 of ' + total)
  }
}

shareOfGuests({ Ana: 'yes', Ben: 'no', Cleo: 'maybe' })
```

Now it's O(n) + O(n), which is **O(n)**. Same output, far less work as the party grows.

Here are the object methods in one table:

| Method                    | Time | Extra space |
| ------------------------- | ---- | ----------- |
| `Object.keys(obj)`        | O(n) | O(n)        |
| `Object.values(obj)`      | O(n) | O(n)        |
| `Object.entries(obj)`     | O(n) | O(n)        |
| `obj.hasOwnProperty(key)` | O(1) | O(1)        |

**Common mistake:** judging code by how many loops you can **see**. Count the loops hidden inside the methods too: `Object.keys`, `includes`, `indexOf` and friends all have one.
