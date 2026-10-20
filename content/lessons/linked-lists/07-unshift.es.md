---
title: 'unshift: agregar un invitado al inicio'
order: 7
minutes: 12
---

> **Meta:** escribir `unshift`, el método que agrega un nodo al inicio de la lista, y ver por qué aquí es O(1) cuando en un array es O(n).

## Entender: qué hace unshift

Llega un invitado y se va directo al **inicio** de la fila de conga. Eso es **`unshift`**, el reflejo de push. Paso 1: qué entra, qué sale, qué cambia.

- **Qué entra:** un valor: `line.unshift('Zoe')`.
- **Qué cambia:** un nodo nuevo con ese valor va **antes del primer nodo**. `head` se mueve al nodo nuevo, porque es el nuevo primer invitado. `length` sube 1. `tail` no se mueve (a menos que la lista estuviera vacía).
- **Qué sale:** la lista misma, `this`, igual que nuestro push.

Esta es la operación donde las listas enlazadas les ganan a los arrays. El `unshift` de un array tiene que recorrer cada elemento un lugar y darle un índice nuevo: O(n). Una lista enlazada solo hace que el nodo nuevo apunte al antiguo primer nodo y mueve `head`. Nadie más de la fila se mueve.

```viz
linked-list-unshift
```

**Qué acaba de pasar:** la fila era Ana, Ben, Cleo. `unshift('Zoe')` puso un nodo para Zoe delante de Ana, `head` se movió a Zoe, y la longitud pasó de 3 a 4. `tail` se quedó en Cleo. Luego se regresó la lista completa.

**Error común:** esperar que `unshift` regrese la nueva longitud. El `unshift` de un array sí lo hace, pero el nuestro regresa la lista, así que se puede encadenar como push.

## Ejemplos: vacía, un invitado, muchos invitados

Paso 2: los mismos tres ejemplos que en push.

**Muchos invitados:** el nodo de Zoe apunta a Ana (donde está `head`), y luego `head` se mueve a Zoe. Dos movimientos de punteros. **Un invitado:** exactamente igual. Zoe apunta a Ana, `head` se mueve a Zoe, y `tail` se queda en Ana, que sigue en el último lugar. **Una fila vacía:** el invitado nuevo es el primero y el último, así que `head` y `tail` apuntan al nodo nuevo, igual que push en una fila vacía.

```viz
linked-list-unshift-examples
```

**Qué acaba de pasar:** con una fila vacía, `head` y `tail` tomaron el nodo de Zoe. Con un invitado y con tres, Zoe se enlazó al frente y solo se movió `head`.

Compáralo con los arrays. Corre esto y fíjate en lo que regresa cada llamada:

```js-run
const guests = ['Ana', 'Ben', 'Cleo']
console.log(guests.unshift('Zoe')) // 4: el unshift de un array regresa la nueva longitud
console.log(guests) // cada invitado se recorrió un lugar para hacer espacio

const empty = []
empty.unshift('Zoe')
console.log(empty) // Zoe ocupa el primer y el último lugar
```

**Error común:** olvidar `tail` en una lista vacía. Si unshift solo mueve `head`, una lista vacía termina con `head` en el nodo nuevo y `tail` todavía en `null`, y el siguiente `push` truena en `this.tail.next`.

## Dividirlo en pasos

Paso 3: el plan. Tiene la misma forma que push, con el trabajo en el otro extremo:

```js
unshift(value) {
  // 1. crea un nodo nuevo con el valor
  // 2. si la lista está vacía: head y tail apuntan al nodo nuevo
  // 3. si no:
  //    a. el next del nodo nuevo apunta al primer nodo (donde está head)
  //    b. head se mueve al nodo nuevo
  // 4. súmale 1 a length
  // 5. regresa la lista (this)
}
```

El orden de 3a y 3b importa, y aquí se cumple la advertencia de la lección de punteros. `head` es lo **único** que apunta al primer nodo. Enlaza el nodo nuevo a él primero, mientras `head` todavía apunta ahí. Si mueves `head` primero, ya nada apunta a Ana, y toda la fila se pierde.

```viz
linked-list-unshift-plan
```

**Qué acaba de pasar:** se creó el nodo nuevo para Zoe, la fila no estaba vacía, el `next` de Zoe apuntó a Ana, y solo entonces `head` se movió a Zoe. La longitud subió y se regresó la lista. En una fila vacía, el paso 2 habría hecho todo el trabajo.

**Error común:** escribir el paso 3b antes del 3a. Primero `this.head = newNode` y luego `newNode.next = this.head` hace que el nodo nuevo se apunte **a sí mismo**. Ana, Ben y Cleo se quedan sin nada que los apunte, y el recolector de basura se los lleva.

## Escribir el código

Paso 4: primero el caso común. Con invitados en la fila, son los dos movimientos del paso 3, más la longitud y el return:

```js
unshift(value) {
  const newNode = new Node(value)
  newNode.next = this.head
  this.head = newNode
  this.length++
  return this
}
```

Luego el caso especial. En una lista vacía esta versión no truena (el `next` del nodo nuevo simplemente queda en `null`), pero deja `tail` en `null`. Así que agrega el mismo `if (!this.head)` que en push, haciendo que `head` y `tail` apunten al nodo nuevo, y mete las dos líneas en el `else`.

```viz
trace-ll-unshift
```

**Qué acaba de pasar:** con 3 invitados, el `else` hizo que Zoe apuntara a Ana, y luego movió `head` a Zoe. Con una fila vacía, el `if` hizo que `head` y `tail` apuntaran a Zoe. En los dos casos no hay bucle: unshift nunca recorre la fila.

```js-run
class Node {
  constructor(value) {
    this.value = value
    this.next = null
  }
}

class LinkedList {
  constructor(value) {
    this.head = null
    this.tail = null
    this.length = 0
    if (value !== undefined) {
      const newNode = new Node(value)
      this.head = newNode
      this.tail = this.head
      this.length = 1
    }
  }

  unshift(value) {
    const newNode = new Node(value)
    if (!this.head) {
      this.head = newNode
      this.tail = newNode
    } else {
      newNode.next = this.head
      this.head = newNode
    }
    this.length++
    return this
  }

  toArray() {
    const values = []
    let temp = this.head
    while (temp !== null) {
      values.push(temp.value)
      temp = temp.next
    }
    return values
  }
}

const line = new LinkedList()
line.unshift('Cleo')
line.unshift('Ben')
line.unshift('Ana')
console.log(line.toArray().join(' -> ')) // Ana -> Ben -> Cleo
console.log(line.head.value, line.tail.value) // Ana Cleo: Cleo llegó primero, así que Cleo queda al final
```

**Error común:** esperar que los invitados agregados con unshift salgan en el orden en que los agregaste. Cada unshift va **delante** del anterior, así que agregar a Cleo, Ben y Ana en ese orden da Ana, Ben, Cleo.

## Revisar

Paso 5: el Big O, y una mejora.

**Big O:** un nodo nuevo y dos movimientos de punteros, sin importar lo larga que sea la fila: **O(1) en tiempo** y **O(1) en espacio**. En un array, `unshift` es **O(n)**, porque cada elemento se recorre y recibe un índice nuevo. Este, y `shift` en la próxima lección, son los dos renglones de la tabla de la lección 2 que ganan las listas enlazadas.

**Una mejora:** igual que en push, las dos ramas terminan con la misma línea, `this.head = newNode`. Sácala del `if`:

```js
unshift(value) {
  const newNode = new Node(value)
  if (!this.head) {
    this.tail = newNode
  } else {
    newNode.next = this.head
  }
  this.head = newNode
  this.length++
  return this
}
```

Pon esto junto a la mejora de push y vas a ver que los dos métodos son reflejo uno del otro: push siempre mueve `tail` y solo pone `head` en una lista vacía, mientras que unshift siempre mueve `head` y solo pone `tail` en una lista vacía.

```js-run
// Agregar 1,000 invitados al inicio: cuenta los movimientos de cada uno.
const sizes = [10, 1000]
for (let i = 0; i < sizes.length; i++) {
  let arrayMoves = 0
  let listMoves = 0
  for (let k = 0; k < sizes[i]; k++) {
    arrayMoves = arrayMoves + k // un array recorre a cada invitado que ya está en la fila
    listMoves = listMoves + 2 // una lista enlazada hace dos movimientos de punteros
  }
  console.log(sizes[i] + ' invitados: array ' + arrayMoves + ' movimientos, lista enlazada ' + listMoves)
}
```

**Error común:** pensar que unshift es rápido porque el código es corto. Un código corto también puede ser lento (una línea corta que llama `guests.unshift` dentro de un bucle es O(n²) en un array). Lo que hace O(1) al nuestro es que nunca toca ningún nodo excepto el nuevo y el antiguo primero.
