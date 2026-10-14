---
title: Big O de los arrays
order: 16
minutes: 11
---

> **Meta:** saber qué operaciones de los arrays son O(1) y cuáles son O(n), y poder explicar por qué.

## Los arrays son listas ordenadas

Antes de construir nuestras propias estructuras de datos, necesitamos conocer el Big O de la que ya usas todos los días: el **array**. Nos da algo contra qué comparar. Cuando construyas una lista enlazada más adelante en el curso, la primera pregunta va a ser: ¿es más rápida que un array, y en qué?

Un array es una **lista ordenada**. Cada elemento tiene una posición, llamada su **índice**, y los índices empiezan en 0: el primer elemento está en el índice 0, el segundo en el índice 1, y el último en el índice `length - 1`. El orden es justo lo que hace útil a un array. Palabras como "primero", "siguiente" y "último" tienen sentido en un array, así que es la herramienta correcta cuando el orden importa: una fila de espera, un top 10, los invitados en el orden en que llegaron. Si solo necesitas guardar unos datos juntos y el orden no importa, muchas veces hay mejores opciones (el siguiente módulo habla de los objetos).

Por cierto, los arrays no son la única estructura de datos ordenada. Más adelante vas a construir **listas enlazadas**, que también guardan sus elementos en orden, pero de una forma muy distinta, y a veces funcionan mejor que los arrays. Los arrays son simplemente la estructura ordenada que JavaScript te da **gratis**.

Para juzgar cualquier estructura de datos, nos fijamos en cuatro operaciones:

- **Acceder:** leer un elemento cuando sabes **dónde** está (su índice).
- **Buscar:** encontrar un elemento cuando solo sabes **qué** es (su valor).
- **Insertar:** agregar un elemento.
- **Eliminar:** quitar un elemento.

Empecemos por acceder.

```viz
constant-jump
```

**Qué acaba de pasar:** `guests[3]` fue directo a la caja 3, sin mirar las cajas 0, 1 y 2 en el camino.

Esto aclara una confusión muy común. Si le pides a un array de 10,000 elementos el elemento del índice 9,000, JavaScript **no** empieza en el índice 0 y cuenta hasta llegar a 9,000. Piensa en un índice como una dirección directa: mientras ese índice exista en el array, JavaScript puede saltar directo a él. Por eso leer por índice es **O(1)**, ya sea el primer elemento, uno del medio o el último, y ya sea que el array tenga 6 elementos o un millón.

Pruébalo. Este código construye un array de un millón de números y luego lee tres de ellos. Cada lectura es instantánea:

```js-run
const numbers = []
for (let i = 0; i < 1000000; i++) {
  numbers.push(i * 2)
}

console.log('primero:', numbers[0])
console.log('índice 900000:', numbers[900000])
console.log('último:', numbers[numbers.length - 1])
```

El bucle que construye el array es O(n), claro: agrega un millón de elementos. Pero cada **lectura** después de eso es un solo paso.

**Error común:** pensar que `numbers[999999]` es más lento que `numbers[0]`. La posición no importa. El índice te lleva directo ahí.

## push y pop contra shift y unshift

Insertar y eliminar es donde los arrays se ponen interesantes, porque la respuesta es: **depende de dónde**. Y la razón es lo mismo que hace rápido el acceso: los índices.

El índice de cada elemento siempre tiene que coincidir con su posición. Si agregas o quitas un elemento en cualquier lugar que no sea el final, cada elemento después de ese lugar queda en el índice equivocado, y hay que **reindexar** a cada uno: darle su número nuevo. Un solo cambio al principio arranca una cascada que recorre todo el array, un poco como una fila de personas donde todos tienen que dar un paso cuando alguien se mete hasta adelante.

```viz
array-reindex
```

Este es un array, `myArray`, con 4 números en los índices 0 a 3. Presiona **Ejecutar** y sigue el resultado:

```js-run
const myArray = [11, 3, 23, 7]

myArray.push(17) // agrega el 17 al final, en el índice 4
console.log('push:', myArray)
myArray.pop() // lo quita otra vez
console.log('pop:', myArray)

myArray.shift() // quita el 11 del principio...
console.log('shift:', myArray, 'el 3 ahora está en el índice', myArray.indexOf(3))
myArray.unshift(11) // ...y lo vuelve a poner
console.log('unshift:', myArray, 'el 3 regresó al índice', myArray.indexOf(3))
```

- **`push(17)`** agrega el 17 al final, en el índice 4. Ningún otro elemento necesita un índice nuevo: **O(1)**.
- **`pop()`** quita el último elemento. Otra vez, nada más se vuelve a indexar: **O(1)**.
- **`shift()`** quita el primer elemento, y ahora todos los demás índices están mal: el nuevo primer elemento tiene que pasar a ser el índice 0, el siguiente el índice 1, y así. **Todos** los elementos se vuelven a indexar: **O(n)**.
- **`unshift(11)`** vuelve a poner el 11 al principio, y cada elemento tiene que subir un índice: **O(n)**.

Con 4 elementos eso no es nada, pero con miles de elementos es muchísimo reindexar. Cada reindexado es un trabajo pequeño, así que la cuenta exacta podría ser 2n o 10n operaciones. Igual crece en proporción a n, así que es O(n).

Una pequeña excepción: en un array **vacío**, el principio y el final son el mismo lugar, así que `unshift` no tiene a nadie que mover. Pero ese es un caso especial. Big O describe qué pasa cuando el array crece.

Recuerda: al **final** de un array, agregar y quitar son O(1). Al **principio**, los dos son O(n). Eso no quiere decir que nunca debas usar `shift` o `unshift`. A veces de verdad necesitas que algo vaya primero. Solo ten claro cuánto cuesta, y evita hacerlo dentro de un bucle sobre un array grande.

**Error común:** "`shift()` es una línea cortita, así que debe ser O(1)." El costo de un método es el trabajo que hace por dentro, no lo largo de la línea que escribes.

## Insertar en el medio

`splice` es la navaja suiza de los arrays: puede insertar, quitar o reemplazar elementos en cualquier parte del array. Su primer argumento es el índice donde empieza, el segundo es cuántos elementos quitar, y cualquier argumento después de esos son elementos para insertar. Pase lo que pase en ese lugar, los elementos que están **después** tienen que moverse, así que la cascada empieza ahí en vez de al principio.

```viz
array-splice
```

Entonces, ¿qué pasa en el medio? Insertemos algo:

```js-run
const myArray = [11, 3, 23, 7]

myArray.splice(1, 0, 'hi') // en el índice 1, quita 0 elementos y agrega 'hi'
console.log(myArray) // el 3, el 23 y el 7 subieron un índice

myArray.splice(1, 1) // en el índice 1, quita 1 elemento
console.log(myArray) // y todos regresan a su lugar
```

Cuando 'hi' entra en el índice 1, cada elemento que está después necesita un índice nuevo: **O(n)**.

Quizá digas: "Oye, solo reindexamos más o menos la mitad de los elementos. ¿No es O(½n)?" Hay dos problemas con esa idea. Primero, Big O siempre mide el **peor caso**, no el promedio, e insertar en el índice 0 mueve todo. Segundo, aunque fuera ½n, **½ es una constante, y las constantes se eliminan**. De cualquier forma, es **O(n)**. Quitar del medio es O(n) por la misma razón.

**Error común:** contar solo el elemento que insertaste. El costo de `splice` está sobre todo en los elementos que tiene que mover, no en el que agrega.

## Buscar por valor contra leer por índice

La última operación es **buscar**: sabes _qué_ estás buscando, pero no _dónde_ está. Esta es la diferencia con acceder en una frase: acceder pregunta "¿qué hay en el índice 3?", y buscar pregunta "¿dónde está el valor 7?". En un array desordenado, el valor puede estar en cualquier lugar, así que la única forma de encontrarlo es revisar los elementos uno por uno.

```viz
search-cases
```

Digamos que buscamos el **valor** 7. Empezamos al principio: ¿eso es 7? No. No. No… hasta que por fin lo encontramos. Si está al final, o si no está, ya revisamos todos los elementos. Buscar **por valor** es **O(n)**. Recuerda que `includes` e `indexOf` hacen exactamente esto por dentro, así que también son O(n).

Si el array está **ordenado**, hay una forma más rápida: la búsqueda binaria, el O(log n) que parte a la mitad y que viste en la lección de logaritmos. La vas a escribir tú en el módulo de búsqueda. Con datos desordenados, O(n) es lo mejor que podemos hacer.

Leer **por índice** es distinto, como viste al principio de la lección: los arrays usan sus índices para ir **directo** a ese lugar, en O(1). En un array de un millón de elementos, puedes saltar directo al elemento 400,000 en un paso.

Esta es toda la lección en una tabla:

| Operación                                          | Big O | Por qué                             |
| -------------------------------------------------- | ----- | ----------------------------------- |
| Leer por índice (`arr[i]`)                         | O(1)  | salta directo ahí                   |
| Buscar por valor (`includes`, `indexOf`)           | O(n)  | puede revisar cada elemento         |
| Agregar o quitar al final (`push`, `pop`)          | O(1)  | nadie se mueve                      |
| Agregar o quitar al principio (`unshift`, `shift`) | O(n)  | todos se mueven                     |
| Agregar o quitar en el medio (`splice`)            | O(n)  | se mueven todos los que van después |

Los mismos índices son la fuerza y la debilidad de los arrays: hacen que leer sea instantáneo, y hacen que cambiar el principio sea caro.

Así que la pregunta más importante sobre cualquier estructura de datos es: **¿para qué la vas a usar?** Si necesitas leer cosas por índice, los arrays son excelentes. Si vas a agregar y quitar muchos elementos al principio, quizá un array no sea la mejor opción, y otra estructura de datos (como las listas enlazadas que vas a construir pronto) sea mejor. De cualquier forma, estás tomando esa decisión con base en Big O.
