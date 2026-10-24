---
title: Visualizando la complejidad temporal
order: 4
minutes: 11
---

> **Meta:** ver en una gráfica cómo crecen dos soluciones, y aprender a leer la tendencia en lugar de los números exactos.

## Grafica el tiempo

Una sola medición con el cronómetro no nos dice mucho: es un solo número, de una sola corrida, en una sola computadora. Pero ¿y si medimos las dos versiones de `sumOneTo` con **n cada vez más grande** y ponemos cada resultado en una gráfica? Entonces ya no estamos viendo un número. Estamos viendo una **tendencia**: cómo cambia el tiempo cuando crece la entrada.

Hacer una gráfica así es sencillo. El eje horizontal es **n**, el tamaño de la entrada. El eje vertical es el **tiempo** que tardó la función. Para cada valor de n, inicia un temporizador, ejecuta la función, detén el temporizador y pon un punto en (n, tiempo). Luego une los puntos. La forma que hacen los puntos te dice más que cualquiera de ellos.

Hay dos formas que buscar. Una **línea recta** que sube significa que el tiempo crece **en proporción** a n: cada vez que n crece la misma cantidad, el tiempo crece más o menos lo mismo. Una **línea plana** significa que n no afecta el tiempo para nada. Así se ven nuestras dos soluciones:

```viz
timing-chart
```

**Qué acaba de pasar:** aparecieron dos imágenes muy distintas.

- **La versión con el bucle** formó una línea recta. Cada vez que n creció 200 millones, el tiempo creció más o menos lo mismo. Eso coincide con lo que contamos: unas 5n + 2 operaciones, así que el tiempo crece **en proporción** a n.
- **La versión con la fórmula** se quedó plana abajo. Sea n 200 millones o mil millones, tarda más o menos el mismo tiempo mínimo, porque siempre hace 3 operaciones.

Con n = mil millones la diferencia es enorme: más de un segundo para el bucle, una fracción mínima de milisegundo para la fórmula. Los tiempos exactos de la gráfica son ejemplos; tu computadora va a dar otros. Las **formas** son en lo que todas las computadoras coinciden. Los puntos no van a caer perfectamente sobre una línea (las computadoras reales tienen "ruido"), pero están lo bastante cerca para ver la tendencia con claridad.

Puedes dibujar las mismas dos formas con operaciones en vez de tiempo. Esto imprime un `#` por operación, así que cada línea es una barra:

```js-run
const sizes = [1, 2, 3, 4, 5]
for (let k = 0; k < sizes.length; k++) {
  const n = sizes[k]
  let loopBar = ''
  for (let i = 0; i < 5 * n + 2; i++) {
    loopBar = loopBar + '#'
  }
  console.log('n = ' + n + ' | bucle:   ' + loopBar)
  console.log('      | fórmula: ###')
}
```

**Error común:** esperar que los puntos caigan exactamente sobre una línea. Los tiempos reales se mueven un poco. Si los puntos están cerca de una línea recta, el crecimiento es lineal; no necesitas una línea perfecta para ver la forma.

## Pruébalo tú

Ahora mide las dos versiones en tu propia computadora, con valores de n cada vez más grandes. Antes de ejecutarlo, una advertencia sobre las entradas pequeñas: cuando el trabajo tarda una fracción mínima de milisegundo, todo lo demás que pasa en tu computadora (otras apps, el navegador, JavaScript preparándose para correr tu código más rápido) pesa más que el trabajo mismo. Ese **ruido** hace que los tiempos pequeños brinquen de una corrida a otra.

También hay un truco para leer los resultados: compara cada resultado con el anterior. Nuestros tamaños crecen 10 veces en cada paso. Si el tiempo también crece unas 10 veces, el trabajo crece en proporción a n, una línea recta. Si el tiempo casi no cambia, la línea es plana.

¿Recuerdas la carrera de cronómetros de la lección 2? Ten en mente su última escena mientras ejecutas el código:

```viz
stopwatch-race
```

**Qué acaba de pasar:** los tiempos cambiaron de máquina a máquina y de corrida a corrida, pero los pasos no. Y en la última escena, un trabajo chiquito marcó 0.0 ms en las dos máquinas, porque era demasiado rápido para medirlo. Eso es justo lo que vas a ver con los valores más pequeños de n.

Ejecuta esto varias veces:

```js-run
function sumOneTo(n) {
  let runningSum = 0
  for (let i = 1; i <= n; i++) {
    runningSum = runningSum + i
  }
  return runningSum
}

function sumOneToFormula(n) {
  return n * (n + 1) / 2
}

const sizes = [1000, 10000, 100000, 1000000, 10000000]
for (let k = 0; k < sizes.length; k++) {
  const n = sizes[k]
  let start = performance.now()
  sumOneTo(n)
  const loopTime = performance.now() - start
  start = performance.now()
  sumOneToFormula(n)
  const formulaTime = performance.now() - start
  console.log('n =', n, '| bucle:', loopTime.toFixed(3), 'ms | fórmula:', formulaTime.toFixed(3), 'ms')
}
```

Con n pequeño, los tiempos del bucle brincan de un lado a otro: a esa escala tan pequeña, todo lo demás que pasa en tu computadora pesa más que el trabajo mismo. Que eso no te confunda. Cuando n se hace grande, el tiempo del bucle sube de forma constante (más o menos 10 veces más trabajo cada vez que n es 10 veces más grande), mientras que el de la fórmula casi no se mueve.

Esa es la lección: **no leas los números exactos, lee la tendencia**.

Este es el truco de comparar hecho con conteos de operaciones, que nunca se mueven. Cada tamaño es 10 veces el anterior, así que divide cada conteo entre el anterior: cerca de 10 significa que el trabajo crece en proporción a n, y 1 significa que no crece nada. Predice qué van a mostrar los números del bucle y luego ejecútalo:

```js-run
const sizes = [1000, 10000, 100000, 1000000]
let previousLoop = 0
for (let k = 0; k < sizes.length; k++) {
  const n = sizes[k]
  const loopOperations = 5 * n + 2
  const formulaOperations = 3
  let growth = ''
  if (previousLoop > 0) {
    growth = ' (' + (loopOperations / previousLoop).toFixed(2) + ' veces el anterior)'
  }
  console.log('n = ' + n + ': bucle ' + loopOperations + growth + ' | fórmula ' + formulaOperations)
  previousLoop = loopOperations
}
```

Cada vez que n creció 10 veces, la cuenta del bucle creció 10 veces: una línea recta. La cuenta de la fórmula se quedó en 3: una línea plana. Usa la misma prueba con tiempos reales: con entradas grandes, una razón cerca de 10 significa que el trabajo crece en proporción a n, aunque los milisegundos exactos se muevan.

**Error común:** decidir con una sola corrida pequeña que el bucle "a veces es más rápido". Con entradas chiquitas, el ruido pesa más que el trabajo, así que cualquiera de las dos versiones puede parecer más rápida. Solo las entradas grandes muestran cuál crece de verdad.

## Las formas que nombra Big O

Esas tendencias son justo lo que describe Big O. Cada forma tiene un nombre, que se escribe con una O mayúscula y, entre paréntesis, cómo crece el trabajo con n:

- **O(1)**, **tiempo constante:** una línea plana. El trabajo se queda igual por grande que sea n, como la fórmula.
- **O(n)**, **tiempo lineal:** una línea recta. El trabajo crece en proporción a n, como el bucle.
- **O(n²)**, **tiempo cuadrático:** una curva que se dobla hacia arriba muy rápido. El trabajo crece con n × n.
- **O(log n)**, **tiempo logarítmico:** una curva que crece muy despacio. Duplicar n agrega solo un paso más.

Más adelante en el módulo vas a tener una lección completa sobre cada una. Por ahora, lo importante es que **la forma importa más que cualquier medición aislada**. Al pasar de 1,000 elementos a 1,000,000 (1,000 veces más), una función O(1) hace el mismo trabajo, una función O(n) hace 1,000 veces más trabajo y una función O(n²) hace un **millón** de veces más.

```viz
big-o-growth-chart
```

**Qué acaba de pasar:** la gráfica dibujó cada forma en los mismos ejes. O(1) se quedó plana, O(log n) subió despacito, O(n) subió en línea recta, y O(n²) se disparó, llegando a 1,000,000 de operaciones con n = 1,000. Recórrela otra vez y compara dónde queda cada línea en la orilla derecha.

Ejecuta los números detrás de esa comparación:

```js-run
const small = 1000
const big = 1000000 // 1,000 veces más elementos

console.log('O(1):  ', 1, '→', 1, 'operaciones')
console.log('O(n):  ', small, '→', big, 'operaciones')
console.log('O(n²): ', small * small, '→', big * big, 'operaciones')
console.log('O(n²) creció', (big * big) / (small * small), 'veces')
```

En la siguiente lección le vamos a dar a Big O su definición oficial, y después vamos a ver cada forma una por una.

**Error común:** pensar que O(n²) es "un poquito peor" que O(n). Con 10 elementos la diferencia es pequeña (100 pasos contra 10). Con un millón de elementos, es un millón de pasos contra un **billón** (un millón de millones). La distancia sigue creciendo conforme crece n.
