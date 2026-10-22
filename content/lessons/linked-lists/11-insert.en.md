---
title: 'insert: add a guest at an index'
order: 11
minutes: 15
---

> **Goal:** write `insert`, the method that adds a new node at any index, by reusing `unshift`, `push` and `get` for the parts they already solve.

## Understand: what insert does

A guest arrives with a friend already in line and squeezes in at a specific spot. That's **`insert`**: a new node at a given index. Step 1: what goes in, what comes out, what changes.

- **What goes in:** an index and a value: `line.insert(2, 'Eve')`.
- **What changes:** a new node with that value goes in **at that index**. The node that was there, and every node after it, now sits one index later. `length` goes up by 1. If the index is 0 or the length, `head` or `tail` moves too.
- **What comes out:** `true` when the guest is in, and `false` when the index is out of range and nothing was added.

Which indexes are allowed? For `get`, the last valid index was `length - 1`. For `insert` there's one more: **`length` itself**, the spot right after the last guest, which means "add at the end". So insert accepts every index from 0 up to `length`, inclusive.

```viz
linked-list-insert
```

**What just happened:** `insert(2, 'Eve')` put a node for Eve at index 2, between Ben and Cleo. Cleo and Dev each moved one index later, to 3 and 4, and the length went from 4 to 5. Then `insert` returned `true`.

**Common mistake:** confusing `insert` with `set`. `set(2, 'Eve')` would **replace** Cleo's value. `insert(2, 'Eve')` adds a new guest and keeps Cleo, one index later.

## Examples: front, back, middle, out of range

Step 2: examples. insert has four kinds, and two of them are methods you've already written.

- **Index 0, the front:** that's exactly **`unshift`**.
- **Index `length`, the back:** that's exactly **`push`**.
- **The middle:** the real work: walk to the node before the spot, and link the new node in. You saw this in lesson 2.
- **Out of range:** a negative index, or one past `length`, like 7 in a line of four. There's no way to put a guest there without leaving a gap no node could fill, so insert returns `false` and changes nothing.

Notice what's **not** on the list: an empty line. It's covered already. On an empty line, `length` is 0, so the only valid index is 0, and that's the unshift case.

```viz
linked-list-insert-examples
```

**What just happened:** index 0 put Zoe at the front, the same as unshift. Index 4 put Eve at the back, the same as push. Index 2 linked Eve into the middle. Index 7 was out of range, so nothing changed and insert returned `false`.

**Common mistake:** copying get's range check, `index >= this.length`. For insert that's wrong: it rejects `index === length`, so you could never insert at the end.

## Break it down

Step 3: the plan. Let the existing methods handle what they already do, and only write new code for the middle:

```js
insert(index, value) {
  // 1. if index < 0 or index > length, return false
  // 2. index 0? unshift. index === length? push. Then return true
  // 3. make a new node
  // 4. nodeBefore = the node before the spot: this.get(index - 1)
  // 5. the new node's next points to nodeBefore's next
  // 6. nodeBefore's next points to the new node
  // 7. add 1 to length, return true
}
```

Step 4 asks for the node **before** the spot, at `index - 1`, because that's the node whose `next` has to change. You can't go back from the node at `index`. Steps 5 and 6 are the order you learned with unshift: **link the new node first**, while `nodeBefore.next` still points to the rest of the line, and only then point `nodeBefore` at the new node.

```viz
linked-list-insert-plan
```

**What just happened:** index 2 passed the range check and wasn't an end. A node for Eve was made, and `get(1)` walked to Ben, the node before the spot. Eve's `next` was pointed at Cleo, and only then was Ben's `next` pointed at Eve. The length went up to 5, and insert returned `true`.

**Common mistake:** doing step 6 before step 5. After `nodeBefore.next = nodeToAdd`, nothing points to Cleo anymore, so `nodeToAdd.next = nodeBefore.next` points Eve's node at itself, and Cleo and Dev are lost.

## Write the code

Step 4: the common case first. In the middle, it's steps 3 to 7:

```js
const nodeToAdd = new Node(value)
const nodeBefore = this.get(index - 1)
nodeToAdd.next = nodeBefore.next
nodeBefore.next = nodeToAdd
this.length++
return true
```

Then the edge cases go on top, in the order of the plan. The range check returns `false`. Index 0 calls `this.unshift(value)` and index `length` calls `this.push(value)`, each followed by `return true`. The `this.` matters here: insert works for whichever list it's called on, so it calls **that** list's unshift and push.

The `return` right after each one also matters. It stops insert there, so the middle-case code below never runs for the ends.

```viz
trace-ll-insert
```

**What just happened:** `insert(2, 'Eve')` passed the checks, made Eve's node, walked to Ben with `get(1)`, and linked Eve between Ben and Cleo. `insert(0, 'Zoe')` handed the job to unshift. `insert(7, 'Eve')` failed the range check and returned `false`.

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

  unshift(value) {
    const nodeToAdd = new Node(value)
    if (!this.head) {
      this.head = nodeToAdd
      this.tail = nodeToAdd
    } else {
      nodeToAdd.next = this.head
      this.head = nodeToAdd
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

  insert(index, value) {
    if (index < 0 || index > this.length) {
      return false
    }
    if (index === 0) {
      this.unshift(value)
      return true
    }
    if (index === this.length) {
      this.push(value)
      return true
    }
    const nodeToAdd = new Node(value)
    const nodeBefore = this.get(index - 1)
    nodeToAdd.next = nodeBefore.next
    nodeBefore.next = nodeToAdd
    this.length++
    return true
  }

  toArray() {
    const values = []
    let current = this.head
    while (current !== null) {
      values.push(current.value)
      current = current.next
    }
    return values
  }
}

const line = new LinkedList('Ana').push('Cleo')
line.insert(1, 'Ben') // middle
line.insert(0, 'Zoe') // front: unshift
line.insert(4, 'Dev') // back (index === length): push
console.log(line.toArray().join(' -> ')) // Zoe -> Ana -> Ben -> Cleo -> Dev
console.log(line.insert(9, 'Eve'), line.length) // false 5
```

**Common mistake:** adding `this.length++` to the front and back cases too. `unshift` and `push` already add 1 to the length, so doing it again in insert counts the new guest twice.

## Look back

Step 5: the Big O, and the return value.

**Big O:** at the front, insert is unshift: O(1). At the back it's push: O(1). In the middle, it walks to the node before the spot with `get`, so it's **O(n) time**, and Big O takes that worst case. It makes one node, so it's **O(1) space**. An array's `splice` is O(n) too, because it re-indexes everything after the spot. That's the tie in lesson 2's table.

**Why `true` every time?** A common way to write the ends is `return this.unshift(value)`, which saves a line. But unshift and push return the **list**, so that insert would return the list for the ends, `true` for the middle and `false` for a bad index. Whoever calls insert would have to check for three different kinds of answer. Returning `true` for every success and `false` for every failure gives one yes-or-no question with one yes-or-no answer.

**Reuse, again:** insert has three edge cases and wrote new code for none of them. The range check is its own, but the front, the back and the walk were all solved before, by unshift, push and get. That's what building a class one method at a time buys you.

```js-run
// Where you insert decides the cost: count the moves for each index.
const length = 6
for (let index = 0; index <= length; index++) {
  let moves = 0
  if (index !== 0 && index !== length) {
    for (let i = 0; i < index - 1; i++) {
      moves++ // get(index - 1) walks this far
    }
  }
  console.log('insert(' + index + '): ' + moves + ' moves')
}
```

**Common mistake:** forgetting the out-of-range case because "nobody will pass a bad index". Someone always does, often off by one, and without the check, `get(index - 1)` returns `undefined` and `undefined.next` crashes.
