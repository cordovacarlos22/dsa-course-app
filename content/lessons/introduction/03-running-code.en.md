---
title: Running code in this course
order: 3
minutes: 6
---

> **Goal:** use the code boxes like a pro: print values, read error messages and recover from an infinite loop.

## The code box

Every dark box with a **Run** button is a small code editor:

- **Edit** the code: click inside and type, like any text box.
- **Run** it: press the **Run** button, or **Ctrl + Enter** (**Cmd + Enter** on a Mac).
- **Reset** it: brings back the original code if you get lost.

Whatever your code prints with `console.log` shows up under the box.

Coding **checks** use a bigger workspace: the lesson on the left, the editor in the middle and the output on the right (tabs on a phone). **Run** shows what your code prints, and **Check** runs tests on your code and tells you which ones pass. You'll try it in the next steps.

## Printing values

`console.log` can print several values at once. It puts a space between them:

```js-run
const language = 'JavaScript'
const year = 1995

console.log('Language:', language)
console.log(language, 'was created in', year)
console.log([1, 2, 3], { course: 'DSA' })
```

You'll use `console.log` all the time to check what your code is doing. When something doesn't work, printing the values step by step is often the fastest way to find out why.

## Reading an error message

Errors aren't failures: they're the computer telling you exactly what went wrong. Run this code:

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

Read error messages in two parts. The **type** (`ReferenceError`) tells you the kind of problem: here, using a name JavaScript doesn't know. The **message** (`gret is not defined`) tells you which name. It's a typo! Change `gret` to `greet` and run it again.

## When code never stops

A loop that never ends is called an **infinite loop**. In a normal browser tab, it would freeze the page. Here, it can't: if your code is still running after **2 seconds**, the course stops it for you and shows a message.

This loop never ends, because we forgot to increase `count`:

```js-run
let count = 0

while (count < 5) {
  // Oops: we never add 1 to count, so count < 5 is always true.
}

console.log('Done!')
```

Run it and wait two seconds. Then fix it: add `count++` inside the loop and run it again. Now you'll see `Done!`.

### Optional: practicing in Chrome DevTools

The code boxes are perfect for lessons. For longer practice sessions, you can also use the code editor that comes with Google Chrome:

1. Open Chrome, then the menu **⋮ → More tools → Developer tools**.
2. In DevTools, open **⋮ → Dock side** and pick **Undock into separate window** to give it a full window.
3. Go to the **Sources** tab, then **Snippets** (open the navigator with the `»` button if you don't see it).
4. Click **+ New snippet**, write your code, and run it with **Ctrl + Enter** (**Cmd + Enter** on a Mac).

The output appears in the **Console** below. You can also call your functions directly from the Console after running the snippet.

In short:

- **Run** = the button or **Ctrl/Cmd + Enter**. **Reset** brings back the original code.
- `console.log(a, b, c)` prints several values separated by spaces.
- An error message = a **type** + a **message**. Output before the error still appears.
- Infinite loops are stopped after **2 seconds**.

Now you're ready for the **Module 1 quiz**. After that, on to Big O!
