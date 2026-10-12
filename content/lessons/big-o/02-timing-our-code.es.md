---
title: Midiendo el tiempo de nuestro código
order: 2
minutes: 9
---

> **Meta:** comparar dos soluciones que funcionan con un cronómetro, y ver por qué medir el tiempo no es suficiente.

## La versión con un bucle

Comparemos dos soluciones al mismo problema: **escribe una función que sume todos los números del 1 al n**. Con n = 3, la respuesta es 1 + 2 + 3 = 6.

La primera idea de casi todos: empezar un `total` en 0 y recorrer del 1 al n sumando cada número. Mírala correr:

```viz
trace-sum-loop
```

Este es el mismo código. Presiona **Ejecutar** para comprobar algunas respuestas:

```js-run
function sumUpTo(n) {
  let total = 0
  for (let i = 1; i <= n; i++) {
    total = total + i
  }
  return total
}

console.log(sumUpTo(3)) // 6
console.log(sumUpTo(6)) // 21
console.log(sumUpTo(100)) // 5050
```

## La versión con una fórmula

La segunda solución se ve completamente distinta. No hay ningún bucle, solo una línea de matemáticas: **n × (n + 1) ÷ 2**.

```viz
trace-sum-formula
```

¿Por qué funciona? Escribe los números del 1 al 100 en fila y júntalos en parejas desde los dos extremos: 1 + 100, 2 + 99, 3 + 98… Cada pareja suma 101, y hay 50 parejas, así que el total es 50 × 101 = 5,050. La fórmula hace exactamente eso para cualquier n. Pero cómo funciona no es el punto de esta lección. Lo que importa es que da las mismas respuestas:

```js-run
function sumUpToFormula(n) {
  return n * (n + 1) / 2
}

console.log(sumUpToFormula(3)) // 6
console.log(sumUpToFormula(6)) // 21
console.log(sumUpToFormula(100)) // 5050
```

Es más corta, pero más corta no significa automáticamente mejor. Dos soluciones que funcionan: entonces, ¿cuál **es** mejor?

## ¿Qué significa "mejor"?

```viz
big-o-growth-chart
```

Antes de responder, tenemos que ponernos de acuerdo en qué significa "mejor". Podría ser:

- **Más rápido:** termina en menos tiempo.
- **Más rápido con entradas grandes:** ser rápido con números pequeños es fácil, pero ¿y sumar hasta mil millones?
- **Menos memoria:** crea menos variables y guarda menos datos mientras corre.
- **Más legible:** otra persona lo puede entender y cambiar.
- **Más corto:** a algunas personas les encanta el código con la menor cantidad de caracteres posible.

Todas son válidas, y la respuesta correcta depende de la situación. Pero la mayoría de los desarrolladores está de acuerdo en que **la velocidad y la memoria** suelen ir primero, y por desgracia muchas veces se ganan a costa de la legibilidad. Escribir código rápido, ligero **y** fácil de leer es el acto de equilibrio de la buena programación, y va a salir una y otra vez en este curso.

Vamos a empezar con la velocidad, y volveremos a la memoria más adelante en este módulo.

## Midámoslas

```viz
stopwatch-race
```

La forma más simple de medir la velocidad es un cronómetro. En el navegador, `performance.now()` te dice cuántos milisegundos han pasado desde que se abrió la página. Guárdalo antes de que corra el código, revísalo otra vez después y réstalos. Presiona **Ejecutar** varias veces:

```js-run
function sumUpTo(n) {
  let total = 0
  for (let i = 1; i <= n; i++) {
    total = total + i
  }
  return total
}

function sumUpToFormula(n) {
  return n * (n + 1) / 2
}

const n = 100000000 // 100 million

let start = performance.now()
sumUpTo(n)
console.log('Loop:', (performance.now() - start).toFixed(2), 'ms')

start = performance.now()
sumUpToFormula(n)
console.log('Formula:', (performance.now() - start).toFixed(2), 'ms')
```

La fórmula gana por mucho. Pero mira los tiempos cuando lo vuelves a ejecutar: cambian en cada ejecución, aunque nada del código cambió. Ese es el **problema con el tiempo**:

1. **Máquinas distintas registran tiempos distintos.** El mismo código es más rápido en una laptop nueva que en un teléfono viejo. El ganador casi siempre es el mismo, pero los números no.
2. **La misma máquina registra tiempos distintos.** Otros programas, el navegador y las optimizaciones de JavaScript cambian un poco en cada ejecución.
3. **El código rápido puede ser demasiado rápido para medirlo.** Cuando varias soluciones terminan en una fracción mínima de milisegundo, el cronómetro no puede decir cuál es de verdad la más eficiente.

Medir el tiempo no es mala idea; los desarrolladores lo hacen todo el tiempo para confirmar que un cambio ayudó. Pero imagina un código que tarda una hora, comparado con otra versión que tarda cuatro. No quieres ejecutar las dos (¡y esperar cinco horas!) solo para saber cuál es mejor. Necesitamos una forma de hablar de cómo se comporta el código **sin** medirlo. Ahí es donde entra Big O.
