---
title: 'Step 2: Explore concrete examples'
order: 3
minutes: 10
---

> **Goal:** use examples (simple, more complex, empty and invalid) to understand a problem better and to check your solution later.

## Why examples?

The second step is to **explore concrete examples**: real inputs, written down with the outputs you expect. It's closely tied to the first step. A problem described in words can feel perfectly clear until you try a real input and realize you don't know what should come out.

Examples do two jobs. First, they help you **understand the problem**: every example you can't answer is a question to ask. Second, they're **sanity checks**: once you've written a solution, you already know what it should return for each example, so you can check it right away. Professional teams do the same thing on a bigger scale. A **user story** describes what should happen when a user does something, and a **unit test** runs a piece of code with an input and checks the output. In fact, every coding check in this course is a list of examples: inputs, and the outputs your code must return.

Our problem for the rest of this module is: **"Write a function that takes a string and returns a count of each character in it."** Let's call it `charCount`. The output will be an object: each key is a character, and its value is how many times that character appears. Start with simple examples, and write them down:

- `charCount('aaa')` → `{ a: 3 }`
- `charCount('banana')` → `{ b: 1, a: 3, n: 2 }`

```viz
five-steps-examples
```

**What just happened:** step 2's checklist has four kinds of examples, and you'll use all four on `charCount` in this lesson: simple, more complex, empty and invalid. Going in that order means you start with the cases you're sure about and then work your way into the strange ones.

Even the simple examples raise a question. For `'aaa'`, should the object also list every other letter with a count of 0, like `{ a: 3, b: 0, c: 0, … }`? That could make the code a little simpler, because every key would already exist, but the object would always have dozens of keys. Ask. We'll say no: only the characters that actually appear.

**Common mistake:** keeping your examples in your head. Write them down where you (and the interviewer) can see them. You'll need them again in step 5.

## From simple to more complex

Once the simple examples are clear, move on to **more complex** ones. They're the ones that make you discover the real rules of the problem. Try a short sentence:

- `charCount('Hi Ana!')`: do we count the **space**? The **`!`**? Are **`'H'` and `'h'`** the same character, or two different ones? What about `'A'` and `'a'`?
- `charCount('Party at 8!')`: should the **digit** `'8'` be counted?

None of these has an obvious answer, because the problem as written doesn't say. In an interview you'd ask; working alone, you'd decide and write the decision down. For this module, we'll decide: **count only letters and digits, ignore case (count everything in lowercase), and skip spaces and punctuation**.

```viz
example-ladder
```

**What just happened:** the examples went from easy to strange. The simple ones had clear answers. The harder ones produced question marks, and at the end every question had an answer. Notice where the rules of our function came from: not from the original problem, but from the examples.

You can write your examples as code, so they're ready to run as soon as the function exists:

```js-run
const examples = [
  { input: 'aaa', expected: { a: 3 } },
  { input: 'banana', expected: { b: 1, a: 3, n: 2 } },
  { input: 'Hi Ana!', expected: { h: 1, i: 1, a: 2, n: 1 } },
  { input: 'Party at 8!', expected: { p: 1, a: 2, r: 1, t: 2, y: 1, 8: 1 } },
  { input: '', expected: {} },
]

for (let i = 0; i < examples.length; i++) {
  console.log(examples[i].input, '→', examples[i].expected)
}
```

**Common mistake:** only trying the "happy" examples, the ones where everything is normal. The examples that make you hesitate are the valuable ones: that's where bugs hide.

## Empty and invalid inputs

Two more kinds of examples complete the list. **Empty inputs:** what should `charCount('')` return? An empty object, `{}`, seems natural, but someone could argue for `null`, `false` or `undefined`. Empty inputs often show you how the problem is supposed to work, so they're always worth asking about.

**Invalid inputs:** what if someone calls `charCount(42)`, `charCount(null)`, or `charCount()` with nothing at all? In an interview, the answer is often "assume the input is valid". In real apps it matters much more: users type unexpected things, and other code passes the wrong values. Thinking about invalid input is how you build code that doesn't break in strange ways. Watch what a simple loop does with bad input:

```js-run
function countCharacters(str) {
  let count = 0
  for (let i = 0; i < str.length; i++) {
    count++
  }
  return count
}

console.log(countCharacters('party')) // 5
console.log(countCharacters('')) // 0
console.log(countCharacters(42)) // 0: a number has no length, so the loop never runs
console.log(countCharacters(['a', 'b'])) // 2: an array has a length too!
console.log(countCharacters(null)) // crashes: null has no length at all
```

**What just happened:** the empty string gave `0`, which is right. The number `42` silently gave `0`, the array was counted as if it were a string, and `null` stopped the program with an error. Three invalid inputs, three different behaviors, and none of them was a decision anyone made. That's why you decide what invalid input should do, instead of letting it happen by accident. For `charCount`, we'll accept only strings.

Notice that Big O hasn't come up yet. That's normal: steps 1 and 2 are about **what** to build. How fast it runs is a question for step 5.

**Common mistake:** assuming an input is valid because it looks right. An array has a `length` and can be read by index, just like a string, but it isn't one.
