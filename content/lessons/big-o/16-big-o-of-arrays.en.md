---
title: Big O of arrays
order: 16
minutes: 11
---

> **Goal:** know which array operations are O(1) and which are O(n), and be able to explain why.

## Arrays are ordered lists

Before we build our own data structures, we need to know the Big O of the one you already use every day: the **array**. It gives us something to compare against. When you build a linked list later in the course, the first question will be: is it faster than an array, and at what?

An array is an **ordered list**. Every item has a position, called its **index**, and indexes start at 0: the first item is at index 0, the second at index 1, and the last one at index `length - 1`. Order is the whole point of an array. Words like "first", "next" and "last" mean something in an array, so it's the right tool when the order matters: a waiting line, a top-10 ranking, the guests in the order they arrived. If you only need to keep some data together and the order doesn't matter, there are often better options (the next module looks at objects).

Arrays aren't the only ordered data structure, by the way. Later you'll build **linked lists**, which also keep their items in order but store them in a very different way, and sometimes do better than arrays. Arrays are simply the ordered structure JavaScript gives you **for free**.

To judge any data structure, we look at four operations:

- **Access:** read an item when you know **where** it is (its index).
- **Search:** find an item when you only know **what** it is (its value).
- **Insert:** add an item.
- **Remove:** take an item out.

Let's start with access.

```viz
constant-jump
```

**What just happened:** `guests[3]` went straight to box 3, without looking at boxes 0, 1 and 2 on the way.

This clears up a very common misconception. If you ask a 10,000-item array for the item at index 9,000, JavaScript does **not** start at index 0 and count its way up to 9,000. Think of an index as a direct address: as long as that index exists in the array, JavaScript can jump straight to it. That's why reading by index is **O(1)**, whether it's the first item, one in the middle or the last one, and whether the array has 6 items or a million.

Try it. This code builds an array of a million numbers, then reads three of them. Each read is instant:

```js-run
const numbers = []
for (let i = 0; i < 1000000; i++) {
  numbers.push(i * 2)
}

console.log('first:', numbers[0])
console.log('index 900000:', numbers[900000])
console.log('last:', numbers[numbers.length - 1])
```

The loop that builds the array is O(n), of course: it pushes a million items. But each **read** after that is a single step.

**Common mistake:** thinking `numbers[999999]` is slower than `numbers[0]`. The position doesn't matter. The index takes you straight there.

## push and pop vs shift and unshift

Insertion and removal are where arrays get interesting, because the answer is: **it depends on where**. And the reason is the same thing that makes access fast: the indexes.

Every item's index must always match its position. If you add or remove an item anywhere except the end, every item after that spot is now at the wrong index, and each one has to be **re-indexed**: given its new number. A single change at the front starts a cascade that runs through the whole array, a bit like a line of people where everyone has to take one step when someone cuts in at the front.

```viz
array-reindex
```

Here's an array of raffle ticket numbers, `tickets`, with 4 numbers at indexes 0 to 3. Press **Run** and follow along:

```js-run
const tickets = [12, 5, 31, 8]

tickets.push(20) // adds 20 at the end, at index 4
console.log('push:', tickets)
tickets.pop() // removes it again
console.log('pop:', tickets)

tickets.shift() // removes 12 from the start...
console.log('shift:', tickets, '5 is now at index', tickets.indexOf(5))
tickets.unshift(12) // ...and puts it back
console.log('unshift:', tickets, '5 is back at index', tickets.indexOf(5))
```

- **`push(20)`** adds 20 at the end, at index 4. None of the other items needs a new index: **O(1)**.
- **`pop()`** removes the last item. Again, nothing else is re-indexed: **O(1)**.
- **`shift()`** removes the first item, and now every other index is wrong: the new first item has to become index 0, the next one index 1, and so on. **Every** item gets re-indexed: **O(n)**.
- **`unshift(12)`** adds 12 back at the start, and every item has to move up one index: **O(n)**.

With 4 items that's nothing, but with thousands of items it's a lot of re-indexing. Each re-index is a small job, so the exact count might be 2n or 10n operations. It still grows in proportion to n, so it's O(n).

One small exception: on an **empty** array, the start and the end are the same place, so `unshift` has nobody to move. That's a special case, though. Big O describes what happens as the array grows.

Remember: at the **end** of an array, adding and removing are O(1). At the **start**, both are O(n). That doesn't mean you must never use `shift` or `unshift`. Sometimes you really need something to go first. Just know what it costs, and avoid doing it inside a loop over a big array.

**Under the hood:** if an array keeps its items side by side in one block of memory, what happens when `push` reaches the end of that block? The engine plans ahead: it keeps a few empty slots past the last item, so most pushes just fill the next free slot. When the slots run out, it grabs a bigger block (in Chrome's engine, about one and a half times as big), copies every item over and carries on. That one copy is O(n), but it happens so rarely that, spread over all the pushes, each push still costs O(1) on average. You'll hear this called **amortized O(1)**.

**Common mistake:** "`shift()` is one short line, so it must be O(1)." The cost of a method is the work it does inside, not the length of the line you type.

## Inserting in the middle

`splice` is the array's Swiss Army knife: it can insert, remove or replace items anywhere in the array. Its first argument is the index where it starts, the second is how many items to remove, and any arguments after that are items to insert. Whatever happens at that spot, the items **after** it have to move, so the cascade starts there instead of at the front.

```viz
array-splice
```

What about the middle, then? Let's insert something:

```js-run
const tickets = [12, 5, 31, 8]

tickets.splice(1, 0, 40) // at index 1, remove 0 items, add 40
console.log(tickets) // 5, 31 and 8 all moved up one index

tickets.splice(1, 1) // at index 1, remove 1 item
console.log(tickets) // and they all move back
```

When 40 goes into index 1, every item after it needs a new index: **O(n)**.

You might say: "Hey, we only re-indexed about half the items. Isn't that O(½n)?" There are two problems with that. First, Big O always measures the **worst case**, not the average, and inserting at index 0 moves everything. Second, even if it were ½n, **½ is a constant, and we drop constants**. Either way, it's **O(n)**. Removing from the middle is O(n) for the same reason.

**Common mistake:** counting only the item you inserted. The cost of `splice` is mostly the items it has to move, not the one it adds.

## Find by value vs read by index

The last operation is **search**: you know _what_ you're looking for, but not _where_ it is. Here's the difference from access in one sentence: access asks "what's at index 3?", while search asks "where is the value 42?". In an unsorted array, the value could be anywhere, so the only way to find it is to check the items one by one.

```viz
search-cases
```

Say we're looking for the **value** 42. We start at the beginning: is that 42? No. No. No… until we finally find it. If it's at the end, or not there at all, we've checked every item. Searching **by value** is **O(n)**. Remember that `includes` and `indexOf` do exactly this behind the scenes, so they're O(n) too.

If the array is **sorted**, there's a faster way: binary search, the O(log n) halving you saw in the logarithms lesson. You'll write it yourself in the searching module. For unsorted data, O(n) is the best we can do.

Reading **by index** is different, as you saw at the start of the lesson: arrays use their indexes to go **directly** to that spot, in O(1). In an array of a million items, you can jump straight to item 600,000 in one step.

Here's the whole lesson in one table:

| Operation                                       | Big O | Why                      |
| ----------------------------------------------- | ----- | ------------------------ |
| Read by index (`arr[i]`)                        | O(1)  | it jumps straight there  |
| Search by value (`includes`, `indexOf`)         | O(n)  | it may check every item  |
| Add or remove at the end (`push`, `pop`)        | O(1)  | nobody moves             |
| Add or remove at the start (`unshift`, `shift`) | O(n)  | everybody moves          |
| Add or remove in the middle (`splice`)          | O(n)  | everybody after it moves |

The same indexes are both the strength and the weakness of arrays: they make reading instant, and they make changing the front expensive.

So the most important question about any data structure is: **what are you going to use it for?** If you need to read things by index, arrays are great. If you'll be adding and removing lots of items at the beginning, an array might not be the best choice, and a different data structure (like the linked lists you'll build soon) might be better. Either way, you're making that decision based on Big O.
