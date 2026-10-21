---
title: 'Under the hood: nodes are objects'
order: 3
minutes: 12
---

> **Goal:** see what a linked list really is in JavaScript (objects inside objects), and walk one from `head` to `null`.

## A node is the whole object

So far we've drawn nodes as boxes with arrows. That picture is for us humans: it's easy to read. But what is a node actually made of, in code?

It's tempting to say a node is its value, like `'Dev'`. It isn't. A node is the **whole thing**: the value **and** the `next` pointer, together. In JavaScript that's an **object** with two properties:

```js
{ value: 'Dev', next: null }
```

That's all a node needs. `value` holds the data, and `next` holds the pointer to the following node, or `null` when there isn't one. Why an object? Because, as you saw in the pointers lesson, a property can hold a **reference** to another object. That reference, stored in `next`, is the arrow in our drawings.

```viz
linked-list-node
```

**What just happened:** we took Dev's node out of the line and looked at its two parts. The value is `'Dev'`. The pointer is `next`, which is `null` because Dev is last. Together they make one object, and that object is the node.

```js-run
const dev = { value: 'Dev', next: null }
console.log(dev) // the whole node: value and next
console.log(dev.value) // 'Dev': only the value
console.log(dev.next) // null: Dev doesn't point anywhere yet
```

(The app prints objects in JSON style, with quotes around the property names. It's the same object.)

**Common mistake:** calling the value "the node". `dev.value` is just a string. The node is the object that holds the value and the pointer, and the pointer is what makes it part of a list.

## The list is objects inside objects

How does Cleo's node point to Dev's node? You set Cleo's `next` **equal to Dev's node object**: `cleo.next = dev`. Now `next` holds a reference to Dev's object. If you print Cleo's node, you'll see Dev's entire object **inside** it, because printing follows the reference and shows what it points to.

Do the same for Ben and Ana, and the whole list turns into **nested objects**: Ana's node holds Ben's, Ben's holds Cleo's, and Cleo's holds Dev's. `head` points to the outermost object, Ana's node. `tail` points to the innermost one, Dev's node, and one way to point it there is `tail = cleo.next`, since Cleo's `next` already points to Dev.

Remember from the pointers lesson: `cleo.next = dev` copies the **arrow**, not the object. There's only one Dev node, and both `cleo.next` and the variable `dev` point to it. So the nesting doesn't waste memory: nothing gets copied, each node exists exactly once, and the "inside" you see when printing is just arrows being followed.

```viz
linked-list-nested
```

**What just happened:** we built the list from the back. Dev's node came first, then Cleo's `next` was pointed at it, then Ben's at Cleo's, then Ana's at Ben's. In code, each new node wraps around the ones after it. `head` ended up on the outside and `tail` on the inside, and the boxes and arrows above are the same list as the nested objects below.

```js-run
const dev = { value: 'Dev', next: null }
const cleo = { value: 'Cleo', next: null }
const ben = { value: 'Ben', next: null }
const ana = { value: 'Ana', next: null }

cleo.next = dev // Cleo's node points to Dev's node
ben.next = cleo
ana.next = ben

const head = ana
const tail = cleo.next // the same object as dev

console.log(head) // nested: Ana holds Ben, Ben holds Cleo, Cleo holds Dev
console.log(tail === dev) // true: one object, two pointers
console.log(head.next.next.next === tail) // true

dev.value = 'Devon'
console.log(head.next.next.next.value) // 'Devon': there's only one Dev node
```

**Common mistake:** thinking `cleo.next = dev` stores a copy of Dev's node. It stores a reference, so a change made through `dev` shows up when you reach the same node through the list, like `'Devon'` above.

## Walking the list

Almost every method you'll write in this module (pop, get, set, insert, remove, reverse) has to reach nodes in the middle of the line. They all do it with the same loop, called **walking** (or **traversing**) the list:

1. Make a pointer called `current` (the node you're on right now) and start it where `head` points.
2. While `current` isn't `null`, do whatever you need with `current`'s node, then move it forward: `current = current.next`.
3. When `current` becomes `null`, you've just stepped past the last node, so the walk is over.

Why use `current` instead of moving `head`? Because `head` is the only thing that points to the front of the line. If you move `head` forward, the nodes behind it have nothing pointing to them, and they're lost for good. So `head` stays where it is, and `current` does the walking. And why a `while` loop instead of a `for` loop? Because a walk doesn't count up to a number: it stops when it reaches `null`, which is exactly what the null at the end of the list is for.

```viz
trace-ll-walk
```

**What just happened:** `current` started on Ana, where `head` points. Each time around the loop, it greeted the guest it was on and then moved forward with `current = current.next`. After the last guest, `current` became `null`, and the condition `current !== null` ended the loop. With an empty line, `head` was already `null`, so the loop never ran. Pick 5 guests and count: the walk visits each node exactly once.

```js-run
const head = {
  value: 'Ana',
  next: { value: 'Ben', next: { value: 'Cleo', next: null } },
}

let current = head
while (current !== null) {
  console.log('Hi, ' + current.value + '!')
  current = current.next
}
console.log(head.value) // still 'Ana': head never moved
```

**The Big O of a walk:** it visits every node once, so it's **O(n) time**. It only needs one extra pointer, `current`, however long the line is, so it's **O(1) extra space**. That's the cost hiding inside pop, insert, remove and finding a node, from the last lesson.

**Common mistake:** forgetting `current = current.next`. Then `current` never changes, the condition never becomes false, and the loop runs forever (the app stops it after 2 seconds). Another one: writing `while (current.next !== null)` when you mean to visit every node. The loop stops with `current` **on** the last node, before its body runs for it, so the last guest never gets greeted. It also crashes on an empty list, because reading `next` from `null` is an error.
