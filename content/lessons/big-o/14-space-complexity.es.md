---
title: Complejidad espacial
order: 14
minutes: 8
---

> **Meta:** medir cuánta memoria extra necesita el código, con la misma notación Big O.

## ¿Cuánta memoria crece?

Hasta ahora nos preocupamos por el **tiempo**: cómo crece el tiempo de ejecución de un algoritmo cuando crece su entrada. Eso es la **complejidad temporal**. Ahora veamos la **complejidad espacial**: cuánta **memoria** ocupa un algoritmo cuando crece su entrada. Usamos la misma notación Big O; solo medimos otra cosa.

```viz
memory-boxes
```

Primero hay que aclarar algo. Cuando n crece, obviamente la entrada también crece: una lista de un millón de invitados ocupa más memoria que una de 10. Esa parte la **ignoramos**. Lo que medimos es el espacio que el algoritmo **necesita por sí mismo**, aparte de la entrada. Si lees sobre esto en internet, quizá veas que se llama **complejidad espacial auxiliar**. En este curso, a menos que digamos lo contrario, "complejidad espacial" quiere decir complejidad espacial auxiliar: lo que pasa **dentro** del algoritmo.

## Reglas prácticas para el espacio

```viz
trace-count-guests
```

- **La mayoría de los primitivos ocupan espacio constante.** Los booleanos, los números, `undefined` y `null` ocupan la misma memoria sin importar su valor: el número 1 y el número 1,000 cuestan lo mismo, igual que `true` y `false`. O(1).
- **Los textos (strings) ocupan espacio O(n)**, donde n es el largo del texto. Un texto de 50 caracteres ocupa unas 50 veces el espacio de uno de 1 carácter.
- **Los tipos por referencia (arrays y objetos) en general son O(n)**, donde n es el largo del array o el número de claves del objeto. Un array de 4 elementos ocupa el doble de espacio que uno de 2.

`countGuests`, en la animación, solo guarda dos números, `count` e `i`. Haya 4 invitados o 4 millones, siguen siendo dos números: **espacio O(1)**.

## Sumar contra duplicar un array

Analicemos dos funciones. Las dos recorren un array de números, pero su espacio es muy distinto:

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

**`sumArray`** crea un número, `total`, y la variable del bucle `i`. Vamos sumando dentro de `total`, pero eso cuesta tiempo, no espacio nuevo: el espacio ya existe. Tenga el array 10 elementos o un millón, la función solo tiene esos dos números. Eso es **espacio O(1)**.

**`doubleArray`** crea un **array nuevo** y le agrega un elemento por cada número de la entrada. Míralo crecer:

```viz
trace-double-array
```

Entran 10 números, se guardan 10 elementos nuevos; entran 50, se guardan 50. El espacio crece en proporción directa a n, así que es **espacio O(n)**. (En realidad es n más un par de variables, pero lo simplificamos a O(n).)

Una función puede ser excelente en una cosa y terrible en la otra: piensa en una función que es O(n²) en **tiempo** pero solo usa unas pocas variables, así que es O(1) en **espacio**. Cuando analices código, responde las dos preguntas: _"Esto es tiempo O(n) y espacio O(1)."_

Prueba con estos:

- Un bucle de 1 a n que solo imprime `i`: **espacio O(1)** (solo `i`).
- Una función que copia cada elemento de un índice par a un array nuevo: unos n / 2 elementos, así que **espacio O(n)**.
- Una función que llena un array nuevo con un total acumulado por cada elemento: n elementos, así que **espacio O(n)**, aunque use bucles anidados para calcularlos.

No necesitas dominar la complejidad espacial para seguir adelante. La meta es que cuando digamos "esta tiene una complejidad espacial excelente pero una complejidad temporal terrible", sepas qué quiere decir.
