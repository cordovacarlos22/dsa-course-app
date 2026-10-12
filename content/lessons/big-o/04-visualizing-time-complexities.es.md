---
title: Visualizando la complejidad temporal
order: 4
minutes: 6
---

> **Meta:** ver en una gráfica cómo crecen dos soluciones, y aprender a leer la tendencia en lugar de los números exactos.

## Grafica el tiempo

Una sola medición con el cronómetro no nos dice mucho. Pero ¿y si medimos las dos versiones de `sumUpTo` con **n cada vez más grande** y ponemos cada resultado en una gráfica?

```viz
timing-chart
```

Hacer una gráfica así es sencillo: para cada valor de n, inicia un temporizador, ejecuta la función, detén el temporizador y pon un punto en (n, tiempo). Luego une los puntos. Aparecen dos imágenes muy distintas:

- **La versión con el bucle** forma una línea recta. Cada vez que n crece la misma cantidad, el tiempo crece más o menos lo mismo. Eso coincide con lo que contamos: unas 5n + 2 operaciones, así que el tiempo crece **en proporción** a n.
- **La versión con la fórmula** se queda plana abajo. Sea n 200 millones o mil millones, tarda más o menos el mismo tiempo mínimo, porque siempre hace 3 operaciones.

Con n = mil millones la diferencia es enorme: más de un segundo para el bucle, una fracción mínima de milisegundo para la fórmula. Los tiempos exactos de la gráfica son ejemplos; tu computadora va a dar otros. Las **formas** son en lo que todas las computadoras coinciden. Los puntos no van a caer perfectamente sobre una línea (las computadoras reales tienen "ruido"), pero están lo bastante cerca para ver la tendencia con claridad.

## Pruébalo tú

```viz
stopwatch-race
```

Ejecuta esto para medir las dos versiones con valores de n cada vez más grandes en tu propia computadora. Ejecútalo varias veces:

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

const sizes = [1000, 10000, 100000, 1000000, 10000000]
for (let k = 0; k < sizes.length; k++) {
  const n = sizes[k]
  let start = performance.now()
  sumUpTo(n)
  const loopTime = performance.now() - start
  start = performance.now()
  sumUpToFormula(n)
  const formulaTime = performance.now() - start
  console.log('n =', n, '| loop:', loopTime.toFixed(3), 'ms | formula:', formulaTime.toFixed(3), 'ms')
}
```

Con n pequeño, los tiempos del bucle brincan de un lado a otro: a esa escala tan pequeña, todo lo demás que pasa en tu computadora pesa más que el trabajo mismo. Que eso no te confunda. Cuando n se hace grande, el tiempo del bucle sube de forma constante (más o menos 10 veces más trabajo cada vez que n es 10 veces más grande), mientras que el de la fórmula casi no se mueve.

Esa es la lección: **no leas los números exactos, lee la tendencia**.

## Las formas que nombra Big O

```viz
big-o-growth-chart
```

Esas tendencias son justo lo que describe Big O. La línea plana de la fórmula se llama **O(1)**, o tiempo constante. La línea recta del bucle es **O(n)**, o tiempo lineal. Hay algunas formas más que vas a conocer en este módulo: **O(n²)**, que se curva hacia arriba muy rápido, y **O(log n)**, que crece muy despacio.

Esto es lo que significan esas formas en la práctica. Al pasar de 1,000 elementos a 1,000,000 (1,000 veces más), una función O(1) hace el mismo trabajo, una función O(n) hace 1,000 veces más trabajo y una función O(n²) hace un **millón** de veces más. Por eso la forma importa más que cualquier medición aislada.

Avanza por la gráfica y compáralas. En la siguiente lección le vamos a dar a Big O su definición oficial, y después vamos a ver cada forma una por una.
