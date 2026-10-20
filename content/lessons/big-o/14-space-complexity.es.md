---
title: Complejidad espacial
order: 14
minutes: 11
---

> **Meta:** medir cuánta memoria extra necesita un código, con la misma notación Big O.

## ¿Cuánta memoria crece?

Hasta ahora nos preocupamos por el **tiempo**: cuánto más tarda un algoritmo cuando su entrada se hace más grande. Eso es la **complejidad temporal**. Ahora veamos la **complejidad espacial**: cuánta **memoria** ocupa un algoritmo cuando crece su entrada. Usamos la misma notación Big O y las mismas reglas (quitar las constantes, quitar los términos no dominantes); solo medimos otra cosa.

Cada valor que crea tu código vive en algún lugar de la memoria de la computadora: cada variable, cada array nuevo, cada texto nuevo. La complejidad espacial pregunta cómo crece la cantidad de memoria **nueva** con la entrada. Una función que guarda un solo contador necesita la misma memoria para 10 invitados o para 10 millones. Una función que hace un gafete nuevo para cada invitado necesita más memoria entre más larga es la lista.

Primero hay que aclarar algo. Cuando n crece, obviamente la entrada también crece: una lista de un millón de invitados ocupa más memoria que una de 10. Esa parte la **ignoramos**. Lo que medimos es el espacio que el algoritmo **necesita por sí mismo**, aparte de la entrada. Si lees sobre esto en internet, quizá veas que se llama **complejidad espacial auxiliar**. En este curso, a menos que digamos lo contrario, "complejidad espacial" quiere decir complejidad espacial auxiliar: lo que pasa **dentro** del algoritmo.

```viz
memory-boxes
```

**Qué acaba de pasar:** contar a los invitados necesitó una caja de memoria, el contador, ya fueran 3 invitados o 6: **espacio O(1)**. Hacer un gafete para cada invitado necesitó una caja nueva por invitado, así que 6 invitados fueron 6 cajas: **espacio O(n)**. La lista de invitados fue la misma en los dos casos, y no contó.

Esta es una función que lee a cada invitado pero solo guarda un nombre extra:

```js-run
function longestName(guests) {
  let longest = guests[0] // un valor extra...
  for (let i = 1; i < guests.length; i++) {
    // ...y la variable del bucle, i
    if (guests[i].length > longest.length) {
      longest = guests[i]
    }
  }
  return longest
}

console.log(longestName(['Ana', 'Ben', 'Cleo', 'Dev']))
```

Mira a los n invitados, así que es O(n) de **tiempo**. Pero solo guarda `longest` e `i`, por larga que sea la lista, así que es O(1) de **espacio**.

**Error común:** contar la entrada como el espacio de la función. Toda función que recibe un array de n elementos "tiene" n elementos en memoria, pero esa memoria ya estaba ahí antes de que corriera la función. Cuenta solo lo que la función crea.

## Reglas prácticas para el espacio

Igual que con el tiempo, unas cuantas reglas prácticas cubren casi todo el código. Dependen del tipo de valor que crea el código:

- **La mayoría de los primitivos ocupan espacio constante.** Los booleanos, los números, `undefined` y `null` ocupan la misma memoria sin importar su valor: el número 1 y el número 1,000 cuestan lo mismo, igual que `true` y `false`. O(1).
- **Los textos (strings) ocupan espacio O(n)**, donde n es el largo del texto. Un texto de 50 caracteres ocupa unas 50 veces el espacio de uno de 1 carácter.
- **Los tipos por referencia (arrays y objetos) en general son O(n)**, donde n cuenta los elementos del array o las claves del objeto. Un array de 4 elementos ocupa el doble de espacio que uno de 2.

Así que para encontrar la complejidad espacial de una función, fíjate en lo que **crea**: unos cuantos números y booleanos son O(1), y un array, un objeto o un texto que crece con la entrada es O(n).

```viz
trace-count-guests
```

**Qué acaba de pasar:** `countGuests` recorrió a cada invitado, pero los únicos valores que guardó fueron dos números, `count` e `i`. Cambiaron en cada vuelta, pero cambiar un número no ocupa memoria nueva: el espacio ya estaba ahí. Haya 4 invitados o 4 millones, siguen siendo dos números: **espacio O(1)**.

Un texto, en cambio, crece cuando le agregas cosas. Cada vuelta de este bucle hace el texto más largo, así que su memoria crece con el número de vueltas:

```js-run
let line = ''
for (let i = 0; i < 5; i++) {
  line = line + 'Ana '
}
console.log(line)
console.log('Largo:', line.length) // 20 caracteres: 4 por vuelta, así que espacio O(n)
```

**Error común:** pensar que un número más grande ocupa más espacio. `let total = 5` y `let total = 5000000` ocupan la misma memoria. Un número es una caja, sin importar qué tenga escrito. Los que crecen son los textos, los arrays y los objetos.

## Sumar vs duplicar un array

Analicemos dos funciones. Las dos recorren un array de números, así que las dos son O(n) de **tiempo**. Pero su espacio es muy distinto, porque una crea un solo número y la otra crea un array nuevo completo.

**`sumArray`** crea un número, `total`, y la variable del bucle, `i`. Seguimos sumando en `total`, pero eso cuesta tiempo, no espacio nuevo: el espacio ya está ahí. Tenga el array 10 elementos o un millón, la función solo tiene esos dos números. Eso es **espacio O(1)**.

**`doubleArray`** crea un **array nuevo** y le mete un elemento por cada número de la entrada. Mira cómo crece:

```viz
trace-double-array
```

**Qué acaba de pasar:** `doubled` empezó como un array vacío. Por cada número de la entrada, apareció una caja más: entran 3 números, se guardan 3 elementos nuevos; entran 6 números, 6 elementos nuevos. Con 50 números, serían 50. El espacio crece en proporción directa a n, así que es **espacio O(n)**. (En realidad es n más un par de variables, pero lo simplificamos a O(n).)

Ejecuta las dos:

```js-run
function sumArray(numbers) {
  let total = 0
  for (let i = 0; i < numbers.length; i++) {
    total = total + numbers[i]
  }
  return total
}

function doubleArray(numbers) {
  const doubled = []
  for (let i = 0; i < numbers.length; i++) {
    doubled.push(numbers[i] * 2)
  }
  return doubled
}

console.log(sumArray([1, 2, 3])) // 6
console.log(doubleArray([1, 2, 3])) // [2, 4, 6]
```

Una función puede ser excelente en una cosa y terrible en la otra: piensa en una función que es O(n²) de **tiempo** pero solo usa unas cuantas variables, así que es O(1) de **espacio**. Cuando analices código, responde las dos preguntas: _"Esto es O(n) de tiempo y O(1) de espacio."_

Prueba con estas:

- Un bucle del 1 a n que solo imprime `i`: **espacio O(1)** (solo `i`).
- Una función que copia a un array nuevo cada elemento en un índice par: unos n / 2 elementos, así que **espacio O(n)**.
- Una función que llena un array nuevo con un total acumulado para cada elemento: n elementos, así que **espacio O(n)**, aunque use bucles anidados para calcularlos.

No necesitas dominar la complejidad espacial antes de seguir. La meta es que cuando digamos "esta tiene una complejidad espacial excelente pero una complejidad temporal terrible", sepas qué significa.

**Error común:** suponer que el tiempo y el espacio siempre coinciden. Las dos funciones de arriba tardan O(n), pero una es O(1) de espacio y la otra O(n). Y una función O(n²) lenta puede usar casi nada de memoria. Da siempre las dos respuestas por separado.
