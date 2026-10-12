---
title: Big O of arrays
order: 16
minutes: 8
---

> **Goal:** know which array operations are O(1) and which are O(n), and why.

## push and pop vs shift and unshift

Before we build our own data structures, we need to know the Big O of the one you already use every day: the **array**. That way we can compare the data structures we build later against it. The key to everything here is the **indexes**.

```viz
array-reindex
```

Here's an array, `myArray`, with 4 numbers at indexes 0 to 3. Press **Run** and follow along:

```js-run
const myArray = [11, 3, 23, 7]

myArray.push(17) // adds 17 at the end, at index 4
console.log('push:', myArray)
myArray.pop() // removes it again
console.log('pop:', myArray)

myArray.shift() // removes 11 from the start...
console.log('shift:', myArray, '3 is now at index', myArray.indexOf(3))
myArray.unshift(11) // ...and puts it back
console.log('unshift:', myArray, '3 is back at index', myArray.indexOf(3))
```

- **`push(17)`** adds 17 at the end, at index 4. None of the other items needs a new index: **O(1)**.
- **`pop()`** removes the last item. Again, nothing else is re-indexed: **O(1)**.
- **`shift()`** removes the first item, and now every other index is wrong: the new first item has to become index 0, the next one index 1, and so on. **Every** item gets re-indexed: **O(n)**.
- **`unshift(11)`** adds 11 back at the start, and every item has to move up one index: **O(n)**.

With 4 items that's nothing, but with thousands of items, that's a lot of re-indexing. Remember: at the **end** of an array, adding and removing are O(1). At the **start**, both are O(n).

## Inserting in the middle

```viz
array-splice
```

What about the middle? `splice` can insert items anywhere:

```js-run
const myArray = [11, 3, 23, 7]

myArray.splice(1, 0, 'hi') // at index 1, remove 0 items, add 'hi'
console.log(myArray) // 3, 23 and 7 all moved up one index

myArray.splice(1, 1) // at index 1, remove 1 item
console.log(myArray) // and they all move back
```

When 'hi' goes into index 1, every item after it needs a new index: **O(n)**.

You might say: "Hey, we only re-indexed about half the items. Isn't that O(½n)?" There are two problems with that. First, Big O always measures the **worst case**, not the average, and inserting at index 0 moves everything. Second, even if it were ½n, **½ is a constant, and we drop constants**. Either way, it's **O(n)**. Removing from the middle is O(n) for the same reason.

## Find by value vs read by index

```viz
search-cases
```

Now, finding an item. Say we're looking for the **value** 7. We start at the beginning: is that 7? No. No. No… until we finally find it. Searching **by value** is **O(n)**.

But reading **by index** is different. "What's at index 3?" Arrays use their indexes to go **directly** to that spot in memory: **O(1)**. That's one of the big advantages of arrays: in an array of a million items, you can jump straight to item 400,000 in one step.

Those same indexes are also the arrays' weakness: adding or removing at the start means re-indexing everything.

So the most important question about any data structure is: **what are you going to use it for?** If you need to read things by index, arrays are great. If you'll be adding and removing lots of items at the beginning, an array might not be the best choice, and a different data structure (like the linked lists you'll build soon) might be better. Either way, you're making that decision based on Big O.
