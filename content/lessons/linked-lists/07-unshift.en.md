---
title: 'unshift: add a guest at the front'
order: 7
minutes: 12
---

> **Goal:** write `unshift`, the method that adds a node at the front of the list, and see why it's O(1) here when it's O(n) on an array.

## Understand: what unshift does

A guest arrives and goes straight to the **front** of the conga line. That's **`unshift`**, the mirror image of push. Step 1: what goes in, what comes out, what changes.

- **What goes in:** one value: `line.unshift('Zoe')`.
- **What changes:** a new node holding that value goes **before the first node**. `head` moves onto the new node, because it's the new first guest. `length` goes up by 1. `tail` doesn't move (unless the list was empty).
- **What comes out:** the list itself, `this`, just like our push.

This is the operation where linked lists beat arrays. An array's `unshift` has to move every item over one place and give it a new index: O(n). A linked list just points the new node at the old first node and moves `head`. Nobody else in the line moves at all.

```viz
linked-list-unshift
```

**What just happened:** the line was Ana, Ben, Cleo. `unshift('Zoe')` put a node for Zoe in front of Ana, `head` moved to Zoe, and the length went from 3 to 4. `tail` stayed on Cleo. Then the whole list was returned.

**Common mistake:** expecting `unshift` to return the new length. An array's `unshift` does, but ours returns the list, so it can be chained like push.

## Examples: empty, one guest, many guests

Step 2: the same three examples as push.

**Many guests:** Zoe's node points to Ana (where `head` is), then `head` moves to Zoe. Two pointer moves. **One guest:** exactly the same. Zoe points to Ana, `head` moves to Zoe, and `tail` stays on Ana, who is still the last guest. **An empty line:** the new guest is the first and the last, so `head` and `tail` both point to the new node, just like push on an empty line.

```viz
linked-list-unshift-examples
```

**What just happened:** with an empty line, both `head` and `tail` took Zoe's node. With one guest and with three, Zoe was linked in front and only `head` moved.

Compare with arrays. Run this and look at what each call returns:

```js-run
const guests = ['Ana', 'Ben', 'Cleo']
console.log(guests.unshift('Zoe')) // 4: an array's unshift returns the new length
console.log(guests) // every guest moved over one place to make room

const empty = []
empty.unshift('Zoe')
console.log(empty) // Zoe is first and last
```

**Common mistake:** forgetting `tail` on an empty list. If unshift only moves `head`, an empty list ends up with `head` on the new node and `tail` still `null`, and the next `push` crashes on `this.tail.next`.

## Break it down

Step 3: the plan. It has the same shape as push, with the work moved to the other end:

```js
unshift(value) {
  // 1. make a new node with the value
  // 2. if the list is empty: head and tail both point to the new node
  // 3. otherwise:
  //    a. the new node's next points to the first node (where head is)
  //    b. head moves to the new node
  // 4. add 1 to length
  // 5. return the list (this)
}
```

The order of 3a and 3b matters, and this is the warning from the pointers lesson coming true. `head` is the **only** thing pointing to the first node. Link the new node to it first, while `head` still points there. If you move `head` first, nothing points to Ana anymore, and the whole line is lost.

```viz
linked-list-unshift-plan
```

**What just happened:** the new node for Zoe was made, the line wasn't empty, Zoe's `next` was pointed at Ana, and only then did `head` move to Zoe. The length went up and the list was returned. On an empty line, step 2 would have done the whole job.

**Common mistake:** writing step 3b before 3a. `this.head = nodeToAdd` first, then `nodeToAdd.next = this.head`, points the new node at **itself**. Ana, Ben and Cleo have nothing pointing to them, and the garbage collector takes them.

## Write the code

Step 4: the common case first. With guests in line, it's the two moves from step 3, then the length and the return:

```js
unshift(value) {
  const nodeToAdd = new Node(value)
  nodeToAdd.next = this.head
  this.head = nodeToAdd
  this.length++
  return this
}
```

Then the edge case. On an empty list this version doesn't crash (the new node's `next` just becomes `null`), but it leaves `tail` as `null`. So add the same `if (!this.head)` as push, pointing both `head` and `tail` at the new node, and move the two lines into the `else`.

```viz
trace-ll-unshift
```

**What just happened:** with 3 guests, the `else` pointed Zoe at Ana, then moved `head` to Zoe. With an empty line, the `if` pointed `head` and `tail` at Zoe. No loop either way: unshift never walks the line.

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

  unshift(value) {
    const nodeToAdd = new Node(value)
    if (!this.head) {
      this.head = nodeToAdd
      this.tail = nodeToAdd
    } else {
      nodeToAdd.next = this.head
      this.head = nodeToAdd
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
line.unshift('Cleo')
line.unshift('Ben')
line.unshift('Ana')
console.log(line.toArray().join(' -> ')) // Ana -> Ben -> Cleo
console.log(line.head.value, line.tail.value) // Ana Cleo: Cleo came first, so Cleo is at the back
```

**Common mistake:** expecting unshifted guests to come out in the order you added them. Each unshift goes in **front** of the last one, so adding Cleo, Ben, Ana in that order gives Ana, Ben, Cleo.

## Look back

Step 5: the Big O, and a refactor.

**Big O:** one new node and two pointer moves, however long the line is: **O(1) time** and **O(1) space**. On an array, `unshift` is **O(n)**, because every item moves over and gets a new index. This, and `shift` in the next lesson, are the two rows of lesson 2's table that linked lists win.

**A refactor:** just like push, both branches end with the same line, `this.head = nodeToAdd`. Move it out of the `if`:

```js
unshift(value) {
  const nodeToAdd = new Node(value)
  if (!this.head) {
    this.tail = nodeToAdd
  } else {
    nodeToAdd.next = this.head
  }
  this.head = nodeToAdd
  this.length++
  return this
}
```

Put this next to push's refactor and you can see the two methods are mirror images: push always moves `tail` and only sets `head` on an empty list, while unshift always moves `head` and only sets `tail` on an empty list.

```js-run
// Adding 1,000 guests at the front: count the moves each one makes.
const sizes = [10, 1000]
for (let i = 0; i < sizes.length; i++) {
  let arrayMoves = 0
  let listMoves = 0
  for (let k = 0; k < sizes[i]; k++) {
    arrayMoves = arrayMoves + k // an array moves every guest already in line
    listMoves = listMoves + 2 // a linked list makes two pointer moves
  }
  console.log(sizes[i] + ' guests: array ' + arrayMoves + ' moves, linked list ' + listMoves)
}
```

**Common mistake:** thinking unshift is fast because the code is short. Short code can still be slow (a short line that calls `guests.unshift` in a loop is O(n²) on an array). What makes ours O(1) is that it never touches any node except the new one and the old first one.
