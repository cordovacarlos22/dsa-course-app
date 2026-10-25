---
title: 'push: add a guest at the back'
order: 5
minutes: 16
---

> **Goal:** write `push`, the method that adds a node to the end of the list, with the 5 steps: understand, examples, break it down, write the code, look back.

## Understand: what push does

A new guest shows up and joins the back of the conga line. That's **`push`**. Step 1 of the 5 steps is to say exactly what goes in, what comes out, and what changes.

- **What goes in:** one value, the new guest's name: `line.push('Dev')`.
- **What changes:** a new node holding that value is added **after the last node**. `tail` moves onto the new node, because it's the new last guest. `length` goes up by 1. `head` doesn't move (unless the list was empty, as you'll see in the examples).
- **What comes out:** our `push` returns **`this`**, the list itself. `this` is the particular list you called `push` on, not some other list, so you can keep using it right away.

The name comes from arrays, and the job is the same: add at the end. The return value is different, though. An array's `push` returns the new length. Ours returns the list, and the last step of this lesson shows why that's handy.

```viz
linked-list-push
```

**What just happened:** the line had three guests. `push('Dev')` added a node for Dev after Cleo, `tail` moved onto Dev, and the length went from 3 to 4. Then `push` handed back the whole list.

Here's how `push` will be used once it's written. (It's a plain code block, not a runnable one, because `push` doesn't exist yet.)

```js
const line = new LinkedList('Ana')
line.push('Ben') // Ana -> Ben
line.push('Cleo') // Ana -> Ben -> Cleo
line.tail.value // 'Cleo'
line.length // 3
```

**Under the hood:** `return this` hands back a **reference** to the same list, not a copy. So `line.push('Dev') === line` is `true`: whatever you call next on the result runs on `line` itself.

**Common mistake:** expecting `push` to return the new length, like an array's `push`. Our linked list's `push` returns the list (`this`). If you need the length, read `line.length`.

## Examples: empty, one guest, many guests

Step 2: try examples, from the easiest to the strange ones, and watch what has to happen in each.

**Many guests** is the main case. Say the line is Ana, Ben, Cleo, and Dev arrives. Two pointer moves do it: the last node's `next` points to Dev's node, and then `tail` moves to Dev. **One guest** works the same way: Ana's `next` points to Ben, and `tail` moves to Ben. `head` stays on Ana in both.

**An empty line** is different, and it's the case beginners forget. There's no last node, so there's no `next` to point at the new node. `tail` is `null`, and writing `this.tail.next = …` when `tail` is `null` crashes the program. In an empty line, the new guest is the **first and the last** guest at the same time, so **both `head` and `tail` point to the new node**.

```viz
linked-list-push-examples
```

**What just happened:** with an empty line, `push('Ana')` pointed `head` and `tail` at Ana's node. With one guest and with three guests, it linked the new node after the tail and moved `tail`, and `head` didn't move.

You can see the crash for yourself. Run this, and read the error:

```js-run
const nodeToAdd = { value: 'Ana', next: null }
let tail = null // an empty list has no last node

console.log('Linking the new node after the tail...')
tail.next = nodeToAdd // there's no node here to set next on
```

That `TypeError` is what a `push` without an empty-list check would do the first time it's used on an empty list.

**Under the hood:** every method in this module keeps three facts in agreement: `head` is `null` exactly when `tail` is `null`, and exactly when `length` is 0. The empty-list example is where that agreement is easiest to break, which is why it comes first.

**Common mistake:** testing only with a list that already has guests. The empty list is the first example to try, because it's the one that crashes.

## Break it down

Step 3: the plan as comments. Check for the empty list first, because that's the case that would crash:

```js
push(value) {
  // 1. make a new node with the value
  // 2. if the list is empty: head and tail both point to the new node
  // 3. otherwise:
  //    a. the last node's next points to the new node
  //    b. tail moves to the new node
  // 4. add 1 to length
  // 5. return the list (this)
}
```

How do you write "the list is empty" in code? You'll often see **`if (!this.head)`**. The `!` operator flips true and false, and `null` counts as false (it's **falsy**), so `!this.head` is `true` exactly when `head` is `null`. In the constructor lesson, `!value` was a trap, because 0 and `''` are falsy too. Here it's safe: `head` is always a node or `null`, never 0.

```viz
linked-list-push-plan
```

**What just happened:** we played the plan on a line of three. The new node was made first. The line wasn't empty, so step 2 was skipped. Cleo's `next` was pointed at the new node, then `tail` moved to it, then the length went up. With an empty line, step 2 alone would have pointed `head` and `tail` at the node.

**Under the hood:** push never sets the new node's `next`. It doesn't have to: the `Node` constructor already started it at `null`, and a node added at the back is the new end of the line. The `Node` class quietly takes care of the end marker.

**Common mistake:** swapping steps 3a and 3b. If `tail` moves first, then `this.tail.next = nodeToAdd` makes the new node point to **itself**, and the old last node, Cleo, still points to `null`. Walking from `head` would never reach Dev. `tail` is your only quick way to the old last node, so use it before you move it.

## Write the code

Step 4: the common case first, then the edge case. With guests already in line, push is the two moves from the plan, then the length and the return:

```js
push(value) {
  const nodeToAdd = new Node(value)
  this.tail.next = nodeToAdd
  this.tail = nodeToAdd
  this.length++
  return this
}
```

That works for one guest and for many, and crashes on an empty list. So add the edge case: an `if (!this.head)` that points `head` and `tail` at the new node, with the two moves going in the `else`. `this.length++` is a short way to write `this.length = this.length + 1`.

```viz
trace-ll-push
```

**What just happened:** with 3 guests, the `if` was false, so the `else` linked Cleo to Dev and moved `tail`. With an empty line, the `if` was true, and `head` and `tail` both took the new node. Either way, there's no loop: push never walks the line.

From now on, our class has a small helper of our own, **`toArray()`**. It's the walk from lesson 3: it visits every node and collects the values into an array, so we can print the whole line in one go.

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

const line = new LinkedList()
line.push('Ana')
line.push('Ben')
line.push('Cleo')
console.log(line.toArray().join(' -> ')) // Ana -> Ben -> Cleo
console.log(line.head.value, line.tail.value, line.length) // Ana Cleo 3
```

**Under the hood:** `this.tail.next = nodeToAdd` and `this.tail = nodeToAdd` look alike but do different jobs, the two from the Under the Hood lesson. The first has a dot before the `=`, so it **changes a node**: the old last node now points to the new one. The second **moves a pointer**: the list's `tail` now points somewhere else.

**Common mistake:** forgetting `this.length++` or `return this`. The list still looks right when you print it, but `length` is wrong, and every method that trusts `length` (you'll write a few) breaks later.

## Look back

Step 5: check the Big O, and look for a clearer way to write it.

**Big O:** push makes one node and moves at most two pointers, whatever the length of the line. That's **O(1) time** and **O(1) space**, the same as an array's `push`. The reason it's O(1) is `tail`: without it, you'd have to walk the whole line to find the last node.

**A refactor:** look at the two branches. Both end by pointing `tail` at the new node (`this.tail = nodeToAdd`). A line that runs in both branches can move out, after the `if`:

```js
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
```

It does exactly the same thing in one line less. Both versions are correct, so pick the one that reads more clearly to you. After any refactor, run the examples again, the empty list first.

**Why `return this` pays off:** because `push` returns the list, you can call another method on the result right away. That's called **chaining**:

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
}

const line = new LinkedList().push('Ana').push('Ben').push('Cleo')
console.log(line.length) // 3
console.log(line.tail.value) // Cleo
```

**Under the hood:** `tail` is a classic trade: the list stores one extra pointer, O(1) more memory, and in return push never walks. You'll see this deal again and again: keep a little extra information so an operation doesn't have to search for it.

**Common mistake:** "simplifying" push by deleting the `if`. Without it, push crashes on the empty list. A refactor has to keep every example working, not just the main one.
