---
title: Contando operaciones
order: 3
minutes: 10
---

> **Meta:** contar las operaciones simples de una función en lugar de medir su tiempo, y ver por qué la cuenta exacta no importa.

## Cuenta la fórmula

Si los segundos cambian de una máquina a otra, ¿qué no cambia? Cuántas **operaciones simples** necesita el código. Una **operación simple** es un paso pequeño: una suma, una resta, una multiplicación, una división, una comparación como `i <= n`, o darle un valor a una variable (una **asignación**). Cinco operaciones son cinco operaciones en una laptop rápida o en un teléfono viejo. Una computadora más rápida hace cada una antes, pero no se puede saltar ninguna.

Esa es la idea detrás de Big O: en lugar de medir el tiempo del código, contamos cuántas operaciones necesita y, más importante, cómo cambia esa cuenta cuando crece la entrada. Contar no necesita cronómetro, no cambia entre una corrida y otra, y funciona con código que ni siquiera has ejecutado.

Los números que solo están escritos en el código, como el `1` y el `2` de la fórmula, no son operaciones: son valores que la computadora ya tiene. Y el tamaño de un número tampoco importa. Multiplicar 3 × 4 y multiplicar 3,000,000 × 4,000,000 son una sola multiplicación para la computadora. Contemos primero la versión con la fórmula:

```viz
trace-sum-formula
```

**Qué acaba de pasar:** `n * (n + 1) / 2` tiene una suma, una multiplicación y una división: **3 operaciones**. Y esto es lo importante: no importa si n es 2 o 1,000,000,000. Elige **n = 1,000,000** en la animación y mira cómo el contador se queda en 3. El trabajo nunca crece.

Pruébala con una n enorme. La respuesta aparece al instante, porque mil millones cuestan las mismas 3 operaciones que 3:

```js-run
function sumUpToFormula(n) {
  return n * (n + 1) / 2
}

console.log(sumUpToFormula(3)) // 3 operaciones
console.log(sumUpToFormula(1000000000)) // siguen siendo 3 operaciones
```

**Error común:** pensar que un número más grande significa más operaciones. La fórmula con n = 1,000,000,000 no hace mil millones de nada. El **tamaño** de la entrada solo importa cuando el código hace algo una vez por elemento, o una vez por número, como un bucle.

## Cuenta el bucle

Ahora la versión con el bucle. Su `+` ya no es una sola operación, porque está **dentro de un bucle**. Una operación dentro de un bucle corre una vez por cada vuelta del bucle, así que para contarla, multiplicas por el número de vueltas. Esa es la habilidad clave para el resto de este módulo: encuentra los bucles y pregúntate cuántas veces corre cada uno.

Vamos línea por línea:

- `total = total + i` es una suma **y** una asignación, y corre una vez por número: n sumas y n asignaciones. Si n es 5, son 5 de cada una; si n es mil millones, mil millones de cada una.
- `i++` es la forma corta de `i = i + 1`: otra suma y otra asignación, otra vez n veces.
- `i <= n` es una comparación, que se revisa n veces.
- `let total = 0` y `let i = 1` pasan una **sola vez**, al principio.

Súmalo todo y obtienes unas **5n + 2** operaciones: 5 por cada número, más 2 al principio. Mira cómo sube el contador:

```viz
trace-sum-loop
```

**Qué acaba de pasar:** cada vuelta del bucle costó las mismas 5 operaciones: la comparación, la suma y la asignación de `total = total + i`, y la suma y la asignación de `i++`. Con n = 3 son 5 × 3 + 2 = 17. Elige **n = 10** y obtienes 5 × 10 + 2 = 52. Las dos operaciones del principio nunca se repiten; todo lo demás se repite una vez por número.

| n     | Bucle (5n + 2) | Fórmula |
| ----- | -------------- | ------- |
| 5     | 27             | 3       |
| 10    | 52             | 3       |
| 1,000 | 5,002          | 3       |

Este es el bucle otra vez, ahora llevando su propia cuenta mientras avanza:

```js-run
function countOperations(n) {
  let operations = 2 // let total = 0 y let i = 1, una vez cada una
  let total = 0
  for (let i = 1; i <= n; i++) {
    total = total + i
    operations = operations + 5 // la comparación, + y = en total, + y = en i++
  }
  return operations
}

console.log(countOperations(5)) // 27
console.log(countOperations(10)) // 52
console.log(countOperations(1000)) // 5002
```

**Error común:** preocuparte porque tu cuenta no coincide con la de otra persona. ¿La comparación que finalmente termina el bucle es una operación más? ¿`i++` es una operación o dos? Cada persona puede llegar a un total un poco distinto, como 5n + 2 o 5n + 3, y no pasa nada. Como muestra el siguiente paso, el número exacto no es lo que buscamos.

## Contar "a ojo"

La buena noticia: **el número exacto no importa**. Sea 5n + 2, 3n o 2n, lo que importa es la **tendencia general**: cuando n crece, el número de operaciones crece **más o menos en proporción a n**. Duplica n y duplicas el trabajo. Multiplica n por 1,000 y el trabajo crece unas 1,000 veces. Ese es el panorama general, y el panorama general es lo que le importa a Big O.

¿Por qué podemos ignorar los detalles? Porque con una n grande dejan de importar. Con n = 1,000,000, el "+ 2" de 5n + 2 son dos operaciones de cinco millones. Y ya sea que cada número cueste 5 operaciones o 3, el bucle sigue siendo el que crece con n, mientras que la fórmula no crece nada. Esa diferencia es la que decide qué solución aguanta una entrada enorme.

```viz
linear-boxes
```

**Qué acaba de pasar:** darle la bienvenida a cada invitado fue un paso, así que 4 invitados tomaron 4 pasos, 8 tomaron 8 y 16 tomaron 16. Los puntos formaron una línea recta: el doble de invitados, el doble de trabajo. Ese crecimiento parejo, en proporción, es el que tiene nuestro bucle, sin importar su cuenta exacta por número.

Lo mismo pasa cuando cuentas a los invitados. Contarlos uno por uno con un bucle cuesta unas 5 operaciones por invitado:

```viz
trace-count-guests
```

**Qué acaba de pasar:** el bucle pagó 5 operaciones por cada invitado, más 3 al principio: 5n + 3, otra línea recta. Pero el último texto señaló un atajo: JavaScript ya sabe cuántos elementos tiene un array, así que `guests.length` da la misma respuesta en **1 paso**, haya 4 invitados o 4 millones. La misma respuesta, un crecimiento completamente distinto.

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']

// Contando uno por uno: el trabajo crece con los invitados.
let count = 0
for (let i = 0; i < guests.length; i++) {
  count = count + 1
}
console.log('Con un bucle:', count)

// Preguntándole al array: un paso, sin importar cuántos invitados haya.
console.log('Con length:', guests.length)
```

Así que a partir de ahora no vamos a contar cada operación. Big O es una forma de **contar a ojo**: contar más o menos, y luego quedarse solo con cómo crece la cuenta. Las siguientes lecciones te muestran cómo.

**Error común:** pensar que `guests.length` recorre el array para contarlo. Un array mantiene su tamaño al día cada vez que cambia, así que leer `length` es un solo paso. El costo está en los bucles que escribes tú, y en los métodos que recorren por ti.
