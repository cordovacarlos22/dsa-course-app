---
title: 'pop: remove the guest at the back'
order: 6
minutes: 16
---

> **Goal:** write `pop`, the method that removes the last node and returns it, with two pointers that walk the line together.

## Understand: what pop does

The guest at the back of the conga line leaves. That's **`pop`**. Step 1: what goes in, what comes out, what changes.

- **What goes in:** nothing. `line.pop()` always removes the **last** guest.
- **What changes:** the last node is cut off the end of the list. `tail` moves **back** to the node before it, and that node's `next` becomes `null`, because it's the new end of the line. `length` goes down by 1.
- **What comes out:** the node that was removed, so you know who left (`line.pop().value` is the name). If the list is empty, there's nothing to remove, and `pop` returns `undefined`.

It sounds like push in reverse, and in lesson 2 you saw why it isn't. All the arrows in a linked list point **forward**. Moving `tail` forward was one step, but moving it back means finding the node **before** the last one, and nothing points backwards to it. The only way to reach it is to start at `head` and walk. That walk is why pop is O(n) while push is O(1), and it's the part of this lesson that needs the most care.

```viz
linked-list-pop
```

**What just happened:** the line had four guests. `pop()` cut Dev's node off the end, moved `tail` back to Cleo, and the length went from 4 to 3. Then it returned Dev's node.

**Common mistake:** expecting `pop` to return the value, like an array's `pop`. Ours returns the whole node. The value is one step away: `line.pop().value`.

## Examples: three scenarios

Step 2: examples. pop has **three scenarios**, and the code has to get all three right.

1. **An empty line.** There's nothing to pop, so pop returns `undefined` and changes nothing. (An array does the same: `[].pop()` is `undefined`.)
2. **One guest.** Popping the only guest leaves the line **empty**. So `head` and `tail` must both go back to `null`, and `length` to 0. This is the sneaky one: if `head` and `tail` still point to the node you just removed, the list says it's empty (length 0) but still holds a ghost guest.
3. **Many guests.** The main case: walk to the node before the tail, move `tail` there, and cut the last node off.

```viz
linked-list-pop-examples
```

**What just happened:** the empty line returned `undefined`. The line with only Ana returned Ana's node and went back to `head` and `tail` on `null`. The line of three returned Cleo's node, and `tail` moved back to Ben.

Arrays behave the same way in the first two scenarios, which makes them easy to remember:

```js-run
const nobody = []
console.log(nobody.pop()) // undefined: nothing to pop

const justAna = ['Ana']
console.log(justAna.pop(), justAna.length) // Ana 0: the array is empty now
```

**Common mistake:** handling only the many-guests case. The one-guest case doesn't crash, which makes it worse: it quietly leaves `head` and `tail` pointing at a node that's no longer in the list.

## Break it down

Step 3: the plan. The hard part is the walk, so here's the idea first. Use **two pointers** that walk the line together: **`temp`** goes first, and **`pre`** (short for "previous") stays **one node behind** it. Each time around the loop, `pre` moves to where `temp` is, and then `temp` moves forward one node. When `temp` has no `next`, it's on the last node, and `pre` is on the node right before it: exactly the one `tail` needs.

```js
pop() {
  // 1. if the list is empty, return undefined
  // 2. temp and pre both start at head
  // 3. walk: while temp has a next, pre = temp, then temp moves on
  //    (temp ends on the last node, pre on the one before it)
  // 4. tail moves to pre, and the new tail's next becomes null
  // 5. subtract 1 from length
  // 6. if length is now 0, head and tail become null
  // 7. return temp
}
```

Why `while (temp.next !== null)` and not `while (temp !== null)`, like the walk in lesson 3? Because we want the walk to stop **on** the last node, not after it. (You could also count with a `for` loop up to `this.length`, but the `while` says exactly what we mean: walk until there's no next node.)

```viz
linked-list-pop-plan
```

**What just happened:** on a line of three, `temp` and `pre` started at Ana and walked until `temp` was on Cleo, the last guest, with `pre` on Ben. `tail` moved to Ben, Ben's `next` became `null`, the length dropped to 2, and Cleo's node was returned. Step 6 only did something in the one-guest line: after Ana left, the length was 0, so `head` and `tail` went back to `null`.

**Common mistake:** walking with `while (temp !== null)`. The loop then runs one extra time, `temp` ends on `null`, and `pre` ends on the **last** node instead of the one before it. You've walked right past the node you needed.

## Write the code

Step 4: the common case first, then the edge cases. With two or more guests, the plan's steps 2 to 5 and 7 are the whole method:

```js
pop() {
  let temp = this.head
  let pre = this.head
  while (temp.next !== null) {
    pre = temp
    temp = temp.next
  }
  this.tail = pre
  this.tail.next = null
  this.length--
  return temp
}
```

Now the edge cases. **The empty list:** `temp.next` would crash when `temp` is `null`, so check first, at the top: `if (!this.head) { return undefined }`.

**One guest:** walk through the code above with only Ana in the line. `temp` and `pre` both start on Ana. `temp.next` is already `null`, so the loop never runs. `this.tail = pre` changes nothing (tail was already on Ana), and so does `this.tail.next = null` (it was already `null`). `this.length--` brings the length to 0. And then... `head` and `tail` are **still pointing at Ana**. So right after the decrement, add: if the length is now 0, set `head` and `tail` to `null`. It has to come **after** `this.length--`, because that's when the length becomes 0.

```viz
trace-ll-pop
```

**What just happened:** with 4 guests, `temp` and `pre` walked together until `temp` was on Dev and `pre` on Cleo, then `tail` moved to Cleo and Dev was cut off, after visiting 4 nodes. With 1 guest, the loop didn't run, and only the `length === 0` check emptied the line. With 0 guests, the first `if` returned `undefined` right away.

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
}

const line = new LinkedList('Ana')
line.push('Ben')
console.log(line.pop().value) // Ben: two or more guests
console.log(line.pop().value) // Ana: the only guest
console.log(line.pop()) // undefined: an empty line
console.log(line.head, line.tail, line.length) // null null 0
```

**Common mistake:** putting the `length === 0` check **before** `this.length--`. With one guest, the length is still 1 at that point, so the check is false, and the ghost guest stays in `head` and `tail`.

## Look back

Step 5: the Big O, and one thing to improve.

**Big O:** pop walks the whole line to find the node before the tail, so it's **O(n) time**. It only uses two extra pointers, `temp` and `pre`, however long the line is: **O(1) space**. On an array, `pop` is O(1). This is the one end-of-line operation where arrays win.

**Can we make it O(1)?** You might think: just keep another pointer to the node before the tail. But after one pop, you'd need the node before **that** one, and you'd be walking again. The real fix is to let every node point **backwards** too, with a `prev` pointer next to `next`. Then the node before the tail is always `tail.prev`, one step away. A list like that is a **doubly linked list**, and it's the next module.

**A refactor to consider:** the walk could count instead, with `for (let i = 0; i < this.length - 1; i++)`, since `length` tells you how many moves reach the last node. Both are correct and both are O(n). We keep the `while`, because it states the stopping rule directly, "stop when there's no next node", and it doesn't depend on `length` being right.

```js-run
// How many nodes does pop visit? Count the walk for longer and longer lines.
const sizes = [10, 100, 1000]
for (let i = 0; i < sizes.length; i++) {
  let head = null
  for (let k = sizes[i]; k >= 1; k--) {
    head = { value: 'Guest ' + k, next: head }
  }
  let temp = head
  let visited = 1
  while (temp.next !== null) {
    temp = temp.next
    visited++
  }
  console.log(sizes[i] + ' guests: ' + visited + ' nodes visited')
}
```

**Common mistake:** reaching for a linked list when your program mostly removes from the back. If pop is the job you'll do most, an array (or a doubly linked list) is the better choice.
