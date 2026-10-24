---
title: 'Pointers: values vs references'
order: 2
minutes: 15
---

> **Goal:** know the difference between copying a value and copying a reference, move pointers from one object to another, and see what garbage collection cleans up.

## Copying a value

You'll use **pointers** in every data structure in this course, so it's worth getting them exactly right. To see what a pointer is, let's start with something that **isn't** one.

JavaScript has two kinds of values. **Primitives** are the simple ones: numbers, strings, booleans, `null` and `undefined`. **Objects** are everything else, including arrays and the instances you create from a class. The two kinds behave very differently when you copy them.

When a variable holds a primitive, like a number, it holds the number itself. Copying the variable copies the number, and after that the two variables have nothing to do with each other:

```js-run
let guestCount = 5
let seats = guestCount // seats gets its own 5

guestCount = 8 // only guestCount changes
console.log(guestCount) // 8
console.log(seats) // still 5
```

```viz
value-copy
```

**What just happened:** `let seats = guestCount` didn't link the two variables. It copied the value 5 into `seats` at that moment, and that was the end of it. When `guestCount` later became 8, `seats` kept its own 5. Strings and booleans work the same way: primitives are always copied.

Try it with a string and a boolean, and predict each line before you run it:

```js-run
let host = 'Ana'
let backupHost = host

host = 'Ben'
console.log(backupHost) // still 'Ana'

let isOpen = true
let wasOpen = isOpen

isOpen = false
console.log(wasOpen) // still true
```

**Under the hood:** think of each variable as its own labeled box. For a primitive, the box holds the value itself, so `let seats = guestCount` puts a copy of 5 into the `seats` box. Primitives also can't be changed in place: `guestCount = 8` doesn't turn the 5 into an 8, it puts a brand-new value in `guestCount`'s box. That's why nothing you do to one variable can ever reach the other.

**Common mistake:** reading `let seats = guestCount` as "seats will always equal guestCount". It only means "seats equals guestCount **right now**".

## Copying an object copies the arrow

Objects are different. When you write `let card = { value: 'Ana' }`, the variable `card` doesn't hold the object itself. The object lives somewhere in memory, and `card` holds a **reference** to it. Think of it as an **arrow** pointing at the object. That arrow is what this course calls a **pointer**. (Some languages, like C, have a special pointer type you can even do math with. JavaScript doesn't: every variable that holds an object, array or class instance simply holds a reference, and that's all we mean by "pointer".)

So what does `let sameCard = card` do? It might look like it makes a second object with the same value. It doesn't. It copies the **arrow**, so now `sameCard` points at **the very same object** in memory that `card` points at.

```viz
reference-copy
```

**What just happened:** there was only ever one object, A. `card` and `sameCard` were two arrows pointing at it. Changing `card.value` followed `card`'s arrow and changed object A, so reading `sameCard.value`, which follows its own arrow to the same object, showed the change too.

```js-run
let card = { value: 'Ana' }
let sameCard = card // copies the arrow, not the object

card.value = 'Ben'
console.log(sameCard.value) // 'Ben': it's the same object

console.log(card === sameCard) // true: both point to one object
console.log({ value: 'Ana' } === { value: 'Ana' }) // false: two objects

const realCopy = { ...card } // a new object with the same properties
realCopy.value = 'Cleo'
console.log(card.value) // still 'Ben'
```

That second comparison surprises a lot of people. With objects, `===` doesn't compare what's inside them: it checks whether both sides point to **the same object**. Two objects that look identical are still two different objects. When you really need a separate copy, `{ ...card }` makes a new object with the same properties (for a simple object like this one).

Arrays are objects too, so they follow the same rule. This one catches people all the time:

```js-run
let guests = ['Ana', 'Ben']
let backup = guests // the same array, not a copy

backup.push('Cleo')
console.log(guests.length) // 3: guests changed too

let realBackup = guests.slice() // a new array with the same items
realBackup.push('Dev')
console.log(guests.length) // still 3
```

**Under the hood:** the arrow is really a **memory address**, a number that says where the object lives. `let sameCard = card` copies that number: a few bytes, however big the object is. That's why copying a reference is **O(1)**, while copying the object itself (`{ ...card }`, `guests.slice()`) is **O(n)**: it has to copy every property or item.

**Common mistake:** thinking `=` copies an object. With objects, `=` copies the arrow: two variables, one object.

## Moving pointers and garbage collection

A pointer isn't glued to its object. You can **move** it by assigning the variable to a different object. Let's make one object, point two variables at it, then make a second object and move both pointers over to it:

```js-run
let first = { value: 'Ana' }
let second = first
let third = { value: 'Cleo' }

second = third // second now points to Cleo's object
first = third // and so does first

console.log(first.value, second.value, third.value)
// Nothing points to { value: 'Ana' } any more
```

```viz
pointer-move
```

**What just happened:** moving `second` didn't change any object; it only moved an arrow. Then `first` moved too, and object A, `{ value: 'Ana' }`, had no arrows left. You can only get to an object through something that points to it, so an object nothing points to can't be reached anymore. It just sits there, taking up memory.

That's where **garbage collection** comes in. Every now and then, JavaScript looks for objects that nothing can reach and frees the memory they use. You never delete an object yourself: you stop pointing to it, and the **garbage collector** cleans it up.

**Under the hood:** the garbage collector doesn't count arrows one by one. It starts from what your code can still use (its variables) and follows every pointer it can, marking each object it reaches. Whatever is left unmarked can't be reached, so its memory is freed. That's why even two objects that only point to each other get cleaned up once nothing else points to them: nobody can reach them anymore.

This is exactly how linked lists work, and it's why this lesson comes right before them. A linked list is a chain of small objects called **nodes**, each one pointing to the next, with `head` and `tail` pointing at the two ends (you saw a tiny version of this in the Introduction module). Adding a node means moving a couple of arrows. Removing one means moving the arrows **away** from it, so nothing points to it anymore, and the garbage collector takes it from there. And moving a pointer is a single assignment, so it's **O(1)** however long the list is. That's why a linked list can add or remove at its front in O(1), something an array can't do.

Following pointers is the other half of the story. To reach the end of a chain, you move a pointer from one node to the next until there's no next node. You'll write exactly that in this step's check. Here's one move first, so you can watch a pointer walk:

```js-run
let ana = { value: 'Ana', next: null }
let ben = { value: 'Ben', next: null }
ana.next = ben // Ana's card now points to Ben's

let current = ana
console.log(current.value) // 'Ana'
current = current.next // move the pointer one card forward
console.log(current.value) // 'Ben'
console.log(ana.value) // still 'Ana': moving current changed no card
```

**Common mistake:** losing the last pointer to something you still need. If you move `head` before saving the next node somewhere, the rest of the list can't be reached anymore, and it's gone.

## Functions get the arrow too

There's one more place where pointers get copied, and you'll meet it in every data structure method: **passing an object to a function**. The parameter gets a copy of the **arrow**, not a copy of the object. So inside the function there are two arrows, the caller's and the parameter, pointing at one object.

That has two consequences, and you need both. If the function **changes the object** through its parameter (`card.arrived = true`), the caller sees the change, because there's only one object. But if the function **moves its parameter** to a different object (`card = { value: 'Zoe' }`), only the function's own arrow moves: the caller's variable still points where it did. Primitives, as always, are just copied.

```js-run
function markArrived(card) {
  card.arrived = true // follows the arrow: changes the caller's object
}

function replaceCard(card) {
  card = { value: 'Zoe' } // moves only this function's arrow
}

const ana = { value: 'Ana', arrived: false }

markArrived(ana)
console.log(ana.arrived) // true

replaceCard(ana)
console.log(ana.value) // still 'Ana'
```

**What just happened:** `markArrived` followed its copy of the arrow and changed the one object, so `ana.arrived` became `true`. `replaceCard` pointed its own parameter at a new object, which nobody outside could see, and that new object was garbage as soon as the function ended. `ana` never moved.

The same thing with a number shows the primitive side: the function gets its own copy, so the only way to get a new value out is to **return** it.

```js-run
function addOne(count) {
  count = count + 1
  return count
}

let guestCount = 5
addOne(guestCount)
console.log(guestCount) // still 5

guestCount = addOne(guestCount)
console.log(guestCount) // 6
```

This is how linked list methods do their work. A method like `push` gets a value, wraps it in a new node, and changes the `next` of the node that `this.tail` points to: it changes objects through pointers, and every other pointer to those nodes sees the change.

**Big O:** passing an object to a function is **O(1)**, however big the object is, because only the arrow is copied.

**Common mistake:** expecting `card = { ... }` inside a function to replace the caller's object. It only moves the function's own pointer. To change the caller's object, change its properties, or return the new object and let the caller store it.
