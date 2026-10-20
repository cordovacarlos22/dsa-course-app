---
title: La introducción oficial a Big O
order: 5
minutes: 11
---

> **Meta:** conocer el significado oficial de Big O y usarlo en cuatro ejemplos.

## Contar "a ojo", ahora oficial

Hemos estado hablando de Big O sin presentarlo oficialmente. Aquí está: **la notación Big O es una forma formal de contar "a ojo".** Nos deja decir con precisión **cómo cambia el tiempo de ejecución de un algoritmo cuando su entrada se hace más grande**. Eso es todo: una descripción de la relación entre el tamaño de la entrada y el tiempo que tarda el código.

"Formal" es la palabra importante. Contar "a ojo" por sí solo es solo una costumbre: contar más o menos y quedarse con la tendencia. Big O convierte esa costumbre en una regla precisa que todos usan igual, para que cuando alguien dice "esto es O(n)", cualquier otro desarrollador sepa exactamente de qué tipo de crecimiento habla. Ignora a propósito los detalles pequeños y se queda solo con la tendencia general.

Ya vimos dos tendencias:

- Con la versión de `sumUpTo` que usa la fórmula, el tamaño de n no cambia el tiempo para nada.
- Con la versión del bucle, cuando n crece, el tiempo de ejecución crece con él en una relación más o menos de uno a uno.

Aquí están otra vez, medidas con n cada vez más grande:

```viz
timing-chart
```

**Qué acaba de pasar:** los tiempos del bucle se alinearon en una línea recta, y los de la fórmula se quedaron planos abajo. Esas dos líneas son lo que describe Big O. No le importa que el bucle tardara un poco más de un segundo con n = mil millones en una computadora en particular; le importa que el tiempo del bucle crece **con** n, y el de la fórmula no.

Cuando no estés seguro con un código, pregúntate: _cuando la entrada crece, ¿cómo se va a ver esta gráfica?_ ¿El tiempo se queda plano, crece en línea recta o se dispara? Puedes responderlo duplicando n y viendo qué pasa con el trabajo:

```js-run
// Las cuentas de operaciones que encontramos en la lección 3:
function loopOperations(n) {
  return 5 * n + 2
}
function formulaOperations(n) {
  return 3
}

let n = 1000
for (let i = 0; i < 4; i++) {
  console.log('n =', n, '| bucle:', loopOperations(n), '| fórmula:', formulaOperations(n))
  n = n * 2
}
```

Cada vez que n se duplica, el trabajo del bucle más o menos se duplica y el de la fórmula se queda quieto. Esa es toda la respuesta a "¿cuál es el Big O?": no un número de segundos, sino cómo responde el trabajo cuando crece la entrada.

**Error común:** pensar que Big O te dice cuánto tarda el código. "O(n)" no significa "n milisegundos" ni nada parecido. Es una descripción del crecimiento, y por eso el mismo código tiene el mismo Big O en cualquier computadora.

## La definición

Esta es la definición oficial. Se ve aterradora, así que justo después la desarmamos:

> Un algoritmo es **O(f(n))** si, **cuando n ya es lo bastante grande**, el número de operaciones simples que necesita nunca es mayor que **una constante por f(n)**.

`f(n)` solo quiere decir "alguna función de n": una fórmula que convierte el tamaño de la entrada en una cantidad de trabajo. Las más comunes son:

- **f(n) = n**: lineal. Cuando n crece, el tiempo crece en proporción.
- **f(n) = n²**: cuadrática. El tiempo crece con el cuadrado de n.
- **f(n) = 1**: constante. Cuando n crece, el tiempo no cambia.
- …y algunas más que vas a conocer pronto, como log n.

Ahora las dos partes difíciles. "**Una constante por** f(n)" significa que podemos multiplicar f(n) por el número fijo que queramos, mientras no dependa de n. "**Cuando n ya es lo bastante grande**" significa que la cuenta solo tiene que quedarse debajo de ese límite con entradas grandes; con entradas chiquitas, se vale cualquier cosa. (En matemáticas se dice que la cuenta queda debajo del límite **tarde o temprano**.) Juntas, son las que hacen que Big O cuente "a ojo": le permiten ignorar los detalles que no importan con entradas grandes.

```viz
same-shape
```

**Qué acaba de pasar:** n, 2n y 3n dibujaron líneas rectas. 2n y 3n eran más empinadas, pero tenían la misma **forma**: duplica la entrada y cada una se duplica. Solo n² fue distinta, doblándose hacia arriba y dejando atrás a las demás. Lo empinado es lo que absorbe "una constante por f(n)"; la forma es lo que se queda Big O.

Esta es la definición en acción. La versión con el bucle hace unas 5n + 2 operaciones. Cuando n es al menos 2, eso nunca es mayor que 6 × n, así que es **O(n)**. Ejecútalo y mira dónde empieza "lo bastante grande":

```js-run
for (let n = 1; n <= 6; n++) {
  const operations = 5 * n + 2
  const limit = 6 * n
  console.log('n =', n, '| 5n + 2 =', operations, '| 6n =', limit, '| ¿debajo del límite?', operations <= limit)
}
```

Con n = 1, la cuenta pasa el límite (7 contra 6). Desde n = 2, nunca lo vuelve a pasar. No importa si la cuenta es 1n, 5n o 50n: en una gráfica gigante, todas son líneas rectas, y las simplificamos a solo n.

Una cosa más que recordar: Big O describe el **peor caso**, el límite superior del tiempo de ejecución. Sea cual sea la entrada, el código no va a hacerlo peor que esto.

**Error común:** pensar que "una constante por f(n)" deja que cualquier código sea O(n) si eliges una constante lo bastante grande. Pruébalo con n²: incluso con una constante de 1,000, n² pasa a 1,000 × n en cuanto n pasa de 1,000, y nunca regresa. Ninguna constante puede hacer que una curva que se dobla hacia arriba se quede debajo de una línea recta.

## Cuatro ejemplos

Es hora de ponerle etiqueta a código real. Para cada función, hazte la pregunta del paso 1: cuando n crece, ¿el trabajo se queda plano, crece en línea o se dispara? No necesitas contar cada operación. Busca los bucles y pregúntate cuántas veces corre cada uno.

1. **`sumUpToFormula(n)`** siempre hace 3 operaciones. La línea es plana: **O(1)**.
2. **`sumUpTo(n)`** con un bucle hace unas 5n + 2 operaciones: **O(n)**.
3. **`countUpAndDown(n)`** cuenta hacia arriba de 0 a n − 1 y luego de regreso hacia abajo, con dos bucles uno **después** del otro. Cada bucle crece con n, así que el total es unas 2n. Quizá quieras llamarla O(2n), pero Big O solo se queda con la forma general, así que es simplemente **O(n)**.
4. **`printPairs(n)`** imprime cada pareja de números de 0 a n − 1 con un bucle **dentro** de otro bucle. Eso es muy distinto de dos bucles seguidos. Como los bucles están anidados, el de adentro corre todas sus n vueltas **por cada vuelta** del de afuera.

Mira los bucles anidados de `printPairs`:

```viz
trace-print-pairs
```

**Qué acaba de pasar:** con i = 0, el bucle de adentro pasó por cada j: (0, 0), (0, 1), (0, 2)… Luego i pasó a 1, y el bucle de adentro empezó otra vez desde el principio. Con n = 3, son 3 vueltas del bucle de afuera × 3 vueltas del de adentro = 9 parejas. Elige n = 4 y obtienes 16.

Ejecuta `countUpAndDown` y cuenta sus líneas:

```js-run
function countUpAndDown(n) {
  console.log('¡Subiendo!')
  for (let i = 0; i < n; i++) {
    console.log(i)
  }
  console.log('¡Arriba! Ahora bajando...')
  for (let j = n - 1; j >= 0; j--) {
    console.log(j)
  }
  console.log('De regreso abajo.')
}

countUpAndDown(3)
```

Seis números para n = 3: dos bucles de n, así que unas 2n, y eso es **O(n)**. Ahora cuenta las parejas que visita `printPairs`:

```js-run
function printPairs(n) {
  let pairs = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      pairs = pairs + 1
    }
  }
  return pairs
}

console.log('n = 2:', printPairs(2), 'parejas') // 4
console.log('n = 3:', printPairs(3), 'parejas') // 9
console.log('n = 4:', printPairs(4), 'parejas') // 16
```

2 → 4, 3 → 9, 4 → 16: el tiempo crece como n × n, así que es **O(n²)**. Eso crece mucho más rápido que O(n): prueba con n = 1,000 y obtienes un millón de parejas.

Así que nuestras cuatro funciones son: constante, lineal, lineal y cuadrática. Si esto se siente como mucho, es normal. Las siguientes lecciones ven cada forma con calma, una por una.

**Error común:** ver dos bucles y decir O(2n) siempre. Dos bucles **seguidos** se suman: n + n = 2n, que es O(n). Dos bucles **uno dentro del otro** se multiplican: n × n, que es O(n²). Antes de contar, fíjate dónde está el segundo bucle.
