---
title: 'Punteros: valores y referencias'
order: 2
minutes: 11
---

> **Meta:** distinguir entre copiar un valor y copiar una referencia, mover punteros de un objeto a otro, y ver qué limpia la recolección de basura.

## Copiar un valor

Vas a usar **punteros** en cada estructura de datos de este curso, así que vale la pena entenderlos bien. Para ver qué es un puntero, empecemos con algo que **no** lo es.

JavaScript tiene dos tipos de valores. Los **primitivos** son los sencillos: números, strings, booleanos, `null` y `undefined`. Los **objetos** son todo lo demás, incluidos los arrays y las instancias que creas a partir de una clase. Los dos tipos se comportan de forma muy distinta cuando los copias.

Cuando una variable guarda un primitivo, como un número, guarda el número en sí. Copiar la variable copia el número, y a partir de ahí las dos variables no tienen nada que ver entre sí:

```js-run
let guestCount = 5
let seats = guestCount // seats recibe su propio 5

guestCount = 8 // solo cambia guestCount
console.log(guestCount) // 8
console.log(seats) // sigue en 5
```

```viz
value-copy
```

**Qué acaba de pasar:** `let seats = guestCount` no unió las dos variables. Copió el valor 5 en `seats` en ese momento, y ahí terminó todo. Cuando después `guestCount` se volvió 8, `seats` se quedó con su propio 5. Los strings y los booleanos funcionan igual: los primitivos siempre se copian.

**Error común:** leer `let seats = guestCount` como "seats siempre va a ser igual a guestCount". Solo quiere decir "seats es igual a guestCount **en este momento**".

## Copiar un objeto copia la flecha

Los objetos son distintos. Cuando escribes `let card = { value: 'Ana' }`, la variable `card` no guarda el objeto en sí. El objeto vive en algún lugar de la memoria, y `card` guarda una **referencia** a él. Piénsalo como una **flecha** que apunta al objeto. Esa flecha es lo que en este curso llamamos un **puntero**. (Algunos lenguajes, como C, tienen un tipo especial de puntero con el que hasta puedes hacer cuentas. JavaScript no: cada variable que guarda un objeto, un array o una instancia de una clase simplemente guarda una referencia, y eso es todo lo que queremos decir con "puntero".)

Entonces, ¿qué hace `let sameCard = card`? Podría parecer que crea un segundo objeto con el mismo valor. No es así. Copia la **flecha**, así que ahora `sameCard` apunta **exactamente al mismo objeto** en memoria que `card`.

```viz
reference-copy
```

**Qué acaba de pasar:** siempre hubo un solo objeto, A. `card` y `sameCard` eran dos flechas apuntando a él. Cambiar `card.value` siguió la flecha de `card` y cambió el objeto A, así que leer `sameCard.value`, que sigue su propia flecha hasta el mismo objeto, también mostró el cambio.

```js-run
let card = { value: 'Ana' }
let sameCard = card // copia la flecha, no el objeto

card.value = 'Ben'
console.log(sameCard.value) // 'Ben': es el mismo objeto

console.log(card === sameCard) // true: los dos apuntan a un solo objeto
console.log({ value: 'Ana' } === { value: 'Ana' }) // false: dos objetos

const realCopy = { ...card } // un objeto nuevo con las mismas propiedades
realCopy.value = 'Cleo'
console.log(card.value) // sigue siendo 'Ben'
```

Esa segunda comparación sorprende a mucha gente. Con objetos, `===` no compara lo que tienen dentro: revisa si los dos lados apuntan **al mismo objeto**. Dos objetos que se ven idénticos siguen siendo dos objetos distintos. Cuando de verdad necesitas una copia aparte, `{ ...card }` crea un objeto nuevo con las mismas propiedades (para un objeto sencillo como este).

**Error común:** pensar que `=` copia un objeto. Con objetos, `=` copia la flecha: dos variables, un solo objeto.

## Mover punteros y la recolección de basura

Un puntero no está pegado a su objeto. Lo puedes **mover** asignando la variable a otro objeto. Creemos un objeto, hagamos que dos variables apunten a él, y luego creemos un segundo objeto y movamos los dos punteros hacia él:

```js-run
let first = { value: 'Ana' }
let second = first
let third = { value: 'Cleo' }

second = third // ahora second apunta al objeto de Cleo
first = third // y first también

console.log(first.value, second.value, third.value)
// Ya nada apunta a { value: 'Ana' }
```

```viz
pointer-move
```

**Qué acaba de pasar:** mover `second` no cambió ningún objeto; solo movió una flecha. Luego `first` también se movió, y el objeto A, `{ value: 'Ana' }`, se quedó sin flechas. Solo puedes llegar a un objeto a través de algo que apunte a él, así que a un objeto al que nada apunta ya no se puede llegar. Solo se queda ahí, ocupando memoria.

Ahí entra la **recolección de basura**. Cada cierto tiempo, JavaScript busca objetos a los que ya nada puede llegar y libera la memoria que usan. Nunca borras un objeto por tu cuenta: dejas de apuntarle, y el **recolector de basura** lo limpia.

Así es exactamente como funcionan las listas enlazadas, y por eso esta lección va justo antes. Una lista enlazada es una cadena de objetos pequeños llamados **nodos**, cada uno apuntando al siguiente, con `head` y `tail` apuntando a los dos extremos (viste una versión pequeña de esto en el módulo de Introducción). Agregar un nodo quiere decir mover un par de flechas. Quitar uno quiere decir **alejar** las flechas de él, para que ya nada le apunte, y el recolector de basura se encarga del resto. Y mover un puntero es una sola asignación, así que es **O(1)** sin importar qué tan larga sea la lista. Por eso una lista enlazada puede agregar o quitar al principio en O(1), algo que un array no puede hacer.

Seguir punteros es la otra mitad de la historia. Para llegar al final de una cadena, mueves un puntero de un nodo al siguiente hasta que ya no hay siguiente nodo. Eso es exactamente lo que vas a escribir en la comprobación de este paso.

**Error común:** perder el último puntero a algo que todavía necesitas. Si mueves `head` antes de guardar el siguiente nodo en algún lado, ya no se puede llegar al resto de la lista, y se pierde.
