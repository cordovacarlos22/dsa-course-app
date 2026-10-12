---
title: 'O(1): tiempo constante'
order: 11
minutes: 6
---

> **Meta:** reconocer código O(1), el Big O más eficiente que existe.

## Una operación, sea cual sea n

Ahora sigue **O(1)**. Esta es una función que solo devuelve n + n:

```js-run
function addItems(n) {
  return n + n
}

function addItemsAgain(n) {
  return n + n + n
}

console.log(addItems(1), addItems(1000000))
console.log(addItemsAgain(1), addItemsAgain(1000000))
```

`addItems` hace **una operación**: la suma. No importa si n es 1 o un millón; siempre es una operación. Eso es **O(1)**.

¿Y si le agregamos otra suma, como en `addItemsAgain`? Ahora son dos operaciones, o sea O(2). Y como seguro ya adivinaste, lo simplificamos a **O(1)**: el número de operaciones es una constante que no cambia cuando cambia n. La versión de `sumUpTo` con la fórmula es igual: 3 operaciones cada vez, así que O(1).

```viz
trace-sum-formula
```

## Salta directo a la caja

```viz
constant-jump
```

El trabajo O(1) **no depende del tamaño de los datos**. El ejemplo clásico es leer un elemento de un array por su índice: `guests[3]` no mira primero las cajas 0, 1 y 2. El array sabe dónde está cada caja, así que **salta directo** a la correcta. Un paso con 6 invitados, un paso con un millón. `guests.length` funciona igual: el array ya sabe su tamaño.

Otros trabajos O(1) de todos los días:

- leer o cambiar la clave de un objeto (`party.host`),
- operaciones con unos pocos números (`guests.length * 2`),
- darle un valor a una variable.

## El Big O más eficiente

En la gráfica, O(1) es una **línea plana** abajo. Es el Big O **más eficiente**: no hay nada más eficiente que O(1). Muchas veces vas a escuchar que se llama **tiempo constante**; cuando escuches esa frase, quiere decir O(1).

Tiempo constante no quiere decir "instantáneo". Una función que siempre hace 1,000 operaciones sigue siendo O(1), porque ese 1,000 nunca crece: hace el mismo trabajo con 10 elementos o con 10 millones. Lo que promete O(1) es que el trabajo **no crece** con la entrada.

Por eso exactamente la versión de `sumUpTo` con la fórmula le ganó a la del bucle: la fórmula es O(1), el bucle es O(n), y la diferencia se hace más grande cada vez que n crece. Y por eso las operaciones O(1) son tan valiosas para cosas que una app hace todo el tiempo: puedes leer `guests.length` mil veces y nunca se vuelve más lento aunque la fiesta crezca.

Pero cuidado: código corto no es lo mismo que tiempo constante. Mira lo que puede esconder una línea que parece inocente:

```viz
trace-is-invited
```

`guests.includes('Zoe')` es una sola línea, y parece que debería ser un solo paso. Pero para responder, JavaScript tiene que hacer exactamente lo que muestra esta animación: revisar a los invitados uno por uno hasta encontrar el nombre o quedarse sin invitados. Eso es O(n).

Así que cuando busques el Big O de una línea, pregúntate: _¿salta directo a la respuesta o esconde un bucle?_ `guests[3]` salta. `guests.includes(name)` y `guests.indexOf(name)` recorren la lista.
