---
title: 'O(1): constant time'
order: 11
minutes: 9
---

> **Goal:** recognize O(1) code, the most efficient Big O there is.

## One operation, whatever n is

Next is **O(1)**, read "O of 1". It describes code whose work **doesn't change** when the input grows. Not "very little work", but **the same** work: whether n is 1 or a billion, the code does the same fixed number of operations. The 1 in O(1) doesn't mean "one operation". It stands for any fixed amount, the way the 1 in f(n) = 1 from the definition never changes with n.

Here's the simplest example: a function that just returns n + n. It does **one operation**, the addition. It doesn't matter if n is 1 or a million; it's always one operation. Add another addition, like `return n + n + n`, and it's two operations, so O(2). As you've probably guessed, we drop the constant and simplify that to **O(1)**: the number of operations is a constant that doesn't change when n changes.

The formula version of `sumUpTo` is the same kind of code:

```viz
trace-sum-formula
```

**What just happened:** n + 1, then the multiplication, then the division: 3 operations. Pick n = 1,000,000 and the counter still stops at 3. Three operations every time, so O(3), which we write as **O(1)**.

Here are `addItems` and `addItemsAgain`, with a tiny n and a huge one:

```js-run
function addItems(n) {
  return n + n
}

function addItemsAgain(n) {
  return n + n + n
}

console.log(addItems(1), addItems(1000000))
console.log(addItemsAgain(1), addItemsAgain(1000000))
```

**Common mistake:** thinking O(1) means "exactly one step". A function that always does 3 steps, or 300, is O(1) too. What makes it O(1) is that the number never grows with the input.

## Jump straight to the box

O(1) work **doesn't depend on the size of the data**. The classic example is reading an array item by its index. An array keeps its items in one block of memory, side by side, like numbered boxes in a row. So to find box 3, the computer doesn't walk past boxes 0, 1 and 2. It works out where box 3 is with a little math (where the row starts, plus 3 boxes) and **jumps straight** there. That's one step with 6 guests, and one step with a million.

`guests.length` works the same way: the array already knows its size, so it doesn't count. Reading or setting a key in an object, like `party.host`, is also O(1); you'll see how objects pull that off in the Hash Tables module. Other everyday O(1) work:

- reading or setting an object key (`party.host`),
- math on a few numbers (`guests.length * 2`),
- giving a variable a value.

```viz
constant-jump
```

**What just happened:** `guests[3]` jumped straight to box 3 without looking at boxes 0, 1 and 2. `guests.length` was one step too. Then the list grew to a million guests, and `guests[500000]` still jumped straight there in a single step. The size of the list never came into it.

Try it with a big list. Building the list takes a moment, because the loop adds a million names. But reading any one of them is instant:

```js-run
const guests = []
for (let i = 0; i < 1000000; i++) {
  guests.push('Guest ' + i)
}

console.log(guests[3]) // jumps to box 3
console.log(guests[500000]) // jumps to box 500000, just as fast
console.log(guests[guests.length - 1]) // the last guest, still one jump
console.log(guests.length) // the array already knows its size

const party = { host: 'Ana', theme: 'Retro' }
console.log(party.host) // reading a key is O(1) too
```

**Common mistake:** thinking the last item of an array is slower to reach than the first. `guests[0]` and `guests[999999]` are the same one jump, because the computer works out where each box is instead of walking to it.

## The most efficient Big O

On the graph, O(1) is a **flat line** along the bottom. It's the **most efficient** Big O there is: no code can do better than a fixed amount of work. You'll often hear it called **constant time**; when you hear that phrase, it means O(1).

Constant time doesn't mean "instant". A function that always does 1,000 operations is still O(1), because that 1,000 never grows: it does the same work for 10 items or 10 million. What O(1) promises is that the work **doesn't grow** with the input.

That's exactly why the formula version of `sumUpTo` beat the loop version: the formula is O(1), the loop is O(n), and the gap gets bigger every time n grows. It's also why O(1) operations are so valuable for things an app does all the time: you can read `guests.length` a thousand times and it never gets slower as the party grows.

Careful, though: short code isn't the same as constant time. Watch what one innocent-looking line can hide:

```viz
trace-is-invited
```

**What just happened:** to answer "is this name on the list?", the code had to check the guests one by one until it found the name or ran out. 'Zoe' took every check. And that's exactly what `guests.includes('Zoe')` does behind the scenes: it's one line, and it looks like it should be one step, but it's a loop. That's O(n).

So when you look for the Big O of a line, ask: _does it jump straight to the answer, or does it hide a loop?_ `guests[3]` jumps. `guests.includes(name)` and `guests.indexOf(name)` loop.

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli', 'Fay']

console.log(guests[4]) // jumps straight to box 4: O(1)
console.log(guests.includes('Zoe')) // checks every guest first: O(n)
console.log(guests.indexOf('Fay')) // checks guests until it finds Fay: O(n)
```

**Common mistake:** calling a line O(1) because it's short. `guests.includes('Zoe')` is one line, but its cost is a loop over every guest. Judge a line by how much work it does, not by how much space it takes on the screen.
