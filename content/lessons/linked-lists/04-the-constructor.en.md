---
title: The constructor
order: 4
minutes: 15
---

> **Goal:** write the `Node` class and the `LinkedList` constructor, using the 5 steps: understand, examples, break it down, write the code, look back.

## Understand: what the constructor does

This is the first method of our `LinkedList` class, so let's do it properly, with the 5 steps from A Problem-Solving Approach. **Step 1 is to understand** what the method has to do and what it gives back, before thinking about code.

The constructor runs when someone writes `new LinkedList('Ana')`. Its job is to set up a brand-new list that holds one guest. The list keeps three pieces of data: **`head`** (the first node), **`tail`** (the last node) and **`length`** (how many nodes there are). So after the constructor runs, there should be one node holding `'Ana'`, with `head` and `tail` both pointing to it and `length` set to 1. What does it return? Nothing itself: as you saw in the classes lesson, `new` hands back the finished instance.

Before writing it, notice what the constructor has in common with three methods you'll write soon: `push`, `unshift` and `insert`. All four receive a value, and all four **make a new node** from it. We don't want the same node-making code copied into four methods, so it gets a class of its own: **`Node`**. Each method then makes a node in one line, `new Node(value)`, and the node always comes out the same way: the value, plus a `next` that starts as `null`.

```viz
linked-list-node-class
```

**What just happened:** we lined up the four methods that receive a value. The constructor makes a node for the first guest, and `push`, `unshift` and `insert` each make one before adding it to the line. Four methods, one shared job, so that job moved into the `Node` class.

Here's the plan for both classes, before any real code:

```js
class Node {
  constructor(value) {
    // makes one node: a value and a next pointer
  }
}

class LinkedList {
  constructor(value) {
    // makes a list that starts with one node
  }
  // later: push, pop, unshift, shift, get, set, insert, remove, reverse
}
```

**Common mistake:** putting `value` and `next` on the list itself. The list isn't a node: it **points to** nodes, with `head` and `tail`. Nodes hold values; the list holds the pointers to its two ends, plus the length.

## Examples: one guest, none, and zero

**Step 2 is to explore examples**, including the strange ones, because that's where bugs hide. For every method in this module, try at least an empty list, a list with one node, and a list with many nodes.

The main example is easy. `new LinkedList('Ana')` gives one node holding `'Ana'`, with `head` and `tail` both on it and `length` 1.

What about `new LinkedList()`, with **no value at all**? A constructor that always makes a node would make one holding `undefined`: a guest with no name. Our class does something more useful and starts **empty** instead: `head` and `tail` point to `null`, and `length` is 0. Then you can start an empty line and add guests later with `push`, and the tests in later lessons can make an empty list easily.

And `new LinkedList(0)`? Zero is a **real value**: a list of scores could easily start with 0. It must get a node like any other value. Keep this example in mind, because it catches a very common bug. Finally, **many guests**: the constructor only takes one value, so it makes one node at most. Adding more is `push`'s job, in the next lesson.

```viz
linked-list-constructor-examples
```

**What just happened:** one value gave one node with both pointers on it. No value gave an empty list, with `head` and `tail` on `null` and a length of 0. Zero gave a node, because 0 is a value. And more guests came from `push`, not from the constructor.

How do you tell "no value" apart from 0? Run this:

```js-run
const values = [undefined, 0, '', 'Ana']
for (let i = 0; i < values.length; i++) {
  const value = values[i]
  console.log(String(value), '| missing?', value === undefined, '| !value:', !value)
}
```

**Common mistake:** checking for a missing value with `if (!value)`. As you just saw, `!0` and `!''` are `true`, so a list started with 0 or an empty string would come out empty. Check `value === undefined` instead: only a value that wasn't passed is `undefined`.

## Break it down

**Step 3 is to break it down:** write the steps as comments before writing code. Comments are cheap to change, and they give you a direction to follow.

The `Node` class has two steps: store the value, and start `next` at `null`, because a new node doesn't point to anyone yet. The `LinkedList` constructor has two parts. First, start empty. Then, if a value was given, make the first node and point both ends of the list at it:

```js
class Node {
  constructor(value) {
    // 1. store the value
    // 2. next starts as null: this node doesn't point to anyone yet
  }
}

class LinkedList {
  constructor(value) {
    // 1. start empty: head and tail point to null, length is 0
    // 2. if a value was given:
    //    a. make a new node with it
    //    b. point head at the new node
    //    c. point tail at the same node
    //    d. the length is 1
  }
}
```

Notice step 1: starting from an empty list and then adding a node means the empty case isn't a special path off to the side. It's where every list begins.

```viz
linked-list-constructor-plan
```

**What just happened:** we played the plan with comments only. The list started empty, a new node was made, `head` was pointed at it, then `tail` was pointed at the **same** node, and finally the length became 1.

**Common mistake:** in step c, making a second node for `tail` with `new Node(value)`. That gives you two separate nodes with the same value, `head` on one and `tail` on the other, and the list is broken from the start. One node, two pointers.

## Write the code

**Step 4 is to write the code:** the common case first, then the edge cases. `Node` is two lines, one per comment:

```js
class Node {
  constructor(value) {
    this.value = value
    this.next = null
  }
}
```

For the list, start with the common case, a value that was given. Many linked list constructors stop right here:

```js
class LinkedList {
  constructor(value) {
    const firstNode = new Node(value)
    this.head = firstNode
    this.tail = this.head
    this.length = 1
  }
}
```

`new Node(value)` runs the Node constructor and gives back a node, and `firstNode` points to it. `this.head = firstNode` points the list's `head` at that node. `this.tail = this.head` means "point `tail` wherever `head` points", which is the same node. `this.length = 1` records one guest. Every line uses `this`, because these are properties of **this** list: the one `new` is building.

Now the edge case. Start every list empty, and wrap the common case in `if (value !== undefined)`, so a missing value skips it:

```viz
trace-ll-constructor
```

**What just happened:** with `'Ana'`, the list started empty, the `if` let the value through, the Node constructor made the node, and `head` and `tail` were pointed at it before `length` became 1. With no value, the `if` was skipped, and the list stayed empty. With 0, the `if` let it through, because 0 isn't `undefined`.

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
}

const line = new LinkedList('Ana')
console.log(line)
console.log(line.head === line.tail) // true: one node, two pointers

const empty = new LinkedList()
console.log(empty.head, empty.tail, empty.length) // null null 0
```

**Common mistake:** writing `head = firstNode` without `this.`. Inside a class, that's an error ("head is not defined"), because `head` isn't a variable: it's a property of the list, and the list is `this`.

## Look back

**Step 5 is to look back:** check the Big O, and see if anything could be clearer.

**Big O:** the constructor does the same few assignments whatever the value is, so it's **O(1) time**. It makes one node at most, so it's **O(1) space**. That's the same as making an array with one item, like `['Ana']`.

**One refactor to think about:** `this.tail = this.head` and `this.tail = firstNode` do exactly the same thing. Both point `tail` at the one node that `firstNode` and `head` already point to. Neither makes a copy: from the pointers lesson, `=` with an object copies the arrow, not the object. We'll keep `this.tail = this.head`, because it reads as "the tail starts where the head is", but either one is correct.

**What the empty start means for later:** because our list can be empty, every method from now on has to handle `head === null`. That's why the empty list is always the first example: in `push`, adding to an empty list has to set `head` too, not just `tail`.

```viz
five-steps-look-back
```

**What just happened:** that's the look-back checklist from A Problem-Solving Approach. For a constructor, the questions that matter most are the Big O and whether the code reads clearly, and both are answered above. Here's the refactor, checked in code:

```js-run
class Node {
  constructor(value) {
    this.value = value
    this.next = null
  }
}

const firstNode = new Node('Ana')
const head = firstNode
const tailOne = head // like this.tail = this.head
const tailTwo = firstNode // like this.tail = firstNode
console.log(tailOne === tailTwo) // true: the same node either way
```

**Common mistake:** thinking `this.tail = this.head` makes `tail` follow `head` from now on. It points `tail` at the node `head` points to **right now**. When `push` moves `tail` later, `head` stays put, and the other way around.
