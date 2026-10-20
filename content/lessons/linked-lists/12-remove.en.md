---
title: 'remove: take out the guest at an index'
order: 12
minutes: 14
---

> **Goal:** write `remove`, the method that takes out the node at any index and returns it, by reusing `shift`, `pop` and `get`.

## Understand: what remove does

A guest in the middle of the conga line has to leave early. The guests on either side close the gap, and the line keeps dancing. That's **`remove`**. Step 1: what goes in, what comes out, what changes.

- **What goes in:** an index: `line.remove(2)`.
- **What changes:** the node at that index leaves the line. The node before it now points to the node after it, every node after it sits one index earlier, and `length` goes down by 1. If it was the first or the last guest, `head` or `tail` moves too.
- **What comes out:** the removed node, cut loose from the line (its `next` is `null`), or `undefined` if there's no node at that index.

Its valid indexes are get's, not insert's: from 0 to `length - 1`. You can insert at `length` (right after the last guest), but you can't remove from there, because nobody is standing in that spot.

```viz
linked-list-remove
```

**What just happened:** `remove(2)` took Cleo's node out of the middle. Ben now points straight to Dev, Dev moved from index 3 to 2, and the length went from 4 to 3. Then remove returned Cleo's node, cut off from the line.

**Common mistake:** mixing up remove's return value with insert's. insert answers yes or no (`true` or `false`). remove gives back **who left** (the node), like pop and shift, or `undefined` when nobody did.

## Examples: front, back, middle, out of range

Step 2: examples. Just like insert, two of them are methods you've already written.

- **Index 0, the front:** that's **`shift`**.
- **The last index, `length - 1`:** that's **`pop`**.
- **The middle:** walk to the node before the one leaving, and point it past that node: `temp.next = temp.next.next` from lesson 2.
- **Out of range:** a negative index, or `length` and above. Nobody is there, so remove returns `undefined`.

An empty line is covered by the range check: with `length` 0, no index is valid. And a line with one guest is covered by the front case, since its only index, 0, is also its last.

```viz
linked-list-remove-examples
```

**What just happened:** index 0 took Ana off the front, like shift. Index 3 took Dev off the back, like pop. Index 2 took Cleo out of the middle. Index 4 was out of range, so nothing changed and remove returned `undefined`.

**Common mistake:** copying insert's range check, `index > this.length`. That lets `remove(length)` through, and there's no node there to remove.

## Break it down

Step 3: the plan. The ends go to shift and pop, and the middle needs **two** pointers: **`before`**, the node whose `next` has to change, and **`temp`**, the node that's leaving (we have to return it).

```js
remove(index) {
  // 1. if index < 0 or index >= length, return undefined
  // 2. index 0? return this.shift(). Last index? return this.pop()
  // 3. before = the node before the spot: this.get(index - 1)
  // 4. temp = before.next: the node that leaves
  // 5. before's next skips over temp
  // 6. temp's next becomes null, to cut it off
  // 7. subtract 1 from length, return temp
}
```

Look at step 4. To get the leaving node, you could call `this.get(index)`, but that walks from `head` all over again. You don't need to: you're already standing on the node right before it, so it's simply `before.next`, one step away. A second `get` would be a second O(n) walk for something that costs O(1).

Step 6 is the same idea as `temp.next = null` in shift: cut the leaving node loose, so whoever receives it doesn't receive the rest of the line too.

```viz
linked-list-remove-plan
```

**What just happened:** index 2 passed the range check and wasn't an end. `get(1)` walked to Ben, so `before` was Ben, and `temp` was Ben's `next`, Cleo, with no second walk. Ben's `next` skipped over Cleo to Dev, Cleo's `next` was cut, and the length dropped to 3.

**Common mistake:** writing only `before.next = before.next.next`. The node does leave the line, but you've lost your only pointer to it, so you can't cut its `next` or return it. Save it in `temp` first.

## Write the code

Step 4: the common case first. In the middle, it's steps 3 to 7:

```js
const before = this.get(index - 1)
const temp = before.next
before.next = temp.next
temp.next = null
this.length--
return temp
```

Then the edge cases go on top. The range check returns `undefined`. Index 0 returns `this.shift()`, and the last index returns `this.pop()`. Unlike insert, remove can return what shift and pop return, because they already return the removed node: the same answer remove gives.

```viz
trace-ll-remove
```

**What just happened:** `remove(2)` walked to Ben with `get(1)`, took Ben's `next` as `temp`, pointed Ben past Cleo, cut Cleo loose and returned Cleo's node. `remove(0)` handed the job to shift. `remove(9)` was out of range and returned `undefined`.

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
      const newNode = new Node(value)
      this.head = newNode
      this.tail = this.head
      this.length = 1
    }
  }

  push(value) {
    const newNode = new Node(value)
    if (!this.head) {
      this.head = newNode
      this.tail = newNode
    } else {
      this.tail.next = newNode
      this.tail = newNode
    }
    this.length++
    return this
  }

  pop() {
    if (!this.head) {
      return undefined
    }
    let temp = this.head
    let pre = this.head
    while (temp.next !== null) {
      pre = temp
      temp = temp.next
    }
    this.tail = pre
    this.tail.next = null
    this.length--
    if (this.length === 0) {
      this.head = null
      this.tail = null
    }
    return temp
  }

  shift() {
    if (!this.head) {
      return undefined
    }
    let temp = this.head
    this.head = this.head.next
    temp.next = null
    this.length--
    if (this.length === 0) {
      this.tail = null
    }
    return temp
  }

  get(index) {
    if (index < 0 || index >= this.length) {
      return undefined
    }
    let temp = this.head
    for (let i = 0; i < index; i++) {
      temp = temp.next
    }
    return temp
  }

  remove(index) {
    if (index < 0 || index >= this.length) {
      return undefined
    }
    if (index === 0) {
      return this.shift()
    }
    if (index === this.length - 1) {
      return this.pop()
    }
    const before = this.get(index - 1)
    const temp = before.next
    before.next = temp.next
    temp.next = null
    this.length--
    return temp
  }

  toArray() {
    const values = []
    let temp = this.head
    while (temp !== null) {
      values.push(temp.value)
      temp = temp.next
    }
    return values
  }
}

const line = new LinkedList('Ana').push('Ben').push('Cleo').push('Dev')
console.log(line.remove(2)) // Cleo's node, on its own
console.log(line.toArray().join(' -> ')) // Ana -> Ben -> Dev
console.log(line.remove(2).value, line.tail.value) // Dev Ben: the last index used pop
console.log(line.remove(5)) // undefined
```

**Common mistake:** checking for the last index with `this.length` instead of `this.length - 1`. `index === this.length` never passes the range check, so the pop case would never run, and removing the last guest would go through the middle code, which never moves `tail`.

## Look back

Step 5: the Big O, and the one refactor that made the middle cheaper.

**Big O:** removing at the front is shift: O(1). Removing the last guest is pop, and pop walks the line: O(n). In the middle, `get` walks to the node before: O(n). So remove is **O(n) time** and **O(1) space**. An array's `splice` is also O(n), for the opposite reason: no walk to find the spot, but everything after it has to be re-indexed.

**The refactor:** `const temp = before.next` instead of `const temp = this.get(index)`. Both give the same node. The first is one step, and the second is a second walk from `head`. Whenever you're already standing next to the node you need, use the arrow you're holding instead of walking again.

**You've finished the toolbox.** With remove, our `LinkedList` can add and take away guests anywhere: at the front, at the back and at any index. Only one method is left, and it's the one interviewers ask about most: reverse.

```js-run
// remove at each index of a line of 6: how many moves to reach the spot?
const length = 6
for (let index = 0; index < length; index++) {
  let moves = 0
  if (index === length - 1) {
    moves = length - 1 // pop walks to the node before the tail
  } else if (index !== 0) {
    moves = index - 1 // get(index - 1)
  }
  console.log('remove(' + index + '): ' + moves + ' moves')
}
```

**Common mistake:** assuming the last guest is the cheapest to remove because it's "at the end". In a singly linked list, the end is the expensive spot. Removing it goes through pop, which walks the whole line.
