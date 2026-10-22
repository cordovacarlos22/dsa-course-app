---
title: Linked lists vs arrays in Big O
order: 2
minutes: 14
---

> **Goal:** know the Big O of every linked list operation, see why each one costs what it does, and compare it with the same operation on an array.

## The back of the line: push and pop

Before you write a single method, it pays to know what each one will cost. With linked lists there's a simple way to tell. Count the **pointer moves**, and ask one question: **do I have to walk to get there?** Moving a pointer is one step, so it's O(1). A walk starts at `head` and visits nodes one by one, and a longer line means a longer walk, so it's O(n).

Start with **`push`**, adding a guest at the back. `tail` already points to the last node, so there's no walking at all. Two pointer moves do the whole job: the last node's `next` points to the new node, and then `tail` moves onto the new node. With 4 guests in line or 4,000, it's the same two moves. **`push` is O(1).**

Now **`pop`**, removing the guest at the back. It looks like push in reverse, but it isn't. After the last guest leaves, `tail` has to point to the guest before them. And to point at a node, you need something that already points to it. The only thing pointing to that second-to-last node is the `next` of the node before it, and pointers only go **forward**: from the last node there's no way back. So the only option is to start at `head` and walk until you find the node whose `next` is the tail. **`pop` is O(n).**

```viz
linked-list-cost-end
```

**What just happened:** `push('Eve')` took two moves, with no walking, because `tail` handed us Dev's node right away. `pop()` had to find Dev again, the guest before the tail, and the only way in was from the front: `current` visited Ana, Ben, Cleo and Dev before it could move `tail` back and cut Eve off. In a longer line, that walk would be longer.

Here's the same thing with plain objects. Run it and look at the count:

```js-run
const dev = { value: 'Dev', next: null }
const cleo = { value: 'Cleo', next: dev }
const ben = { value: 'Ben', next: cleo }
const ana = { value: 'Ana', next: ben }
let head = ana
let tail = dev

// push Eve: two pointer moves, however long the line is
const eve = { value: 'Eve', next: null }
tail.next = eve
tail = eve
console.log('Last guest:', tail.value)

// pop Eve: walk from head to the node right before the tail
let current = head
let visited = 1
while (current.next !== tail) {
  current = current.next
  visited++
}
tail = current
tail.next = null
console.log('Last guest:', tail.value, '- nodes visited:', visited)
```

**Common mistake:** assuming `pop` is O(1) because `push` is. The two look like mirror images, but `push` only moves forward from the tail, while `pop` needs the node **behind** the tail, and a singly linked list can't look backwards. (The Doubly Linked Lists module fixes exactly this.)

## The front of the line: unshift and shift

At the front of the line, the story flips. **`unshift`** adds a guest at the front. `head` already points to the first node, so the new node can point where `head` points, with no walking. Then `head` moves onto the new node. Two pointer moves: **`unshift` is O(1).**

**`shift`** removes the guest at the front, and it's even shorter: `head = head.next`. One move, and `head` sits on the second guest. The old first node has nothing pointing to it anymore, and from the pointers lesson you know what happens to an object nothing points to: the garbage collector takes it. **`shift` is O(1).**

This is where linked lists beat arrays. On an array, `unshift` and `shift` are O(n), because every other item has to move over and get a new index. A linked list has no indexes to update, so nothing else has to move.

```viz
linked-list-cost-front
```

**What just happened:** `unshift('Zoe')` made a node for Zoe, pointed it at Ana (the node `head` was already pointing to), and then moved `head` onto Zoe. `shift()` moved `head` back to Ana in one step, and Zoe's node, with nothing pointing to it, was left for the garbage collector.

```js-run
const ben = { value: 'Ben', next: null }
let head = { value: 'Ana', next: ben }

// unshift Zoe: link the new node first, then move head
const zoe = { value: 'Zoe', next: null }
zoe.next = head
head = zoe
console.log(head.value, '->', head.next.value) // Zoe -> Ana

// shift: one pointer move
head = head.next
console.log(head.value) // Ana
```

**Common mistake:** moving `head` before linking the new node. If you write `head = zoe` first, then `zoe.next = head` points Zoe's node at itself, and nothing points to Ana anymore: the rest of the line is lost. Link the new node first, then move `head`.

## The middle: insert, remove and find

Most of the cost of working in the middle of a linked list is getting there. Say you want to **insert** Eve at index 3. A linked list has no index 3 to jump to, so you walk from `head` and count: index 0, 1, 2. You stop at index 2, the node **right before** the spot. Then two pointer moves link Eve in: Eve's `next` points to the node after it, and the node before points to Eve. The moves are O(1), but the walk grows with the line, so **`insert` is O(n).**

**Removing** at an index works the same way. Walk to the node before the one that's leaving, then point it past that node: `current.next = current.next.next`. Nothing points to the removed node anymore, so it's gone. The walk makes **`remove` O(n)** too.

**Finding** a guest is a walk as well. To find Cleo **by value**, you check each node from `head` until one matches: O(n), and that's the same on an array, which also has to check items one by one. But finding the guest **by index** is where arrays win: an array jumps straight to `guests[2]` in O(1), while a linked list still has to walk and count. **Finding by index is O(n)** on a linked list.

```viz
linked-list-cost-middle
```

**What just happened:** to insert Eve at index 3, `current` walked to Cleo at index 2, the node before the spot. Eve was pointed at Dev first, then Cleo was pointed at Eve. To remove index 3, the same walk ended on Cleo, and Cleo was pointed past Eve, straight to Dev.

```viz
linked-list-cost-lookup
```

**What just happened:** finding Cleo by value took 3 node visits, and finding index 2 took the same 3, counting along the way. The array found `guests[2]` with one jump, because its items sit side by side in memory.

Here's a walk to an index next to an array lookup:

```js-run
const head = {
  value: 'Ana',
  next: { value: 'Ben', next: { value: 'Cleo', next: { value: 'Dev', next: null } } },
}

// the guest at index 2: move forward 2 times from head
let current = head
for (let i = 0; i < 2; i++) {
  current = current.next
}
console.log(current.value) // 'Cleo', after walking

const guests = ['Ana', 'Ben', 'Cleo', 'Dev']
console.log(guests[2]) // 'Cleo', in one jump
```

**Common mistake:** walking one node too far before inserting. To put a guest at index 3, stop at index **2**. If you stop on the node at index 3, the node before it is already behind you, and you can't go back to link it.

## Linked lists vs arrays: pick by the job

Put everything side by side and a pattern shows up. Here's every operation from this lesson, for a linked list with `head` and `tail` and for an array:

| Operation                     | Linked list | Array | Faster in   |
| ----------------------------- | ----------- | ----- | ----------- |
| push (add at the end)         | O(1)        | O(1)  | tie         |
| pop (remove from the end)     | O(n)        | O(1)  | array       |
| unshift (add at the front)    | O(1)        | O(n)  | linked list |
| shift (remove from the front) | O(1)        | O(n)  | linked list |
| insert at an index            | O(n)        | O(n)  | tie         |
| remove at an index            | O(n)        | O(n)  | tie         |
| find by index                 | O(n)        | O(1)  | array       |
| find by value                 | O(n)        | O(n)  | tie         |

Neither structure wins every row, so the right question isn't "which one is better?" but "**what will my program do most?**" If you mostly read items by position (guest number 57, the 3rd score), an array's O(1) index lookup is hard to beat. If you mostly add and remove at the front, a linked list does it in O(1) while an array re-indexes everything.

Think of a ticket counter: new guests join at the back, and the guest at the front gets served and leaves. That's `push` plus `shift`. A linked list does both in O(1). An array does `push` in O(1) too, but every `shift` moves the whole line. Lines like this are called **queues**, and you'll build one later in this section.

```viz
linked-list-big-o
```

**What just happened:** the table lit up one group at a time. Half the rows are ties. Arrays win pop and finding by index, thanks to their indexes and their single block of memory. Linked lists win the front of the line, because moving `head` never touches any other node.

**Common mistake:** judging a structure by one operation. Pop is slow on a linked list, but if your program never pops, that doesn't matter. Look at the mix of operations your program does most, then pick.
