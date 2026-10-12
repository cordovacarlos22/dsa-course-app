---
title: 'O(1): tiempo constante'
order: 9
minutes: 5
---

> **Meta:** reconocer código O(1), el mejor Big O que existe.

## Salta directo a la caja

Hay código que hace la misma cantidad de trabajo sin importar qué tan grande sea la entrada:

```viz
constant-jump
```

`guests[3]` no mira primero las cajas 0, 1 y 2. Un array sabe exactamente dónde está cada caja, así que leer por índice **salta directo** a la correcta. Un paso con 6 invitados, un paso con un millón. `guests.length` funciona igual: el array ya sabe su tamaño.

Compáralo con `isInvited`, que puede tener que mirar a cada invitado. Leer una caja por su índice nunca depende de cuántas cajas haya.

## Una línea plana

```viz
big-o-growth-chart
```

El trabajo que no crece con la entrada es **O(1)**, que se lee "O de 1" y también se llama **tiempo constante**. En la gráfica es la **línea plana** de abajo. No hay nada mejor que O(1).

Unos pocos pasos siguen siendo O(1). Este código da dos pasos, siempre:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli']

const first = guests[0]
const last = guests[guests.length - 1]
console.log('First:', first, '- Last:', last)
```

Dos pasos es O(2), y eliminamos la constante: O(1). Otros trabajos O(1) de todos los días: leer o cambiar la clave de un objeto (`party.host`), operaciones con unos pocos números (`guests.length * 2`) y darle un valor a una variable. Cuando escuches "tiempo constante" en una entrevista, quiere decir O(1).

Por eso las operaciones O(1) son tan valiosas para cosas que tu app hace todo el tiempo: puedes leer `guests.length` mil veces y nunca se vuelve más lento aunque la fiesta crezca.

## Una línea no siempre es O(1)

```viz
trace-is-invited
```

Cuidado: código corto no es lo mismo que código rápido. `guests.includes('Zoe')` es una sola línea, y parece que debería ser un solo paso. Pero para responder, JavaScript tiene que hacer exactamente lo que muestra esta animación: revisar a los invitados uno por uno hasta encontrar el nombre o quedarse sin invitados. Eso es O(n).

Así que cuando busques el Big O de una línea, pregúntate: _¿esta línea salta directo a la respuesta o esconde un bucle?_ `guests[3]` salta. `guests.includes(name)` y `guests.indexOf(name)` recorren la lista.
