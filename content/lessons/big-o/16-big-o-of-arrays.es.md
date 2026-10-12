---
title: Big O de los arrays
order: 16
minutes: 8
---

> **Meta:** saber qué operaciones de los arrays son O(1) y cuáles son O(n), y por qué.

## push y pop contra shift y unshift

Antes de construir nuestras propias estructuras de datos, necesitamos conocer el Big O de la que ya usas todos los días: el **array**. Así vamos a poder comparar contra él las estructuras de datos que construyamos después. La clave de todo esto son los **índices**.

```viz
array-reindex
```

Este es un array, `myArray`, con 4 números en los índices 0 a 3. Presiona **Ejecutar** y sigue el resultado:

```js-run
const myArray = [11, 3, 23, 7]

myArray.push(17) // adds 17 at the end, at index 4
console.log('push:', myArray)
myArray.pop() // removes it again
console.log('pop:', myArray)

myArray.shift() // removes 11 from the start...
console.log('shift:', myArray, '3 is now at index', myArray.indexOf(3))
myArray.unshift(11) // ...and puts it back
console.log('unshift:', myArray, '3 is back at index', myArray.indexOf(3))
```

- **`push(17)`** agrega el 17 al final, en el índice 4. Ningún otro elemento necesita un índice nuevo: **O(1)**.
- **`pop()`** quita el último elemento. Otra vez, nada más se vuelve a indexar: **O(1)**.
- **`shift()`** quita el primer elemento, y ahora todos los demás índices están mal: el nuevo primer elemento tiene que pasar a ser el índice 0, el siguiente el índice 1, y así. **Todos** los elementos se vuelven a indexar: **O(n)**.
- **`unshift(11)`** vuelve a poner el 11 al principio, y cada elemento tiene que subir un índice: **O(n)**.

Con 4 elementos eso no es nada, pero con miles de elementos es muchísimo reindexar. Recuerda: al **final** de un array, agregar y quitar son O(1). Al **principio**, los dos son O(n).

## Insertar en el medio

```viz
array-splice
```

¿Y en el medio? `splice` puede insertar elementos en cualquier lugar:

```js-run
const myArray = [11, 3, 23, 7]

myArray.splice(1, 0, 'hi') // at index 1, remove 0 items, add 'hi'
console.log(myArray) // 3, 23 and 7 all moved up one index

myArray.splice(1, 1) // at index 1, remove 1 item
console.log(myArray) // and they all move back
```

Cuando 'hi' entra en el índice 1, cada elemento que está después necesita un índice nuevo: **O(n)**.

Quizá digas: "Oye, solo reindexamos más o menos la mitad de los elementos. ¿No es O(½n)?" Hay dos problemas con esa idea. Primero, Big O siempre mide el **peor caso**, no el promedio, e insertar en el índice 0 mueve todo. Segundo, aunque fuera ½n, **½ es una constante, y las constantes se eliminan**. De cualquier forma, es **O(n)**. Quitar del medio es O(n) por la misma razón.

## Buscar por valor contra leer por índice

```viz
search-cases
```

Ahora, buscar un elemento. Digamos que buscamos el **valor** 7. Empezamos al principio: ¿eso es 7? No. No. No… hasta que por fin lo encontramos. Buscar **por valor** es **O(n)**.

Pero leer **por índice** es distinto. "¿Qué hay en el índice 3?" Los arrays usan sus índices para ir **directo** a ese lugar de la memoria: **O(1)**. Esa es una de las grandes ventajas de los arrays: en un array de un millón de elementos, puedes saltar directo al elemento 400,000 en un paso.

Esos mismos índices también son la debilidad de los arrays: agregar o quitar al principio obliga a reindexar todo.

Así que la pregunta más importante sobre cualquier estructura de datos es: **¿para qué la vas a usar?** Si necesitas leer cosas por índice, los arrays son excelentes. Si vas a agregar y quitar muchos elementos al principio, quizá un array no sea la mejor opción, y otra estructura de datos (como las listas enlazadas que vas a construir pronto) sea mejor. De cualquier forma, estás tomando esa decisión con base en Big O.
