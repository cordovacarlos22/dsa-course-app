---
title: Por qué un cronómetro no es suficiente
order: 2
minutes: 6
---

> **Meta:** ver por qué medir el tiempo del código da respuestas poco confiables y por qué contar operaciones funciona mejor.

## Midamos el tiempo de un código

Esta función cuenta los números pares de un array. La vamos a ejecutar tres veces con el mismo millón de números y medir cada ejecución con `performance.now()`, el cronómetro del navegador:

```js-run
function countEvens(numbers) {
  let count = 0
  for (const number of numbers) {
    if (number % 2 === 0) count++
  }
  return count
}

const numbers = Array.from({ length: 1000000 }, (_, i) => i)

for (let run = 1; run <= 3; run++) {
  const start = performance.now()
  countEvens(numbers)
  const ms = performance.now() - start
  console.log('Ejecución', run, 'tardó', ms.toFixed(2), 'ms')
}
```

Presiona **Ejecutar** varias veces. ¡Los tiempos cambian en cada ejecución, aunque el código y la entrada nunca cambian!

## ¿Qué tiene de malo medir el tiempo?

- **Máquinas distintas, tiempos distintos.** Una laptop rápida y un celular viejo dan números completamente diferentes para el mismo código.
- **La misma máquina tampoco es constante.** Otros programas, el navegador y las optimizaciones de JavaScript afectan cada ejecución.
- **Las entradas pequeñas esconden la diferencia.** Dos algoritmos muy distintos pueden parecer "instantáneos" con 10 elementos.

Necesitamos una medida que dependa solo del **código** y del **tamaño de la entrada**.

## Mejor cuenta las operaciones

Una operación es un paso pequeño: una comparación, una suma, una asignación. Contemos cuántas veces se ejecuta el cuerpo del bucle con distintos tamaños de entrada:

```js-run
function countChecks(numbers) {
  let checks = 0
  for (const number of numbers) {
    checks++ // una revisión de "¿es par?" por cada número
  }
  return checks
}

for (const n of [10, 100, 1000, 10000]) {
  const numbers = Array.from({ length: n }, (_, i) => i)
  console.log('n =', n, '→', countChecks(numbers), 'revisiones')
}
```

Este número es el mismo en cualquier máquina y en cada ejecución. Y muestra lo importante: **el trabajo crece al mismo ritmo que `n`**.

## No necesitamos la cuenta exacta

Si contaras cada operación de `countEvens` (asignar `count`, cada comparación, cada `count++`…), podrías llegar a algo como `2n + 2`. ¿De verdad sería distinto `3n + 5`? No en lo que importa. Con un millón de números, los dos son "más o menos un millón por un número pequeño".

Lo que nos importa es la **forma** del crecimiento: ¿el trabajo se queda plano, crece en línea recta o explota? Eso es exactamente lo que captura Big O, y en las próximas lecciones vas a aprender las reglas sencillas para leerlo.

## Resumen

- Medir el tiempo depende de la máquina y cambia en cada ejecución.
- Contar operaciones depende solo del código y del tamaño de la entrada.
- Big O ignora la cuenta exacta y se queda con la **forma** del crecimiento.

## Compruébalo tú mismo

1. Menciona dos razones por las que medir el tiempo del mismo código puede dar resultados distintos.
2. Si `countChecks` hace 10,000 revisiones con 10,000 números, ¿cuántas hará con 50,000?
3. ¿Por qué no nos importa si una función hace `2n + 2` o `3n + 5` operaciones?
