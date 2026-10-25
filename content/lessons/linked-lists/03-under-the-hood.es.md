---
title: 'Por dentro: los nodos son objetos'
order: 3
minutes: 15
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

**Qué acaba de pasar:** sacamos el nodo de Dev de la fila y vimos sus dos partes. El valor es `'Dev'`. El puntero es `next`, que es `null` porque Dev va al final. Juntos forman un solo objeto, y ese objeto es el nodo.

```js-run
const dev = { value: 'Dev', next: null }
console.log(dev) // todo el nodo: value y next
console.log(dev.value) // 'Dev': solo el valor
console.log(dev.next) // null: Dev todavía no apunta a nada
```

(La app imprime los objetos en estilo JSON, con comillas alrededor de los nombres de las propiedades. Es el mismo objeto.)

**Por dentro:** los motores de JavaScript notan cuando muchos objetos tienen las mismas propiedades, agregadas en el mismo orden, y les dan una misma descripción de su forma, que comparten todos, así que leer `node.value` sigue siendo rápido. Cada nodo de este módulo es `{ value, next }`, armado igual cada vez. Esa es una razón más para que la próxima lección cree todos los nodos con una sola clase `Node`: la misma forma, siempre.

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

**Por dentro:** imprimir tiene que seguir cada `next` para mostrarte el anidado, así que una lista larga se imprime como una línea larga de llaves anidadas, una dentro de otra. Las DevTools del navegador no los siguen todos de una vez: muestran los primeros niveles y te dejan dar clic en una flechita para abrir el siguiente. De cualquier forma, son las mismas flechas que se siguen, y nada en la lista cambia cuando la imprimes.

**Error común:** pensar que `cleo.next = dev` guarda una copia del nodo de Dev. Guarda una referencia, así que un cambio hecho a través de `dev` aparece cuando llegas al mismo nodo por la lista, como `'Devon'` arriba.

## Recorrer la lista

Casi todos los métodos que vas a escribir en este módulo (pop, get, set, insert, remove, reverse) tienen que llegar a nodos en medio de la fila. Todos lo hacen con el mismo bucle, que se llama **recorrer** la lista (en inglés, _traversing_):

1. Crea un puntero llamado `current` (el nodo en el que vas ahora) y empiézalo donde apunta `head`.
2. Mientras `current` no sea `null`, haz lo que necesites con el nodo de `current`, y luego avánzalo: `current = current.next`.
3. Cuando `current` se vuelve `null`, acabas de pasar el último nodo, así que el recorrido terminó.

¿Por qué usar `current` en vez de mover `head`? Porque `head` es lo único que apunta al inicio de la fila. Si avanzas `head`, a los nodos que deja atrás ya no los apunta nada, y se pierden para siempre. Así que `head` se queda donde está, y `current` es el que camina. ¿Y por qué un bucle `while` y no un `for`? Porque un recorrido no cuenta hasta un número: se detiene al llegar a `null`, que es justo para lo que sirve el null del final de la lista.

```viz
trace-ll-walk
```

**Qué acaba de pasar:** `current` empezó en Ana, donde apunta `head`. En cada vuelta del bucle, saludó a quien estaba en ese nodo y luego avanzó con `current = current.next`. Después del último nodo, `current` se volvió `null`, y la condición `current !== null` terminó el bucle. Con una fila vacía, `head` ya era `null`, así que el bucle nunca corrió. Elige 5 nombres y cuenta: el recorrido visita cada nodo exactamente una vez.

```js-run
const head = {
  value: 'Ana',
  next: { value: 'Ben', next: { value: 'Cleo', next: null } },
}

let current = head
while (current !== null) {
  console.log('¡Hola, ' + current.value + '!')
  current = current.next
}
console.log(head.value) // sigue siendo 'Ana': head nunca se movió
```

**El Big O de un recorrido:** visita cada nodo una vez, así que es **O(n) en tiempo**. Solo necesita un puntero extra, `current`, sin importar lo larga que sea la fila, así que es **O(1) en espacio extra**. Ese es el costo escondido dentro de pop, insert, remove y buscar un nodo, de la lección pasada.

**Por dentro:** `while (current !== null)` y `while (current)` se detienen en el mismo momento, porque `null` cuenta como falso en una condición y un objeto nodo cuenta como verdadero. Escribimos `!== null` a propósito: dice exactamente lo que queremos, "hasta pasar el final de la fila", y nada más puede colarse como falso.

**Error común:** olvidar `current = current.next`. Entonces `current` nunca cambia, la condición nunca se vuelve falsa, y el bucle corre para siempre (la app lo detiene después de 2 segundos). Otro: escribir `while (current.next !== null)` cuando quieres visitar todos los nodos. El bucle se detiene con `current` **en** el último nodo, antes de que su cuerpo corra para él, así que el último nombre nunca recibe su saludo. Además truena con una lista vacía, porque leer `next` de `null` es un error.

## Cambiar un nodo vs mover un puntero

`current` y `head` apuntan a nodos que están **en** la lista, así que hay dos cosas muy distintas que puedes hacer con `current`, y cada método de este módulo usa las dos:

- **Mover el puntero:** `current = current.next`. Solo cambia la variable `current`. Ahora apunta a otro nodo, y la lista queda exactamente igual que antes.
- **Cambiar el nodo:** `current.value = 'Bea'`. Esto llega **a través** del puntero y cambia el nodo al que apunta. Ese nodo está en la lista, así que la lista cambia, y cualquiera que llegue a ese nodo, por `head` o por cualquier otro puntero, ve el valor nuevo.

Es la lección de punteros otra vez, aplicada a un recorrido. `=` sobre una variable mueve una flecha. `=` sobre una **propiedad** (cualquier cosa con un punto) cambia el objeto al final de la flecha.

Antes de correrlo, predice las dos líneas que imprime:

```js-run
const head = {
  value: 'Ana',
  next: { value: 'Ben', next: { value: 'Cleo', next: null } },
}

let current = head
current = current.next // mover el puntero: ahora en el nodo de Ben
current.value = 'Bea' // cambiar el nodo: el nodo de Ben ahora guarda 'Bea'
current = null // mover el puntero otra vez: la lista ni se entera

console.log(head.value, head.next.value, head.next.next.value)
console.log(current)
```

**Qué acaba de pasar:** mover `current` al nodo de Ben no cambió nada en la lista. Escribir `current.value` sí: cambió el nodo mismo, así que `head.next.value` imprimió `'Bea'`. Poner `current` en `null` solo cambió la variable, así que la lista quedó completa: Ana, Bea, Cleo. Los métodos de más adelante usan justo esto: `set` camina con `current` y luego cambia `current.value`, e `insert` cambia `current.next` para enlazar un nodo nuevo.

**Big O:** mover `current` una vez y cambiar un nodo son **O(1)**. Llevar `current` a un nodo a k pasos de `head` es la caminata O(k) de antes.

**Error común:** esperar que `current = null` (o `current = someOtherNode`) quite un nodo de la lista. Mover tu propio puntero nunca cambia la lista. Para cambiar la fila, tienes que cambiar una propiedad de un nodo que está en ella, como `current.next`.
