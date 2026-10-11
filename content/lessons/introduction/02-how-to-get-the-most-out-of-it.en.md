---
title: How to get the most out of this course
order: 2
minutes: 6
---

> **Goal:** understand why the course starts with Big O and with classes and pointers, and build a study routine that works.

## "Can I skip straight to the code?"

You can. If you only want to write code, jump to the Linked Lists module. But the next two modules are short, and they make everything after them easier. Here's why.

## Why Big O comes first

Imagine you're building an app, and the most important thing it does is **remove the last item** from a list, thousands of times per second. You could store the list as a **singly linked list** or as a **doubly linked list**. Which one should you pick?

It turns out the doubly linked list is _much_ faster at this exact job. You'll see why in the Doubly Linked Lists module. What matters now is _how_ we'll compare them: with **Big O**, the language programmers use to talk about efficiency.

There are three reasons to learn it first:

1. **Every topic uses it.** For each data structure and algorithm in this course, we'll ask, "What's its Big O?"
2. **It helps you choose.** Picking the right data structure for a job means comparing their Big O.
3. **Interviews always ask about it.** In a coding interview, you'll almost certainly be asked for the Big O of your solution.

## Why classes and pointers come next

Every data structure in this course is built as a **class**. A linked list, for example, is a `LinkedList` class with methods like `push` and `pop`. So you need the basics of classes before we start.

**Pointers** are the other key idea, and they trip up a lot of people. Here's a common mistake: looking at a linked list diagram and calling the first box "head" and the last box "tail". In fact, `head` and `tail` are **not** the boxes (the nodes). They are **variables that point to** nodes.

Run this tiny example. We make one node, point `head` and `tail` at it, then add a second node to the end:

```js-run
const firstNode = { value: 4, next: null }
let head = firstNode
let tail = firstNode
console.log('Do head and tail point to the same node?', head === tail)

// Add a new node to the end of the chain:
const newNode = { value: 7, next: null }
tail.next = newNode // 1. the current last node points to the new one
tail = newNode // 2. tail moves to the new node

console.log('head points to the node with', head.value)
console.log('tail points to the node with', tail.value)
console.log('the node after head has', head.next.value)
```

Notice that `head` never moved: it still points to the first node. Only `tail` moved, because `tail` is a pointer, and pointers can be moved to a different node. You'll learn exactly how this works in Module 3.

## Your study routine

The fastest way to learn DSA is to **practice right after you learn**:

1. Read the lesson and play with every animation and code box. Change the code and run it again.
2. At the end of the module, take the **quiz**.
3. Then do the **timed exercises**. Write the code yourself, even if it feels slow at first.

Don't save all the practice for the end of the course. A little practice after each module sticks much better than a lot of practice months later.

## Recap

- **Big O** is how we compare code. Every topic uses it, it helps you choose data structures, and interviews ask about it.
- Every data structure is a **class**.
- `head` and `tail` are **pointers** to nodes, not the nodes themselves.
- Practice right after each module.

## Check yourself

1. Which is better at removing the last item: a singly or a doubly linked list?
2. In the code above, which line makes the old last node point to the new node?
3. Why is `head` still `4` at the end?

More questions like these are waiting in the **Module 1 quiz**.
