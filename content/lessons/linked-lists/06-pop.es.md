---
title: 'pop: quitar a quien está al final'
order: 6
minutes: 18
---

> **Meta:** escribir `pop`, el método que quita el último nodo y lo regresa, con dos punteros que recorren la fila juntos.

## Entender: qué hace pop

Quien está al final de la fila de conga se va. Eso es **`pop`**. Paso 1: qué entra, qué sale, qué cambia.

- **Qué entra:** nada. `line.pop()` siempre quita a la **última** persona.
- **Qué cambia:** el último nodo se suelta del final de la lista. `tail` se mueve **hacia atrás** al nodo de antes, y el `next` de ese nodo se vuelve `null`, porque ahora es el final de la fila. `length` baja 1.
- **Qué sale:** el nodo que se quitó, para que sepas quién se fue (`line.pop().value` es el nombre). Si la lista está vacía, no hay nada que quitar, y `pop` regresa `undefined`.

Suena a push al revés, y en la lección 2 viste por qué no lo es. Todas las flechas de una lista enlazada apuntan **hacia adelante**. Mover `tail` hacia adelante fue un paso, pero moverlo hacia atrás significa encontrar el nodo **antes** del último, y nada apunta hacia atrás a él. La única forma de llegar es empezar en `head` y caminar. Esa caminata es la razón de que pop sea O(n) mientras push es O(1), y es la parte de esta lección que necesita más cuidado.

```viz
linked-list-pop
```

**Qué acaba de pasar:** la fila tenía cuatro invitados. `pop()` soltó el nodo de Dev del final, regresó `tail` a Cleo, y la longitud pasó de 4 a 3. Luego regresó el nodo de Dev.

**Por dentro:** el nodo que regresa pop ya está separado de la fila: era el último, así que su `next` es `null`. Por eso pop, a diferencia de shift dentro de dos lecciones, nunca tiene que cortar una flecha antes de regresarlo.

**Error común:** esperar que `pop` regrese el valor, como el `pop` de un array. El nuestro regresa todo el nodo. El valor está a un paso: `line.pop().value`.

## Ejemplos: tres escenarios

Paso 2: ejemplos. pop tiene **tres escenarios**, y el código tiene que resolver bien los tres.

1. **Una fila vacía.** No hay nada a qué hacerle pop, así que pop regresa `undefined` y no cambia nada. (Un array hace lo mismo: `[].pop()` es `undefined`.)
2. **Un nombre.** Hacerle pop a la única persona deja la fila **vacía**. Así que `head` y `tail` tienen que regresar a `null`, y `length` a 0. Este es el tramposo: si `head` y `tail` todavía apuntan al nodo que acabas de quitar, la lista dice que está vacía (length 0) pero todavía guarda un nodo fantasma.
3. **Muchos invitados.** El caso principal: camina hasta el nodo antes del tail, mueve `tail` ahí, y suelta el último nodo.

```viz
linked-list-pop-examples
```

**Qué acaba de pasar:** la fila vacía regresó `undefined`. La fila con solo Ana regresó el nodo de Ana y volvió a tener `head` y `tail` en `null`. La fila de tres regresó el nodo de Cleo, y `tail` regresó a Ben.

Los arrays se comportan igual en los dos primeros escenarios, así que son fáciles de recordar:

```js-run
const nobody = []
console.log(nobody.pop()) // undefined: no hay nada a qué hacerle pop

const justAna = ['Ana']
console.log(justAna.pop(), justAna.length) // Ana 0: ahora el array está vacío
```

**Por dentro:** pop regresa `undefined` en una lista vacía a propósito: es lo que regresa el `pop` de un array vacío (`[].pop()` es `undefined`), así que el código que ya conoce los arrays no se lleva sorpresas.

**Error común:** resolver solo el caso de muchos nombres. El caso de un nombre no truena, y eso lo hace peor: sin avisar, deja a `head` y `tail` apuntando a un nodo que ya no está en la lista.

## Dividirlo en pasos

Paso 3: el plan. La parte difícil es la caminata, así que primero la idea. Usa **dos punteros** que recorren la fila juntos: **`current`** va adelante, y **`previous`** (de "previo") se queda **un nodo atrás**. En cada vuelta del bucle, `previous` se mueve a donde está `current`, y luego `current` avanza un nodo. Cuando `current` ya no tiene `next`, está en el último nodo, y `previous` está en el nodo justo antes: exactamente el que necesita `tail`.

```js
pop() {
  // 1. si la lista está vacía, regresa undefined
  // 2. current y previous empiezan en head
  // 3. camina: mientras current tenga next, previous = current y luego current avanza
  //    (current termina en el último nodo, previous en el de antes)
  // 4. tail se mueve a previous, y el next del nuevo tail se vuelve null
  // 5. réstale 1 a length
  // 6. si length ahora es 0, head y tail se vuelven null
  // 7. regresa current
}
```

¿Por qué `while (current.next !== null)` y no `while (current !== null)`, como el recorrido de la lección 3? Porque queremos que la caminata se detenga **en** el último nodo, no después de él. (También podrías contar con un bucle `for` hasta `this.length`, pero el `while` dice justo lo que queremos: camina hasta que no haya siguiente nodo.)

```viz
linked-list-pop-plan
```

**Qué acaba de pasar:** en una fila de tres, `current` y `previous` empezaron en Ana y caminaron hasta que `current` quedó en Cleo, el último nodo, con `previous` en Ben. `tail` se movió a Ben, el `next` de Ben se volvió `null`, la longitud bajó a 2, y se regresó el nodo de Cleo. El paso 6 solo hizo algo en la fila de un nombre: cuando Ana se fue, la longitud era 0, así que `head` y `tail` regresaron a `null`.

**Por dentro:** que `current` y `previous` avancen a un nodo de distancia es un patrón con nombre: un **puntero que va detrás** (en inglés, _trailing pointer_). `previous` siempre recuerda el nodo que acabas de dejar, porque una lista enlazada simple no puede regresar a él. `remove` usa la misma pareja más adelante en este módulo.

**Error común:** caminar con `while (current !== null)`. Entonces el bucle corre una vez de más, `current` termina en `null`, y `previous` termina en el **último** nodo en vez del de antes. Te pasaste justo del nodo que necesitabas.

## Escribir el código

Paso 4: primero el caso común, luego los casos especiales. Con dos o más invitados, los pasos 2 a 5 y el 7 del plan son todo el método:

```js
pop() {
  let current = this.head
  let previous = this.head
  while (current.next !== null) {
    previous = current
    current = current.next
  }
  this.tail = previous
  this.tail.next = null
  this.length--
  return current
}
```

Ahora los casos especiales. **La lista vacía:** `current.next` truena cuando `current` es `null`, así que revisa primero, arriba de todo: `if (!this.head) { return undefined }`.

**Un nombre:** recorre el código de arriba con solo Ana en la fila. `current` y `previous` empiezan en Ana. `current.next` ya es `null`, así que el bucle nunca corre. `this.tail = previous` no cambia nada (tail ya estaba en Ana), y `this.tail.next = null` tampoco (ya era `null`). `this.length--` deja la longitud en 0. Y entonces... `head` y `tail` **todavía apuntan a Ana**. Así que justo después de restar, agrega: si la longitud ahora es 0, pon `head` y `tail` en `null`. Tiene que ir **después** de `this.length--`, porque es ahí cuando la longitud se vuelve 0.

```viz
trace-ll-pop
```

**Qué acaba de pasar:** con 4 invitados, `current` y `previous` caminaron juntos hasta que `current` quedó en Dev y `previous` en Cleo; luego `tail` se movió a Cleo y Dev se soltó, después de visitar 4 nodos. Con 1 nombre, el bucle no corrió, y solo la revisión de `length === 0` vació la fila. Con 0 invitados, el primer `if` regresó `undefined` de inmediato.

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

  pop() {
    if (!this.head) {
      return undefined
    }
    let current = this.head
    let previous = this.head
    while (current.next !== null) {
      previous = current
      current = current.next
    }
    this.tail = previous
    this.tail.next = null
    this.length--
    if (this.length === 0) {
      this.head = null
      this.tail = null
    }
    return current
  }
}

const line = new LinkedList('Ana')
line.push('Ben')
console.log(line.pop().value) // Ben: dos o más invitados
console.log(line.pop().value) // Ana: la única persona
console.log(line.pop()) // undefined: una fila vacía
console.log(line.head, line.tail, line.length) // null null 0
```

**Por dentro:** pop no destruye el nodo. La lista deja de apuntarle, pero el nodo es un objeto normal, y quien llamó a pop ahora tiene un puntero a él. Si ese código ignora el resultado, ya nada llega al nodo, y el recolector de basura lo libera.

**Error común:** poner la revisión de `length === 0` **antes** de `this.length--`. Con un nombre, la longitud todavía es 1 en ese momento, así que la revisión es falsa, y el nodo fantasma se queda en `head` y `tail`.

## Revisar

Paso 5: el Big O, y algo que mejorar.

**Big O:** pop recorre toda la fila para encontrar el nodo antes del tail, así que es **O(n) en tiempo**. Solo usa dos punteros extra, `current` y `previous`, sin importar lo larga que sea la fila: **O(1) en espacio**. En un array, `pop` es O(1). Esta es la única operación en los extremos de la fila donde ganan los arrays.

**¿Podemos hacerlo O(1)?** Podrías pensar: solo guarda otro puntero al nodo antes del tail. Pero después de un pop, necesitarías el nodo antes de **ese**, y estarías caminando otra vez. El arreglo de verdad es que cada nodo también apunte **hacia atrás**, con un puntero `prev` junto a `next`. Así el nodo antes del tail siempre es `tail.prev`, a un paso. Una lista así es una **lista doblemente enlazada**, y es el siguiente módulo.

**Una mejora para pensar:** la caminata podría contar, con `for (let i = 0; i < this.length - 1; i++)`, porque `length` te dice cuántos movimientos llegan al último nodo. Las dos son correctas y las dos son O(n). Nos quedamos con el `while`, porque dice directamente la regla para detenerse, "detente cuando no haya siguiente nodo", y no depende de que `length` esté bien.

```js-run
// ¿Cuántos nodos visita pop? Cuenta la caminata en filas cada vez más largas.
const sizes = [10, 100, 1000]
for (let i = 0; i < sizes.length; i++) {
  let head = null
  for (let k = sizes[i]; k >= 1; k--) {
    head = { value: 'Persona ' + k, next: head }
  }
  let current = head
  let visited = 1
  while (current.next !== null) {
    current = current.next
    visited++
  }
  console.log(sizes[i] + ' invitados: ' + visited + ' nodos visitados')
}
```

**Por dentro:** la caminata existe solo porque un nodo no puede apuntar hacia atrás. Dale a cada nodo un segundo puntero, `prev`, y el nodo antes del tail es simplemente `this.tail.prev`: pop se vuelve O(1). Eso es una **lista doblemente enlazada**, un módulo más adelante, y el precio es un puntero más en cada nodo.

**Error común:** usar una lista enlazada cuando tu programa casi siempre quita del final. Si pop es el trabajo que más vas a hacer, un array (o una lista doblemente enlazada) es mejor opción.
