---
title: Big O de los métodos de arrays
order: 4
minutes: 14
---

> **Meta:** conocer el Big O de los métodos de arrays que usas todos los días, y elegir entre un array y un objeto según el trabajo.

## El final es barato, el principio es caro

Los arrays traen decenas de métodos incluidos. No necesitas memorizar el Big O de cada uno. Lo que importa es que puedas deducirlo, y la forma de hacerlo es la pregunta de la primera lección de este módulo: **¿cuántos elementos toca?**

Empecemos con los cuatro que ya conoces del módulo de Big O, porque marcan el patrón para todo lo demás:

- **`push`** y **`pop`** trabajan al **final**. Nadie más se mueve, así que son **O(1)**, ya sea que el array tenga 1 elemento o un millón.
- **`shift`** y **`unshift`** trabajan al **principio**. Todos los demás elementos tienen que reindexarse, así que son **O(n)**.

Hasta los nombres cuentan la historia: en inglés, _shift_ quiere decir "recorrer", y cuando haces `shift` en un array, todo lo que tiene se recorre un lugar.

```viz
array-reindex
```

**Qué acaba de pasar:** `push` y `pop` solo tocaron la caja del final, mientras que `shift` y `unshift` hicieron que cada invitado se moviera a un índice nuevo. Acceder a un elemento por su índice, como ya sabes, también es O(1), así que el final de un array se porta tan bien como un objeto.

Esto importa más cuando el método se ejecuta **dentro de un bucle**. Aquí hay una fila de invitados que se atiende desde el frente, de dos formas:

```js-run
// Versión 1: shift en un bucle. Cada shift es O(n)...
const line = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli']
while (line.length > 0) {
  const next = line.shift()
  console.log('Atendiendo a', next)
}

// Versión 2: leer por índice. Cada lectura es O(1).
const line2 = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli']
for (let i = 0; i < line2.length; i++) {
  console.log('Atendiendo a', line2[i])
}
```

Las dos imprimen lo mismo. Pero la versión 1 llama n veces a un método O(n), lo que suma **O(n²)** conforme crece la fila, mientras que la versión 2 es **O(n)**. (La versión 1 vacía el array, así que es la herramienta correcta si de verdad necesitas eso. Solo ten claro cuánto cuesta.)

**Error común:** decir que `shift` es O(n/2) porque "en promedio" se mueve la mitad de los elementos. Se mueven todos, cada vez. Y aunque fuera n/2, eliminamos la constante: O(n).

## concat, slice y splice: O(n)

Estos tres métodos copian o mueven grupos de elementos:

- **`concat`** une arrays: `guests.concat(more)` construye un array **nuevo** con cada elemento de `guests` seguido de cada elemento de `more`. Tiene que copiarlos todos. Si los arrays tienen n y m elementos, son **O(n + m)** pasos. Normalmente lo vas a ver escrito simplemente como **O(n)**, donde n es el tamaño del array final. Las dos formas dicen lo mismo: el trabajo crece con el total de elementos.
- **`slice(inicio, fin)`** devuelve una **copia** de una parte del array, desde `inicio` hasta `fin` (sin incluirlo). Sin argumentos, copia todo el array. Su costo es el **tamaño de la copia**: copiar 10 elementos son 10 pasos, copiar 1,000 son 1,000. Como un slice puede ser tan grande como todo el array, aparece como **O(n)**. `slice` nunca cambia el array original.
- **`splice(inicio, cuántosQuitar, …elementos)`** **cambia** el array en su lugar: puede quitar elementos, insertar elementos o las dos cosas, en cualquier parte. Si insertas al final, nada se mueve; si insertas al principio o en el medio, cada elemento después de ese lugar se reindexa. En general, **O(n)**.

```viz
array-copy-methods
```

**Qué acaba de pasar:** `concat` copió los 9 elementos a un array nuevo. `slice(1, 4)` copió solo 3, y `slice()` copió los 6. `splice` en el índice 2 movió a los 4 invitados que estaban después de Zoe; en el índice 0 movió a todos. En cada caso el trabajo crece con el array, así que cada uno es **O(n)**.

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli', 'Fay']
const more = ['Gus', 'Hana', 'Ivan']

console.log(guests.concat(more)) // un array nuevo con los 9
console.log(guests.slice(1, 4)) // una copia de 3: ['Ben', 'Cleo', 'Dev']
console.log(guests) // slice y concat no cambiaron guests

guests.splice(2, 0, 'Zoe') // inserta en el índice 2: los demás suben
console.log(guests) // splice SÍ cambió guests
```

**Error común:** confundir `slice` con `splice`. Una letra de diferencia, trabajos muy distintos: `slice` copia y deja el array en paz; `splice` cambia el array mismo.

## sort: O(n log n)

Ordenar es el método común de arrays más lento, y vale la pena entender por qué. Para poner los elementos en orden, no basta con mirar cada elemento una vez: un elemento no sabe a dónde pertenece hasta que se **compara** con otros. Así que ordenar quiere decir hacer comparaciones y mover cosas de lugar.

¿Cuántas comparaciones? La forma obvia, comparar cada elemento con todos los demás, es O(n²). Los buenos algoritmos de ordenamiento son mucho más listos y necesitan como **n × log n** comparaciones. Ese es un Big O nuevo, **O(n log n)**: más lento que mirar cada elemento una vez, pero mucho más rápido que comparar cada par. Para 1,000 elementos, n² son 1,000,000 de pasos, mientras que n log n son apenas unos 10,000.

El `sort` incluido en JavaScript usa uno de estos algoritmos listos, así que es **O(n log n)**. Más adelante en el curso vas a escribir tú seis algoritmos de ordenamiento, algunos O(n²) y otros O(n log n), y vas a ver exactamente de dónde sale el log. Por ahora, solo recuerda dónde queda sort en la escala:

```viz
sort-growth-chart
```

**Qué acaba de pasar:** O(n log n) queda entre la línea recta de O(n) y la curva empinada de O(n²), mucho más cerca de O(n). Por eso ordenar primero puede seguir siendo buena idea: por ejemplo, ordenar una lista una vez para poder hacerle búsqueda binaria muchas veces.

`sort` tiene dos sorpresas, y las dos les pegan a los principiantes:

```js-run
const scores = [10, 9, 1, 100]

// Sorpresa 1: por defecto, sort compara los elementos como TEXTO
console.log([10, 9, 1, 100].sort()) // [1, 10, 100, 9]

// Para ordenar números, dale una función de comparación
scores.sort((a, b) => a - b)
console.log(scores) // [1, 9, 10, 100]

// Sorpresa 2: sort cambia el array mismo
console.log(scores)
```

Sin una función de comparación, `sort` convierte los elementos en strings y los pone en orden de diccionario, donde "100" va antes que "9" porque "1" va antes que "9". La función de comparación `(a, b) => a - b` le dice que los compare como números.

**Error común:** ordenar números con un `sort()` solo. Funciona del 1 al 9, y eso esconde el error hasta que llega el primer número de dos dígitos.

## forEach, map, filter y reduce: O(n)

Estos cuatro métodos reciben un **callback**: una función que le pasas, y que el método llama una vez por cada elemento. Una forma corta de escribir un callback es una **función flecha**: `(name) => name.toUpperCase()` quiere decir "una función que recibe `name` y lo devuelve en mayúsculas".

- **`forEach`** ejecuta el callback en cada elemento, y no devuelve nada. Es un bucle disfrazado.
- **`map`** ejecuta el callback en cada elemento y construye un **array nuevo** con los resultados, del mismo tamaño que el original.
- **`filter`** ejecuta el callback en cada elemento y construye un **array nuevo** solo con los elementos para los que devolvió `true`.
- **`reduce`** ejecuta el callback en cada elemento para combinarlos todos en **un solo valor**, como un total.

Cada uno visita cada elemento una vez, así que cada uno es **O(n)**. Igual que `Object.keys`, parecen un solo paso, pero tienen un bucle por dentro.

```viz
array-loop-methods
```

**Qué acaba de pasar:** cada método tocó a los 5 invitados. `map` produjo 5 cajas nuevas, `filter` se quedó con los 4 nombres cortos, y `reduce` lo resumió todo en un solo número, 16. Resultados distintos, el mismo costo: una visita por elemento, **O(n)**.

Este es `forEach` junto al bucle normal que reemplaza. Hacen exactamente el mismo trabajo:

```js
guests.forEach((name) => console.log('Bienvenido, ' + name))
```

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli']

// Lo que forEach hace por ti: un bucle sobre cada invitado
for (let i = 0; i < guests.length; i++) {
  console.log('Bienvenido, ' + guests[i])
}

console.log(guests.map((name) => name.toUpperCase()))
console.log(guests.filter((name) => name.length === 3))
console.log(guests.reduce((total, name) => total + name.length, 0))
```

En este curso seguimos escribiendo casi todos los bucles como `for (let i = 0; …)`, porque así se ve cada paso. Pero ahora sabes que cuando ves `forEach`, `map`, `filter` o `reduce`, estás viendo un bucle.

**Error común:** olvidar el costo del callback. `guests.map((name) => guests.indexOf(name))` ejecuta `indexOf`, una búsqueda O(n), una vez por invitado: eso es **O(n²)**. El costo total es n veces el costo del callback.

## ¿Arrays u objetos?

Estos son todos los métodos de arrays de este módulo en una tabla:

| Método                               | Big O      | Por qué                        |
| ------------------------------------ | ---------- | ------------------------------ |
| `arr[i]`, `push`, `pop`              | O(1)       | nadie se mueve                 |
| `shift`, `unshift`                   | O(n)       | todos se mueven                |
| `concat`, `slice`, `splice`          | O(n)       | copia o mueve muchos elementos |
| `includes`, `indexOf`                | O(n)       | una búsqueda, uno por uno      |
| `forEach`, `map`, `filter`, `reduce` | O(n)       | una visita por elemento        |
| `sort`                               | O(n log n) | muchas comparaciones           |

Casi todo es O(n). `sort` tarda más. Y `push`, `pop` y leer por índice son lo más rápido que hay, mucho más rápidos que agregar o quitar al principio.

```viz
array-vs-object
```

**Qué acaba de pasar:** este es el panorama completo del módulo. Pon las dos estructuras lado a lado y aparecen las ideas principales:

1. **Los objetos son rápidos en casi todo**: insertar, eliminar, acceder y actualizar son O(1). Pero **no tienen orden** en absoluto.
2. **Los arrays son excelentes cuando necesitas orden**, y rápidos al final. Pero agregar o quitar al **principio** desata una cascada de reindexado, y lo mismo pasa al agregar o quitar en el **medio**: O(n).
3. **Buscar un valor es O(n) en los dos**, a menos que los datos estén organizados para eso.

Así que elige según el trabajo. Si buscas cosas por nombre y no te importa el orden, usa un objeto. Si el orden importa, usa un array, y trabaja al final siempre que puedas.

Y esta es la **limitación de los arrays**: insertar al principio no es tan fácil como parece. Hay estructuras de datos mucho mejores para eso. Las **listas enlazadas**, que vas a construir pronto, guardan sus elementos en orden igual que los arrays, pero pueden agregar y quitar al principio en O(1). Vas a ver cómo lo logran cuando llegues ahí.

**Error común:** elegir una estructura de datos por costumbre. Pregúntate qué vas a hacer con los datos más seguido, y elige la estructura que vuelva barata esa operación.
