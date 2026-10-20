---
title: 'reverse: turn the line around'
order: 13
minutes: 16
---

> **Goal:** write `reverse`, the method that flips the whole list in place, and keep track of every node while the arrows turn around.

## Understand: what reverse does

The DJ shouts "turn around!", and the conga line heads the other way: the guest at the back leads, and everyone holds on to the guest who used to be behind them. That's **`reverse`**, and it's one of the most common linked list questions in coding interviews. Step 1: what goes in, what comes out, what changes.

- **What goes in:** nothing. `line.reverse()` works on the whole list.
- **What changes:** `head` and `tail` swap, and **every `next` arrow flips** to point at the node that used to come before it. The last node's `next`, once `null`, now points back; the first node's `next` becomes `null`, because it's the new end.
- **What comes out:** the list itself, `this`, like push and unshift.

It reverses **in place**: no new nodes and no second list. The same nodes stay where they are in memory, and only their arrows change. That's what makes it a good interview question: building a reversed copy is easy, but flipping the arrows without losing track of the line takes care.

```viz
linked-list-reverse
```

**What just happened:** before, `head` was on Ana and every arrow pointed right. After `reverse()`, `head` was on Dev, `tail` on Ana, and every arrow pointed left. Read from the new `head`, the line is Dev, Cleo, Ben, Ana.

**Common mistake:** thinking reverse moves the values around, putting `'Dev'` into Ana's node and so on. It doesn't touch a single value. Only the `next` arrows and `head`/`tail` change.

## Examples: empty, one guest, two, many

Step 2: examples, from the smallest up.

- **An empty line:** reversed, it's still empty. The method must not crash on it.
- **One guest:** reversed, it's the same line. `head` and `tail` are both on Ana before and after.
- **Two guests:** Ana → Ben becomes Ben → Ana. `head` and `tail` swap, Ben's `next` points to Ana, and Ana's `next` becomes `null`.
- **Many guests:** the same flip, repeated along the whole line.

```viz
linked-list-reverse-examples
```

**What just happened:** the empty line and the one-guest line came out unchanged. Two guests swapped places as head and tail, with one arrow flipped. Four guests came out as Dev, Cleo, Ben, Ana, with every node pointing to the one that used to come before it.

Arrays have a built-in `reverse` too, and it also works in place:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']
const sameArray = guests.reverse()
console.log(guests) // reversed in place
console.log(sameArray === guests) // true: no new array was made
```

**Common mistake:** checking only the many-guests example. The empty line is the one that crashes a careless reverse, as you'll see in step 4.

## Break it down

Step 3: the plan. Swapping `head` and `tail` is the easy part: save `head` in `temp`, point `head` at `tail`, then point `tail` at `temp`.

The hard part is flipping the arrows. The moment you flip a node's `next` to point backwards, you've let go of the **rest of the line**: nothing points forward to the next node anymore, and there's a **gap**. So before every flip, you need a pointer on the far side of the gap. That's why reverse uses three pointers that walk the line together:

- **`temp`**: the node whose arrow you're flipping right now.
- **`next`**: the node after `temp`, saved **before** the flip, so the rest of the line isn't lost.
- **`prev`**: the node before `temp`, where `temp`'s arrow should point after the flip. It starts as `null`, because the first node will become the last one.

```js
reverse() {
  // 1. swap head and tail (temp remembers the old head)
  // 2. prev starts as null, and so does next
  // 3. for each node: next = temp.next, to remember the rest
  // 4.   temp.next = prev: flip the arrow
  // 5.   prev = temp, then temp = next: both move one node on
  // 6. return the list
}
```

```viz
linked-list-reverse-plan
```

**What just happened:** after the swap, `temp` sat on Ana with `prev` on `null`. `next` grabbed Ben, Ana's arrow flipped to `null`, and that opened a gap between Ana and Ben. But `next` was still holding Ben, so `prev` moved to Ana and `temp` crossed the gap to Ben. After four rounds, every arrow pointed left.

**Common mistake:** flipping first and saving `next` second. After `temp.next = prev`, `temp.next` no longer leads forward, so `next = temp.next` saves the wrong node, and the rest of the line is gone.

## Write the code

Step 4: the swap, then the loop. We know the loop runs once per node, so a `for` loop up to `this.length` fits. The four lines inside it are steps 3 to 5 of the plan, in that order.

Where are the edge cases? They're handled by the same code. With **one guest**, the swap changes nothing, and the loop runs once: Ana's `next` becomes `prev`, which is `null`, just as it was. With an **empty line**, `temp` is `null`, and the loop runs zero times, so `temp.next` is never read.

That's why `next` starts as `null`. A version that starts with `let next = temp.next` reads `temp.next` before the loop, and with an empty line, `temp` is `null`, so it crashes.

```viz
trace-ll-reverse
```

**What just happened:** with 4 guests, the swap put `head` on Dev and `tail` on Ana, then each round saved `next`, flipped `temp`'s arrow back to `prev`, and moved both forward. After the last round, `temp` and `next` were `null` and `prev` was on Dev, the new first node. With 1 guest, one round changed nothing. With 0 guests, the loop never ran.

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

  reverse() {
    let temp = this.head
    this.head = this.tail
    this.tail = temp
    let prev = null
    let next = null
    for (let i = 0; i < this.length; i++) {
      next = temp.next
      temp.next = prev
      prev = temp
      temp = next
    }
    return this
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
console.log(line.reverse().toArray().join(' -> ')) // Dev -> Cleo -> Ben -> Ana
console.log(line.head.value, line.tail.value) // Dev Ana
console.log(new LinkedList().reverse().length) // 0: the empty line is fine
```

**Common mistake:** writing the four loop lines in another order. Each line needs the one before it: `next` must be saved before the flip, and `prev` must move before `temp` does, or `prev` would land on the wrong node.

## Look back

Step 5: the Big O, one refactor, and the whole module in one table.

**Big O:** reverse visits each node once: **O(n) time**. It uses three extra pointers whatever the length of the line, and no new nodes: **O(1) space**. That's the answer interviewers look for. Building a reversed copy is also O(n) time, but it needs O(n) extra space for the new nodes.

**A refactor:** the loop could run `while (temp !== null)` instead of counting to `this.length`. Both stop after the last node. The `while` version doesn't depend on `length` being correct, which is a nice property if you ever reuse this loop on a chain of nodes that doesn't have a `length`, as many interview problems do.

**The whole `LinkedList` class**, with every method you've built in this module:

| Method                 | What it does                    | Big O (time) |
| ---------------------- | ------------------------------- | ------------ |
| `constructor(value)`   | starts empty, or with one guest | O(1)         |
| `push(value)`          | adds at the back                | O(1)         |
| `pop()`                | removes from the back           | O(n)         |
| `unshift(value)`       | adds at the front               | O(1)         |
| `shift()`              | removes from the front          | O(1)         |
| `get(index)`           | finds the node at an index      | O(n)         |
| `set(index, value)`    | changes the value at an index   | O(n)         |
| `insert(index, value)` | adds at an index                | O(n)         |
| `remove(index)`        | removes at an index             | O(n)         |
| `reverse()`            | flips the whole list in place   | O(n)         |

Every row matches the costs you predicted in lesson 2, before writing a single method. The interview problems for this module, coming with the next section of the course, use these same pointer moves: finding the middle node, spotting a cycle, reversing part of a list.

**Common mistake:** memorizing reverse line by line. In an interview, you'll be asked to explain it. Remember the idea instead, a gap opens with every flip and `next` holds the far side, and you can rebuild the four lines from it.
