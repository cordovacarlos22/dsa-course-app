---
title: Running code in this course
order: 3
minutes: 8
---

> **Goal:** use the code boxes like a pro: print values, read error messages and recover from an infinite loop.

## The code box

Every dark box with a **Run** button is a small code editor:

- **Edit** the code: click inside and type, like any text box.
- **Run** it: press the **Run** button, or **Ctrl + Enter** (**Cmd + Enter** on a Mac).
- **Reset** it: brings back the original code if you get lost.

When you press Run, your code runs right here in your browser, in a separate space from the page itself, so the lesson never freezes. JavaScript reads your code **from top to bottom**, one line at a time, and whatever your code prints with `console.log` shows up under the box. Nothing you type can break the lesson: if you get lost, Reset brings everything back.

That makes the code boxes the best place to experiment. Change a number, rename a variable, delete a line and see what happens. You learn more from one surprising result than from reading the same code ten times. Try it with this one: run it, then swap the last two lines and run it again.

```js-run
console.log('1. This line runs first')
const total = 2 + 3
console.log('2. Then this one: 2 + 3 =', total)
console.log('3. And this one runs last')
```

Coding **checks** use a bigger workspace: the lesson on the left, and on the right the editor with the output below it (tabs on a phone). **Run** shows what your code prints, and **Check** runs tests on your code and tells you which ones pass. You'll try it in the next steps.

**Common mistake:** computing a value and expecting to see it. A line like `2 + 3` on its own works out the answer and then throws it away. Only what you pass to `console.log` shows up under the box.

## Printing values

`console.log` is your window into a running program. You can't see what's inside a variable while the code runs, but you can print it. That's why programmers print values all the time: to check that a variable holds what they think it holds, and to follow a loop one turn at a time.

`console.log` can print several values at once. Separate them with commas, and it puts a space between them. Arrays and objects print with their contents, so you can see every item:

```js-run
const language = 'JavaScript'
const year = 1995

console.log('Language:', language)
console.log(language, 'was created in', year)
console.log([1, 2, 3], { course: 'DSA' })
```

When something doesn't work, printing the values step by step is often the fastest way to find out why. Put a `console.log` inside a loop and you get one line per turn, so you can watch a variable change:

```js-run
const guests = ['Ana', 'Ben', 'Cleo']
let count = 0
for (let i = 0; i < guests.length; i++) {
  count = count + 1
  console.log('i is', i, '| guest is', guests[i], '| count is', count)
}
```

**Common mistake:** joining an object to text with `+`. `console.log('Guest: ' + { name: 'Ana' })` prints `Guest: [object Object]`, because `+` turns the object into text first. Use a comma instead, `console.log('Guest:', { name: 'Ana' })`, and you'll see what's inside.

## Reading an error message

Errors aren't failures: they're the computer telling you exactly what went wrong. When JavaScript reaches a line it can't run, it **stops** there and prints an error. Everything before that line has already run; nothing after it runs.

Every error message has two parts. The **type** tells you the kind of problem, and the **message** tells you the details. You'll see three types most often:

- **ReferenceError:** you used a name JavaScript doesn't know, usually a typo or a variable you forgot to create.
- **TypeError:** the value is the wrong kind for what you did with it, like reading a property of `undefined` or calling something that isn't a function. You'll meet this one a lot with linked lists: `null.next` is a TypeError.
- **SyntaxError:** JavaScript couldn't even read the code, like a missing `)` or `}`. With this one, nothing runs at all.

Run this code:

```js-run
function greet(name) {
  return 'Hello, ' + name
}

console.log(greet('Ada'))
console.log(gret('Grace'))
```

You'll see two things:

1. `Hello, Ada`: everything **before** the error still runs and prints.
2. A red line: `ReferenceError: gret is not defined`.

The **type** (`ReferenceError`) says we used a name JavaScript doesn't know. The **message** (`gret is not defined`) says which name. It's a typo! Change `gret` to `greet` and run it again.

Here's a TypeError. There's no guest at index 5, so `guests[5]` is `undefined`, and `undefined` has no `length`:

```js-run
const guests = ['Ana', 'Ben', 'Cleo']
console.log(guests[5]) // undefined: there's no guest at index 5
console.log(guests[5].length)
```

**Common mistake:** reading only the word "Error" and guessing. The message almost always names the exact problem: which name is missing, or which value was `undefined`. Read the whole line before you change anything.

## When code never stops

A `while` loop runs **as long as its condition is true**. So something inside the loop has to change, little by little, until the condition becomes false. If nothing changes, the condition stays true forever, and you get an **infinite loop**. In a normal browser tab, it would freeze the page, because JavaScript does one thing at a time and never gets to anything else. Here, it can't: if your code is still running after **2 seconds**, the course stops it for you and shows a message.

This loop never ends, because we forgot to increase `count`:

```js-run
let count = 0

while (count < 5) {
  // Oops: we never add 1 to count, so count < 5 is always true.
}

console.log('Done!')
```

Run it and wait two seconds. Then fix it: add `count++` inside the loop and run it again. Now you'll see `Done!`.

**Common mistake:** changing the variable in the wrong direction. If the loop runs while `count < 5`, then `count--` makes `count` smaller and smaller, so it never reaches 5: still an infinite loop. Ask yourself: "Does each turn bring me closer to the end?"

### Optional: practicing in Chrome DevTools

The code boxes are perfect for lessons. For longer practice sessions, you can also use the code editor that comes with Google Chrome. The steps are the same on a Mac, Windows or a Chromebook:

1. Open Chrome, then the menu **⋮ → More tools → Developer tools**.
2. In DevTools, open its own **⋮** menu (not the browser's), then **Dock side**, and pick **Undock into separate window** to give it a full window.
3. Go to the **Sources** tab, then **Snippets** (open the navigator with the `»` button if you don't see it).
4. Click **+ New snippet**, write your code, and run it with **Ctrl + Enter** (**Cmd + Enter** on a Mac).

The output appears in the **Console** below. You can also call your functions directly from the Console after running the snippet. DevTools comes in a light and a dark theme: pick one in its **Settings** (the gear icon), then reload DevTools when it asks.

In short:

- **Run** = the button or **Ctrl/Cmd + Enter**. **Reset** brings back the original code.
- `console.log(a, b, c)` prints several values separated by spaces.
- An error message = a **type** + a **message**. Output before the error still appears.
- Infinite loops are stopped after **2 seconds**.

Now you're ready for the **Module 1 quiz**. After that, on to Big O!
