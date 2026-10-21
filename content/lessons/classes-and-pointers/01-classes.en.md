---
title: 'Classes: the blueprint for every data structure'
order: 1
minutes: 12
---

> **Goal:** write a class with a constructor and methods, know what `new` and `this` do, and see why every data structure in this course is a class.

## A class is an invitation template

So far you've kept data in arrays and objects, and written functions that work on that data. A **class** puts both in one place: it describes what data something holds **and** what you can do with it. Think of the **invitation template** for our party. The template isn't an invitation. It's a design you use to print as many invitations as you want, and every invitation it prints has the same layout, with a different guest's name on it.

In code, the template is the **class**, and each invitation it prints is an **instance** of that class (you'll also hear "an object created from the class"). Here's an `Invitation` class. By convention, class names start with a **capital letter** (`Invitation`, `LinkedList`), which makes them easy to tell apart from ordinary variables and functions (`invitation`, `push`):

```js
class Invitation {
  constructor(guest) {
    this.guest = guest
  }
}
```

That's already a complete class. It's tiny, but it can make invitations, and every invitation it makes gets its own `guest`.

```viz
invitation-template
```

**What just happened:** the class stayed the same the whole time: it's the template. `new Invitation('Ana')` printed the first instance, and `new Invitation('Ben')` printed a second one. Both have the same layout (a `guest`), but each keeps its **own** value. Printing a thousand more invitations wouldn't change the template at all.

Run it, and notice the last line: two invitations made from the same class are still two different objects.

```js-run
class Invitation {
  constructor(guest) {
    this.guest = guest
  }
}

const forAna = new Invitation('Ana')
const forBen = new Invitation('Ben')

console.log(forAna.guest)
console.log(forBen.guest)
console.log(forAna === forBen) // false: two different invitations
```

**Common mistake:** forgetting `new`. Without it, `Invitation('Ana')` doesn't make an invitation: JavaScript stops with a `TypeError`, because a class can only be used with `new`.

## The constructor, new and this

Every class has a special method called the **constructor**. It's the code that runs when a new instance is created, and its job is to set that instance up: here, to store its guest. The values you pass to the class, like `'Ana'`, go straight to the constructor's parameters, like `guest`.

The keyword **`new`** is what calls the constructor. `new Invitation('Ana')` looks like a single action, but JavaScript does four small things:

1. It makes a brand-new, empty object.
2. It points **`this`** at that object.
3. It runs the constructor, which fills the object in (`this.guest = 'Ana'`).
4. It returns the finished object, which we usually store in a variable.

```viz
invitation-new
```

**What just happened:** the object was built in front of you: empty, then pointed to by `this`, then filled in by the constructor, then handed to `forAna`. That's why the constructor writes `this.guest` and not just `guest`. `guest` is the parameter that was passed in; `this.guest` is the property stored on **this particular invitation**.

**`this`** always means "the instance this code is running for". When the constructor runs for `forAna`, `this` is `forAna`. When it runs for `forBen`, `this` is `forBen`. The same line of code, `this.guest = guest`, writes to a different invitation each time, and that's how one class can make many instances without them getting in each other's way.

A constructor can also set up properties that aren't passed in. Here, every new invitation starts out unsent:

```js-run
class Invitation {
  constructor(guest) {
    this.guest = guest
    this.isSent = false // every invitation starts unsent
  }
}

const forAna = new Invitation('Ana')
console.log(forAna.guest, forAna.isSent)
```

**Common mistake:** writing `guest = guest` instead of `this.guest = guest` in the constructor. That only reassigns the parameter, so the invitation ends up with no guest at all.

## Methods: getters and setters

A class can also have **methods**: functions that belong to the class and work on an instance's data. You write them inside the class, without the `function` keyword. Most methods fall into two broad groups. A **getter** reads some data from the instance and returns it. A **setter** changes the instance's data.

```js-run
class Invitation {
  constructor(guest) {
    this.guest = guest
  }

  getGuest() {
    return this.guest
  }

  setGuest(guest) {
    this.guest = guest
  }
}

const forAna = new Invitation('Ana')
const forBen = new Invitation('Ben')

console.log(forAna.getGuest())
console.log(forBen.getGuest())

forBen.setGuest('Benny') // the name was wrong on Ben's invitation
console.log(forBen.getGuest()) // changed
console.log(forAna.getGuest()) // not changed
```

```viz
invitation-methods
```

**What just happened:** `getGuest` is written once, in the class, and every instance can use it. When you call `forAna.getGuest()`, `this` is `forAna`; when you call `forBen.getGuest()`, `this` is `forBen`. That's why the same method gave two different answers, and why `setGuest` on one invitation never touched the other.

Why use methods at all, when you could just write `forBen.guest = 'Benny'`? Because methods let the class decide how its data is used. A setter could check the new value first, or update two properties together so they never disagree. When you build a linked list, a method like `push` will keep the list's `head`, `tail` and `length` in sync, which is easy to get wrong if you edit those properties by hand.

You may also see JavaScript's own `get` and `set` syntax, which lets a method be read like a property:

```js
class Invitation {
  constructor(guest) {
    this._guest = guest
  }

  get guest() {
    return this._guest
  }
}

new Invitation('Ana').guest // 'Ana', no parentheses
```

In this course we write getters and setters as plain methods, like `getGuest()`, so it's always clear when a method runs.

**Common mistake:** forgetting the parentheses. `forAna.getGuest` without `()` doesn't call the method: it gives you back the function itself.

## Every data structure is a class

Why spend a lesson on invitations? Because **every data structure you'll build in this course is a class**. A linked list, a stack, a queue, a tree, a hash table, a graph: each one is a class with a constructor that sets it up and methods that do specific jobs with its data.

Here's a preview of the class you'll build in the next module. The constructor receives a value and creates the list with that first item. Then each method does one job: `push` adds an item at the end, `unshift` adds one at the start, `insert` adds one at a given index, `remove` takes out the item at an index, `pop` removes the last item and `shift` removes the first.

```js
class LinkedList {
  constructor(value) {
    // create the list with its first item
  }
  push(value) {}
  unshift(value) {}
  insert(index, value) {}
  remove(index) {}
  pop() {}
  shift() {}
}
```

```viz
list-class-preview
```

**What just happened:** one `LinkedList` instance, `line`, went through every method. Each call did one specific thing, and because the methods belong to the class, `line.push(...)` always works on `line`'s own data. A second list made with `new LinkedList(...)` would have its own guests, and its methods would work on those, exactly like `forAna` and `forBen`.

That's the power of classes: once a data structure is written as a class, you can create as many as you need with `new`, and each one carries its own data and its own set of tools. Creating an instance and calling a simple getter or setter like `getGuest` are both **O(1)**: they do the same small amount of work no matter how many invitations exist. The methods you'll write in the coming modules won't all be that cheap, and measuring them with Big O is a big part of the job.

**Common mistake:** thinking the class _is_ the data. The class is only the blueprint. The data lives in each instance you create with `new`.
