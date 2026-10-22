---
title: 'push: agregar un invitado al final'
order: 5
minutes: 14
---

> **Meta:** escribir `push`, el método que agrega un nodo al final de la lista, con los 5 pasos: entender, ejemplos, dividirlo en pasos, escribir el código y revisar.

## Entender: qué hace push

Llega un invitado nuevo y se forma al final de la fila de conga. Eso es **`push`**. El paso 1 de los 5 pasos es decir exactamente qué entra, qué sale y qué cambia.

- **Qué entra:** un valor, el nombre del invitado nuevo: `line.push('Dev')`.
- **Qué cambia:** se agrega un nodo nuevo con ese valor **después del último nodo**. `tail` se mueve al nodo nuevo, porque es el nuevo último invitado. `length` sube 1. `head` no se mueve (a menos que la lista estuviera vacía, como vas a ver en los ejemplos).
- **Qué sale:** nuestro `push` regresa **`this`**, la lista misma. `this` es la lista en particular sobre la que llamaste `push`, no cualquier otra lista, así que la puedes seguir usando de inmediato.

El nombre viene de los arrays, y el trabajo es el mismo: agregar al final. Lo que regresa sí es distinto. El `push` de un array regresa la nueva longitud. El nuestro regresa la lista, y el último paso de esta lección muestra por qué eso es práctico.

```viz
linked-list-push
```

**Qué acaba de pasar:** la fila tenía tres invitados. `push('Dev')` agregó un nodo para Dev después de Cleo, `tail` se movió a Dev, y la longitud pasó de 3 a 4. Luego `push` regresó la lista completa.

Así se va a usar `push` cuando esté escrito. (Es un bloque de código normal, no uno que se pueda correr, porque `push` todavía no existe.)

```js
const line = new LinkedList('Ana')
line.push('Ben') // Ana -> Ben
line.push('Cleo') // Ana -> Ben -> Cleo
line.tail.value // 'Cleo'
line.length // 3
```

**Error común:** esperar que `push` regrese la nueva longitud, como el `push` de un array. El `push` de nuestra lista enlazada regresa la lista (`this`). Si necesitas la longitud, lee `line.length`.

## Ejemplos: vacía, un invitado, muchos invitados

Paso 2: prueba ejemplos, de los más fáciles a los raros, y fíjate en lo que tiene que pasar en cada uno.

**Muchos invitados** es el caso principal. Digamos que la fila es Ana, Ben, Cleo, y llega Dev. Dos movimientos de punteros lo resuelven: el `next` del último nodo apunta al nodo de Dev, y luego `tail` se mueve a Dev. **Un invitado** funciona igual: el `next` de Ana apunta a Ben, y `tail` se mueve a Ben. `head` se queda en Ana en los dos casos.

**Una fila vacía** es distinta, y es el caso que los principiantes olvidan. No hay último nodo, así que no hay ningún `next` que pueda apuntar al nodo nuevo. `tail` es `null`, y escribir `this.tail.next = …` cuando `tail` es `null` hace que el programa truene. En una fila vacía, el invitado nuevo es **el primero y el último** a la vez, así que **`head` y `tail` apuntan al nodo nuevo**.

```viz
linked-list-push-examples
```

**Qué acaba de pasar:** con una fila vacía, `push('Ana')` hizo que `head` y `tail` apuntaran al nodo de Ana. Con un invitado y con tres, enlazó el nodo nuevo después del tail y movió `tail`, y `head` no se movió.

Puedes ver el error tú mismo. Corre esto, y lee el error:

```js-run
const nodeToAdd = { value: 'Ana', next: null }
let tail = null // una lista vacía no tiene último nodo

console.log('Enlazando el nodo nuevo después del tail...')
tail.next = nodeToAdd // aquí no hay ningún nodo al cual ponerle next
```

Ese `TypeError` es lo que haría un `push` sin revisar la lista vacía la primera vez que se usara en una lista vacía.

**Error común:** probar solo con una lista que ya tiene invitados. La lista vacía es el primer ejemplo que hay que probar, porque es la que truena.

## Dividirlo en pasos

Paso 3: el plan como comentarios. Revisa primero la lista vacía, porque es el caso que tronaría:

```js
push(value) {
  // 1. crea un nodo nuevo con el valor
  // 2. si la lista está vacía: head y tail apuntan al nodo nuevo
  // 3. si no:
  //    a. el next del último nodo apunta al nodo nuevo
  //    b. tail se mueve al nodo nuevo
  // 4. súmale 1 a length
  // 5. regresa la lista (this)
}
```

¿Cómo se escribe "la lista está vacía" en código? Vas a ver seguido **`if (!this.head)`**. El operador `!` voltea verdadero y falso, y `null` cuenta como falso (es **falsy**), así que `!this.head` es `true` justo cuando `head` es `null`. En la lección del constructor, `!value` era una trampa, porque 0 y `''` también son falsy. Aquí es seguro: `head` siempre es un nodo o `null`, nunca 0.

```viz
linked-list-push-plan
```

**Qué acaba de pasar:** jugamos el plan con una fila de tres. Primero se creó el nodo nuevo. La fila no estaba vacía, así que el paso 2 se saltó. El `next` de Cleo apuntó al nodo nuevo, luego `tail` se movió a él, y luego subió la longitud. Con una fila vacía, el paso 2 solo habría hecho que `head` y `tail` apuntaran al nodo.

**Error común:** cambiar el orden de los pasos 3a y 3b. Si `tail` se mueve primero, `this.tail.next = nodeToAdd` hace que el nodo nuevo se apunte **a sí mismo**, y el antiguo último nodo, Cleo, sigue apuntando a `null`. Recorrer desde `head` nunca llegaría a Dev. `tail` es tu única forma rápida de llegar al antiguo último nodo, así que úsalo antes de moverlo.

## Escribir el código

Paso 4: primero el caso común, luego el caso especial. Con invitados en la fila, push son los dos movimientos del plan, más la longitud y el return:

```js
push(value) {
  const nodeToAdd = new Node(value)
  this.tail.next = nodeToAdd
  this.tail = nodeToAdd
  this.length++
  return this
}
```

Eso funciona con un invitado y con muchos, y truena con una lista vacía. Así que agrega el caso especial: un `if (!this.head)` que haga que `head` y `tail` apunten al nodo nuevo, con los dos movimientos dentro del `else`. `this.length++` es una forma corta de escribir `this.length = this.length + 1`.

```viz
trace-ll-push
```

**Qué acaba de pasar:** con 3 invitados, el `if` fue falso, así que el `else` enlazó a Cleo con Dev y movió `tail`. Con una fila vacía, el `if` fue verdadero, y `head` y `tail` tomaron el nodo nuevo. En los dos casos no hay ningún bucle: push nunca recorre la fila.

De aquí en adelante, nuestra clase tiene un pequeño ayudante nuestro, **`toArray()`**. Es el recorrido de la lección 3: visita cada nodo y junta los valores en un array, para que podamos imprimir toda la fila de una vez.

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
      const firstNode = new Node(value)
      this.head = firstNode
      this.tail = this.head
      this.length = 1
    }
  }

  push(value) {
    const nodeToAdd = new Node(value)
    if (!this.head) {
      this.head = nodeToAdd
      this.tail = nodeToAdd
    } else {
      this.tail.next = nodeToAdd
      this.tail = nodeToAdd
    }
    this.length++
    return this
  }

  toArray() {
    const values = []
    let current = this.head
    while (current !== null) {
      values.push(current.value)
      current = current.next
    }
    return values
  }
}

const line = new LinkedList()
line.push('Ana')
line.push('Ben')
line.push('Cleo')
console.log(line.toArray().join(' -> ')) // Ana -> Ben -> Cleo
console.log(line.head.value, line.tail.value, line.length) // Ana Cleo 3
```

**Error común:** olvidar `this.length++` o `return this`. La lista se sigue viendo bien al imprimirla, pero `length` queda mal, y todos los métodos que confían en `length` (vas a escribir varios) fallan después.

## Revisar

Paso 5: revisa el Big O, y busca una forma más clara de escribirlo.

**Big O:** push crea un nodo y mueve como máximo dos punteros, sin importar lo larga que sea la fila. Eso es **O(1) en tiempo** y **O(1) en espacio**, igual que el `push` de un array. Lo que lo hace O(1) es `tail`: sin él, tendrías que recorrer toda la fila para encontrar el último nodo.

**Una mejora:** mira las dos ramas. Las dos terminan haciendo que `tail` apunte al nodo nuevo (`this.tail = nodeToAdd`). Una línea que corre en las dos ramas se puede sacar, después del `if`:

```js
push(value) {
  const nodeToAdd = new Node(value)
  if (!this.head) {
    this.head = nodeToAdd
  } else {
    this.tail.next = nodeToAdd
  }
  this.tail = nodeToAdd
  this.length++
  return this
}
```

Hace exactamente lo mismo con una línea menos. Las dos versiones son correctas, así que elige la que se te haga más clara. Después de cualquier mejora, vuelve a correr los ejemplos, empezando por la lista vacía.

**Por qué vale la pena `return this`:** como `push` regresa la lista, puedes llamar otro método sobre el resultado de inmediato. A eso se le llama **encadenar** (en inglés, _chaining_):

```js-run
class Node {
  constructor(value) {
    this.value = value
    this.next = null
  }
}

class LinkedList {
  constructor() {
    this.head = null
    this.tail = null
    this.length = 0
  }

  push(value) {
    const nodeToAdd = new Node(value)
    if (!this.head) {
      this.head = nodeToAdd
    } else {
      this.tail.next = nodeToAdd
    }
    this.tail = nodeToAdd
    this.length++
    return this
  }
}

const line = new LinkedList().push('Ana').push('Ben').push('Cleo')
console.log(line.length) // 3
console.log(line.tail.value) // Cleo
```

**Error común:** "simplificar" push borrando el `if`. Sin él, push truena con la lista vacía. Una mejora tiene que mantener funcionando todos los ejemplos, no solo el principal.
