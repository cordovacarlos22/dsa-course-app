---
title: Listas enlazadas vs arrays en Big O
order: 2
minutes: 18
---

> **Meta:** saber el Big O de cada operación de una lista enlazada, ver por qué cada una cuesta lo que cuesta, y compararla con la misma operación en un array.

## El final de la fila: push y pop

Antes de escribir un solo método, conviene saber cuánto va a costar cada uno. Con las listas enlazadas hay una forma sencilla de saberlo. Cuenta los **movimientos de punteros** y hazte una pregunta: **¿tengo que caminar para llegar ahí?** Mover un puntero es un paso, así que es O(1). Una caminata empieza en `head` y visita los nodos uno por uno, y una fila más larga significa una caminata más larga, así que es O(n).

Empieza con **`push`**, agregar a alguien al final. `tail` ya apunta al último nodo, así que no hay que caminar nada. Dos movimientos de punteros hacen todo el trabajo: el `next` del último nodo apunta al nodo nuevo, y luego `tail` se mueve al nodo nuevo. Con 4 invitados en la fila o con 4,000, son los mismos dos movimientos. **`push` es O(1).**

Ahora **`pop`**, quitar a quien está al final. Parece push al revés, pero no lo es. Cuando la última persona se va, `tail` tiene que apuntar a la que estaba antes. Y para apuntar a un nodo, necesitas algo que ya apunte a él. Lo único que apunta a ese penúltimo nodo es el `next` del nodo anterior, y los punteros solo van **hacia adelante**: desde el último nodo no hay forma de regresar. Así que la única opción es empezar en `head` y caminar hasta encontrar el nodo cuyo `next` es el tail. **`pop` es O(n).**

```viz
linked-list-cost-end
```

**Qué acaba de pasar:** `push('Eve')` tomó dos movimientos, sin caminar, porque `tail` nos dio el nodo de Dev de inmediato. `pop()` tuvo que volver a encontrar a Dev, el nodo antes del tail, y la única entrada era por el inicio: `current` visitó a Ana, Ben, Cleo y Dev antes de poder regresar `tail` y dejar fuera a Eve. En una fila más larga, esa caminata sería más larga.

Aquí está lo mismo con objetos normales. Córrelo y fíjate en la cuenta:

```js-run
const dev = { value: 'Dev', next: null }
const cleo = { value: 'Cleo', next: dev }
const ben = { value: 'Ben', next: cleo }
const ana = { value: 'Ana', next: ben }
let head = ana
let tail = dev

// push de Eve: dos movimientos de punteros, sin importar lo larga que sea la fila
const eve = { value: 'Eve', next: null }
tail.next = eve
tail = eve
console.log('Al final:', tail.value)

// pop de Eve: caminar desde head hasta el nodo justo antes del tail
let current = head
let visited = 1
while (current.next !== tail) {
  current = current.next
  visited++
}
tail = current
tail.next = null
console.log('Al final:', tail.value, '- nodos visitados:', visited)
```

**Por dentro:** un nodo no tiene idea de quién le apunta. El nodo de Dev guarda `'Dev'` y su propio `next`, y nada en él dice "Cleo me apunta". Los punteros van en un solo sentido: el nodo que apunta lo sabe, el nodo apuntado no. Así que la única forma de encontrar el nodo **antes** de Dev es preguntarle a cada nodo, desde el inicio, "¿tu `next` es Dev?" Esa pregunta, repetida, es la caminata O(n) dentro de `pop`.

**Error común:** suponer que `pop` es O(1) porque `push` lo es. Parecen reflejo uno del otro, pero `push` solo avanza desde el tail, mientras que `pop` necesita el nodo **detrás** del tail, y una lista enlazada simple no puede mirar hacia atrás. (El módulo de Listas doblemente enlazadas arregla justo esto.)

## El inicio de la fila: unshift y shift

Al inicio de la fila, la historia se voltea. **`unshift`** agrega a alguien al inicio. `head` ya apunta al primer nodo, así que el nodo nuevo puede apuntar a donde apunta `head`, sin caminar. Luego `head` se mueve al nodo nuevo. Dos movimientos de punteros: **`unshift` es O(1).**

**`shift`** quita a quien está al inicio, y es todavía más corto: `head = head.next`. Un movimiento, y `head` queda en el segundo nodo. Ya nada apunta al antiguo primer nodo, y por la lección de punteros sabes qué le pasa a un objeto al que nada apunta: el recolector de basura se lo lleva. **`shift` es O(1).**

Aquí es donde las listas enlazadas le ganan a los arrays. En un array, `unshift` y `shift` son O(n), porque todos los demás elementos tienen que recorrerse y recibir un índice nuevo. Una lista enlazada no tiene índices que actualizar, así que nada más tiene que moverse.

```viz
linked-list-cost-front
```

**Qué acaba de pasar:** `unshift('Zoe')` creó un nodo para Zoe, lo apuntó a Ana (el nodo al que `head` ya apuntaba) y luego movió `head` a Zoe. `shift()` regresó `head` a Ana en un paso, y el nodo de Zoe, sin nada que lo apuntara, quedó para el recolector de basura.

```js-run
const ben = { value: 'Ben', next: null }
let head = { value: 'Ana', next: ben }

// unshift de Zoe: primero enlaza el nodo nuevo, luego mueve head
const zoe = { value: 'Zoe', next: null }
zoe.next = head
head = zoe
console.log(head.value, '->', head.next.value) // Zoe -> Ana

// shift: un solo movimiento de puntero
head = head.next
console.log(head.value) // Ana
```

**Por dentro:** `shift` nunca borra nada por sí mismo. El **recolector de basura** de JavaScript corre en segundo plano y libera cualquier objeto al que tu programa ya no puede llegar desde sus variables. En cuanto `head` pasa más allá de Zoe, nada alcanzable apunta al nodo de Zoe, así que el recolector lo libera después, cuando le toca. Ese trabajo no es parte de tu método, así que no cambia el O(1) de `shift`.

**Error común:** mover `head` antes de enlazar el nodo nuevo. Si escribes `head = zoe` primero, entonces `zoe.next = head` hace que el nodo de Zoe se apunte a sí mismo, y ya nada apunta a Ana: el resto de la fila se pierde. Primero enlaza el nodo nuevo, luego mueve `head`.

## La mitad: insert, remove y buscar

Casi todo el costo de trabajar en medio de una lista enlazada está en llegar ahí. Digamos que quieres **insertar** a Eve en el índice 3. Una lista enlazada no tiene un índice 3 al cual saltar, así que caminas desde `head` y cuentas: índice 0, 1, 2. Te detienes en el índice 2, el nodo **justo antes** del lugar. Luego dos movimientos de punteros meten a Eve: el `next` de Eve apunta al nodo que va después, y el nodo de antes apunta a Eve. Los movimientos son O(1), pero la caminata crece con la fila, así que **`insert` es O(n).**

**Quitar** en un índice funciona igual. Camina hasta el nodo antes del que se va, y apúntalo más allá de ese nodo: `current.next = current.next.next`. Ya nada apunta al nodo que quitaste, así que desaparece. La caminata hace que **`remove` también sea O(n).**

**Buscar** un nombre también es una caminata. Para encontrar a Cleo **por valor**, revisas cada nodo desde `head` hasta que uno coincida: O(n), y es lo mismo en un array, que también tiene que revisar los elementos uno por uno. Pero buscar **por índice** es donde ganan los arrays: un array salta directo a `guests[2]` en O(1), mientras que una lista enlazada todavía tiene que caminar y contar. **Buscar por índice es O(n)** en una lista enlazada.

```viz
linked-list-cost-middle
```

**Qué acaba de pasar:** para insertar a Eve en el índice 3, `current` caminó hasta Cleo en el índice 2, el nodo antes del lugar. Primero Eve apuntó a Dev, y luego Cleo apuntó a Eve. Para quitar el índice 3, la misma caminata terminó en Cleo, y Cleo se apuntó más allá de Eve, directo a Dev.

```viz
linked-list-cost-lookup
```

**Qué acaba de pasar:** encontrar a Cleo por valor tomó 3 nodos visitados, y encontrar el índice 2 tomó los mismos 3, contando en el camino. El array encontró `guests[2]` de un salto, porque sus elementos están uno junto al otro en memoria.

Aquí está una caminata hasta un índice junto a una búsqueda en un array:

```js-run
const head = {
  value: 'Ana',
  next: { value: 'Ben', next: { value: 'Cleo', next: { value: 'Dev', next: null } } },
}

// el nombre en el índice 2: avanzar 2 veces desde head
let current = head
for (let i = 0; i < 2; i++) {
  current = current.next
}
console.log(current.value) // 'Cleo', después de caminar

const guests = ['Ana', 'Ben', 'Cleo', 'Dev']
console.log(guests[2]) // 'Cleo', de un salto
```

**Por dentro:** insert es O(n) en las dos estructuras, pero por razones distintas. Una lista enlazada paga la **caminata** hasta el lugar; enlazar son solo dos movimientos de punteros. Un array puede saltar al lugar en O(1), y luego paga por **recorrer** un lugar cada elemento que va después. Así que si un método de la lista enlazada ya está parado en el nodo correcto (porque un paso anterior caminó hasta ahí), insertar junto a él es O(1). Un array nunca tiene ese trato: los elementos después del lugar siempre se mueven.

**Error común:** caminar un nodo de más antes de insertar. Para poner a alguien en el índice 3, detente en el índice **2**. Si te detienes en el nodo del índice 3, el nodo de antes ya quedó atrás, y no puedes regresar a enlazarlo.

## Listas enlazadas vs arrays: elige según el trabajo

Pon todo lado a lado y aparece un patrón. Aquí está cada operación de esta lección, para una lista enlazada con `head` y `tail` y para un array:

| Operación                   | Lista enlazada | Array | Más rápida en  |
| --------------------------- | -------------- | ----- | -------------- |
| push (agregar al final)     | O(1)           | O(1)  | empate         |
| pop (quitar del final)      | O(n)           | O(1)  | array          |
| unshift (agregar al inicio) | O(1)           | O(n)  | lista enlazada |
| shift (quitar del inicio)   | O(1)           | O(n)  | lista enlazada |
| insert en un índice         | O(n)           | O(n)  | empate         |
| remove en un índice         | O(n)           | O(n)  | empate         |
| buscar por índice           | O(n)           | O(1)  | array          |
| buscar por valor            | O(n)           | O(n)  | empate         |

Ninguna de las dos gana todos los renglones, así que la pregunta correcta no es "¿cuál es mejor?" sino "**¿qué va a hacer más mi programa?**" Si casi siempre lees elementos por posición (el nombre número 57, el tercer puntaje), es difícil ganarle a la búsqueda por índice O(1) de un array. Si casi siempre agregas y quitas al inicio, una lista enlazada lo hace en O(1) mientras un array reindexa todo.

Piensa en una taquilla: las personas nuevas se forman al final, y quien está al inicio recibe su boleto y se va. Eso es `push` más `shift`. Una lista enlazada hace los dos en O(1). Un array también hace `push` en O(1), pero cada `shift` mueve toda la fila. A las filas así se les llama **colas**, y vas a construir una más adelante en esta sección.

```viz
linked-list-big-o
```

**Qué acaba de pasar:** la tabla iluminó un grupo a la vez. La mitad de los renglones son empate. Los arrays ganan pop y buscar por índice, gracias a sus índices y a su bloque único de memoria. Las listas enlazadas ganan el inicio de la fila, porque mover `head` nunca toca a ningún otro nodo.

**Por dentro:** Big O cuenta pasos, no cuánto tarda cada paso, y aquí los arrays tienen una ventaja escondida. Sus elementos están uno junto al otro, así que la computadora los lee en trozos grandes que ya tenía cargados (su **caché**). Los nodos de una lista enlazada están dispersos, así que cada paso de una caminata puede tener que ir a buscar otro lugar de la memoria, y eso es más lento. Dos caminatas O(n) pueden tardar tiempos bastante distintos, y con listas pequeñas un array muchas veces es más rápido en la práctica. Big O te dice cómo **crece** el tiempo; no decide todas las carreras.

**Error común:** juzgar una estructura por una sola operación. Pop es lento en una lista enlazada, pero si tu programa nunca hace pop, eso no importa. Fíjate en la mezcla de operaciones que tu programa hace más, y luego elige.

## Memoria: un bloque o muchos nodos

El tiempo no es el único costo. El otro es el **espacio**: cuánta memoria necesita cada estructura, y cómo la consigue.

Un array necesita **un solo bloque sin huecos**. Cuando haces `push` y el bloque está lleno, el motor reserva un bloque más grande en otro lado y copia ahí todos los elementos. Esa copia es O(n), pero pasa pocas veces, porque cada bloque nuevo deja espacio de sobra. Repartido entre muchos `push`, un `push` promedia O(1): el costo **amortizado** del módulo de Big O. Una lista enlazada nunca copia nada. Cada `push` crea un nodo nuevo donde haya memoria libre, y los nodos que ya estaban en la fila nunca se mueven.

El precio de esa libertad son los punteros. Cada espacio de un array guarda un elemento, pero cada nodo guarda un elemento **y** un puntero `next`, y la lista suma `head`, `tail` y `length` encima. Las dos estructuras siguen usando **O(n) de espacio** para n nombres (lo extra es un puntero por nombre, una cantidad constante), pero una lista enlazada usa más memoria para los mismos nombres.

```js-run
const names = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eve']

// arma la lista desde el final, para que cada nodo nuevo apunte al que va después
let head = null
for (let i = names.length - 1; i >= 0; i--) {
  head = { value: names[i], next: head }
}

// recórrela y cuenta lo que guarda
let values = 0
let pointers = 0
let current = head
while (current !== null) {
  values++
  pointers++ // cada nodo tiene un next, incluso el último (guarda null)
  current = current.next
}
console.log('valores:', values, '| punteros next:', pointers)
console.log('espacios del array:', names.length)
```

**Qué acaba de pasar:** el bucle armó una lista de 5 nodos desde el final: cada nodo nuevo apuntó a la lista armada hasta ese momento, y `head` se movió a él. Luego la caminata contó 5 valores y 5 punteros `next`, uno por nodo, mientras que el array solo necesitó sus 5 espacios. Los mismos nombres, más piezas que guardar: ese es el lado de la memoria en el intercambio.

**Big O:** las dos usan **O(n) de espacio**. Armar la lista fue **O(n) de tiempo**, un paso O(1) por nombre, y la caminata para contar también fue O(n).

**Error común:** pensar que una lista enlazada ahorra memoria porque nunca reserva espacio de sobra. Nunca desperdicia un bloque entero sin usar, pero paga un puntero en cada nodo. Cuál usa menos memoria depende de los tamaños, así que elige según las operaciones que tu programa hace más, como mostró la tabla.
