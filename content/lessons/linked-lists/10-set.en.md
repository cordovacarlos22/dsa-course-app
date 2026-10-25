---
title: 'set: change the value at an index'
order: 10
minutes: 14
---

> **Goal:** write `set`, the method that changes the value of the node at an index, by reusing `get` instead of writing the walk again.

## Understand: what set does

A guest's name tag has a typo: it says Ben, but it should say Benny. Nobody joins or leaves the line; one node just gets a new value. That's **`set`**. Step 1: what goes in, what comes out, what changes.

- **What goes in:** an index and the new value: `line.set(1, 'Benny')`.
- **What changes:** the **value** of the node at that index. No node is added or removed, so `head`, `tail` and `length` stay exactly as they were.
- **What comes out:** `true` if the change worked, `false` if there's no node at that index. Returning a yes-or-no lets the caller know whether anything happened.

`set` is close to `get`: both go to the node at an index. The only difference is what they do when they get there. `get` hands the node back, and `set` changes its value.

```viz
linked-list-set
```

**What just happened:** `set(1, 'Benny')` went to the node at index 1 and changed its value from Ben to Benny. Same node, same place in the line, new value. It returned `true`.

**Under the hood:** `set` changes the node's `value` and nothing else. The node keeps its place in memory and its `next`, so no arrow anywhere in the list moves. Any other pointer to that node, from a variable or from the node before it, sees the new value right away.

**Common mistake:** thinking `set` adds a guest at that index. It only changes a guest who is already there. Adding a new node at an index is `insert`, two lessons from now.

## Examples: in range, out of range, empty

Step 2: examples. Since `set` goes to an index, its examples are the same as get's.

- **An index that exists:** `set(3, 'Devon')` on four guests changes Dev to Devon and returns `true`.
- **An index that doesn't exist:** `set(9, 'Zoe')` finds no node at index 9, changes nothing and returns `false`. The same goes for negative indexes.
- **An empty line:** no index exists, so every `set` returns `false`.

```viz
linked-list-set-examples
```

**What just happened:** with index 3, Dev's node got the new value Devon, and `set` returned `true`. With index 9 and with an empty line, there was no node to change, so nothing changed and `set` returned `false`.

Arrays let you set by index too, with `guests[1] = 'Benny'`, in O(1). But an array happily writes past the end: `guests[9] = 'Zoe'` makes the array longer and leaves empty slots behind. Our `set` refuses instead and says so with `false`.

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']
guests[1] = 'Benny'
console.log(guests) // Ben's slot now says Benny

guests[9] = 'Zoe'
console.log(guests.length) // 10: the array grew, with empty slots in between
```

Before you run this, predict both lines. It's set's idea with plain objects:

```js-run
const head = { value: 'Ana', next: { value: 'Ben', next: null } }

let target = head.next // like this.get(1)
target.value = 'Benny' // change the node through the pointer
target = { value: 'Zoe', next: null } // move the pointer: the list doesn't notice

console.log(head.next.value)
console.log(target.value)
```

**What just happened:** `target.value = 'Benny'` reached through the pointer and changed Ben's node, which is in the list, so `head.next.value` printed Benny. Pointing `target` at a brand-new object only changed the variable: Zoe never joined the line.

**Under the hood:** returning `true` or `false` is a common way for a method to report "did it work?" when there's nothing useful to hand back. Arrays do it too: `Array.isArray` and `includes` answer yes or no, and so does our `set`.

**Common mistake:** returning nothing. Without `true` or `false`, a caller who tries `set(9, 'Zoe')` can't tell that nothing happened.

## Break it down

Step 3: the plan. Before writing it, notice that steps 1 to 3 of get's plan (check the range, start at head, walk to the index) are exactly what `set` needs. We already have that code, and a method can call another method of the same class with **`this`**: `this.get(index)`. So set's plan is short:

```js
set(index, value) {
  // 1. target = this.get(index): the node, or undefined
  // 2. if target is a node: change its value, return true
  // 3. otherwise, return false
}
```

How does step 2 tell "a node" apart from `undefined`? With `if (target)`. A node is an object, and objects are **truthy**. `undefined` is **falsy**. So `if (target)` runs exactly when `get` found a node. (Unlike `if (!value)` in the constructor, this is safe: `get` only ever returns a node or `undefined`.)

```viz
linked-list-set-plan
```

**What just happened:** `this.get(1)` did all the finding and handed back Ben's node. The node was truthy, so its value changed to Benny, and `set` returned `true`. With index 9, `get` returned `undefined`, the `if` was skipped, and `set` returned `false`.

**Under the hood:** `this.get(index)` is a method calling another method on the same object. Inside `set`, `this` is the list `set` was called on, so `this.get` walks **that** list. That's how one class's methods build on each other.

**Common mistake:** calling `get(index)` without `this.`. Inside a class, `get` on its own isn't a variable, so it's an error ("get is not defined"). Methods of the same object are reached through `this`.

## Write the code

Step 4: with `get` doing the walk, the code follows the plan line by line. The common case and the edge case are the two branches of one `if`: the node exists, or it doesn't.

```viz
trace-ll-set
```

**What just happened:** `set(1, 'Benny')` called `this.get(1)`, which walked to Ben's node. The `if` ran, the value changed, and `set` returned `true`. `set(9, 'Zoe')` got `undefined` back, skipped the `if` and returned `false`.

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

  get(index) {
    if (index < 0 || index >= this.length) {
      return undefined
    }
    let current = this.head
    for (let i = 0; i < index; i++) {
      current = current.next
    }
    return current
  }

  set(index, value) {
    const target = this.get(index)
    if (target) {
      target.value = value
      return true
    }
    return false
  }
}

const line = new LinkedList('Ana').push('Ben').push('Cleo')
console.log(line.set(1, 'Benny')) // true
console.log(line.get(1).value) // Benny
console.log(line.set(9, 'Zoe')) // false: there's no index 9
console.log(line.length) // 3: set never adds or removes
```

**Under the hood:** in `target.value = value`, the two `value`s are different things. The left one, after the dot, is the node's **property**. The right one is the **parameter** `set` received. JavaScript tells them apart by the dot, the same way `this.value = value` worked in the `Node` constructor.

**Common mistake:** leaving out `return true` inside the `if`. The value still changes, but then the code carries on to `return false`, so `set` reports a failure for a change that worked.

## Look back

Step 5: the Big O, and why reusing `get` was the right call.

**Big O:** `set` does one `get` (a walk of up to n nodes) and one assignment: **O(n) time**, **O(1) space**. All of the cost comes from the walk inside `get`. Changing the value itself is O(1). On an array, `guests[1] = 'Benny'` is O(1), because the array can jump to the slot.

**Reusing a method is a refactor you do on purpose.** Without `get`, `set` would repeat the range check and the loop, and two copies of the same walk means two places for the same bug. With `get`, there's one walk to get right. If you ever fix or speed up `get`, `set` gets the fix for free. That's the same reason `Node` became its own class in the constructor lesson.

**A variation to know:** some code returns the node's old value from `set`, so the caller knows what it replaced. Ours returns `true` or `false`, because the question callers ask most is "did it work?".

```js-run
// set on an index near the end walks almost the whole line,
// while the assignment itself is a single step.
const sizes = [10, 1000]
for (let i = 0; i < sizes.length; i++) {
  const lastIndex = sizes[i] - 1
  let moves = 0
  for (let k = 0; k < lastIndex; k++) {
    moves++
  }
  console.log(sizes[i] + ' guests: ' + moves + ' moves to reach the last index, then 1 assignment')
}
```

**Under the hood:** reusing `get` costs nothing extra in Big O: `set` would need the same walk if it wrote its own loop. What it saves is **code**: one walk, written and tested once, used by `set`, `insert` and `remove`. A bug fixed in `get` is fixed in all four.

**Common mistake:** thinking `set` is O(1) because changing a value is O(1). The change is, but finding the node isn't. Always count the walk to get there.
