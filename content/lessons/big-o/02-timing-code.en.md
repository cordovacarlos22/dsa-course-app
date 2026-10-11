---
title: Why a stopwatch isn't enough
order: 2
minutes: 4
---

> **Goal:** see why we count steps instead of timing code in seconds.

## Let's time it

```viz
stopwatch-race
```

The same code, timed on two computers. The seconds change from machine to machine, and even from run to run. The number of **steps** never changes.

Try it on your computer. Press **Run** a few times and watch the time change:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli', 'Fay']

const start = performance.now()
for (let i = 0; i < guests.length; i++) {
  const message = 'Welcome, ' + guests[i] + '!'
}
const time = performance.now() - start

console.log('Time:', time.toFixed(3), 'ms')
console.log('Steps:', guests.length)
```

## Count the steps instead

```viz
trace-welcome-all
```

Steps depend only on the **code** and the **number of guests** (we call it **n**). That's what Big O counts. Pick **6 guests**: double the guests, double the messages.
