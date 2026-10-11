---
title: Complejidad espacial
order: 12
minutes: 4
---

> **Meta:** medir cuánta memoria extra necesita el código, con el mismo lenguaje de Big O.

## ¿Cuánta memoria crece?

```viz
memory-boxes
```

La **complejidad espacial** cuenta la **memoria extra** que crea el código cuando crece la entrada (la entrada misma no cuenta).

- Unos pocos números o valores true/false: **espacio O(1)**.
- Un array, objeto o texto nuevo que crece con la entrada: **espacio O(n)**.

## El tiempo y el espacio son preguntas separadas

```viz
trace-welcome-all
```

`welcomeAll` tarda **tiempo O(n)** (un mensaje por invitado) pero solo guarda `i`: **espacio O(1)**. En las entrevistas muchas veces preguntan las dos cosas: _"¿Cuál es la complejidad temporal? ¿Y la espacial?"_

```js-run
const guests = ['Ana', 'Ben', 'Cleo']

// Espacio O(n): un gafete nuevo por invitado.
const nameTags = []
for (let i = 0; i < guests.length; i++) {
  nameTags.push("Hi, I'm " + guests[i])
}
console.log(nameTags)
```
