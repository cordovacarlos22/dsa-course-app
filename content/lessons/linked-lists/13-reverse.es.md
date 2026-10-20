---
title: 'reverse: voltear la fila'
order: 13
minutes: 16
---

> **Meta:** escribir `reverse`, el método que voltea toda la lista en su lugar, sin perder ningún nodo mientras las flechas cambian de dirección.

## Entender: qué hace reverse

El DJ grita "¡den la vuelta!", y la fila de conga va hacia el otro lado: el invitado del final ahora va al frente, y cada quien se agarra del invitado que antes iba detrás. Eso es **`reverse`**, y es una de las preguntas de listas enlazadas más comunes en las entrevistas de programación. Paso 1: qué entra, qué sale, qué cambia.

- **Qué entra:** nada. `line.reverse()` trabaja sobre toda la lista.
- **Qué cambia:** `head` y `tail` se intercambian, y **cada flecha `next` se voltea** para apuntar al nodo que antes iba delante. El `next` del último nodo, que era `null`, ahora apunta hacia atrás; el `next` del primer nodo se vuelve `null`, porque ahora es el final.
- **Qué sale:** la lista misma, `this`, como push y unshift.

Voltea **en su lugar**: sin nodos nuevos ni una segunda lista. Los mismos nodos se quedan donde están en memoria, y solo cambian sus flechas. Eso es lo que la hace una buena pregunta de entrevista: hacer una copia volteada es fácil, pero voltear las flechas sin perder la fila requiere cuidado.

```viz
linked-list-reverse
```

**Qué acaba de pasar:** antes, `head` estaba en Ana y todas las flechas apuntaban a la derecha. Después de `reverse()`, `head` estaba en Dev, `tail` en Ana, y todas las flechas apuntaban a la izquierda. Leída desde el nuevo `head`, la fila es Dev, Cleo, Ben, Ana.

**Error común:** pensar que reverse mueve los valores, poniendo `'Dev'` en el nodo de Ana y así. No toca ni un solo valor. Solo cambian las flechas `next` y `head`/`tail`.

## Ejemplos: vacía, un invitado, dos, muchos

Paso 2: ejemplos, de los más chicos hacia arriba.

- **Una fila vacía:** volteada, sigue vacía. El método no debe tronar con ella.
- **Un invitado:** volteada, es la misma fila. `head` y `tail` están en Ana antes y después.
- **Dos invitados:** Ana → Ben se vuelve Ben → Ana. `head` y `tail` se intercambian, el `next` de Ben apunta a Ana, y el `next` de Ana se vuelve `null`.
- **Muchos invitados:** el mismo volteo, repetido a lo largo de toda la fila.

```viz
linked-list-reverse-examples
```

**Qué acaba de pasar:** la fila vacía y la de un invitado salieron igual. Dos invitados intercambiaron lugares como head y tail, con una flecha volteada. Cuatro invitados salieron como Dev, Cleo, Ben, Ana, con cada nodo apuntando al que antes iba delante.

Los arrays también tienen un `reverse` integrado, y también trabaja en su lugar:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']
const sameArray = guests.reverse()
console.log(guests) // volteado en su lugar
console.log(sameArray === guests) // true: no se creó un array nuevo
```

**Error común:** probar solo el ejemplo de muchos invitados. La fila vacía es la que hace tronar un reverse descuidado, como vas a ver en el paso 4.

## Dividirlo en pasos

Paso 3: el plan. Intercambiar `head` y `tail` es la parte fácil: guarda `head` en `temp`, haz que `head` apunte a `tail`, y luego que `tail` apunte a `temp`.

La parte difícil es voltear las flechas. En el momento en que volteas el `next` de un nodo hacia atrás, sueltas **el resto de la fila**: ya nada apunta hacia adelante al siguiente nodo, y queda un **hueco**. Así que antes de cada volteo, necesitas un puntero del otro lado del hueco. Por eso reverse usa tres punteros que recorren la fila juntos:

- **`temp`**: el nodo cuya flecha estás volteando ahora.
- **`next`**: el nodo después de `temp`, guardado **antes** del volteo, para no perder el resto de la fila.
- **`prev`**: el nodo antes de `temp`, a donde debe apuntar la flecha de `temp` después del volteo. Empieza en `null`, porque el primer nodo va a ser el último.

```js
reverse() {
  // 1. intercambia head y tail (temp recuerda el head viejo)
  // 2. prev empieza en null, y next también
  // 3. por cada nodo: next = temp.next, para recordar el resto
  // 4.   temp.next = prev: voltea la flecha
  // 5.   prev = temp y luego temp = next: los dos avanzan un nodo
  // 6. regresa la lista
}
```

```viz
linked-list-reverse-plan
```

**Qué acaba de pasar:** después del intercambio, `temp` estaba en Ana con `prev` en `null`. `next` tomó a Ben, la flecha de Ana se volteó hacia `null`, y eso abrió un hueco entre Ana y Ben. Pero `next` todavía sostenía a Ben, así que `prev` se movió a Ana y `temp` cruzó el hueco hasta Ben. Después de cuatro vueltas, todas las flechas apuntaban a la izquierda.

**Error común:** voltear primero y guardar `next` después. Después de `temp.next = prev`, `temp.next` ya no lleva hacia adelante, así que `next = temp.next` guarda el nodo equivocado, y el resto de la fila se pierde.

## Escribir el código

Paso 4: el intercambio, y luego el bucle. Sabemos que el bucle corre una vez por nodo, así que un bucle `for` hasta `this.length` queda bien. Las cuatro líneas de adentro son los pasos 3 a 5 del plan, en ese orden.

¿Dónde están los casos especiales? Los resuelve el mismo código. Con **un invitado**, el intercambio no cambia nada, y el bucle corre una vez: el `next` de Ana se vuelve `prev`, que es `null`, igual que antes. Con una **fila vacía**, `temp` es `null`, y el bucle corre cero veces, así que nunca se lee `temp.next`.

Por eso `next` empieza en `null`. Una versión que empieza con `let next = temp.next` lee `temp.next` antes del bucle, y con una fila vacía `temp` es `null`, así que truena.

```viz
trace-ll-reverse
```

**Qué acaba de pasar:** con 4 invitados, el intercambio puso `head` en Dev y `tail` en Ana, y luego cada vuelta guardó `next`, volteó la flecha de `temp` hacia `prev`, y avanzó los dos. Después de la última vuelta, `temp` y `next` eran `null` y `prev` estaba en Dev, el nuevo primer nodo. Con 1 invitado, una vuelta no cambió nada. Con 0 invitados, el bucle nunca corrió.

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

  reverse() {
    let temp = this.head
    this.head = this.tail
    this.tail = temp
    let prev = null
    let next = null
    for (let i = 0; i < this.length; i++) {
      next = temp.next
      temp.next = prev
      prev = temp
      temp = next
    }
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

const line = new LinkedList('Ana').push('Ben').push('Cleo').push('Dev')
console.log(line.reverse().toArray().join(' -> ')) // Dev -> Cleo -> Ben -> Ana
console.log(line.head.value, line.tail.value) // Dev Ana
console.log(new LinkedList().reverse().length) // 0: la fila vacía funciona
```

**Error común:** escribir las cuatro líneas del bucle en otro orden. Cada línea necesita la anterior: `next` se tiene que guardar antes del volteo, y `prev` se tiene que mover antes que `temp`, o `prev` caería en el nodo equivocado.

## Revisar

Paso 5: el Big O, una mejora, y todo el módulo en una tabla.

**Big O:** reverse visita cada nodo una vez: **O(n) en tiempo**. Usa tres punteros extra sin importar la longitud de la fila, y ningún nodo nuevo: **O(1) en espacio**. Esa es la respuesta que buscan en una entrevista. Hacer una copia volteada también es O(n) en tiempo, pero necesita O(n) de espacio extra para los nodos nuevos.

**Una mejora:** el bucle podría ser `while (temp !== null)` en vez de contar hasta `this.length`. Los dos se detienen después del último nodo. La versión con `while` no depende de que `length` esté bien, y eso es útil si algún día reusas este bucle en una cadena de nodos que no tiene `length`, como pasa en muchos problemas de entrevista.

**Toda la clase `LinkedList`**, con cada método que construiste en este módulo:

| Método                 | Qué hace                         | Big O (tiempo) |
| ---------------------- | -------------------------------- | -------------- |
| `constructor(value)`   | empieza vacía, o con un invitado | O(1)           |
| `push(value)`          | agrega al final                  | O(1)           |
| `pop()`                | quita del final                  | O(n)           |
| `unshift(value)`       | agrega al inicio                 | O(1)           |
| `shift()`              | quita del inicio                 | O(1)           |
| `get(index)`           | encuentra el nodo en un índice   | O(n)           |
| `set(index, value)`    | cambia el valor en un índice     | O(n)           |
| `insert(index, value)` | agrega en un índice              | O(n)           |
| `remove(index)`        | quita en un índice               | O(n)           |
| `reverse()`            | voltea toda la lista en su lugar | O(n)           |

Cada renglón coincide con los costos que predijiste en la lección 2, antes de escribir un solo método. Los problemas de entrevista de este módulo, que llegan con la siguiente sección del curso, usan estos mismos movimientos de punteros: encontrar el nodo de en medio, detectar un ciclo, voltear una parte de la lista.

**Error común:** memorizar reverse línea por línea. En una entrevista te van a pedir que lo expliques. Mejor recuerda la idea, con cada volteo se abre un hueco y `next` sostiene el otro lado, y con eso puedes reconstruir las cuatro líneas.
