---
title: 'Classes: the blueprint for every data structure'
order: 1
minutes: 12
---

> **Goal:** write a class with a constructor and methods, know what `new` and `this` do, and see why every data structure in this course is a class.

## A class is a cookie cutter

So far you've kept data in arrays and objects, and written functions that work on that data. A **class** puts both in one place: it describes what data something holds **and** what you can do with it. Think of a **cookie cutter**. The cutter isn't a cookie. It's a shape you use to stamp out as many cookies as you want, and every cookie it makes has the same shape.

In code, the cutter is the **class**, and each cookie it makes is an **instance** of that class (you'll also hear "an object created from the class"). Here's a `Cookie` class. By convention, class names start with a **capital letter** (`Cookie`, `LinkedList`), which makes them easy to tell apart from ordinary variables and functions (`cookie`, `push`):

```js
class Cookie {
  constructor(flavor) {
    this.flavor = flavor
  }
}
```

That's already a complete class. It's tiny, but it can make cookies, and every cookie it makes gets its own `flavor`.

```viz
cookie-cutter
```

**What just happened:** the class stayed the same the whole time: it's the cutter. `new Cookie('chocolate')` stamped out the first instance, and `new Cookie('vanilla')` stamped out a second one. Both have the same shape (a `flavor`), but each keeps its **own** value. Making a thousand more cookies wouldn't change the cutter at all.

Run it, and notice the last line: two cookies made from the same class are still two different objects.

```js-run
class Cookie {
  constructor(flavor) {
    this.flavor = flavor
  }
}

const cookieOne = new Cookie('chocolate')
const cookieTwo = new Cookie('vanilla')

console.log(cookieOne.flavor)
console.log(cookieTwo.flavor)
console.log(cookieOne === cookieTwo) // false: two different cookies
```

**Common mistake:** forgetting `new`. Without it, `Cookie('chocolate')` doesn't make a cookie: JavaScript stops with a `TypeError`, because a class can only be used with `new`.

## The constructor, new and this

Every class has a special method called the **constructor**. It's the code that runs when a new instance is created, and its job is to set that instance up: here, to store its flavor. The values you pass to the class, like `'chocolate'`, go straight to the constructor's parameters, like `flavor`.

The keyword **`new`** is what calls the constructor. `new Cookie('chocolate')` looks like a single action, but JavaScript does four small things:

1. It makes a brand-new, empty object.
2. It points **`this`** at that object.
3. It runs the constructor, which fills the object in (`this.flavor = 'chocolate'`).
4. It returns the finished object, which we usually store in a variable.

```viz
cookie-new
```

**What just happened:** the object was built in front of you: empty, then pointed to by `this`, then filled in by the constructor, then handed to `cookieOne`. That's why the constructor writes `this.flavor` and not just `flavor`. `flavor` is the parameter that was passed in; `this.flavor` is the property stored on **this particular cookie**.

**`this`** always means "the instance this code is running for". When the constructor runs for `cookieOne`, `this` is `cookieOne`. When it runs for `cookieTwo`, `this` is `cookieTwo`. The same line of code, `this.flavor = flavor`, writes to a different cookie each time, and that's how one class can make many instances without them getting in each other's way.

A constructor can also set up properties that aren't passed in. Here, every new cookie starts out unbaked:

```js-run
class Cookie {
  constructor(flavor) {
    this.flavor = flavor
    this.isBaked = false // every cookie starts raw
  }
}

const cookieOne = new Cookie('chocolate')
console.log(cookieOne.flavor, cookieOne.isBaked)
```

**Common mistake:** writing `flavor = flavor` instead of `this.flavor = flavor` in the constructor. That only reassigns the parameter, so the cookie ends up with no flavor at all.

## Methods: getters and setters

A class can also have **methods**: functions that belong to the class and work on an instance's data. You write them inside the class, without the `function` keyword. Most methods fall into two broad groups. A **getter** reads some data from the instance and returns it. A **setter** changes the instance's data.

```js-run
class Cookie {
  constructor(flavor) {
    this.flavor = flavor
  }

  getFlavor() {
    return this.flavor
  }

  setFlavor(flavor) {
    this.flavor = flavor
  }
}

const cookieOne = new Cookie('chocolate')
const cookieTwo = new Cookie('vanilla')

console.log(cookieOne.getFlavor())
console.log(cookieTwo.getFlavor())

cookieOne.setFlavor('oatmeal')
console.log(cookieOne.getFlavor()) // changed
console.log(cookieTwo.getFlavor()) // not changed
```

```viz
cookie-methods
```

**What just happened:** `getFlavor` is written once, in the class, and every instance can use it. When you call `cookieOne.getFlavor()`, `this` is `cookieOne`; when you call `cookieTwo.getFlavor()`, `this` is `cookieTwo`. That's why the same method gave two different answers, and why `setFlavor` on one cookie never touched the other.

Why use methods at all, when you could just write `cookieOne.flavor = 'oatmeal'`? Because methods let the class decide how its data is used. A setter could check the new value first, or update two properties together so they never disagree. When you build a linked list, a method like `push` will keep the list's `head`, `tail` and `length` in sync, which is easy to get wrong if you edit those properties by hand.

You may also see JavaScript's own `get` and `set` syntax, which lets a method be read like a property:

```js
class Cookie {
  constructor(flavor) {
    this._flavor = flavor
  }

  get flavor() {
    return this._flavor
  }
}

new Cookie('chocolate').flavor // 'chocolate', no parentheses
```

In this course we write getters and setters as plain methods, like `getFlavor()`, so it's always clear when a method runs.

**Common mistake:** forgetting the parentheses. `cookieOne.getFlavor` without `()` doesn't call the method: it gives you back the function itself.

## Every data structure is a class

Why spend a lesson on cookies? Because **every data structure you'll build in this course is a class**. A linked list, a stack, a queue, a tree, a hash table, a graph: each one is a class with a constructor that sets it up and methods that do specific jobs with its data.

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

**What just happened:** one `LinkedList` instance, `line`, went through every method. Each call did one specific thing, and because the methods belong to the class, `line.push(...)` always works on `line`'s own data. A second list made with `new LinkedList(...)` would have its own guests, and its methods would work on those, exactly like `cookieOne` and `cookieTwo`.

That's the power of classes: once a data structure is written as a class, you can create as many as you need with `new`, and each one carries its own data and its own set of tools. Creating an instance and calling a simple getter or setter like `getFlavor` are both **O(1)**: they do the same small amount of work no matter how many cookies exist. The methods you'll write in the coming modules won't all be that cheap, and measuring them with Big O is a big part of the job.

**Common mistake:** thinking the class _is_ the data. The class is only the blueprint. The data lives in each instance you create with `new`.
