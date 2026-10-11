---
title: ¿Qué es Big O?
order: 1
minutes: 7
---

> **Meta:** entender qué mide Big O y por qué contamos pasos en lugar de segundos.

## Dos formas de revisar una lista de invitados

Estás en la puerta de una fiesta con la lista de invitados. Alguien llega y dice su nombre. ¿Está en la lista?

Aquí hay dos programas que responden esa pregunta:

```js-run
const guests = ['Ana', 'Luis', 'Maya', 'Omar', 'Zoe']

// Versión 1: leer la lista desde arriba hasta encontrar el nombre.
function isInvitedList(name) {
  for (const guest of guests) {
    if (guest === name) return true
  }
  return false
}

// Versión 2: poner los nombres en un Set una vez y luego preguntarle al Set.
const guestSet = new Set(guests)
function isInvitedSet(name) {
  return guestSet.has(name)
}

console.log(isInvitedList('Omar'), isInvitedSet('Omar'))
console.log(isInvitedList('Leo'), isInvitedSet('Leo'))
```

Presiona **Ejecutar**. Las dos versiones dan las mismas respuestas. Entonces, ¿cuál es mejor?

Con 5 invitados no se nota. Ahora imagina un estadio con un millón de nombres en la lista.

## Cuenta los pasos, no los segundos

Tu primera idea podría ser un cronómetro: ejecutar las dos y ver cuál termina primero. El problema es que el cronómetro mide tu _computadora_ tanto como tu _código_. El mismo programa corre más rápido en una laptop nueva que en un celular viejo.

Así que, en lugar de eso, contamos **pasos**: cuántos nombres tiene que revisar cada versión. Ese número no depende de la máquina. Contémoslos con listas cada vez más grandes, buscando un nombre que no está (el caso más lento para la versión 1):

```js-run
function checksWithList(list, name) {
  let checks = 0
  for (const guest of list) {
    checks++
    if (guest === name) break
  }
  return checks
}

for (const n of [10, 1000, 1000000]) {
  const list = Array.from({ length: n }, (_, i) => 'invitado-' + i)
  console.log('n =', n, '→ la lista necesita', checksWithList(list, 'Leo'), 'revisiones')
}
console.log('El Set necesita más o menos 1 revisión, sin importar cuántos invitados haya.')
```

La versión con la lista hace **una revisión por invitado**, así que su trabajo crece con el número de invitados, `n`. El Set va directo a la respuesta: su trabajo es más o menos el mismo con 10 invitados o con un millón.

Eso es lo que describe **Big O**: **cómo crece el trabajo cuando crece la entrada**.

- `isInvitedList` es **O(n)**: el trabajo crece al mismo ritmo que `n`.
- `isInvitedSet` es **O(1)** (en promedio): el trabajo se mantiene igual, sin importar cuánto valga `n`.

## Cómo se ven las distintas formas de crecer

Recorre la gráfica paso a paso. Cada línea es una forma en que el trabajo puede crecer cuando `n` se hace más grande:

```viz
big-o-growth-chart
```

La diferencia entre estas líneas es pequeña con entradas chicas y enorme con entradas grandes. Por eso importa Big O: los programas reales manejan miles o millones de elementos.

## Tiempo y espacio

Big O mide dos cosas:

- **Complejidad temporal:** cómo crece el número de **pasos** con la entrada.
- **Complejidad espacial:** cuánta **memoria extra** necesita el código cuando crece la entrada.

Nuestra lista de invitados muestra el intercambio. El Set es más rápido, pero es una **segunda copia** de todos los nombres, así que usa memoria extra: O(n) de espacio. La versión con la lista no usa memoria extra: O(1) de espacio. En una entrevista te pueden decir: _"Muy bien, es rápido. ¿Puedes hacerlo con menos memoria?"_ Vamos a hablar sobre todo del tiempo, pero ten en cuenta el espacio.

## Resumen de Big O

| Código                | Tiempo           | Espacio extra |
| --------------------- | ---------------- | ------------- |
| `isInvitedList(name)` | O(n)             | O(1)          |
| `isInvitedSet(name)`  | O(1) en promedio | O(n)          |

## Compruébalo tú mismo

1. ¿Por qué no medimos la velocidad del código con un cronómetro?
2. Si la lista de invitados se hace 10 veces más grande, ¿qué pasa con el trabajo de `isInvitedList`? ¿Y con el de `isInvitedSet`?
3. La versión con el Set es más rápida. ¿Qué cuesta a cambio?

Cuando termines las lecciones de Big O, haz el **cuestionario de Big O** en la página del módulo.
