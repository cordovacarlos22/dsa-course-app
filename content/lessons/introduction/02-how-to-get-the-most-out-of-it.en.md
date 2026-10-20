---
title: Getting the most out of this course
order: 2
minutes: 8
---

> **Goal:** understand why the course starts with Big O, why classes and pointers come before the data structures, and build a study routine that works.

## "Can I skip straight to the code?"

Some people only want to write code and skip anything that sounds like theory. You can: the Data Structures section is right there in the course map. But two short topics make everything in it easier: **Big O**, which comes next, and **classes and pointers**, which open that section. This step is about the first one.

**Big O** is how programmers describe the **efficiency** of code. Not in seconds, which change from computer to computer, but in how the amount of work grows as the input grows. Here's a situation where that matters. You're building an app, and the most important thing it does is **remove the last item** from a list, thousands of times per second. You could store the list as a **singly linked list**, where each item only knows the item after it, or as a **doubly linked list**, where each item knows the one before it too. Which one should you pick?

The doubly linked list is _much_ faster at this exact job. The animation below shows why the singly linked list struggles. You don't need to understand every line yet; you'll build this in the Linked Lists module.

```viz
linked-list-cost-end
```

**What just happened:** adding Eve at the end took two moves, because `tail` already pointed at the last guest. But removing Eve meant moving `tail` back to Dev, and in a singly linked list nothing points back from Eve. So the code walked the whole line from the front to find the guest before the tail. With 4 guests that's a short walk; with 4,000 it's a long one. A doubly linked list would step back from the tail in one move. Big O is the language for exactly this difference: one version does the same small amount of work every time, the other does more work the longer the list gets.

Run this to see how the walk grows with the size of the list:

```js-run
// A singly linked list can only be walked forward, from the front.
// To remove the last guest, you first have to reach the guest before it.
const sizes = [4, 400, 4000]
for (let k = 0; k < sizes.length; k++) {
  let steps = 0
  for (let i = 0; i < sizes[k] - 2; i++) {
    steps++
  }
  console.log(sizes[k] + ' guests: ' + steps + ' steps to reach the second-to-last guest')
}
```

There are three reasons to learn Big O first:

1. **Every topic uses it.** For each data structure and algorithm in this course, we'll ask, "What's its Big O?", and the quizzes ask it too.
2. **It helps you choose.** Picking the right data structure for a job, like the linked list above, means comparing their Big O.
3. **Interviews always ask about it.** In a coding interview, you'll almost certainly be asked for the Big O of your solution.

**Common mistake:** skipping Big O because it has a little math in it. Every module after it uses Big O to explain _why_ one method is fast and another is slow. Without it, you'd have to memorize those answers instead of working them out.

## Why classes and pointers matter

Every data structure in this course is built as a **class**. A class is a blueprint: it describes the data each object holds and the **methods** (functions) that work with that data. A linked list, for example, is a `LinkedList` class with methods like `push` and `pop`, and every list you make with it gets those methods. So you need the basics of classes before you build one, and that's why the Data Structures section opens with a short Classes & Pointers module, just two lessons long.

**Pointers** are the other key idea, and they trip up a lot of people. When a variable holds an object, it doesn't hold a copy of the object: it holds a **reference**, an arrow to where the object lives. In this course we call a variable like that a **pointer**. Pointers can be moved to point at a different object, and two pointers can point at the same object.

Here's where that matters. Look at the labels in this linked list:

```viz
linked-list-anatomy
```

**What just happened:** each box is a **node**, holding a value and a `next` pointer to the node after it. `head` and `tail` sat **above** the boxes, pointing down at the first and the last node. They aren't nodes themselves. They're variables that point to nodes.

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

Notice that `head` never moved: it still points to the first node. Only `tail` moved, because `tail` is a pointer, and pointers can be moved to a different node. You'll learn exactly how this works in the Classes & Pointers module.

**Common mistake:** looking at a linked list diagram and calling the first box "head" and the last box "tail". In fact, `head` and `tail` are **not** the boxes (the nodes). They are **variables that point to** nodes. It just happens that `head` points at the first one right now, and that can change.

## Your study routine

The fastest way to learn DSA is to **practice right after you learn**. Reading a solution feels like understanding it, but the real test is writing it yourself while the idea is still fresh. Each time you pull an idea back out of your memory, by answering a question or writing code, it gets easier to remember next time. That's why every step in this course ends with a check, and why each module ends with practice.

Everything happens right here in the browser, so there's nothing to download or set up. Here's the routine:

1. Read the lesson and play with every animation and code box. Change the code and run it again.
2. At the end of the module, take the **quiz** on the module page.
3. Then do the **exercises**. **Build it** exercises have you write the module's code yourself, one method or step at a time, and **Interview problems** use the topic on a LeetCode-style problem. Write the code yourself, even if it feels slow at first. Each exercise checks your code with tests, gives a hint after a failed try, and shows how long you took.

Each exercise comes with starter code, so you skip the setup and spend your time on the one idea the module taught. Do them as soon as you finish the module, not "later".

**Common mistake:** saving all the practice for the end of the course. A little practice after each module sticks much better than a lot of practice months later. And when you're stuck, try the hint before you reveal the answer: the struggle is part of how it sticks.

In short:

- **Big O** is how we compare code. Every topic uses it, it helps you choose data structures, and interviews ask about it.
- Every data structure is a **class**.
- `head` and `tail` are **pointers** to nodes, not the nodes themselves.
- Practice right after each module: the quiz, then the exercises.

When you finish this module, the **Module 1 quiz** is waiting on the module page.
