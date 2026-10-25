---
title: 'reverse: turn the line around'
order: 13
minutes: 19
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

**Under the hood:** "in place" is about extra **space**, not about whether anything changes. The list changes completely, but it uses the same n nodes the whole time, plus three pointers. A reversed copy would need n new nodes: O(n) extra space.

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

Before you run this, predict the order it prints. It's reverse's flipping idea with plain objects, using a `while` loop that walks until `null` (the lesson's method counts with a `for` loop instead):

```js-run
let head = { value: 'Ana', next: { value: 'Ben', next: { value: 'Cleo', next: null } } }

let previous = null
let current = head
while (current !== null) {
  const nextNode = current.next // save the far side
  current.next = previous // flip the arrow
  previous = current
  current = nextNode
}
head = previous

let order = ''
let walker = head
while (walker !== null) {
  order = order + walker.value + ' '
  walker = walker.next
}
console.log(order)
```

**What just happened:** each round flipped one arrow, so after three rounds every node pointed to the one that used to come before it. `previous` ended on Cleo, the new first node, and walking from there printed Cleo Ben Ana.

**Under the hood:** an array's `reverse()` is in place too, but it moves **values**: it swaps the first item with the last, the second with the second-to-last, and so on, about n/2 swaps. It can do that because it jumps to any index. A singly linked list can't jump to an index or step back from `tail`, so it does the opposite: every value stays in its node, and the arrows turn around.

**Common mistake:** checking only the many-guests example. The empty line is the one that crashes a careless reverse, as you'll see in step 4.

## Break it down

Step 3: the plan. Swapping `head` and `tail` is the easy part: save `head` in `current`, point `head` at `tail`, then point `tail` at `current`.

The hard part is flipping the arrows. The moment you flip a node's `next` to point backwards, you've let go of the **rest of the line**: nothing points forward to the next node anymore, and there's a **gap**. So before every flip, you need a pointer on the far side of the gap. That's why reverse uses three pointers that walk the line together:

- **`current`**: the node whose arrow you're flipping right now.
- **`nextNode`**: the node after `current`, saved **before** the flip, so the rest of the line isn't lost.
- **`previous`**: the node before `current`, where `current`'s arrow should point after the flip. It starts as `null`, because the first node will become the last one.

```js
reverse() {
  // 1. swap head and tail (current remembers the old head)
  // 2. previous starts as null, and so does nextNode
  // 3. for each node: nextNode = current.next, to remember the rest
  // 4.   current.next = previous: flip the arrow
  // 5.   previous = current, then current = next: both move one node on
  // 6. return the list
}
```

```viz
linked-list-reverse-plan
```

**What just happened:** after the swap, `current` sat on Ana with `previous` on `null`. `nextNode` grabbed Ben, Ana's arrow flipped to `null`, and that opened a gap between Ana and Ben. But `nextNode` was still holding Ben, so `previous` moved to Ana and `current` crossed the gap to Ben. After four rounds, every arrow pointed left.

**Under the hood:** at every moment of the loop, the nodes behind `current` form a finished reversed line that starts at `previous`, and the nodes from `current` on are the untouched rest. Each round moves one node from the rest to the front of the finished part. When `current` reaches `null`, the rest is empty and the whole line is reversed.

**Common mistake:** flipping first and saving `nextNode` second. After `current.next = previous`, `current.next` no longer leads forward, so `nextNode = current.next` saves the wrong node, and the rest of the line is gone.

## Write the code

Step 4: the swap, then the loop. We know the loop runs once per node, so a `for` loop up to `this.length` fits. The four lines inside it are steps 3 to 5 of the plan, in that order.

Where are the edge cases? They're handled by the same code. With **one guest**, the swap changes nothing, and the loop runs once: Ana's `next` becomes `previous`, which is `null`, just as it was. With an **empty line**, `current` is `null`, and the loop runs zero times, so `current.next` is never read.

That's why `nextNode` starts as `null`. A version that starts with `let nextNode = current.next` reads `current.next` before the loop, and with an empty line, `current` is `null`, so it crashes.

```viz
trace-ll-reverse
```

**What just happened:** with 4 guests, the swap put `head` on Dev and `tail` on Ana, then each round saved `nextNode`, flipped `current`'s arrow back to `previous`, and moved both forward. After the last round, `current` and `nextNode` were `null` and `previous` was on Dev, the new first node. With 1 guest, one round changed nothing. With 0 guests, the loop never ran.

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

  reverse() {
    let current = this.head
    this.head = this.tail
    this.tail = current
    let previous = null
    let nextNode = null
    for (let i = 0; i < this.length; i++) {
      nextNode = current.next
      current.next = previous
      previous = current
      current = nextNode
    }
    return this
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

const line = new LinkedList('Ana').push('Ben').push('Cleo').push('Dev')
console.log(line.reverse().toArray().join(' -> ')) // Dev -> Cleo -> Ben -> Ana
console.log(line.head.value, line.tail.value) // Dev Ana
console.log(new LinkedList().reverse().length) // 0: the empty line is fine
```

**Under the hood:** the head-and-tail swap needs a spare variable for the same reason swapping two cups of juice needs a third cup. `this.head = this.tail` would overwrite the only pointer to the old first node, so it's saved in `current` first. That's the classic way to swap two variables: save one, overwrite it, then use the saved copy.

**Common mistake:** writing the four loop lines in another order. Each line needs the one before it: `nextNode` must be saved before the flip, and `previous` must move before `current` does, or `previous` would land on the wrong node.

## Look back

Step 5: the Big O, one refactor, and the whole module in one table.

**Big O:** reverse visits each node once: **O(n) time**. It uses three extra pointers whatever the length of the line, and no new nodes: **O(1) space**. That's the answer interviewers look for. Building a reversed copy is also O(n) time, but it needs O(n) extra space for the new nodes.

**A refactor:** the loop could run `while (current !== null)` instead of counting to `this.length`. Both stop after the last node. The `while` version doesn't depend on `length` being correct, which is a nice property if you ever reuse this loop on a chain of nodes that doesn't have a `length`, as many interview problems do.

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

**Under the hood:** the loop's three pointers (`previous`, `current`, `nextNode`) are a pattern you'll see again: moving a small window of pointers along a chain so you never lose your place. Doubly linked lists, trees and many interview problems use the same "save the far side before you cut" move.

**Common mistake:** memorizing reverse line by line. In an interview, you'll be asked to explain it. Remember the idea instead, a gap opens with every flip and `nextNode` holds the far side, and you can rebuild the four lines from it.
