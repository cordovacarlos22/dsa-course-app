---
title: Why a stopwatch isn't enough
order: 2
minutes: 6
---

> **Goal:** see why timing code gives unreliable answers, and why counting steps works better.

## Let's time it

The most obvious way to compare two versions of the same code is to time them. Here's that experiment on two computers:

```viz
stopwatch-race
```

JavaScript has a stopwatch built in: `performance.now()` gives you the current time in milliseconds. Save it before the code runs, check it again after, and subtract. Press **Run** a few times:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli', 'Fay', 'Gus', 'Hana']

const start = performance.now()
for (let i = 0; i < guests.length; i++) {
  const message = 'Welcome, ' + guests[i] + '!'
}
const time = performance.now() - start

console.log('Time:', time.toFixed(4), 'ms')
console.log('Steps:', guests.length)
```

You probably got a different time on every run, even though nothing changed. That's the first of three problems with stopwatches:

1. **The same computer gives different times.** Other apps, the browser and JavaScript's own optimizations change a little on every run.
2. **Different computers give different times.** A new laptop and an old phone run the same code at very different speeds. Whose time is the real one?
3. **Fast code is too fast to measure.** With a few guests, both versions finish in about 0 ms, so the stopwatch can't tell which one is better, even when one of them really is.

And imagine code that takes an hour to run. You don't want to wait an hour (twice!) just to compare two ideas.

## Count the steps instead

```viz
trace-welcome-all
```

Timing isn't useless. Developers time their code all the time to check that a change really helped. But to **talk about** code, we need a measure that doesn't depend on the machine, the day, or how many tabs you have open.

Look at the counter in the animation: `welcomeAll` sends **one message per guest**. 3 guests → 3 messages, 6 guests → 6 messages, on a fast laptop or a slow phone, today or next year. The number of steps depends only on two things: the **code** and the **size of the input**. We call the size of the input **n** (here, the number of guests).

That's what Big O does. Instead of timing, it counts steps and asks one question: _when n grows, how does the number of steps grow?_
