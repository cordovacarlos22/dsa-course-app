---
title: Running code in this course
order: 3
minutes: 12
---

> **Goal:** use the code boxes like a pro: print values, follow the replay, read error messages and recover from an infinite loop.

## The code box

Every dark box with a **Run** button is a small code editor:

- **Edit** the code: click inside and type, like any text box.
- **Run** it: press the **Run** button, or **Ctrl + Enter** (**Cmd + Enter** on a Mac).
- **Reset** it: brings back the original code if you get lost.

When you press Run, your code runs right here in your browser, in a separate space from the page itself, so the lesson never freezes. JavaScript runs your code **from top to bottom**, one line at a time, and whatever your code prints with `console.log` shows up under the box. Nothing you type can break the lesson: if you get lost, Reset brings everything back.

That makes the code boxes the best place to experiment. Change a number, rename a variable, delete a line and see what happens. You learn more from one surprising result than from reading the same code ten times. Try it with this one: run it, then press **Edit**, swap the last two lines and run it again.

```js-run
console.log('1. This line runs first')
const result = 2 + 3
console.log('2. Then this one: 2 + 3 =', result)
console.log('3. And this one runs last')
```

After you press Run, the box turns into a **replay** of what happened:

- The code shows **read-only, with line numbers**.
- The output appears **one line at a time**. Each line has a **line tag**, like `line 3`, that says which line of code printed it, and that line of code lights up.
- **Replay** plays it all again, **Step** shows one more line each time you press it, **Show all** shows everything at once, and **Edit** takes you back to the editor, with your code just as you left it.

In the box above, the tags read `line 1`, `line 3` and `line 4`. Line 2 printed nothing, so it never lights up: it worked out `2 + 3` silently. When the output is long (more than 60 lines), or your device asks for less motion, everything shows at once instead.

**Under the hood:** a web page runs its JavaScript **one thing at a time**. If your code ran inside the page and got stuck in a loop, the page couldn't do anything else: no scrolling, no clicking, no drawing. So the course runs your code in a **Web Worker**, a separate helper that runs JavaScript next to the page instead of inside it. The lesson stays responsive while your code runs, and if your code is still busy after **2 seconds**, the course stops the worker. Before running your code, the course also notes the line number of each `console.log`; that's how the replay knows which line printed what.

Coding **checks** use a bigger workspace: the lesson on the left, and on the right the editor with the output below it (tabs on a phone). **Run** shows what your code prints, and **Check** runs tests on your code and tells you which ones pass. You'll try one at the end of the next step: a short warm-up. It's the module's only coding check: the rest are questions about code and explain-it-yourself boxes, so you can focus on reading code first.

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

Watch the replay of that one: the tag says `line 5` three times, because the same line runs again on every turn of the loop. That's the loop, made visible.

Commas and `+` look alike, but they do different things. A comma gives `console.log` separate values, and it prints each one. A `+` with text **joins** first, from left to right, and `console.log` gets just the joined result. Predict each line, then run it:

```js-run
console.log('5' + 3)
console.log(5 + 3)
console.log('Total:', 5 + 3)
console.log('Total: ' + 5 + 3)
```

`'5' + 3` joins text, so it prints `53`. `5 + 3` adds numbers: `8`. With the comma, `5 + 3` is worked out on its own, so you get `Total: 8`. But in the last line, `'Total: ' + 5` happens first and makes the text `'Total: 5'`, and then `+ 3` joins another `3`: `Total: 53`. When you mix text and numbers, commas are the safe choice.

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

The **type** (`ReferenceError`) says we used a name JavaScript doesn't know. The **message** (`gret is not defined`) says which name. It's a typo! Press **Edit**, change `gret` to `greet` and run it again.

In the replay, the error comes last, in red, tagged with the line that threw it: `line 6` here. That tag is your starting point: go to that line and read it slowly. (When the browser can't tell which line it was, the error simply has no tag.)

Here's a TypeError. There's no guest at index 5, so `guests[5]` is `undefined`, and `undefined` has no `length`:

```js-run
const guests = ['Ana', 'Ben', 'Cleo']
console.log(guests[5]) // undefined: there's no guest at index 5
console.log(guests[5].length)
```

A **SyntaxError** works differently. Before running anything, JavaScript first **reads** all of your code to work out its structure: where each function, loop and line begins and ends. If it can't make sense of the code, it gives up right there, so not even the first line runs. That's why this example isn't a Run box:

```js
console.log('Will this print?')
console.log('The closing parenthesis is missing'
```

You'd get an error like `SyntaxError: missing ) after argument list`, and no output at all, not even `Will this print?`. The words differ a little from browser to browser. When you see a SyntaxError, look for a missing `)`, `}` or quote, often near the end of the code.

**Common mistake:** reading only the word "Error" and guessing. The message almost always names the exact problem: which name is missing, or which value was `undefined`. Read the whole line before you change anything.

## When code never stops

A `while` loop runs **as long as its condition is true**. So something inside the loop has to change, little by little, until the condition becomes false. If nothing changes, the condition stays true forever, and you get an **infinite loop**. In a normal browser tab, it would freeze the page, because JavaScript does one thing at a time and never gets to anything else. Here, it can't: your code runs in the Web Worker you met in the first step, and if it's still running after **2 seconds**, the course stops it for you and shows a message.

This loop never ends, because we forgot to increase `count`:

```js-run
let count = 0

while (count < 5) {
  // Oops: we never add 1 to count, so count < 5 is always true.
}

console.log('Done!')
```

Run it and wait two seconds. Then fix it: add `count++` inside the loop and run it again. Now you'll see `Done!`.

Before you run any loop, ask it three questions:

1. **When does it stop?** Read the condition: this loop stops when `count < 5` becomes false, so when `count` reaches 5.
2. **What changes on each turn?** Find the line inside the loop that changes the variable in the condition. If there isn't one, it never stops.
3. **Does the change move toward the end?** `count++` moves `count` from 0 up to 5, so yes.

**Common mistake:** changing the variable in the wrong direction. If the loop runs while `count < 5`, then `count--` makes `count` smaller and smaller, so it never reaches 5: still an infinite loop. Ask yourself: "Does each turn bring me closer to the end?"

### Optional: practicing in Chrome DevTools

The code boxes are perfect for lessons. For longer practice sessions, you can also use the code editor that comes with Google Chrome. The steps are the same on a Mac, Windows or a Chromebook:

1. Open Chrome, then the menu **⋮ → More tools → Developer tools**.
2. In DevTools, open its own **⋮** menu (not the browser's), then **Dock side**. You can dock DevTools to the right, the bottom or the left of the page, or pick **Undock into separate window** to give it a window of its own. Then make that window full screen for plenty of room.
3. Go to the **Sources** tab, and open its left panel with the **Show navigator** button (top left) if it's closed. Then pick the **Snippets** tab; if you don't see it, it's behind the `»` button. Every snippet you save stays there, so it's a handy home for your practice code.
4. Click **+ New snippet**, write your code, and run it with **Ctrl + Enter** (**Cmd + Enter** on a Mac), or with the play button at the bottom.

Try it with a tiny function:

```js
function sayBack(words) {
  return words
}

console.log(sayBack('Hello from a snippet!'))
```

The output appears in the **Console** below. After you run the snippet, the function exists in that tab, so you can also call it straight from the Console: type `sayBack('Hi from the Console')` and press Enter. DevTools comes in a light and a dark theme: pick one in its **Settings** (the gear icon), then reload DevTools when it asks.

In short:

- **Run** = the button or **Ctrl/Cmd + Enter**. **Reset** brings back the original code.
- After Run, the **replay** shows each output line with a **line tag** for the line that printed it: **Replay**, **Step**, **Show all** and **Edit**.
- Your code runs in a **Web Worker**, next to the page, so the lesson never freezes.
- `console.log(a, b, c)` prints several values separated by spaces. A `+` with text joins first.
- An error message = a **type** + a **message**. Output before the error still appears, except with a **SyntaxError**, where nothing runs.
- Infinite loops are stopped after **2 seconds**. Check every loop: when does it stop, and does each turn move toward it?

Now you're ready for the **Module 1 quiz**. After that, on to Big O!
