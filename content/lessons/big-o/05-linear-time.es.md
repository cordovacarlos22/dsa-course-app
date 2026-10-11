---
title: 'O(n): tiempo lineal'
order: 5
minutes: 4
---

> **Meta:** reconocer código O(n): un paso por elemento.

## Un paso por invitado

```viz
trace-welcome-all
```

El bucle corre **una vez por invitado**. 3 invitados → 3 mensajes. 6 invitados → 6 mensajes. El trabajo crece al mismo ritmo que **n**, el número de invitados.

## Una línea recta

```viz
linear-boxes
```

En una gráfica, O(n) es una **línea recta**. También se llama **tiempo lineal**. Cuando escuches "proporcional" en una entrevista, piensa en O(n).

Encuéntralo en el código: **un bucle** que visita cada elemento un número fijo de veces.

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']

let letters = 0
for (let i = 0; i < guests.length; i++) {
  letters = letters + guests[i].length
}
console.log('Letters in all the names:', letters)
```
