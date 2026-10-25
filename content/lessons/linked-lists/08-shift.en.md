---
title: 'shift: remove the guest at the front'
order: 8
minutes: 16
---

> **Goal:** write `shift`, the method that removes the first node and returns it, cleanly cut off from the rest of the line.

## Understand: what shift does

The guest at the front of the conga line leaves. That's **`shift`**, the same name and the same job as the array method that removes the first item. Step 1: what goes in, what comes out, what changes.

- **What goes in:** nothing. `line.shift()` always removes the **first** guest.
- **What changes:** `head` moves to the **next** node, so the second guest becomes the first. `length` goes down by 1. `tail` doesn't move (unless the line ends up empty).
- **What comes out:** the node that was removed, on its own, or `undefined` if the list was empty.

Compare it with pop. pop had to walk the whole line to find the node before the tail. shift needs the node **after** the head, and that's just `this.head.next`: the arrows point the right way. So there's no walk at all, and shift is O(1), while an array's `shift` is O(n), because every item moves down one index.

```viz
linked-list-shift
```

**What just happened:** the line was Ana, Ben, Cleo. `shift()` took Ana's node off the front, `head` moved to Ben, and the length went from 3 to 2. Then it returned Ana's node, cut off from the line.

**Under the hood:** shift returns the whole node, like pop, so the two removing methods behave the same way. The caller gets the value with `.value`, and a list of nodes stays a list of nodes.

**Common mistake:** confusing `shift` and `unshift`. `unshift` **adds** at the front, `shift` **removes** from the front. One way to remember: the longer name does the adding.

## Examples: three scenarios

Step 2: shift has the same three scenarios as pop.

1. **An empty line:** there's no one to remove, so return `undefined` and change nothing.
2. **One guest:** removing the only guest empties the line. `head` moves to `head.next`, which is `null`, so `head` takes care of itself. But `tail` is still pointing at the node that just left, so `tail` has to be set to `null` too.
3. **Many guests:** `head` moves to the second guest, the first node is cut off and returned, and `tail` stays where it is.

```viz
linked-list-shift-examples
```

**What just happened:** the empty line returned `undefined`. The line with only Ana returned Ana's node and ended with `head` and `tail` both on `null`. The line of three returned Ana's node, `head` moved to Ben, and `tail` stayed on Cleo.

As with pop, arrays agree on the first two scenarios:

```js-run
const nobody = []
console.log(nobody.shift()) // undefined

const justAna = ['Ana']
console.log(justAna.shift(), justAna.length) // Ana 0
```

**Under the hood:** `this.head = this.head.next` works because JavaScript works out the right side's value before it changes `head`. It reads `this.head.next`, the second node (or `null`), while `head` still points to the first one, and only then moves `head`. That one line is safe whenever there's a first node, the one-node line included; the empty line never reaches it, because the first `if` returns.

**Common mistake:** handling the one-guest case like pop does, resetting both `head` and `tail`. That works, but it hides how shift is different: `head` becomes `null` on its own, because the only node's `next` was `null`. Only `tail` needs the extra help.

## Break it down

Step 3: the plan. Two details are easy to miss, so here they are before the comments.

First, you need a pointer to the first node **before** `head` moves off it, because you're going to return that node. That's `oldHead`. Second, once `head` has moved, the old first node is out of the line, but its `next` **still points to the second guest**. If you return it like that, whoever gets it is holding the rest of the line too. So cut it loose: `oldHead.next = null`.

```js
shift() {
  // 1. if the list is empty, return undefined
  // 2. oldHead points to the first node
  // 3. head moves to the next node
  // 4. oldHead's next becomes null, to cut it off from the line
  // 5. subtract 1 from length
  // 6. if length is now 0, tail becomes null too
  // 7. return oldHead
}
```

```viz
linked-list-shift-plan
```

**What just happened:** `oldHead` grabbed Ana's node, then `head` moved to Ben. Ana's node was out of the line but still pointed to Ben, until step 4 cut that arrow. The length dropped to 2, and Ana's node was returned on its own. In the one-guest line, step 6 set `tail` to `null` after Ana left.

Here's what step 4 prevents. Run it:

```js-run
let head = {
  value: 'Ana',
  next: { value: 'Ben', next: { value: 'Cleo', next: null } },
}

const oldHead = head
head = head.next
console.log(oldHead) // Ana's node is out of the line, but still holds Ben and Cleo

oldHead.next = null
console.log(oldHead) // now it's only Ana
```

**Under the hood:** `oldHead.next = null` doesn't free any memory: the node is still held by `oldHead`, and soon by whoever receives it. It's about **correctness**: it makes sure the returned node can't reach into the line. It also matters for memory later: if some code keeps the returned node after the list itself is gone, an uncut `next` would keep the rest of the chain reachable, so the garbage collector couldn't free it.

**Common mistake:** skipping `oldHead.next = null`. The list itself is fine without it, but the returned node still points into the line, so code that uses it can reach, and even change, guests who are still in the list.

## Write the code

Step 4: the common case first. With two or more guests, it's steps 2 to 5 and 7:

```js
shift() {
  let oldHead = this.head
  this.head = this.head.next
  oldHead.next = null
  this.length--
  return oldHead
}
```

Now the edge cases. **The empty list:** `this.head.next` crashes when `head` is `null`, so check at the top: `if (!this.head) { return undefined }`. **One guest:** walk through the code with only Ana. `oldHead` points to Ana, `head` becomes Ana's `next`, which is `null`, `oldHead.next = null` changes nothing, and the length drops to 0. But `tail` still points to Ana. So, after the decrement, add: if the length is now 0, set `tail` to `null`.

```viz
trace-ll-shift
```

**What just happened:** with 4 guests, `oldHead` took Ana, `head` moved to Ben, Ana's `next` was cut, and the length dropped to 3. With 1 guest, `head` became `null` on its own, and the `length === 0` check set `tail` to `null`. With 0 guests, the first `if` returned `undefined`.

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

  shift() {
    if (!this.head) {
      return undefined
    }
    let oldHead = this.head
    this.head = this.head.next
    oldHead.next = null
    this.length--
    if (this.length === 0) {
      this.tail = null
    }
    return oldHead
  }
}

const line = new LinkedList('Ana')
line.push('Ben')
console.log(line.shift()) // Ana's node, on its own
console.log(line.shift().value) // Ben: the only guest left
console.log(line.shift()) // undefined: an empty line
console.log(line.head, line.tail, line.length) // null null 0
```

**Under the hood:** after `this.length--`, checking `this.length === 0` and checking `this.head === null` give the same answer, because every method keeps `head` and `length` in agreement. We check the length, the same way pop does, so the two methods read alike.

**Common mistake:** forgetting the `length === 0` check. The line looks empty from `head`, but `tail` still holds the guest who left: `line.tail.value` would still say `'Ana'` for an empty line. Any method that trusts `tail` to be the last guest would then work with someone who isn't in the line anymore.

## Look back

Step 5: the Big O, and how shift fits with the methods you already have.

**Big O:** shift moves `head` once and cuts one arrow, with no walk: **O(1) time** and **O(1) space**. On an array, `shift` is **O(n)**. You've now written all four methods for the two ends of the line, and their costs match lesson 2's table: push O(1), pop O(n), unshift O(1), shift O(1).

**Compare it with pop.** Both remove a node and both have the same three scenarios, but their one-guest fixes differ. pop had to reset `head` **and** `tail`, because nothing in its code moved `head`. shift only resets `tail`, because `this.head = this.head.next` already made `head` `null`. Writing out the one-guest walk-through, line by line, is what showed the difference each time.

**push plus shift is a queue.** Guests join at the back with `push` and get served from the front with `shift`, and with a linked list both are O(1). That's the ticket counter from lesson 2, and you'll build a proper `Queue` class later in this section.

```js-run
class Node {
  constructor(value) {
    this.value = value
    this.next = null
  }
}

class LinkedList {
  constructor() {
    this.head = null
    this.tail = null
    this.length = 0
  }

  push(value) {
    const nodeToAdd = new Node(value)
    if (!this.head) {
      this.head = nodeToAdd
    } else {
      this.tail.next = nodeToAdd
    }
    this.tail = nodeToAdd
    this.length++
    return this
  }

  shift() {
    if (!this.head) {
      return undefined
    }
    let oldHead = this.head
    this.head = this.head.next
    oldHead.next = null
    this.length--
    if (this.length === 0) {
      this.tail = null
    }
    return oldHead
  }
}

const counter = new LinkedList().push('Ana').push('Ben').push('Cleo')
while (counter.length > 0) {
  console.log('Now serving ' + counter.shift().value)
}
```

**Under the hood:** `push` at the back plus `shift` at the front is a **queue**: first in, first out, like the ticket counter. On our linked list both are O(1), so serving n guests costs O(n) in total. The Stacks & Queues module builds one, with these exact two moves.

**Common mistake:** using an array as a long queue with `push` and `shift`. It works, but every `shift` moves the whole line, so serving n guests costs O(n²) in total. A linked list serves them in O(n).
