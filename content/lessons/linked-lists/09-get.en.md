---
title: 'get: find the node at an index'
order: 9
minutes: 15
---

> **Goal:** write `get`, the method that walks to the node at an index and returns it, and handle every index that doesn't exist.

## Understand: what get does

A linked list has no indexes, but people still ask for "the third guest". **`get`** answers that question: it gives a linked list something that works like an index, by counting while it walks. Step 1: what goes in, what comes out, what changes.

- **What goes in:** an index, counted from `head` like an array's: the first node is 0, the next is 1, and so on.
- **What comes out:** the **node** at that index, still in the line. If there's no node at that index, `get` returns `undefined`.
- **What changes:** nothing. `get` only looks.

This is "finding by index" from lesson 2's table, and it's O(n): there's no block of memory to jump into, so the only way to the node at index 2 is from `head`, one `next` at a time. `get` is also a building block. In the next lessons, `set`, `insert` and `remove` all start by calling it.

```viz
linked-list-get
```

**What just happened:** `get(2)` started at `head` and moved forward twice, counting Ana as 0, Ben as 1 and Cleo as 2. It returned Cleo's node, and the line didn't change.

**Under the hood:** `get` hands back the **real node**, not a copy. Whatever you do to it, like changing its `value` or its `next`, happens inside the list. That's exactly what `set`, `insert` and `remove` will rely on.

**Common mistake:** expecting `get` to return the value. It returns the whole node, so you can still follow its `next` or change it. The value is one step away: `line.get(2).value`.

## Examples: empty, one guest, the last guest, out of range

Step 2: examples. For an index method, the interesting examples are about **which indexes exist**. In a line of four guests, the valid indexes are 0, 1, 2 and 3: from 0 up to **`length - 1`**.

- **An empty line** has no valid index at all, so `get(0)` returns `undefined`.
- **One guest:** only index 0 exists, and `get(0)` returns the head node without moving.
- **The last guest:** `get(length - 1)` is the longest walk, all the way to the tail.
- **Out of range:** a negative index like -1, or an index of `length` or more (like 4 in a line of four), doesn't exist. `get` returns `undefined` for those without walking at all.

```viz
linked-list-get-examples
```

**What just happened:** the empty line and indexes -1 and 4 all returned `undefined`, without walking. Index 0 with one guest returned Ana's node straight away, and index 3 walked the whole line to Dev.

Arrays answer out-of-range indexes the same way, which makes `undefined` a natural choice:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']
console.log(guests[3]) // Dev: the last index is length - 1
console.log(guests[4]) // undefined: no guest at index 4
console.log(guests[-1]) // undefined: no negative indexes
```

Before you run this, predict each line. `walkTo` is `get` **without** the range check:

```js-run
function walkTo(head, index) {
  let current = head
  for (let i = 0; i < index; i++) {
    current = current.next
  }
  return current
}

const head = { value: 'Ana', next: { value: 'Ben', next: { value: 'Cleo', next: null } } }
console.log(walkTo(head, 0).value)
console.log(walkTo(head, 2).value)
console.log(walkTo(head, 3)) // index 3 is the length
```

**What just happened:** index 0 didn't move and gave Ana; index 2 moved twice and gave Cleo. Index 3, the length, moved one step past the last node and gave `null` instead of a node. Index 4 would crash, because it would read `.next` from that `null`. That's the job of the range check.

**Under the hood:** the range check runs **before** the walk for a reason: reading `.next` on `null` throws a `TypeError` and stops the program. Rejecting a bad index first means the loop only ever walks over nodes that exist.

**Common mistake:** writing the range check as `index > this.length`. That lets `index === length` through, and the walk steps off the end of the line. The last index that exists is `length - 1`, so the check is `index >= this.length`.

## Break it down

Step 3: the plan as comments.

```js
get(index) {
  // 1. if index < 0 or index >= length, return undefined
  // 2. current starts at head (index 0)
  // 3. move current forward, index times
  // 4. return current
}
```

Step 3 is a walk, but not the open-ended walk of pop. Here we know **exactly how many moves** we need: to reach index 2, move 2 times. When you know the count in advance, a `for` loop is the natural fit: `for (let i = 0; i < index; i++) { current = current.next }`. pop used `while`, because it didn't know where the end was until it saw `null`.

The range check comes first because it makes everything after it safe. Once an index has passed it, the walk can never run off the end of the line.

```viz
linked-list-get-plan
```

**What just happened:** the range check passed for index 2. `current` started at `head`, on index 0, and moved forward once per count: to Ben (1), then Cleo (2). Two moves for index 2, and then `current` was returned.

**Under the hood:** the loop counts moves, not nodes. To reach index k you move k times, so `get(0)` moves zero times and hands back `head` as it is. That's why the loop runs while `i < index`, starting from 0.

**Common mistake:** an off-by-one in the loop, like `i <= index` or starting `i` at 1. Either makes `current` move one time too many or too few. Check the loop on the smallest example: `get(0)` must not move at all.

## Write the code

Step 4: the common case first, then the edge case. With an index that exists, `get` is the walk:

```js
get(index) {
  let current = this.head
  for (let i = 0; i < index; i++) {
    current = current.next
  }
  return current
}
```

Then the edge case: an index that doesn't exist. Without a check, `get(10)` on four guests moves `current` onto `null` and then crashes trying to read `null.next`. So the range check goes at the top, and returns `undefined` before any walking starts. The check comes straight from step 2's examples: below 0, or `length` and above.

```viz
trace-ll-get
```

**What just happened:** `get(2)` passed the check, started at Ana, and moved twice to Cleo, after visiting 3 nodes. `get(0)` passed the check and returned Ana's node without moving. `get(4)` failed the check and returned `undefined` straight away.

```js-run
class Node {
  constructor(value) {
    this.value = value
    this.next = null
  }
}

class LinkedList {
  constructor(value) {
    this.head = null
    this.tail = null
    this.length = 0
    if (value !== undefined) {
      const firstNode = new Node(value)
      this.head = firstNode
      this.tail = this.head
      this.length = 1
    }
  }

  push(value) {
    const nodeToAdd = new Node(value)
    if (!this.head) {
      this.head = nodeToAdd
      this.tail = nodeToAdd
    } else {
      this.tail.next = nodeToAdd
      this.tail = nodeToAdd
    }
    this.length++
    return this
  }

  get(index) {
    if (index < 0 || index >= this.length) {
      return undefined
    }
    let current = this.head
    for (let i = 0; i < index; i++) {
      current = current.next
    }
    return current
  }
}

const line = new LinkedList('Ana').push('Ben').push('Cleo').push('Dev')
console.log(line.get(2).value) // Cleo
console.log(line.get(0).value) // Ana
console.log(line.get(4)) // undefined
console.log(line.get(-1)) // undefined
```

**Under the hood:** the walk can never crash, even though it reads `current.next` on every move. The range check guarantees `index` is at most `length - 1`, and the loop moves exactly `index` times, so every `next` it reads belongs to a node that's really in the line.

**Common mistake:** returning `null` for an index that doesn't exist. It works, but it's a different answer from an array's `undefined`, and from what `pop` and `shift` return on an empty list. One "nothing there" value across the class is easier to check.

## Look back

Step 5: the Big O, and one design choice to think about.

**Big O:** `get` walks up to `index` nodes, and the worst case is the last index, which walks the whole line: **O(n) time**. It uses one extra pointer, `current`: **O(1) space**. An array does the same job in O(1) with `guests[index]`, and that's the biggest difference between the two structures.

**Why return the node, not the value?** Returning `current.value` would be fine for someone who only wants to read a name. But the next three methods need the **node itself**. `set` changes the node's value, and `insert` and `remove` link new arrows around it. Returning the node makes `get` the shared first step of all three, and reading the value is still one `.value` away.

**Could it be faster?** For an index in the second half of the line, walking from the tail would be shorter, but a singly linked list can't walk backwards. A doubly linked list can, and its `get` uses exactly that trick: start from whichever end is closer.

```js-run
// get walks index moves. Count them for every index in a line of 5.
const length = 5
for (let index = 0; index < length; index++) {
  let moves = 0
  for (let i = 0; i < index; i++) {
    moves++
  }
  console.log('get(' + index + '): ' + moves + ' moves')
}
```

**Under the hood:** a doubly linked list can make `get` about twice as fast in practice: for an index past the middle, it walks backwards from `tail` with `prev`. It's still O(n), because the constant drops, but it's a real trick you'll meet in the Doubly Linked Lists module.

**Common mistake:** calling `get` inside a loop to visit every node: `for (let i = 0; i < line.length; i++) { line.get(i) }`. Each `get` walks from the start again, so the loop does 0 + 1 + 2 + … moves: O(n²). To visit every node, walk once with `current`, like `toArray` does.
