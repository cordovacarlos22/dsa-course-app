---
title: What is a linked list?
order: 1
minutes: 13
---

> **Goal:** know what a linked list is, how it's different from an array, and name its parts: nodes, `next`, `head`, `tail` and `null`.

## No indexes, and not side by side

Until now you've used the data structures JavaScript hands you for free: arrays and objects. From this module on, you **build your own**. The first one is the **linked list**, and the best way to understand it is to put it next to the structure it always gets compared to: the array.

An array has two features you've been relying on, maybe without noticing. First, every item has an **index**: `guests[0]`, `guests[1]`, `guests[2]`. Second, the items are stored **side by side in memory**, in one unbroken block (the technical word is **contiguous**). Those two facts work together. Because the block has no gaps and every slot is the same size, the computer finds `guests[2]` with one bit of arithmetic: the start of the block, plus 2 slots. That's why reading an array by index is O(1).

A linked list gives up both. Its items have **no indexes**, and they **aren't stored side by side**: each one can sit anywhere in memory, wherever there happened to be free space when it was created. So how do you get from one item to the next? Each item keeps a **pointer** to the item after it. You met pointers in the Classes & Pointers module, and a linked list is really just a chain of them.

```viz
array-vs-linked-list
```

**What just happened:** the array kept its four guests in one block, slots 4 to 7, and could find `guests[2]` by counting from the start of that block. The linked list put the same four guests in slots 2, 9, 5 and 11, in no particular order. What holds them together is that each one remembers the slot of the next one. When we draw the list as a chain, those memories become the arrows.

Here's a tiny linked list built by hand from plain objects, so you can see both ideas in code. (Lesson 3 takes this apart piece by piece.)

```js-run
const line = {
  value: 'Ana',
  next: { value: 'Ben', next: { value: 'Cleo', next: null } },
}

console.log(line[2]) // undefined: there are no indexes
console.log(line.next.next.value) // 'Cleo': follow the links instead
```

**Under the hood:** every time your code creates an object, the JavaScript engine finds a free spot for it in a big area of memory called the **heap**. Objects made at different moments land wherever there's room, so the nodes of one list usually end up scattered. That's why a node has to remember where the next one is: nothing else knows. It also means each node costs a little more memory than an array slot, because it stores a pointer next to its value.

**Common mistake:** typing `list[2]` out of habit. A linked list has no index to jump to. To get the third guest, you start at the first one and follow two links.

## Head, tail and null

Each item in a linked list is called a **node**. A node holds two things: a **value** (for us, a guest's name) and a pointer called **`next`**, which points to the node that comes after it. The story for this module is a **conga line**: every guest holds on to the next guest in line, and nobody needs a number to know where they are.

The list itself keeps two more pointers. **`head`** points to the first node, the front of the line. **`tail`** points to the last node, the back of the line. With `head` alone you can reach every node, by following `next` again and again. `tail` is a shortcut: it gets you to the end of the line without walking the whole thing.

And the last node? Its `next` has nobody to point to, so it holds **`null`**. That `null` is how you know you've reached the end. A list built this way is called **null-terminated**, because it ends in `null`.

```viz
linked-list-anatomy
```

**What just happened:** we gave every part of the list a name. Each box is a node, with a value and a `next` pointer. `head` sits on Ana, the first node, and `tail` sits on Dev, the last one. Dev's `next` is `null`, and that marks the end of the line.

```js-run
const dev = { value: 'Dev', next: null }
const cleo = { value: 'Cleo', next: dev }
const ben = { value: 'Ben', next: cleo }
const ana = { value: 'Ana', next: ben }

const head = ana
const tail = dev

console.log(head.value) // 'Ana': the front of the line
console.log(tail.value) // 'Dev': the back of the line
console.log(tail.next) // null: nothing after the tail
console.log(head.next.value) // 'Ben': one link from the front
console.log(head === ana) // true: head is a pointer to Ana's node
```

Before you run the next snippet, predict what each line prints. Count the links from `head` for each one.

```js-run
const dev = { value: 'Dev', next: null }
const cleo = { value: 'Cleo', next: dev }
const ben = { value: 'Ben', next: cleo }
const head = { value: 'Ana', next: ben }

console.log(head.next.next.value) // two links from the front
console.log(head.next.next.next === dev) // three links: is it the tail?
console.log(head.next.next.next.next) // one link past the tail
```

**What just happened:** two links from Ana reached Cleo. Three links reached Dev's node, the very same object as `dev`, so the comparison was `true`. One more link read Dev's `next`, which is `null`: the end of the line.

Notice that `head` and `tail` aren't nodes. They're **pointers to nodes**, just like the variables from the pointers lesson: `head` and `ana` are two names for the same object.

**Under the hood:** why `null` and not `undefined`? Both mean "nothing", but JavaScript gives you `undefined` when something was **never set**, like a property you forgot to write. `null` is the one you set **on purpose**. So a `next` of `null` says "this node has no next guest, and that's deliberate", while an `undefined` `next` usually means a bug. Checking `current !== null`, as every walk in this module does, only works if the end of the line really is `null`.

**Common mistake:** thinking the tail's `next` loops back to the first node. In every list in this module, the last node's `next` is `null`. (Lists whose last node points back to the first one do exist: they're called circular lists, and they're a different structure.)

## What you'll build in this module

Why go to all this trouble when arrays already exist? Because linked lists shine exactly where arrays struggle: adding and removing at the **front**. To put a guest at index 0, an array has to move every other guest over by one (you saw that re-indexing in the Big O module). A linked list just makes a new node and points it at the old first node, and nobody else moves. A linked list also grows one node at a time, so it never needs one big unbroken block of memory.

You'll find linked lists in real software, usually tucked inside something else: a queue of songs to play next, a line of print jobs waiting for the printer, the history behind an undo button. Stacks and queues, later in this section, are often built as linked lists, and trees and graphs use the very same idea of nodes and pointers. Get comfortable with linked lists now, and the rest of the Data Structures section gets much easier.

In this module you'll build a `LinkedList` class from scratch, one method per lesson: the same class you previewed in the Classes & Pointers module. Every method lesson follows the **5 steps** from A Problem-Solving Approach: understand what the method does, try examples (an empty list, one node, many nodes), break it down into steps, write the code, and look back at its Big O.

```viz
list-class-preview
```

**What just happened:** the preview ran the methods you're about to write. The constructor starts the line, `push` and `unshift` add a guest at the back and the front, `insert` and `remove` work at an index, and `pop` and `shift` take a guest off either end. In the next lesson, before you write any of them, you'll work out what each one costs.

**Under the hood:** JavaScript has no built-in linked list. Arrays come with the language, written by the people who built the engine, but a linked list in JavaScript is always one somebody wrote out of objects and pointers, exactly as you're about to do. Other languages ship one in their standard library, and inside, it's the same nodes and `next` pointers.

**Common mistake:** deciding that linked lists are simply "better" than arrays. They're faster at some jobs and slower at others, and the next lesson puts numbers on both.

## Following the links

Without indexes, how do you say "the 4th guest"? You count **links**. The guest at position 0 is the node `head` points to. Position 1 is one link away: `head.next`. Position 2 is two links away: `head.next.next`. In general, the node at position k is **k links from `head`**. The positions aren't stored anywhere: they're just how many times you followed `next`.

Typing `.next` four times works for a tiny list, but not for position 57. So you follow the links in a **loop**, moving a pointer one node at a time. Lesson 3 turns this into the walk that almost every method in this module uses. For now, here's the idea in its smallest form:

```js-run
const head = {
  value: 'Ana',
  next: { value: 'Ben', next: { value: 'Cleo', next: { value: 'Dev', next: null } } },
}

// the guest at position 3: follow next 3 times
let current = head
for (let i = 0; i < 3; i++) {
  current = current.next
}
console.log(current.value) // 'Dev'

// following one link too many reaches null
let past = head
for (let i = 0; i < 4; i++) {
  past = past.next
}
console.log(past) // null: there's no guest at position 4
```

**What just happened:** the loop moved `current` forward 3 times, from Ana to Ben, Cleo and finally Dev, so position 3 is Dev. The second loop moved 4 times and ended on `null`, the end marker. Reading `past.value` there would crash, because `null` has no properties: that's why every method you write checks for `null` before it reads a node.

**Big O:** reaching position k takes k steps, so in a list of n guests, reaching a guest is **O(n)** in the worst case (the last one). The pointers themselves, `head`, `tail` and one `next` per node, take **O(n) space** in total, one per guest.

**In short:** a linked list is a chain of nodes. Each node has a value and a `next` pointer, `head` and `tail` point to the two ends, and the last node points to `null`. There are no indexes, so reaching a node means following links from `head`.

**Common mistake:** counting positions from 1. Like array indexes, positions in a linked list start at 0: the node `head` points to is position 0, so position 3 is the **4th** guest.
