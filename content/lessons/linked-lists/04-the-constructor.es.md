---
title: El constructor
order: 4
minutes: 15
---

> **Meta:** escribir la clase `Node` y el constructor de `LinkedList`, con los 5 pasos: entender, ejemplos, dividirlo en pasos, escribir el código y revisar.

## Entender: qué hace el constructor

Este es el primer método de nuestra clase `LinkedList`, así que hagámoslo bien, con los 5 pasos de Un método para resolver problemas. **El paso 1 es entender** qué tiene que hacer el método y qué regresa, antes de pensar en código.

El constructor corre cuando alguien escribe `new LinkedList('Ana')`. Su trabajo es preparar una lista nueva que guarde a un invitado. La lista guarda tres datos: **`head`** (el primer nodo), **`tail`** (el último nodo) y **`length`** (cuántos nodos hay). Así que, después de que corre el constructor, debe haber un nodo con `'Ana'`, con `head` y `tail` apuntando a él y `length` en 1. ¿Qué regresa? Nada por sí mismo: como viste en la lección de clases, `new` te entrega la instancia terminada.

Antes de escribirlo, fíjate en lo que el constructor tiene en común con tres métodos que vas a escribir pronto: `push`, `unshift` e `insert`. Los cuatro reciben un valor, y los cuatro **crean un nodo nuevo** con él. No queremos el mismo código para crear nodos copiado en cuatro métodos, así que le damos su propia clase: **`Node`**. Cada método crea entonces un nodo en una línea, `new Node(value)`, y el nodo siempre sale igual: el valor, más un `next` que empieza en `null`.

```viz
linked-list-node-class
```

**Qué acaba de pasar:** pusimos en fila los cuatro métodos que reciben un valor. El constructor crea un nodo para el primer invitado, y `push`, `unshift` e `insert` crean uno cada uno antes de agregarlo a la fila. Cuatro métodos, un trabajo en común, así que ese trabajo se fue a la clase `Node`.

Este es el plan de las dos clases, antes de cualquier código real:

```js
class Node {
  constructor(value) {
    // crea un nodo: un valor y un puntero next
  }
}

class LinkedList {
  constructor(value) {
    // crea una lista que empieza con un nodo
  }
  // después: push, pop, unshift, shift, get, set, insert, remove, reverse
}
```

**Error común:** poner `value` y `next` en la lista misma. La lista no es un nodo: **apunta a** nodos, con `head` y `tail`. Los nodos guardan valores; la lista guarda los punteros a sus dos extremos, más la longitud.

## Ejemplos: un invitado, ninguno y cero

**El paso 2 es explorar ejemplos**, incluyendo los raros, porque ahí se esconden los errores. Para cada método de este módulo, prueba al menos una lista vacía, una lista con un nodo y una lista con muchos nodos.

El ejemplo principal es fácil. `new LinkedList('Ana')` da un nodo con `'Ana'`, con `head` y `tail` en él y `length` en 1.

¿Y `new LinkedList()`, **sin ningún valor**? Un constructor que siempre crea un nodo crearía uno con `undefined`: un invitado sin nombre. Nuestra clase hace algo más útil y empieza **vacía**: `head` y `tail` apuntan a `null`, y `length` es 0. Así puedes empezar una fila vacía y agregar invitados después con `push`, y las pruebas de las próximas lecciones pueden crear una lista vacía fácilmente.

¿Y `new LinkedList(0)`? El cero es un **valor real**: una lista de puntajes podría empezar con 0 sin problema. Tiene que recibir un nodo como cualquier otro valor. Ten en mente este ejemplo, porque atrapa un error muy común. Por último, **muchos invitados**: el constructor solo recibe un valor, así que crea un nodo como máximo. Agregar más es trabajo de `push`, en la próxima lección.

```viz
linked-list-constructor-examples
```

**Qué acaba de pasar:** un valor dio un nodo con los dos punteros encima. Sin valor dio una lista vacía, con `head` y `tail` en `null` y longitud 0. El cero dio un nodo, porque 0 es un valor. Y más invitados vinieron de `push`, no del constructor.

¿Cómo distingues "sin valor" de 0? Corre esto:

```js-run
const values = [undefined, 0, '', 'Ana']
for (let i = 0; i < values.length; i++) {
  const value = values[i]
  console.log(String(value), '| ¿falta?', value === undefined, '| !value:', !value)
}
```

**Error común:** revisar si falta un valor con `if (!value)`. Como acabas de ver, `!0` y `!''` son `true`, así que una lista que empieza con 0 o con un string vacío saldría vacía. Revisa `value === undefined`: solo un valor que no se pasó es `undefined`.

## Dividirlo en pasos

**El paso 3 es dividirlo en pasos:** escribe los pasos como comentarios antes de escribir código. Los comentarios son fáciles de cambiar, y te dan una dirección a seguir.

La clase `Node` tiene dos pasos: guardar el valor y empezar `next` en `null`, porque un nodo nuevo todavía no apunta a nadie. El constructor de `LinkedList` tiene dos partes. Primero, empezar vacía. Luego, si se dio un valor, crear el primer nodo y apuntar los dos extremos de la lista a él:

```js
class Node {
  constructor(value) {
    // 1. guarda el valor
    // 2. next empieza en null: este nodo todavía no apunta a nadie
  }
}

class LinkedList {
  constructor(value) {
    // 1. empieza vacía: head y tail apuntan a null, length es 0
    // 2. si se dio un valor:
    //    a. crea un nodo nuevo con él
    //    b. haz que head apunte al nodo nuevo
    //    c. haz que tail apunte al mismo nodo
    //    d. length es 1
  }
}
```

Fíjate en el paso 1: empezar con una lista vacía y luego agregar un nodo hace que el caso vacío no sea un camino especial a un lado. Es donde empieza toda lista.

```viz
linked-list-constructor-plan
```

**Qué acaba de pasar:** jugamos el plan solo con comentarios. La lista empezó vacía, se creó un nodo nuevo, `head` lo apuntó, luego `tail` apuntó al **mismo** nodo, y al final length se volvió 1.

**Error común:** en el paso c, crear un segundo nodo para `tail` con `new Node(value)`. Eso te da dos nodos separados con el mismo valor, `head` en uno y `tail` en el otro, y la lista queda rota desde el principio. Un nodo, dos punteros.

## Escribir el código

**El paso 4 es escribir el código:** primero el caso común, luego los casos especiales. `Node` son dos líneas, una por comentario:

```js
class Node {
  constructor(value) {
    this.value = value
    this.next = null
  }
}
```

Para la lista, empieza con el caso común, un valor que sí se dio. Muchos constructores de listas enlazadas terminan aquí:

```js
class LinkedList {
  constructor(value) {
    const newNode = new Node(value)
    this.head = newNode
    this.tail = this.head
    this.length = 1
  }
}
```

`new Node(value)` corre el constructor de Node y regresa un nodo, y `newNode` apunta a él. `this.head = newNode` hace que el `head` de la lista apunte a ese nodo. `this.tail = this.head` significa "haz que `tail` apunte a donde apunta `head`", que es el mismo nodo. `this.length = 1` anota un invitado. Cada línea usa `this`, porque son propiedades de **esta** lista: la que `new` está construyendo.

Ahora el caso especial. Empieza cada lista vacía, y envuelve el caso común en `if (value !== undefined)`, para que un valor que falta se lo salte:

```viz
trace-ll-constructor
```

**Qué acaba de pasar:** con `'Ana'`, la lista empezó vacía, el `if` dejó pasar el valor, el constructor de Node creó el nodo, y `head` y `tail` lo apuntaron antes de que length se volviera 1. Sin valor, el `if` se saltó, y la lista se quedó vacía. Con 0, el `if` lo dejó pasar, porque 0 no es `undefined`.

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
}

const line = new LinkedList('Ana')
console.log(line)
console.log(line.head === line.tail) // true: un nodo, dos punteros

const empty = new LinkedList()
console.log(empty.head, empty.tail, empty.length) // null null 0
```

**Error común:** escribir `head = newNode` sin `this.`. Dentro de una clase, eso es un error ("head is not defined"), porque `head` no es una variable: es una propiedad de la lista, y la lista es `this`.

## Revisar

**El paso 5 es revisar:** checa el Big O, y mira si algo podría quedar más claro.

**Big O:** el constructor hace las mismas pocas asignaciones sin importar el valor, así que es **O(1) en tiempo**. Crea un nodo como máximo, así que es **O(1) en espacio**. Es lo mismo que crear un array con un elemento, como `['Ana']`.

**Una mejora para pensar:** `this.tail = this.head` y `this.tail = newNode` hacen exactamente lo mismo. Los dos hacen que `tail` apunte al único nodo al que ya apuntan `newNode` y `head`. Ninguno hace una copia: por la lección de punteros, `=` con un objeto copia la flecha, no el objeto. Nos quedamos con `this.tail = this.head`, porque se lee como "el tail empieza donde está el head", pero cualquiera de los dos es correcto.

**Lo que significa empezar vacía para después:** como nuestra lista puede estar vacía, cada método de aquí en adelante tiene que manejar `head === null`. Por eso la lista vacía siempre es el primer ejemplo: en `push`, agregar a una lista vacía también tiene que poner `head`, no solo `tail`.

```viz
five-steps-look-back
```

**Qué acaba de pasar:** esa es la lista de preguntas para revisar, de Un método para resolver problemas. Para un constructor, las preguntas que más importan son el Big O y si el código se lee claro, y las dos tienen respuesta arriba. Aquí está la mejora, comprobada en código:

```js-run
class Node {
  constructor(value) {
    this.value = value
    this.next = null
  }
}

const newNode = new Node('Ana')
const head = newNode
const tailOne = head // como this.tail = this.head
const tailTwo = newNode // como this.tail = newNode
console.log(tailOne === tailTwo) // true: el mismo nodo de las dos formas
```

**Error común:** pensar que `this.tail = this.head` hace que `tail` siga a `head` de aquí en adelante. Hace que `tail` apunte al nodo al que `head` apunta **en este momento**. Cuando `push` mueva `tail` después, `head` se queda donde está, y al revés.
