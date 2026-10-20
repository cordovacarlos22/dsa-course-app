---
title: 'insert: agregar un invitado en un índice'
order: 11
minutes: 15
---

> **Meta:** escribir `insert`, el método que agrega un nodo nuevo en cualquier índice, reusando `unshift`, `push` y `get` para las partes que ya resuelven.

## Entender: qué hace insert

Llega un invitado con un amigo que ya está en la fila y se mete en un lugar específico. Eso es **`insert`**: un nodo nuevo en un índice dado. Paso 1: qué entra, qué sale, qué cambia.

- **Qué entra:** un índice y un valor: `line.insert(2, 'Eve')`.
- **Qué cambia:** un nodo nuevo con ese valor entra **en ese índice**. El nodo que estaba ahí, y cada nodo después de él, quedan un índice más adelante. `length` sube 1. Si el índice es 0 o la longitud, también se mueve `head` o `tail`.
- **Qué sale:** `true` cuando el invitado ya está en la fila, y `false` cuando el índice está fuera de rango y no se agregó nada.

¿Qué índices se permiten? Para `get`, el último índice válido era `length - 1`. Para `insert` hay uno más: **`length` mismo**, el lugar justo después del último invitado, que significa "agrega al final". Así que insert acepta todos los índices de 0 hasta `length`, incluido.

```viz
linked-list-insert
```

**Qué acaba de pasar:** `insert(2, 'Eve')` puso un nodo para Eve en el índice 2, entre Ben y Cleo. Cleo y Dev quedaron un índice más adelante, en 3 y 4, y la longitud pasó de 4 a 5. Luego `insert` regresó `true`.

**Error común:** confundir `insert` con `set`. `set(2, 'Eve')` **reemplazaría** el valor de Cleo. `insert(2, 'Eve')` agrega un invitado nuevo y conserva a Cleo, un índice más adelante.

## Ejemplos: inicio, final, mitad, fuera de rango

Paso 2: ejemplos. insert tiene cuatro tipos, y dos de ellos son métodos que ya escribiste.

- **Índice 0, el inicio:** eso es exactamente **`unshift`**.
- **Índice `length`, el final:** eso es exactamente **`push`**.
- **La mitad:** el trabajo de verdad: camina hasta el nodo antes del lugar, y enlaza ahí el nodo nuevo. Lo viste en la lección 2.
- **Fuera de rango:** un índice negativo, o uno después de `length`, como 7 en una fila de cuatro. No hay forma de poner a un invitado ahí sin dejar un hueco que ningún nodo podría llenar, así que insert regresa `false` y no cambia nada.

Fíjate en lo que **no** está en la lista: una fila vacía. Ya está cubierta. En una fila vacía, `length` es 0, así que el único índice válido es 0, y ese es el caso de unshift.

```viz
linked-list-insert-examples
```

**Qué acaba de pasar:** el índice 0 puso a Zoe al inicio, igual que unshift. El índice 4 puso a Eve al final, igual que push. El índice 2 enlazó a Eve en la mitad. El índice 7 estaba fuera de rango, así que nada cambió e insert regresó `false`.

**Error común:** copiar la revisión del rango de get, `index >= this.length`. Para insert está mal: rechaza `index === length`, así que nunca podrías insertar al final.

## Dividirlo en pasos

Paso 3: el plan. Deja que los métodos que ya existen hagan lo que ya saben hacer, y solo escribe código nuevo para la mitad:

```js
insert(index, value) {
  // 1. si index < 0 o index > length, regresa false
  // 2. ¿index 0? unshift. ¿index === length? push. Luego regresa true
  // 3. crea un nodo nuevo
  // 4. temp = el nodo antes del lugar: this.get(index - 1)
  // 5. el next del nodo nuevo apunta al next de temp
  // 6. el next de temp apunta al nodo nuevo
  // 7. súmale 1 a length, regresa true
}
```

El paso 4 pide el nodo **antes** del lugar, en `index - 1`, porque es el nodo cuyo `next` tiene que cambiar. Desde el nodo en `index` no puedes regresar. Los pasos 5 y 6 siguen el orden que aprendiste con unshift: **primero enlaza el nodo nuevo**, mientras `temp.next` todavía apunta al resto de la fila, y solo después haz que `temp` apunte al nodo nuevo.

```viz
linked-list-insert-plan
```

**Qué acaba de pasar:** el índice 2 pasó la revisión del rango y no era un extremo. Se creó un nodo para Eve, y `get(1)` caminó hasta Ben, el nodo antes del lugar. El `next` de Eve apuntó a Cleo, y solo entonces el `next` de Ben apuntó a Eve. La longitud subió a 5, e insert regresó `true`.

**Error común:** hacer el paso 6 antes del 5. Después de `temp.next = newNode`, ya nada apunta a Cleo, así que `newNode.next = temp.next` hace que el nodo de Eve se apunte a sí mismo, y Cleo y Dev se pierden.

## Escribir el código

Paso 4: primero el caso común. En la mitad, son los pasos 3 a 7:

```js
const newNode = new Node(value)
const temp = this.get(index - 1)
newNode.next = temp.next
temp.next = newNode
this.length++
return true
```

Luego van arriba los casos especiales, en el orden del plan. La revisión del rango regresa `false`. El índice 0 llama a `this.unshift(value)` y el índice `length` llama a `this.push(value)`, cada uno seguido de `return true`. El `this.` importa aquí: insert funciona para cualquier lista sobre la que se llame, así que llama al unshift y al push de **esa** lista.

El `return` justo después de cada uno también importa. Detiene a insert ahí, así que el código del caso de en medio nunca corre para los extremos.

```viz
trace-ll-insert
```

**Qué acaba de pasar:** `insert(2, 'Eve')` pasó las revisiones, creó el nodo de Eve, caminó hasta Ben con `get(1)`, y enlazó a Eve entre Ben y Cleo. `insert(0, 'Zoe')` le pasó el trabajo a unshift. `insert(7, 'Eve')` no pasó la revisión del rango y regresó `false`.

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

  insert(index, value) {
    if (index < 0 || index > this.length) {
      return false
    }
    if (index === 0) {
      this.unshift(value)
      return true
    }
    if (index === this.length) {
      this.push(value)
      return true
    }
    const newNode = new Node(value)
    const temp = this.get(index - 1)
    newNode.next = temp.next
    temp.next = newNode
    this.length++
    return true
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

const line = new LinkedList('Ana').push('Cleo')
line.insert(1, 'Ben') // en medio
line.insert(0, 'Zoe') // al inicio: unshift
line.insert(4, 'Dev') // al final (index === length): push
console.log(line.toArray().join(' -> ')) // Zoe -> Ana -> Ben -> Cleo -> Dev
console.log(line.insert(9, 'Eve'), line.length) // false 5
```

**Error común:** agregar `this.length++` también en los casos del inicio y del final. `unshift` y `push` ya le suman 1 a la longitud, así que hacerlo otra vez en insert cuenta dos veces al invitado nuevo.

## Revisar

Paso 5: el Big O, y lo que regresa.

**Big O:** al inicio, insert es unshift: O(1). Al final es push: O(1). En la mitad, camina hasta el nodo antes del lugar con `get`, así que es **O(n) en tiempo**, y Big O toma ese peor caso. Crea un nodo, así que es **O(1) en espacio**. El `splice` de un array también es O(n), porque reindexa todo lo que va después del lugar. Ese es el empate de la tabla de la lección 2.

**¿Por qué `true` cada vez?** Una forma común de escribir los extremos es `return this.unshift(value)`, que ahorra una línea. Pero unshift y push regresan la **lista**, así que ese insert regresaría la lista en los extremos, `true` en la mitad y `false` con un índice malo. Quien llame a insert tendría que revisar tres tipos de respuesta distintos. Regresar `true` en cada éxito y `false` en cada falla da una pregunta de sí o no con una respuesta de sí o no.

**Reusar, otra vez:** insert tiene tres casos especiales y no escribió código nuevo para ninguno. La revisión del rango es suya, pero el inicio, el final y la caminata ya estaban resueltos, por unshift, push y get. Eso es lo que te da construir una clase un método a la vez.

```js-run
// Dónde insertas decide el costo: cuenta los movimientos para cada índice.
const length = 6
for (let index = 0; index <= length; index++) {
  let moves = 0
  if (index !== 0 && index !== length) {
    for (let i = 0; i < index - 1; i++) {
      moves++ // get(index - 1) camina hasta aquí
    }
  }
  console.log('insert(' + index + '): ' + moves + ' movimientos')
}
```

**Error común:** olvidar el caso fuera de rango porque "nadie va a pasar un índice malo". Siempre alguien lo hace, muchas veces equivocándose por uno, y sin la revisión, `get(index - 1)` regresa `undefined` y `undefined.next` truena.
