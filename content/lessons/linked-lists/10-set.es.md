---
title: 'set: cambiar el valor en un índice'
order: 10
minutes: 14
---

> **Meta:** escribir `set`, el método que cambia el valor del nodo en un índice, reusando `get` en vez de escribir la caminata otra vez.

## Entender: qué hace set

Un gafete tiene un error: dice Ben, pero debería decir Benny. Nadie entra ni sale de la fila; un nodo solo recibe un valor nuevo. Eso es **`set`**. Paso 1: qué entra, qué sale, qué cambia.

- **Qué entra:** un índice y el valor nuevo: `line.set(1, 'Benny')`.
- **Qué cambia:** el **valor** del nodo en ese índice. No se agrega ni se quita ningún nodo, así que `head`, `tail` y `length` se quedan exactamente igual.
- **Qué sale:** `true` si el cambio funcionó, `false` si no hay nodo en ese índice. Regresar un sí o un no le dice a quien lo llamó si pasó algo.

`set` se parece a `get`: los dos van al nodo en un índice. La única diferencia es lo que hacen al llegar. `get` regresa el nodo, y `set` cambia su valor.

```viz
linked-list-set
```

**Qué acaba de pasar:** `set(1, 'Benny')` fue al nodo del índice 1 y cambió su valor de Ben a Benny. El mismo nodo, el mismo lugar en la fila, un valor nuevo. Regresó `true`.

**Por dentro:** `set` cambia el `value` del nodo y nada más. El nodo conserva su lugar en la memoria y su `next`, así que ninguna flecha de la lista se mueve. Cualquier otro puntero a ese nodo, de una variable o del nodo de antes, ve el valor nuevo de inmediato.

**Error común:** pensar que `set` agrega a alguien en ese índice. Solo cambia un nodo que ya está ahí. Agregar un nodo nuevo en un índice es `insert`, dentro de dos lecciones.

## Ejemplos: en rango, fuera de rango, vacía

Paso 2: ejemplos. Como `set` va a un índice, sus ejemplos son los mismos que los de get.

- **Un índice que existe:** `set(3, 'Devon')` con cuatro invitados cambia a Dev por Devon y regresa `true`.
- **Un índice que no existe:** `set(9, 'Zoe')` no encuentra nodo en el índice 9, no cambia nada y regresa `false`. Lo mismo pasa con los índices negativos.
- **Una fila vacía:** no existe ningún índice, así que todo `set` regresa `false`.

```viz
linked-list-set-examples
```

**Qué acaba de pasar:** con el índice 3, el nodo de Dev recibió el valor nuevo Devon, y `set` regresó `true`. Con el índice 9 y con una fila vacía, no había nodo que cambiar, así que nada cambió y `set` regresó `false`.

Los arrays también te dejan cambiar por índice, con `guests[1] = 'Benny'`, en O(1). Pero un array escribe sin problema más allá del final: `guests[9] = 'Zoe'` hace el array más largo y deja espacios vacíos en medio. Nuestro `set` se niega, y lo dice con `false`.

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']
guests[1] = 'Benny'
console.log(guests) // el lugar de Ben ahora dice Benny

guests[9] = 'Zoe'
console.log(guests.length) // 10: el array creció, con espacios vacíos en medio
```

Antes de correrlo, predice las dos líneas. Es la idea de set con objetos normales:

```js-run
const head = { value: 'Ana', next: { value: 'Ben', next: null } }

let target = head.next // como this.get(1)
target.value = 'Benny' // cambiar el nodo a través del puntero
target = { value: 'Zoe', next: null } // mover el puntero: la lista ni se entera

console.log(head.next.value)
console.log(target.value)
```

**Qué acaba de pasar:** `target.value = 'Benny'` llegó a través del puntero y cambió el nodo de Ben, que está en la lista, así que `head.next.value` imprimió Benny. Apuntar `target` a un objeto nuevo solo cambió la variable: Zoe nunca entró a la fila.

**Por dentro:** regresar `true` o `false` es una forma común de que un método diga "¿funcionó?" cuando no hay nada útil que regresar. Los arrays también lo hacen: `includes` responde sí o no, y nuestro `set` también.

**Error común:** no regresar nada. Sin `true` o `false`, quien intenta `set(9, 'Zoe')` no puede saber que no pasó nada.

## Dividirlo en pasos

Paso 3: el plan. Antes de escribirlo, fíjate en que los pasos 1 a 3 del plan de get (revisar el rango, empezar en head, caminar hasta el índice) son justo lo que necesita `set`. Ya tenemos ese código, y un método puede llamar a otro método de la misma clase con **`this`**: `this.get(index)`. Así que el plan de set es corto:

```js
set(index, value) {
  // 1. target = this.get(index): el nodo, o undefined
  // 2. si target es un nodo: cambia su valor, regresa true
  // 3. si no, regresa false
}
```

¿Cómo distingue el paso 2 "un nodo" de `undefined`? Con `if (target)`. Un nodo es un objeto, y los objetos son **truthy**. `undefined` es **falsy**. Así que `if (target)` corre justo cuando `get` encontró un nodo. (A diferencia de `if (!value)` en el constructor, esto es seguro: `get` solo regresa un nodo o `undefined`.)

```viz
linked-list-set-plan
```

**Qué acaba de pasar:** `this.get(1)` hizo toda la búsqueda y regresó el nodo de Ben. El nodo era truthy, así que su valor cambió a Benny, y `set` regresó `true`. Con el índice 9, `get` regresó `undefined`, el `if` se saltó, y `set` regresó `false`.

**Por dentro:** `this.get(index)` es un método que llama a otro método del mismo objeto. Dentro de `set`, `this` es la lista con la que se llamó a `set`, así que `this.get` recorre **esa** lista. Así se apoyan unos métodos de una clase en otros.

**Error común:** llamar `get(index)` sin `this.`. Dentro de una clase, `get` solo no es una variable, así que es un error ("get is not defined"). A los métodos del mismo objeto se llega con `this`.

## Escribir el código

Paso 4: con `get` haciendo la caminata, el código sigue el plan línea por línea. El caso común y el caso especial son las dos ramas de un solo `if`: el nodo existe, o no existe.

```viz
trace-ll-set
```

**Qué acaba de pasar:** `set(1, 'Benny')` llamó a `this.get(1)`, que caminó hasta el nodo de Ben. El `if` corrió, el valor cambió, y `set` regresó `true`. `set(9, 'Zoe')` recibió `undefined`, se saltó el `if` y regresó `false`.

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

  set(index, value) {
    const target = this.get(index)
    if (target) {
      target.value = value
      return true
    }
    return false
  }
}

const line = new LinkedList('Ana').push('Ben').push('Cleo')
console.log(line.set(1, 'Benny')) // true
console.log(line.get(1).value) // Benny
console.log(line.set(9, 'Zoe')) // false: no hay índice 9
console.log(line.length) // 3: set nunca agrega ni quita
```

**Por dentro:** en `target.value = value`, los dos `value` son cosas distintas. El de la izquierda, después del punto, es la **propiedad** del nodo. El de la derecha es el **parámetro** que recibió `set`. JavaScript los distingue por el punto, igual que `this.value = value` funcionaba en el constructor de `Node`.

**Error común:** dejar fuera `return true` dentro del `if`. El valor sí cambia, pero luego el código sigue hasta `return false`, así que `set` reporta un error en un cambio que sí funcionó.

## Revisar

Paso 5: el Big O, y por qué reusar `get` fue la decisión correcta.

**Big O:** `set` hace un `get` (una caminata de hasta n nodos) y una asignación: **O(n) en tiempo**, **O(1) en espacio**. Todo el costo viene de la caminata dentro de `get`. Cambiar el valor en sí es O(1). En un array, `guests[1] = 'Benny'` es O(1), porque el array puede saltar directo al lugar.

**Reusar un método es una mejora que haces a propósito.** Sin `get`, `set` repetiría la revisión del rango y el bucle, y dos copias de la misma caminata son dos lugares para el mismo error. Con `get`, hay una sola caminata que hacer bien. Si algún día arreglas o aceleras `get`, `set` recibe el arreglo gratis. Es la misma razón por la que `Node` se volvió su propia clase en la lección del constructor.

**Una variante que conviene conocer:** hay código que regresa el valor viejo del nodo desde `set`, para que quien lo llama sepa qué reemplazó. El nuestro regresa `true` o `false`, porque la pregunta que más se hace es "¿funcionó?".

```js-run
// set en un índice cerca del final recorre casi toda la fila,
// mientras que la asignación en sí es un solo paso.
const sizes = [10, 1000]
for (let i = 0; i < sizes.length; i++) {
  const lastIndex = sizes[i] - 1
  let moves = 0
  for (let k = 0; k < lastIndex; k++) {
    moves++
  }
  console.log(sizes[i] + ' invitados: ' + moves + ' movimientos para llegar al último índice, luego 1 asignación')
}
```

**Por dentro:** reusar `get` no cuesta nada extra en Big O: `set` necesitaría la misma caminata si escribiera su propio bucle. Lo que ahorra es **código**: una caminata, escrita y probada una vez, que usan `set`, `insert` y `remove`. Un error arreglado en `get` queda arreglado en los cuatro.

**Error común:** pensar que `set` es O(1) porque cambiar un valor es O(1). El cambio sí lo es, pero encontrar el nodo no. Cuenta siempre la caminata para llegar ahí.
