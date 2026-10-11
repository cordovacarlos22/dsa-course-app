---
title: Mejor caso, caso promedio y peor caso
order: 3
minutes: 6
---

> **Meta:** saber qué describen Ω (omega), Θ (theta) y O (big O), y por qué en las entrevistas se habla del peor caso.

## El mismo código, distinta cantidad de trabajo

Estás buscando una canción en una playlist desordenada, una canción a la vez. Cuánto tardas depende de **dónde** está la canción:

```js-run
const playlist = ['Intro', 'Sunrise', 'Echo', 'Drift', 'Finale']

function stepsToFind(song) {
  let steps = 0
  for (const track of playlist) {
    steps++
    if (track === song) return steps
  }
  return steps // revisó todas las canciones y no la encontró
}

console.log('Mejor caso (primera canción):', stepsToFind('Intro'), 'paso')
console.log('Canción del medio:', stepsToFind('Echo'), 'pasos')
console.log('Peor caso (no está):', stepsToFind('Encore'), 'pasos')
```

Mismo código, misma playlist, pero 1 paso, 3 pasos o 5 pasos según la entrada.

## Tres letras griegas

En ciencias de la computación cada situación tiene nombre:

| Caso              | Letra                | Significado                                           | Nuestra playlist                          |
| ----------------- | -------------------- | ----------------------------------------------------- | ----------------------------------------- |
| **Mejor** caso    | Ω (omega)            | lo mínimo que puede trabajar el código                | la encontramos al primer intento: Ω(1)    |
| Caso **promedio** | Θ (theta)            | el trabajo que puedes esperar la mayoría de las veces | más o menos la mitad de la playlist: Θ(n) |
| **Peor** caso     | O (big O, "ómicron") | lo máximo que puede trabajar el código                | revisamos todas las canciones: O(n)       |

## Big O significa el peor caso

Cuando alguien dice "el Big O de este código", se refiere al **peor caso**. Esa es la promesa útil: _sin importar la entrada, nunca será más lento que esto_.

Una confusión común es decir "el Big O del mejor caso". Técnicamente, el mejor caso es omega y el caso promedio es theta. Big O siempre es el límite superior.

¿Por qué fijarnos en el peor caso? Porque es el que te muerde. Una búsqueda que casi siempre es rápida, pero a veces revisa un millón de elementos, tarde o temprano va a hacer justo eso con un usuario real.

En resumen:

- El mismo código puede hacer distinta cantidad de trabajo con distintas entradas.
- Ω = mejor caso, Θ = caso promedio, **O = peor caso**.
- "¿Cuál es el Big O?" siempre pregunta por el peor caso.
