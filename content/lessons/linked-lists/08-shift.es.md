---
title: 'shift: quitar al invitado del inicio'
order: 8
minutes: 14
---

> **Meta:** escribir `shift`, el método que quita el primer nodo y lo regresa, bien separado del resto de la fila.

## Entender: qué hace shift

El invitado del inicio de la fila de conga se va. Eso es **`shift`**, el mismo nombre y el mismo trabajo que el método de array que quita el primer elemento. Paso 1: qué entra, qué sale, qué cambia.

- **Qué entra:** nada. `line.shift()` siempre quita al **primer** invitado.
- **Qué cambia:** `head` se mueve al **siguiente** nodo, así que el segundo invitado se vuelve el primero. `length` baja 1. `tail` no se mueve (a menos que la fila quede vacía).
- **Qué sale:** el nodo que se quitó, solo, o `undefined` si la lista estaba vacía.

Compáralo con pop. pop tuvo que recorrer toda la fila para encontrar el nodo antes del tail. shift necesita el nodo **después** del head, y ese es simplemente `this.head.next`: las flechas apuntan hacia el lado correcto. Así que no hay ninguna caminata, y shift es O(1), mientras que el `shift` de un array es O(n), porque cada elemento baja un índice.

```viz
linked-list-shift
```

**Qué acaba de pasar:** la fila era Ana, Ben, Cleo. `shift()` sacó el nodo de Ana del inicio, `head` se movió a Ben, y la longitud pasó de 3 a 2. Luego regresó el nodo de Ana, ya separado de la fila.

**Error común:** confundir `shift` y `unshift`. `unshift` **agrega** al inicio, `shift` **quita** del inicio. Una forma de recordarlo: el nombre más largo es el que agrega.

## Ejemplos: tres escenarios

Paso 2: shift tiene los mismos tres escenarios que pop.

1. **Una fila vacía:** no hay nadie a quien quitar, así que regresa `undefined` y no cambies nada.
2. **Un invitado:** quitar al único invitado vacía la fila. `head` se mueve a `head.next`, que es `null`, así que `head` se arregla solo. Pero `tail` todavía apunta al nodo que se acaba de ir, así que también hay que poner `tail` en `null`.
3. **Muchos invitados:** `head` se mueve al segundo invitado, el primer nodo se suelta y se regresa, y `tail` se queda donde está.

```viz
linked-list-shift-examples
```

**Qué acaba de pasar:** la fila vacía regresó `undefined`. La fila con solo Ana regresó el nodo de Ana y terminó con `head` y `tail` en `null`. La fila de tres regresó el nodo de Ana, `head` se movió a Ben, y `tail` se quedó en Cleo.

Igual que con pop, los arrays coinciden en los dos primeros escenarios:

```js-run
const nobody = []
console.log(nobody.shift()) // undefined

const justAna = ['Ana']
console.log(justAna.shift(), justAna.length) // Ana 0
```

**Error común:** resolver el caso de un invitado como lo hace pop, reiniciando `head` y `tail`. Funciona, pero esconde en qué es distinto shift: `head` se vuelve `null` solo, porque el `next` del único nodo era `null`. Solo `tail` necesita la ayuda extra.

## Dividirlo en pasos

Paso 3: el plan. Hay dos detalles fáciles de pasar por alto, así que aquí van antes de los comentarios.

Primero, necesitas un puntero al primer nodo **antes** de que `head` se mueva, porque vas a regresar ese nodo. Ese es `temp`. Segundo, cuando `head` ya se movió, el antiguo primer nodo está fuera de la fila, pero su `next` **todavía apunta al segundo invitado**. Si lo regresas así, quien lo reciba también se lleva el resto de la fila. Así que suéltalo: `temp.next = null`.

```js
shift() {
  // 1. si la lista está vacía, regresa undefined
  // 2. temp apunta al primer nodo
  // 3. head se mueve al siguiente nodo
  // 4. el next de temp se vuelve null, para soltarlo de la fila
  // 5. réstale 1 a length
  // 6. si length ahora es 0, tail también se vuelve null
  // 7. regresa temp
}
```

```viz
linked-list-shift-plan
```

**Qué acaba de pasar:** `temp` tomó el nodo de Ana, y luego `head` se movió a Ben. El nodo de Ana quedó fuera de la fila pero todavía apuntaba a Ben, hasta que el paso 4 cortó esa flecha. La longitud bajó a 2, y el nodo de Ana se regresó solo. En la fila de un invitado, el paso 6 puso `tail` en `null` cuando Ana se fue.

Esto es lo que evita el paso 4. Córrelo:

```js-run
let head = {
  value: 'Ana',
  next: { value: 'Ben', next: { value: 'Cleo', next: null } },
}

const temp = head
head = head.next
console.log(temp) // el nodo de Ana está fuera de la fila, pero todavía trae a Ben y a Cleo

temp.next = null
console.log(temp) // ahora es solo Ana
```

**Error común:** saltarse `temp.next = null`. La lista en sí queda bien sin esa línea, pero el nodo que regresas todavía apunta a la fila, así que el código que lo use puede llegar, y hasta cambiar, a invitados que siguen en la lista.

## Escribir el código

Paso 4: primero el caso común. Con dos o más invitados, son los pasos 2 a 5 y el 7:

```js
shift() {
  let temp = this.head
  this.head = this.head.next
  temp.next = null
  this.length--
  return temp
}
```

Ahora los casos especiales. **La lista vacía:** `this.head.next` truena cuando `head` es `null`, así que revisa arriba de todo: `if (!this.head) { return undefined }`. **Un invitado:** recorre el código con solo Ana. `temp` apunta a Ana, `head` se vuelve el `next` de Ana, que es `null`, `temp.next = null` no cambia nada, y la longitud baja a 0. Pero `tail` todavía apunta a Ana. Así que, después de restar, agrega: si la longitud ahora es 0, pon `tail` en `null`.

```viz
trace-ll-shift
```

**Qué acaba de pasar:** con 4 invitados, `temp` tomó a Ana, `head` se movió a Ben, se cortó el `next` de Ana, y la longitud bajó a 3. Con 1 invitado, `head` se volvió `null` solo, y la revisión de `length === 0` puso `tail` en `null`. Con 0 invitados, el primer `if` regresó `undefined`.

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

  shift() {
    if (!this.head) {
      return undefined
    }
    let temp = this.head
    this.head = this.head.next
    temp.next = null
    this.length--
    if (this.length === 0) {
      this.tail = null
    }
    return temp
  }
}

const line = new LinkedList('Ana')
line.push('Ben')
console.log(line.shift()) // el nodo de Ana, solo
console.log(line.shift().value) // Ben: el único invitado que quedaba
console.log(line.shift()) // undefined: una fila vacía
console.log(line.head, line.tail, line.length) // null null 0
```

**Error común:** olvidar la revisión de `length === 0`. Vista desde `head`, la fila parece vacía, pero `tail` todavía guarda al invitado que se fue: `line.tail.value` seguiría diciendo `'Ana'` en una fila vacía. Cualquier método que confíe en que `tail` es el último invitado trabajaría con alguien que ya no está en la fila.

## Revisar

Paso 5: el Big O, y cómo encaja shift con los métodos que ya tienes.

**Big O:** shift mueve `head` una vez y corta una flecha, sin caminar: **O(1) en tiempo** y **O(1) en espacio**. En un array, `shift` es **O(n)**. Ya escribiste los cuatro métodos de los dos extremos de la fila, y sus costos coinciden con la tabla de la lección 2: push O(1), pop O(n), unshift O(1), shift O(1).

**Compáralo con pop.** Los dos quitan un nodo y los dos tienen los mismos tres escenarios, pero sus arreglos para un invitado son distintos. pop tuvo que reiniciar `head` **y** `tail`, porque nada en su código movía `head`. shift solo reinicia `tail`, porque `this.head = this.head.next` ya dejó `head` en `null`. Lo que mostró la diferencia cada vez fue recorrer, línea por línea, el caso de un invitado.

**push más shift es una cola.** Los invitados se forman al final con `push` y los atienden por el inicio con `shift`, y con una lista enlazada los dos son O(1). Es la taquilla de la lección 2, y vas a construir una clase `Queue` de verdad más adelante en esta sección.

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
    const newNode = new Node(value)
    if (!this.head) {
      this.head = newNode
    } else {
      this.tail.next = newNode
    }
    this.tail = newNode
    this.length++
    return this
  }

  shift() {
    if (!this.head) {
      return undefined
    }
    let temp = this.head
    this.head = this.head.next
    temp.next = null
    this.length--
    if (this.length === 0) {
      this.tail = null
    }
    return temp
  }
}

const counter = new LinkedList().push('Ana').push('Ben').push('Cleo')
while (counter.length > 0) {
  console.log('Atendiendo a ' + counter.shift().value)
}
```

**Error común:** usar un array como una cola larga con `push` y `shift`. Funciona, pero cada `shift` mueve toda la fila, así que atender a n invitados cuesta O(n²) en total. Una lista enlazada los atiende en O(n).
