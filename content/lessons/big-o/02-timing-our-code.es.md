---
title: Midiendo el tiempo de nuestro código
order: 2
minutes: 12
---

> **Meta:** comparar dos soluciones que funcionan con un cronómetro, y ver por qué medir el tiempo no es una medida suficiente.

## La versión con un bucle

Para comparar soluciones necesitamos un problema con más de una buena respuesta. Este es el nuestro: **escribe una función que sume todos los números del 1 al n**, incluido n. Con n = 3, la respuesta es 1 + 2 + 3 = 6. Con n = 6, es 1 + 2 + 3 + 4 + 5 + 6 = 21.

La primera idea de casi todos es un **acumulador**: una variable que empieza en 0 y va juntando la respuesta pedazo por pedazo. Crea un `runningSum` en 0, recorre del 1 al n y suma cada número a `runningSum` en el camino. Cuando termina el bucle, `runningSum` tiene la suma. Es la solución que se nos ocurre primero porque hace exactamente lo que harías a mano.

Mírala correr, una línea a la vez:

```viz
trace-sum-loop
```

**Qué acaba de pasar:** `runningSum` empezó en 0. En cada vuelta del bucle, `i` era el siguiente número, y `runningSum = runningSum + i` lo sumaba. Con n = 3, `runningSum` pasó por 0 → 1 → 3 → 6. Luego `i` se volvió 4, la revisión `i <= n` falló, el bucle se detuvo y la función regresó 6. Fíjate cómo crece el trabajo: n = 3 tomó tres vueltas, y n = 10 tomaría diez.

Este es el mismo código. Presiona **Ejecutar** para comprobar algunas respuestas:

```js-run
function sumOneTo(n) {
  let runningSum = 0
  for (let i = 1; i <= n; i++) {
    runningSum = runningSum + i
  }
  return runningSum
}

console.log(sumOneTo(3)) // 6
console.log(sumOneTo(6)) // 21
console.log(sumOneTo(100)) // 5050
```

**Error común:** escribir el bucle como `i < n`. Se detiene un número antes, así que `sumOneTo(3)` suma 1 + 2 y regresa 3. El problema dice "hasta n, incluido", así que la revisión es `i <= n`.

## La versión con una fórmula

La segunda solución se ve completamente distinta. No hay ningún bucle, solo una línea de matemáticas: **n × (n + 1) ÷ 2**. Es menos intuitiva que el bucle, y no se te ocurriría si no la hubieras visto antes. Está bien: en el código real, muchas buenas soluciones son trucos que alguien encontró una vez y que todos comparten.

¿Por qué funciona? Escribe los números del 1 al 100 en fila y júntalos en parejas desde los dos extremos: 1 + 100, 2 + 99, 3 + 98… Cada pareja suma 101, y hay 50 parejas, así que el total es 50 × 101 = 5,050. La fórmula hace exactamente eso para cualquier n: hay n ÷ 2 parejas, y cada pareja suma n + 1. (Una historia muy conocida cuenta que el matemático Carl Friedrich Gauss la encontró de niño, cuando su maestro le pidió a la clase sumar del 1 al 100.)

Pero cómo funciona no es el punto de esta lección. Lo que importa es que da las mismas respuestas. Mírala:

```viz
trace-sum-formula
```

**Qué acaba de pasar:** con n = 3, la fórmula hizo n + 1 = 4, luego 3 × 4 = 12, luego 12 ÷ 2 = 6. Es el mismo 6 que obtuvo el bucle, pero sin ningún bucle: tres pasos pequeños de matemáticas. Elige una n más grande en la animación, como 1,000,000, y siguen siendo tres pasos. (Lo mismo pasa con n = 6: 6 + 1 = 7, 6 × 7 = 42, 42 ÷ 2 = 21.)

Ejecútala y compara con las respuestas del bucle:

```js-run
function sumOneToFormula(n) {
  return n * (n + 1) / 2
}

console.log(sumOneToFormula(3)) // 6
console.log(sumOneToFormula(6)) // 21
console.log(sumOneToFormula(100)) // 5050
```

Es más corta, pero más corta no significa automáticamente mejor. Dos soluciones que funcionan: entonces, ¿cuál **es** mejor?

**Error común:** quitar los paréntesis. `n * n + 1 / 2` no es la misma fórmula: JavaScript multiplica y divide antes de sumar, así que primero calcula `n * n` y `1 / 2`, y `sumOneToFormula(3)` regresaría 9.5. Los paréntesis en `n * (n + 1) / 2` hacen que la suma vaya primero.

## ¿Qué significa "mejor"?

Antes de responder, tenemos que ponernos de acuerdo en qué significa "mejor". Podría ser:

- **Más rápido:** termina en menos tiempo.
- **Más rápido con entradas grandes:** ser rápido con números pequeños es fácil, pero ¿y sumar hasta mil millones?
- **Menos memoria:** crea menos variables y guarda menos datos mientras corre.
- **Más legible:** otra persona lo puede entender y cambiar.
- **Más corto:** a algunas personas les encanta el código con la menor cantidad de caracteres posible.

Todas son válidas, y la respuesta correcta depende de la situación. Pero casi toda la gente que programa está de acuerdo en que **la velocidad y la memoria** suelen ir primero, y por desgracia, perseguirlas muchas veces hace el código más difícil de leer. Escribir código rápido, ligero **y** fácil de leer es el acto de equilibrio de la buena programación, y va a salir una y otra vez en este curso.

"Más rápido con entradas grandes" es lo que separa a nuestras dos soluciones. Con números pequeños, las dos terminan al instante. La diferencia solo aparece cuando n crece, y de eso trata esta gráfica:

```viz
big-o-growth-chart
```

**Qué acaba de pasar:** cada línea mostró cómo crece el trabajo cuando crece n. Cerca de la orilla izquierda, donde n es pequeña, las líneas están juntas, así que cualquier solución se ve bien. Más a la derecha, se separan mucho. Por eso juzgamos la velocidad por lo que pasa con entradas **grandes**: ahí es donde una solución lenta duele.

La legibilidad también importa. Estas dos funciones hacen las mismas matemáticas, pero solo una te dice qué está haciendo:

```js-run
// Corta, pero difícil de leer:
function f(x) {
  return x * (x + 1) / 2
}

// Las mismas matemáticas, con nombres que las explican:
function sumOneToFormula(n) {
  const pairs = n / 2
  const eachPairAddsUpTo = n + 1
  return pairs * eachPairAddsUpTo
}

console.log(f(100), sumOneToFormula(100))
```

Vamos a empezar con la velocidad, y volveremos a la memoria más adelante en este módulo.

**Error común:** tratar "menos caracteres" como "más rápido". El número de caracteres de tu código no dice nada de cuánto trabajo hace. Una llamada de una línea a un método incluido puede esconder un bucle sobre un millón de elementos.

## Midámoslas

La forma más simple de medir la velocidad es un cronómetro. En el navegador, `performance.now()` te dice cuántos milisegundos han pasado desde que se abrió la página. Guárdalo en una variable antes de que corra el código, revísalo otra vez después y réstalos: la diferencia es cuánto tardó el código, en milisegundos. (Divide entre 1,000 si lo quieres en segundos.)

Quienes programan hacen esto de verdad. Se llama **benchmarking** (medir el rendimiento), y es una buena forma de confirmar que un cambio hizo tu código más rápido. Pero el tiempo tiene un problema, y la siguiente animación lo muestra:

```viz
stopwatch-race
```

**Qué acaba de pasar:** el mismo código corrió en una laptop rápida y en un teléfono viejo. La laptop terminó mucho antes, y una segunda corrida dio tiempos distintos en las dos, aunque nada cambió en el código. Pero las dos máquinas hicieron exactamente el mismo número de pasos, y los pasos solo cambiaron cuando cambió el número de invitados. En la última escena, un trabajo chiquito marcó 0.0 ms en las dos: demasiado rápido para medirlo.

Ahora mide tú nuestras dos soluciones. Antes de presionar **Ejecutar**, predice cuál gana, y más o menos por cuánto. Luego ejecútalo varias veces:

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

const n = 100000000 // 100 millones

let start = performance.now()
sumOneTo(n)
console.log('Bucle:', (performance.now() - start).toFixed(2), 'ms')

start = performance.now()
sumOneToFormula(n)
console.log('Fórmula:', (performance.now() - start).toFixed(2), 'ms')
```

La fórmula gana por mucho. Pero mira los tiempos cuando lo vuelves a ejecutar: cambian en cada ejecución, aunque nada del código cambió. Ese es el **problema con el tiempo**:

1. **Máquinas distintas registran tiempos distintos.** El mismo código es más rápido en una laptop nueva que en un teléfono viejo. El ganador casi siempre es el mismo, pero los números no.
2. **La misma máquina registra tiempos distintos.** Otros programas, el navegador y las optimizaciones de JavaScript cambian un poco en cada ejecución.
3. **El código rápido puede ser demasiado rápido para medirlo.** Cuando varias soluciones terminan en una fracción mínima de milisegundo, el cronómetro no puede decir cuál es de verdad la más eficiente.

**Por dentro:** dos cosas hacen que los tiempos se muevan incluso en una sola computadora. Primero, los motores de JavaScript no ejecutan tu código igual cada vez: observan qué partes se ejecutan mucho, como un bucle muy usado, y las compilan a código de máquina más rápido mientras el programa corre. Así que las primeras ejecuciones pueden ser más lentas que las siguientes, antes de que eso pase. Segundo, los navegadores hacen `performance.now()` un poco menos preciso a propósito, como medida de seguridad, así que un trabajo que tarda unos microsegundos puede aparecer como 0. Las dos son razones para medir con entradas grandes y varias ejecuciones, y las dos son razones para contar operaciones.

Medir el tiempo no es mala idea; quienes programan lo hacen todo el tiempo para confirmar que un cambio ayudó. Pero imagina un código que tarda una hora, comparado con otra versión que tarda cuatro. No quieres ejecutar las dos (¡y esperar cinco horas!) solo para saber cuál es mejor. Necesitamos una forma de hablar de cómo se comporta el código **sin** medirlo. Ahí es donde entra Big O.

**Error común:** medir una vez y confiar en el número. Una sola corrida se puede desviar por cualquier otra cosa que esté haciendo tu computadora. Si vas a medir, hazlo varias veces, con una entrada grande, y compara la tendencia, no un solo resultado.
