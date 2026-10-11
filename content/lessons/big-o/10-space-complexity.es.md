---
title: Complejidad espacial
order: 10
minutes: 6
---

> **Meta:** medir cuánta memoria extra necesita el código, con el mismo lenguaje de Big O.

## La memoria también es un costo

Hasta ahora contamos pasos. La **complejidad espacial** cuenta otra cosa: cuánta **memoria extra** crea el código cuando crece la entrada. (La entrada en sí no cuenta; solo medimos lo que agrega el código.)

### Algunas reglas prácticas

- Los números, los booleanos, `undefined` y `null` ocupan un espacio fijo → O(1).
- Los strings ocupan espacio proporcional a su largo.
- Los arrays y objetos ocupan espacio proporcional a cuántos elementos guardan.

## Espacio O(1): unas pocas variables

```js-run
function averageScore(scores) {
  let total = 0 // un número
  for (const score of scores) {
    total += score
  }
  return total / scores.length
}

console.log(averageScore([80, 92, 75, 100]))
```

Sin importar cuántas calificaciones haya, la función solo guarda `total` (y la variable del bucle). Eso es **espacio O(1)**, aunque tome **tiempo O(n)**.

## Espacio O(n): un array nuevo que crece

```js-run
function withBonus(scores) {
  const boosted = [] // crece con la entrada
  for (const score of scores) {
    boosted.push(score + 5)
  }
  return boosted
}

console.log(withBonus([80, 92, 75, 100]))
```

Esta función construye un **array nuevo** con un elemento por cada calificación. Si las calificaciones se duplican, la memoria se duplica: **espacio O(n)**.

## Tiempo y espacio son preguntas distintas

| Función        | Tiempo | Espacio extra |
| -------------- | ------ | ------------- |
| `averageScore` | O(n)   | O(1)          |
| `withBonus`    | O(n)   | O(n)          |

En las entrevistas muchas veces preguntan las dos cosas: _"¿Cuál es la complejidad temporal? ¿Y la espacial?"_ A veces vas a cambiar una por la otra, como en la lista de invitados de la primera lección: el `Set` hizo las búsquedas más rápidas usando más memoria.

En resumen:

- **Complejidad espacial** = cuánta memoria extra crece con la entrada.
- Unas pocas variables → espacio O(1). Un array/objeto/string nuevo que crece con la entrada → espacio O(n).
- Cuando te pregunten, responde tiempo **y** espacio.
