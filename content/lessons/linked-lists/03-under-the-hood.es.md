---
title: 'Por dentro: los nodos son objetos'
order: 3
minutes: 12
---

> **Meta:** ver qué es en realidad una lista enlazada en JavaScript (objetos dentro de objetos), y recorrer una desde `head` hasta `null`.

## Un nodo es todo el objeto

Hasta ahora hemos dibujado los nodos como cajas con flechas. Ese dibujo es para nosotros los humanos: es fácil de leer. Pero, ¿de qué está hecho un nodo en realidad, en código?

Es tentador decir que un nodo es su valor, como `'Dev'`. No lo es. Un nodo es **todo junto**: el valor **y** el puntero `next`. En JavaScript eso es un **objeto** con dos propiedades:

```js
{ value: 'Dev', next: null }
```

Eso es todo lo que necesita un nodo. `value` guarda el dato, y `next` guarda el puntero al siguiente nodo, o `null` cuando no hay uno. ¿Por qué un objeto? Porque, como viste en la lección de punteros, una propiedad puede guardar una **referencia** a otro objeto. Esa referencia, guardada en `next`, es la flecha de nuestros dibujos.

```viz
linked-list-node
```

**Qué acaba de pasar:** sacamos el nodo de Dev de la fila y vimos sus dos partes. El valor es `'Dev'`. El puntero es `next`, que es `null` porque Dev es el último. Juntos forman un solo objeto, y ese objeto es el nodo.

```js-run
const dev = { value: 'Dev', next: null }
console.log(dev) // todo el nodo: value y next
console.log(dev.value) // 'Dev': solo el valor
console.log(dev.next) // null: Dev todavía no apunta a nada
```

(La app imprime los objetos en estilo JSON, con comillas alrededor de los nombres de las propiedades. Es el mismo objeto.)

**Error común:** decirle "el nodo" al valor. `dev.value` es solo un string. El nodo es el objeto que guarda el valor y el puntero, y el puntero es lo que lo hace parte de una lista.

## La lista son objetos dentro de objetos

¿Cómo apunta el nodo de Cleo al nodo de Dev? Haces que el `next` de Cleo sea **igual al objeto del nodo de Dev**: `cleo.next = dev`. Ahora `next` guarda una referencia al objeto de Dev. Si imprimes el nodo de Cleo, vas a ver todo el objeto de Dev **adentro**, porque al imprimir se sigue la referencia y se muestra a qué apunta.

Haz lo mismo con Ben y Ana, y toda la lista se vuelve **objetos anidados**: el nodo de Ana contiene el de Ben, el de Ben contiene el de Cleo, y el de Cleo contiene el de Dev. `head` apunta al objeto de más afuera, el nodo de Ana. `tail` apunta al de más adentro, el nodo de Dev, y una forma de apuntarlo ahí es `tail = cleo.next`, porque el `next` de Cleo ya apunta a Dev.

Recuerda la lección de punteros: `cleo.next = dev` copia la **flecha**, no el objeto. Solo hay un nodo de Dev, y tanto `cleo.next` como la variable `dev` apuntan a él. Así que anidar no desperdicia memoria: nada se copia, cada nodo existe una sola vez, y el "adentro" que ves al imprimir son solo flechas que se van siguiendo.

```viz
linked-list-nested
```

**Qué acaba de pasar:** armamos la lista desde el final. Primero el nodo de Dev, luego el `next` de Cleo apuntó a él, luego el de Ben al de Cleo, y luego el de Ana al de Ben. En código, cada nodo nuevo envuelve a los que van después. `head` quedó afuera y `tail` adentro, y las cajas con flechas de arriba son la misma lista que los objetos anidados de abajo.

```js-run
const dev = { value: 'Dev', next: null }
const cleo = { value: 'Cleo', next: null }
const ben = { value: 'Ben', next: null }
const ana = { value: 'Ana', next: null }

cleo.next = dev // el nodo de Cleo apunta al nodo de Dev
ben.next = cleo
ana.next = ben

const head = ana
const tail = cleo.next // el mismo objeto que dev

console.log(head) // anidado: Ana contiene a Ben, Ben a Cleo y Cleo a Dev
console.log(tail === dev) // true: un objeto, dos punteros
console.log(head.next.next.next === tail) // true

dev.value = 'Devon'
console.log(head.next.next.next.value) // 'Devon': solo hay un nodo de Dev
```

**Error común:** pensar que `cleo.next = dev` guarda una copia del nodo de Dev. Guarda una referencia, así que un cambio hecho a través de `dev` aparece cuando llegas al mismo nodo por la lista, como `'Devon'` arriba.

## Recorrer la lista

Casi todos los métodos que vas a escribir en este módulo (pop, get, set, insert, remove, reverse) tienen que llegar a nodos en medio de la fila. Todos lo hacen con el mismo bucle, que se llama **recorrer** la lista (en inglés, _traversing_):

1. Crea un puntero llamado `temp` (de "temporal") y empiézalo donde apunta `head`.
2. Mientras `temp` no sea `null`, haz lo que necesites con el nodo de `temp`, y luego avánzalo: `temp = temp.next`.
3. Cuando `temp` se vuelve `null`, acabas de pasar el último nodo, así que el recorrido terminó.

¿Por qué usar `temp` en vez de mover `head`? Porque `head` es lo único que apunta al inicio de la fila. Si avanzas `head`, a los nodos que deja atrás ya no los apunta nada, y se pierden para siempre. Así que `head` se queda donde está, y `temp` es el que camina. ¿Y por qué un bucle `while` y no un `for`? Porque un recorrido no cuenta hasta un número: se detiene al llegar a `null`, que es justo para lo que sirve el null del final de la lista.

```viz
trace-ll-walk
```

**Qué acaba de pasar:** `temp` empezó en Ana, donde apunta `head`. En cada vuelta del bucle, saludó al invitado donde estaba y luego avanzó con `temp = temp.next`. Después del último invitado, `temp` se volvió `null`, y la condición `temp !== null` terminó el bucle. Con una fila vacía, `head` ya era `null`, así que el bucle nunca corrió. Elige 5 invitados y cuenta: el recorrido visita cada nodo exactamente una vez.

```js-run
const head = {
  value: 'Ana',
  next: { value: 'Ben', next: { value: 'Cleo', next: null } },
}

let temp = head
while (temp !== null) {
  console.log('¡Hola, ' + temp.value + '!')
  temp = temp.next
}
console.log(head.value) // sigue siendo 'Ana': head nunca se movió
```

**El Big O de un recorrido:** visita cada nodo una vez, así que es **O(n) en tiempo**. Solo necesita un puntero extra, `temp`, sin importar lo larga que sea la fila, así que es **O(1) en espacio extra**. Ese es el costo escondido dentro de pop, insert, remove y buscar un nodo, de la lección pasada.

**Error común:** olvidar `temp = temp.next`. Entonces `temp` nunca cambia, la condición nunca se vuelve falsa, y el bucle corre para siempre (la app lo detiene después de 2 segundos). Otro: escribir `while (temp.next !== null)` cuando quieres visitar todos los nodos. El bucle se detiene con `temp` **en** el último nodo, antes de que su cuerpo corra para él, así que el último invitado nunca recibe su saludo. Además truena con una lista vacía, porque leer `next` de `null` es un error.
