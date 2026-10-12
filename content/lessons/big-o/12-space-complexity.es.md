---
title: Complejidad espacial
order: 12
minutes: 5
---

> **Meta:** medir cuánta memoria extra necesita el código, con el mismo lenguaje de Big O.

## ¿Cuánta memoria crece?

Hasta ahora contamos **pasos** (complejidad temporal). La **complejidad espacial** usa el mismo lenguaje de Big O para la **memoria**: cuando la entrada crece, ¿cuánta memoria extra necesita el código?

```viz
memory-boxes
```

Solo contamos la memoria que el código **crea**, no la entrada misma. La lista de invitados ya existe antes de que corra la función, así que no cuenta. (En los libros quizá veas que a esto le llaman espacio _auxiliar_.)

Reglas prácticas de lo que ocupa espacio:

- **Números, true/false, `null` y `undefined`:** una cantidad fija cada uno, así que unos pocos son O(1).
- **Textos (strings):** el espacio crece con su longitud. Un nombre de 50 letras ocupa unas 50 veces el espacio de un nombre de 1 letra.
- **Arrays y objetos:** el espacio crece con cuántos elementos guardan, así que un array nuevo de n elementos es O(n).

Por ejemplo, `countGuests`, de la lección de contar operaciones, solo necesita dos números: `count` e `i`. Haya 10 invitados o 10 millones, siguen siendo dos números: **espacio O(1)**. En cuanto el código construye algo nuevo para cada invitado (una lista, un objeto con una clave por invitado, un texto largo con todos los nombres), su espacio crece con n.

## El tiempo y el espacio son preguntas separadas

```viz
trace-welcome-all
```

`welcomeAll` tarda **tiempo O(n)**: un mensaje por invitado. Pero solo guarda una variable, `i`, sin importar cuántos invitados haya. Así que es **espacio O(1)**. Rápido o lento y ligero o pesado son preguntas distintas, y una función puede ser buena en una y mala en la otra.

Esta construye un array nuevo con un gafete para cada invitado, así que su memoria crece con n: **espacio O(n)**.

```js-run
const guests = ['Ana', 'Ben', 'Cleo']

const nameTags = []
for (let i = 0; i < guests.length; i++) {
  nameTags.push("Hi, I'm " + guests[i])
}
console.log(nameTags)
```

A veces vas a cambiar una cosa por la otra: usar memoria extra (por ejemplo, recordar los nombres que ya viste) para que el código sea más rápido. En las entrevistas, da las dos respuestas: _"Esto es tiempo O(n) y espacio O(1)."_ Y si te piden usar menos memoria, busca los arrays y objetos nuevos que crea tu código: casi siempre ahí se va el espacio.
