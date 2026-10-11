---
title: 'O(n²): bucles anidados'
order: 6
minutes: 6
---

> **Meta:** reconocer código O(n²) y entender por qué se vuelve lento tan rápido.

## Cada pareja, una vez de cada lado

Un club de ajedrez quiere que cada jugador juegue contra todos los demás, una vez con blancas y otra con negras. Hagamos la lista de partidas con un bucle dentro de otro bucle:

```js-run
const players = ['Ada', 'Ben', 'Cy']

let games = 0
for (const white of players) {
  for (const black of players) {
    if (white !== black) console.log(white, 'vs', black)
    games++ // contamos cada paso interno, incluso cuando un jugador se enfrenta a sí mismo
  }
}
console.log('Pasos internos:', games)
```

Por cada uno de los 3 jugadores, el bucle interno se ejecuta 3 veces: **3 × 3 = 9** pasos. Con `n` jugadores son **n × n = n²**.

Eso es **O(n²)**, también llamado **tiempo cuadrático**. Cuando veas un bucle dentro de otro bucle, los dos sobre la misma entrada, piensa en O(n²).

## ¿Qué tan rápido crece?

```js-run
function innerSteps(n) {
  let steps = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      steps++
    }
  }
  return steps
}

for (const n of [10, 100, 1000]) {
  console.log('n =', n, '→', innerSteps(n), 'pasos')
}
```

10 veces más jugadores significa **100 veces** más trabajo. Por eso el código O(n²) parece bien en las pruebas y luego se arrastra con datos reales.

Un tercer bucle anidado vuelve a multiplicar: **n × n × n = O(n³)**, que crece todavía más rápido.

## O(n²) es una señal de alerta

Los bucles anidados no siempre se pueden evitar, pero muchas veces son una pista de que hay una forma más inteligente. Muchos problemas de entrevista empiezan con una idea O(n²) y te piden llevarla a O(n). En este curso, el módulo de patrones te va a enseñar cómo.

## Resumen

- Un bucle dentro de otro bucle sobre la misma entrada → **O(n²)**.
- 10× la entrada → 100× el trabajo.
- Tres bucles anidados → O(n³).

## Compruébalo tú mismo

1. Dos bucles anidados sobre un array de 50 elementos: ¿cuántos pasos internos?
2. Si n pasa de 1,000 a 2,000, ¿cuánto más trabajo hace el código O(n²)?
3. ¿Qué Big O tienen tres bucles anidados sobre el mismo array?
