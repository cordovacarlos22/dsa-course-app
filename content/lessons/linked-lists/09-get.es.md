---
title: 'get: encontrar el nodo en un índice'
order: 9
minutes: 12
---

> **Meta:** escribir `get`, el método que camina hasta el nodo en un índice y lo regresa, y manejar cada índice que no existe.

## Entender: qué hace get

Una lista enlazada no tiene índices, pero la gente igual pide "el tercer invitado". **`get`** responde esa pregunta: le da a la lista enlazada algo que funciona como un índice, contando mientras camina. Paso 1: qué entra, qué sale, qué cambia.

- **Qué entra:** un índice, contado desde `head` como en un array: el primer nodo es 0, el siguiente es 1, y así.
- **Qué sale:** el **nodo** en ese índice, que sigue en la fila. Si no hay nodo en ese índice, `get` regresa `undefined`.
- **Qué cambia:** nada. `get` solo mira.

Esto es "buscar por índice" de la tabla de la lección 2, y es O(n): no hay un bloque de memoria al cual saltar, así que la única forma de llegar al nodo del índice 2 es desde `head`, un `next` a la vez. `get` también es una pieza para construir otros métodos. En las próximas lecciones, `set`, `insert` y `remove` empiezan llamándolo.

```viz
linked-list-get
```

**Qué acaba de pasar:** `get(2)` empezó en `head` y avanzó dos veces, contando a Ana como 0, a Ben como 1 y a Cleo como 2. Regresó el nodo de Cleo, y la fila no cambió.

**Error común:** esperar que `get` regrese el valor. Regresa todo el nodo, para que todavía puedas seguir su `next` o cambiarlo. El valor está a un paso: `line.get(2).value`.

## Ejemplos: vacía, un invitado, el último invitado, fuera de rango

Paso 2: ejemplos. En un método con índices, los ejemplos interesantes son sobre **qué índices existen**. En una fila de cuatro invitados, los índices válidos son 0, 1, 2 y 3: de 0 hasta **`length - 1`**.

- **Una fila vacía** no tiene ningún índice válido, así que `get(0)` regresa `undefined`.
- **Un invitado:** solo existe el índice 0, y `get(0)` regresa el nodo de head sin moverse.
- **El último invitado:** `get(length - 1)` es la caminata más larga, hasta el tail.
- **Fuera de rango:** un índice negativo como -1, o un índice de `length` o más (como 4 en una fila de cuatro), no existe. `get` regresa `undefined` para esos sin caminar nada.

```viz
linked-list-get-examples
```

**Qué acaba de pasar:** la fila vacía y los índices -1 y 4 regresaron `undefined`, sin caminar. El índice 0 con un invitado regresó el nodo de Ana de inmediato, y el índice 3 recorrió toda la fila hasta Dev.

Los arrays responden igual a los índices fuera de rango, así que `undefined` es una elección natural:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']
console.log(guests[3]) // Dev: el último índice es length - 1
console.log(guests[4]) // undefined: no hay invitado en el índice 4
console.log(guests[-1]) // undefined: no hay índices negativos
```

**Error común:** escribir la revisión del rango como `index > this.length`. Eso deja pasar `index === length`, y la caminata se sale del final de la fila. El último índice que existe es `length - 1`, así que la revisión es `index >= this.length`.

## Dividirlo en pasos

Paso 3: el plan como comentarios.

```js
get(index) {
  // 1. si index < 0 o index >= length, regresa undefined
  // 2. temp empieza en head (índice 0)
  // 3. avanza temp, index veces
  // 4. regresa temp
}
```

El paso 3 es una caminata, pero no la caminata sin fin conocido de pop. Aquí sabemos **exactamente cuántos movimientos** necesitamos: para llegar al índice 2, muévete 2 veces. Cuando conoces la cuenta de antemano, un bucle `for` es lo natural: `for (let i = 0; i < index; i++) { temp = temp.next }`. pop usó `while`, porque no sabía dónde estaba el final hasta ver `null`.

La revisión del rango va primero porque hace seguro todo lo que viene después. Cuando un índice ya la pasó, la caminata nunca puede salirse del final de la fila.

```viz
linked-list-get-plan
```

**Qué acaba de pasar:** la revisión del rango pasó para el índice 2. `temp` empezó en `head`, en el índice 0, y avanzó una vez por cada cuenta: a Ben (1), luego a Cleo (2). Dos movimientos para el índice 2, y luego se regresó `temp`.

**Error común:** equivocarse por uno en el bucle, como `i <= index` o empezar `i` en 1. Cualquiera de los dos hace que `temp` se mueva una vez de más o de menos. Prueba el bucle con el ejemplo más chico: `get(0)` no debe moverse nada.

## Escribir el código

Paso 4: primero el caso común, luego el caso especial. Con un índice que existe, `get` es la caminata:

```js
get(index) {
  let temp = this.head
  for (let i = 0; i < index; i++) {
    temp = temp.next
  }
  return temp
}
```

Luego el caso especial: un índice que no existe. Sin revisión, `get(10)` con cuatro invitados mueve `temp` a `null` y luego truena al intentar leer `null.next`. Así que la revisión del rango va arriba de todo, y regresa `undefined` antes de empezar a caminar. La revisión sale directo de los ejemplos del paso 2: menor que 0, o `length` y más.

```viz
trace-ll-get
```

**Qué acaba de pasar:** `get(2)` pasó la revisión, empezó en Ana, y avanzó dos veces hasta Cleo, después de visitar 3 nodos. `get(0)` pasó la revisión y regresó el nodo de Ana sin moverse. `get(4)` no pasó la revisión y regresó `undefined` de inmediato.

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

  push(value) {
    const newNode = new Node(value)
    if (!this.head) {
      this.head = newNode
      this.tail = newNode
    } else {
      this.tail.next = newNode
      this.tail = newNode
    }
    this.length++
    return this
  }

  get(index) {
    if (index < 0 || index >= this.length) {
      return undefined
    }
    let temp = this.head
    for (let i = 0; i < index; i++) {
      temp = temp.next
    }
    return temp
  }
}

const line = new LinkedList('Ana').push('Ben').push('Cleo').push('Dev')
console.log(line.get(2).value) // Cleo
console.log(line.get(0).value) // Ana
console.log(line.get(4)) // undefined
console.log(line.get(-1)) // undefined
```

**Error común:** regresar `null` para un índice que no existe. Funciona, pero es una respuesta distinta al `undefined` de un array, y a lo que regresan `pop` y `shift` con una lista vacía. Un solo valor para "aquí no hay nada" en toda la clase es más fácil de revisar.

## Revisar

Paso 5: el Big O, y una decisión de diseño para pensar.

**Big O:** `get` camina hasta `index` nodos, y el peor caso es el último índice, que recorre toda la fila: **O(n) en tiempo**. Usa un puntero extra, `temp`: **O(1) en espacio**. Un array hace el mismo trabajo en O(1) con `guests[index]`, y esa es la diferencia más grande entre las dos estructuras.

**¿Por qué regresar el nodo y no el valor?** Regresar `temp.value` estaría bien para quien solo quiere leer un nombre. Pero los siguientes tres métodos necesitan **el nodo mismo**. `set` cambia el valor del nodo, e `insert` y `remove` enlazan flechas nuevas alrededor de él. Regresar el nodo hace que `get` sea el primer paso compartido de los tres, y leer el valor sigue estando a un `.value` de distancia.

**¿Podría ser más rápido?** Para un índice en la segunda mitad de la fila, caminar desde el tail sería más corto, pero una lista enlazada simple no puede caminar hacia atrás. Una lista doblemente enlazada sí puede, y su `get` usa justo ese truco: empezar desde el extremo más cercano.

```js-run
// get hace index movimientos. Cuéntalos para cada índice de una fila de 5.
const length = 5
for (let index = 0; index < length; index++) {
  let moves = 0
  for (let i = 0; i < index; i++) {
    moves++
  }
  console.log('get(' + index + '): ' + moves + ' movimientos')
}
```

**Error común:** llamar `get` dentro de un bucle para visitar todos los nodos: `for (let i = 0; i < line.length; i++) { line.get(i) }`. Cada `get` vuelve a caminar desde el inicio, así que el bucle hace 0 + 1 + 2 + … movimientos: O(n²). Para visitar todos los nodos, camina una sola vez con `temp`, como hace `toArray`.
