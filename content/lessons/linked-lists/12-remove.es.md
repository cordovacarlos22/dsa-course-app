---
title: 'remove: sacar a quien está en un índice'
order: 12
minutes: 17
---

> **Meta:** escribir `remove`, el método que saca el nodo de cualquier índice y lo regresa, reusando `shift`, `pop` y `get`.

## Entender: qué hace remove

Alguien en medio de la fila de conga se tiene que ir temprano. Los invitados de cada lado cierran el hueco, y la fila sigue bailando. Eso es **`remove`**. Paso 1: qué entra, qué sale, qué cambia.

- **Qué entra:** un índice: `line.remove(2)`.
- **Qué cambia:** el nodo en ese índice sale de la fila. El nodo de antes ahora apunta al nodo de después, cada nodo de después queda un índice antes, y `length` baja 1. Si era el primer o el último nodo, también se mueve `head` o `tail`.
- **Qué sale:** el nodo que se quitó, suelto de la fila (su `next` es `null`), o `undefined` si no hay nodo en ese índice.

Sus índices válidos son los de get, no los de insert: de 0 a `length - 1`. Puedes insertar en `length` (justo después del último nodo), pero no puedes quitar de ahí, porque en ese lugar no hay nadie.

```viz
linked-list-remove
```

**Qué acaba de pasar:** `remove(2)` sacó el nodo de Cleo de la mitad. Ahora Ben apunta directo a Dev, Dev pasó del índice 3 al 2, y la longitud pasó de 4 a 3. Luego remove regresó el nodo de Cleo, suelto de la fila.

**Por dentro:** quitar un nodo no lo borra. Sigue siendo un objeto normal, que ahora guarda quien recibió lo que regresó el método. Solo desaparece de la **lista**, porque ningún nodo de la fila le apunta.

**Error común:** confundir lo que regresa remove con lo que regresa insert. insert responde sí o no (`true` o `false`). remove te da **quién se fue** (el nodo), como pop y shift, o `undefined` cuando nadie se fue.

## Ejemplos: inicio, final, mitad, fuera de rango

Paso 2: ejemplos. Igual que con insert, dos de ellos son métodos que ya escribiste.

- **Índice 0, el inicio:** eso es **`shift`**.
- **El último índice, `length - 1`:** eso es **`pop`**.
- **La mitad:** camina hasta el nodo antes del que se va, y haz que se lo salte: `nodeBefore.next = nodeBefore.next.next` de la lección 2.
- **Fuera de rango:** un índice negativo, o `length` y más. Ahí no hay nadie, así que remove regresa `undefined`.

Una fila vacía queda cubierta por la revisión del rango: con `length` en 0, ningún índice es válido. Y una fila con un nombre queda cubierta por el caso del inicio, porque su único índice, 0, también es el último.

```viz
linked-list-remove-examples
```

**Qué acaba de pasar:** el índice 0 sacó a Ana del inicio, como shift. El índice 3 sacó a Dev del final, como pop. El índice 2 sacó a Cleo de la mitad. El índice 4 estaba fuera de rango, así que nada cambió y remove regresó `undefined`.

Antes de correrlo, predice las tres líneas. Es el caso del medio de remove con objetos normales:

```js-run
const dev = { value: 'Dev', next: null }
const cleo = { value: 'Cleo', next: dev }
const ben = { value: 'Ben', next: cleo }

const removed = ben.next // Cleo: el nodo que se va
ben.next = removed.next // Ben ahora apunta más allá de Cleo
console.log(ben.next.value)
console.log(removed.next.value) // ¿todavía apunta a la fila?

removed.next = null // sepáralo
console.log(removed.next)
```

**Qué acaba de pasar:** con un solo movimiento de puntero, Ben apuntó directo a Dev, así que Cleo quedó fuera de la fila. Pero el nodo de Cleo siguió apuntando a Dev hasta que `removed.next = null` lo cortó. Ese corte es la razón por la que remove regresa un nodo limpio.

**Por dentro:** la revisión del rango de remove es la misma que la de get, `index < 0 || index >= this.length`, porque solo puedes quitar un nodo que existe, igual que solo puedes obtener uno. insert era la excepción, porque también acepta el lugar justo después del último nodo.

**Error común:** copiar la revisión del rango de insert, `index > this.length`. Eso deja pasar `remove(length)`, y ahí no hay ningún nodo que quitar.

## Dividirlo en pasos

Paso 3: el plan. Los extremos van a shift y pop, y la mitad necesita **dos** punteros: **`nodeBefore`**, el nodo cuyo `next` tiene que cambiar, y **`removed`**, el nodo que se va (lo tenemos que regresar).

```js
remove(index) {
  // 1. si index < 0 o index >= length, regresa undefined
  // 2. ¿index 0? regresa this.shift(). ¿Último índice? regresa this.pop()
  // 3. nodeBefore = el nodo antes del lugar: this.get(index - 1)
  // 4. removed = nodeBefore.next: el nodo que se va
  // 5. el next de before se salta a removed
  // 6. el next de removed se vuelve null, para soltarlo
  // 7. réstale 1 a length, regresa removed
}
```

Fíjate en el paso 4. Para llegar al nodo que se va, podrías llamar `this.get(index)`, pero eso camina otra vez desde `head`. No hace falta: ya estás parado en el nodo justo antes, así que es simplemente `nodeBefore.next`, a un paso. Un segundo `get` sería una segunda caminata O(n) para algo que cuesta O(1).

El paso 6 es la misma idea que `oldHead.next = null` en shift: suelta el nodo que se va, para que quien lo reciba no reciba también el resto de la fila.

```viz
linked-list-remove-plan
```

**Qué acaba de pasar:** el índice 2 pasó la revisión del rango y no era un extremo. `get(1)` caminó hasta Ben, así que `nodeBefore` fue Ben, y `removed` fue el `next` de Ben, Cleo, sin una segunda caminata. El `next` de Ben se saltó a Cleo y apuntó a Dev, se cortó el `next` de Cleo, y la longitud bajó a 3.

**Por dentro:** `nodeBefore.next = removed.next` es toda la eliminación: un movimiento de puntero. Todo lo demás en el método es encontrar `nodeBefore`, guardar `removed` para poder regresarlo, y ordenar (`removed.next = null`, `length--`).

**Error común:** escribir solo `nodeBefore.next = nodeBefore.next.next`. El nodo sí sale de la fila, pero perdiste tu único puntero a él, así que no puedes cortar su `next` ni regresarlo. Guárdalo primero en `removed`.

## Escribir el código

Paso 4: primero el caso común. En la mitad, son los pasos 3 a 7:

```js
const nodeBefore = this.get(index - 1)
const removed = nodeBefore.next
nodeBefore.next = removed.next
removed.next = null
this.length--
return removed
```

Luego van arriba los casos especiales. La revisión del rango regresa `undefined`. El índice 0 regresa `this.shift()`, y el último índice regresa `this.pop()`. A diferencia de insert, remove sí puede regresar lo que regresan shift y pop, porque ya regresan el nodo que quitaron: la misma respuesta que da remove.

```viz
trace-ll-remove
```

**Qué acaba de pasar:** `remove(2)` caminó hasta Ben con `get(1)`, tomó el `next` de Ben como `removed`, hizo que Ben se saltara a Cleo, soltó a Cleo y regresó su nodo. `remove(0)` le pasó el trabajo a shift. `remove(9)` estaba fuera de rango y regresó `undefined`.

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

  shift() {
    if (!this.head) {
      return undefined
    }
    let oldHead = this.head
    this.head = this.head.next
    oldHead.next = null
    this.length--
    if (this.length === 0) {
      this.tail = null
    }
    return oldHead
  }

  get(index) {
    if (index < 0 || index >= this.length) {
      return undefined
    }
    let current = this.head
    for (let i = 0; i < index; i++) {
      current = current.next
    }
    return current
  }

  remove(index) {
    if (index < 0 || index >= this.length) {
      return undefined
    }
    if (index === 0) {
      return this.shift()
    }
    if (index === this.length - 1) {
      return this.pop()
    }
    const nodeBefore = this.get(index - 1)
    const removed = nodeBefore.next
    nodeBefore.next = removed.next
    removed.next = null
    this.length--
    return removed
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

const line = new LinkedList('Ana').push('Ben').push('Cleo').push('Dev')
console.log(line.remove(2)) // el nodo de Cleo, solo
console.log(line.toArray().join(' -> ')) // Ana -> Ben -> Dev
console.log(line.remove(2).value, line.tail.value) // Dev Ben: el último índice usó pop
console.log(line.remove(5)) // undefined
```

**Por dentro:** remove le pasa los extremos a `shift` y `pop`, que ya actualizan `length`, `head` y `tail`. Así que el caso del medio no toca `head` ni `tail`, por la misma razón que el caso del medio de insert: un nodo del medio nunca es el primero ni el último.

**Error común:** revisar el último índice con `this.length` en vez de `this.length - 1`. `index === this.length` nunca pasa la revisión del rango, así que el caso de pop nunca correría, y quitar el último nodo pasaría por el código de en medio, que nunca mueve `tail`.

## Revisar

Paso 5: el Big O, y la mejora que abarató la mitad.

**Big O:** quitar al inicio es shift: O(1). Quitar el último nodo es pop, y pop recorre la fila: O(n). En la mitad, `get` camina hasta el nodo de antes: O(n). Así que remove es **O(n) en tiempo** y **O(1) en espacio**. El `splice` de un array también es O(n), por la razón contraria: no camina para encontrar el lugar, pero todo lo que va después tiene que reindexarse.

**La mejora:** `const removed = nodeBefore.next` en vez de `const removed = this.get(index)`. Los dos dan el mismo nodo. El primero es un paso, y el segundo es una segunda caminata desde `head`. Cuando ya estás parado junto al nodo que necesitas, usa la flecha que tienes en la mano en vez de caminar otra vez.

**Ya terminaste la caja de herramientas.** Con remove, nuestra `LinkedList` puede agregar y quitar invitados en cualquier lugar: al inicio, al final y en cualquier índice. Solo queda un método, y es el que más preguntan en las entrevistas: reverse.

```js-run
// remove en cada índice de una fila de 6: ¿cuántos movimientos para llegar al lugar?
const length = 6
for (let index = 0; index < length; index++) {
  let moves = 0
  if (index === length - 1) {
    moves = length - 1 // pop camina hasta el nodo antes del tail
  } else if (index !== 0) {
    moves = index - 1 // get(index - 1)
  }
  console.log('remove(' + index + '): ' + moves + ' movimientos')
}
```

**Por dentro:** una lista doblemente enlazada hace O(1) quitar un nodo que **ya tienes**: desde el nodo mismo, `prev` y `next` te dan a los dos vecinos, sin caminar. Por eso los navegadores y los editores usan listas así para cosas que quitan seguido, como los pasos detrás del botón de deshacer.

**Error común:** suponer que el último nodo es el más barato de quitar porque está "al final". En una lista enlazada simple, el final es el lugar caro. Quitarlo pasa por pop, que recorre toda la fila.
