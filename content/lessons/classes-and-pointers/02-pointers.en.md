---
title: 'Pointers: values vs references'
order: 2
minutes: 11
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

This is exactly how linked lists work, and it's why this lesson comes right before them. A linked list is a chain of small objects called **nodes**, each one pointing to the next, with `head` and `tail` pointing at the two ends (you saw a tiny version of this in the Introduction module). Adding a node means moving a couple of arrows. Removing one means moving the arrows **away** from it, so nothing points to it anymore, and the garbage collector takes it from there. And moving a pointer is a single assignment, so it's **O(1)** however long the list is. That's why a linked list can add or remove at its front in O(1), something an array can't do.

Following pointers is the other half of the story. To reach the end of a chain, you move a pointer from one node to the next until there's no next node. You'll write exactly that in this step's check.

**Common mistake:** losing the last pointer to something you still need. If you move `head` before saving the next node somewhere, the rest of the list can't be reached anymore, and it's gone.
